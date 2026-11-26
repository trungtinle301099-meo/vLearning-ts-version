#!/usr/bin/env python3
"""PreToolUse hook bảo vệ chốt chặn 2 lần duyệt và phạm vi writable_paths của vLearning."""
from __future__ import annotations

import json
from pathlib import Path
import re
import subprocess
import sys

PROTECTED_PREFIXES = ("src/", "tests/")
PROTECTED_FILES = {"playwright.config.ts", "package.json"}
WRITE_TOOL_HINTS = ("write", "edit", "replace", "create", "delete", "patch")
PLAYWRIGHT_CMD_RE = re.compile(r"(?:^|\s|&&|;|\|)(?:npx\s+playwright\s+test|npm\s+run\s+test\b)")
MERGE_CMD_RE = re.compile(r"(?:^|\s|&&|;|\|)git\s+(?:merge|branch\s+-[fM]|reset\s+--hard)\b")
NOTEBOOK_WRITE_RE = re.compile(
    r"\bnotebooklm\s+(?:source\s+(?:add|delete|remove|rename|replace|update)|delete|create)\b"
)


def _allow(reason: str = "") -> int:
    out = {"decision": "allow"}
    if reason:
        out["reason"] = reason
    print(json.dumps(out, ensure_ascii=False))
    return 0


def _deny(reason: str) -> int:
    print(json.dumps({"decision": "deny", "reason": reason}, ensure_ascii=False))
    return 0


def _ask(reason: str) -> int:
    print(json.dumps({"decision": "ask", "reason": reason}, ensure_ascii=False))
    return 0


def _git_root(cwd: str) -> Path | None:
    try:
        top = subprocess.check_output(
            ["git", "-C", cwd, "rev-parse", "--show-toplevel"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=3,
        ).strip()
        return Path(top).resolve()
    except (OSError, subprocess.SubprocessError):
        return None


def _writable_paths(state: dict) -> set[str]:
    plan = state.get("plan") or {}
    approval = state.get("approval") or {}
    selected: set[str] = set()
    for part in approval.get("scope", []):
        selected.update(part.get("case_ids", []))
    allowed: set[str] = set()
    for item in plan.get("files", []):
        if item.get("action") != "reuse" and selected.intersection(item.get("case_ids", [])):
            allowed.add(item["path"])
    return allowed


def _batch_mode(state: dict) -> str | None:
    scope = (state.get("approval") or {}).get("scope") or []
    return scope[0].get("mode") if scope else None


def evaluate_hook(payload: dict) -> dict:
    cwd = payload.get("cwd") or (payload.get("workspacePaths") or [None])[0]
    if not cwd:
        return {"decision": "allow"}

    repo = _git_root(cwd)
    if not repo:
        return {"decision": "allow"}

    tasks_dir = repo / "ai-engine" / "tasks"
    active_file = tasks_dir / ".active"
    if not active_file.exists():
        return {"decision": "allow"}
    task = active_file.read_text(encoding="utf-8").strip()
    if not task:
        return {"decision": "allow"}

    state_file = tasks_dir / task / "state.json"
    if not state_file.exists():
        return {"decision": "allow"}
    state = json.loads(state_file.read_text(encoding="utf-8"))
    stage = state.get("stage", "")
    if stage in {"done", "covered", ""}:
        return {"decision": "allow"}

    tool_call = payload.get("toolCall") or {}
    tool_name = (tool_call.get("name") or "").lower()
    args = tool_call.get("args") or {}

    target_path = (
        args.get("Path")
        or args.get("TargetFile")
        or args.get("FilePath")
        or args.get("AbsolutePath")
    )
    if target_path and any(hint in tool_name for hint in WRITE_TOOL_HINTS):
        resolved = Path(target_path)
        if not resolved.is_absolute():
            resolved = (repo / resolved).resolve()
        else:
            resolved = resolved.resolve()
        try:
            rel = resolved.relative_to(repo).as_posix()
        except ValueError:
            rel = ""

        if rel in PROTECTED_FILES or rel.startswith(PROTECTED_PREFIXES):
            if stage != "generate":
                return {
                    "decision": "deny",
                    "reason": (
                        f"Nhiệm vụ {task} đang ở bước '{stage}'. "
                        f"Không được sửa '{rel}' ngoài giai đoạn 'generate' đã được Tín duyệt lần 1."
                    ),
                }
            allowed = _writable_paths(state)
            if rel not in allowed:
                return {
                    "decision": "deny",
                    "reason": (
                        f"File '{rel}' nằm ngoài phạm vi writable_paths đã duyệt của {task}: "
                        f"{sorted(allowed)}"
                    ),
                }

    if tool_name == "run_command" or "CommandLine" in args:
        cmd = args.get("CommandLine") or ""
        if "vlearning_agent.cli" in cmd:
            return {"decision": "allow"}

        if NOTEBOOK_WRITE_RE.search(cmd):
            return {
                "decision": "ask",
                "reason": "Thao tác ghi/xóa nguồn NotebookLM cần Tín duyệt riêng theo project-rules.md.",
            }

        if PLAYWRIGHT_CMD_RE.search(cmd):
            if stage not in {"run", "checks"}:
                mode = _batch_mode(state)
                return {
                    "decision": "deny",
                    "reason": (
                        f"Nhiệm vụ {task} đang ở bước '{stage}' (mode={mode}). "
                        "Chỉ chạy Playwright qua `cli.py run-tests` ở bước 'run' hoặc 'checks'."
                    ),
                }

        if MERGE_CMD_RE.search(cmd) and stage not in {"merging", "done"}:
            return {
                "decision": "deny",
                "reason": (
                    f"Nhiệm vụ {task} đang ở bước '{stage}'. "
                    "Chưa có duyệt lần 2 của Tín (`cli.py approve-merge`) để tích hợp nhánh."
                ),
            }

    return {"decision": "allow"}


def main() -> int:
    try:
        payload = json.load(sys.stdin)
        result = evaluate_hook(payload)
    except Exception:
        result = {"decision": "allow"}
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

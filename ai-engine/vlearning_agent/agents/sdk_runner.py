"""Chạy từng vai trò qua Google Antigravity Python SDK (không dùng Muse)."""
from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
import re
from typing import Any

from .runner import PromptPackage

READ_ONLY_ROLES = {"analyst", "planner", "plan_reviewer", "code_reviewer"}


def load_repo_dotenv(repo: Path) -> None:
    """Nạp các biến môi trường từ .env của repo nếu shell chưa đặt."""
    env_file = repo / ".env"
    if not env_file.exists():
        return
    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ and value:
            os.environ[key] = value


def ensure_sdk_auth(repo: Path) -> None:
    """Đảm bảo có cấu hình xác thực cho google-antigravity SDK khi chạy từ terminal."""
    load_repo_dotenv(repo)
    has_gemini_key = bool(os.environ.get("GEMINI_API_KEY", "").strip())
    use_vertex = os.environ.get("GOOGLE_GENAI_USE_VERTEXAI", "").lower() in ("1", "true")
    has_vertex = use_vertex and bool(
        os.environ.get("GOOGLE_CLOUD_PROJECT", "").strip()
        and os.environ.get("GOOGLE_CLOUD_LOCATION", "").strip()
    )
    if not (has_gemini_key or has_vertex):
        raise RuntimeError(
            "Thiếu khóa xác thực cho chế độ chạy AI tự động từ terminal (google-antigravity SDK). "
            "Hãy đặt GEMINI_API_KEY trong shell hoặc file .env của repo "
            "(hoặc đặt GOOGLE_GENAI_USE_VERTEXAI=1, GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION)."
        )


def parse_json_output(raw: str, expected_keys: set[str], optional_keys: set[str] = ()) -> dict[str, Any]:
    text = raw.lstrip("\ufeff").strip()
    fence = re.fullmatch(
        r"```(?:json)?[ \t]*\r?\n(.*)\r?\n```",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if fence:
        text = fence.group(1).strip()
    obj = json.loads(text)
    if not isinstance(obj, dict):
        raise ValueError("Cần một JSON object.")
    required = expected_keys - set(optional_keys)
    if not required.issubset(obj) or not set(obj).issubset(expected_keys):
        raise ValueError("Các trường cấp đầu không khớp " + ", ".join(sorted(expected_keys)))
    return obj


def _build_local_config(repo: Path, pkg: PromptPackage, model: str | None = None):
    from google.antigravity import BuiltinTools, CapabilitiesConfig, LocalAgentConfig

    read_tools = [
        BuiltinTools.LIST_DIR,
        BuiltinTools.SEARCH_DIR,
        BuiltinTools.FIND_FILE,
        BuiltinTools.VIEW_FILE,
        BuiltinTools.FINISH,
    ]
    if pkg.role == "generator":
        enabled_tools = [
            *read_tools[:-1],
            BuiltinTools.CREATE_FILE,
            BuiltinTools.EDIT_FILE,
            BuiltinTools.FINISH,
        ]
    else:
        enabled_tools = read_tools

    system = pkg.system_prompt
    if pkg.role == "generator" and pkg.writable_paths:
        system += (
            "\n\nChỉ được tạo/sửa các đường dẫn trong `writable_paths`: "
            + ", ".join(pkg.writable_paths)
        )

    return LocalAgentConfig(
        system_instructions=system,
        capabilities=CapabilitiesConfig(
            enable_subagents=False,
            enabled_tools=enabled_tools,
        ),
        policies=[],
        workspaces=[str(repo.resolve())],
        model=model,
    )


async def _run_stage_async(
    repo: Path,
    pkg: PromptPackage,
    output_schema: dict[str, Any],
    *,
    model: str | None = None,
) -> dict[str, Any]:
    from google.antigravity import Agent

    expected_keys = set(output_schema)
    optional_keys = {"patch"} if pkg.role == "generator" else set()

    prompt = (
        f"{pkg.render()}\n\n"
        "## Yêu cầu định dạng đầu ra\n"
        "Chỉ trả duy nhất 1 JSON object hợp lệ khớp chính xác `output_schema` trong context "
        "(bắt đầu bằng `{` và kết thúc bằng `}`). Giữ nguyên mã TC, đường dẫn file và đặt "
        "báo cáo Markdown tiếng Việt vào trường `report`.\n"
        f"Schema bắt buộc: `{json.dumps(output_schema, ensure_ascii=False)}`"
    )

    config = _build_local_config(repo, pkg, model=model)
    async with Agent(config) as agent:
        last_error = ""
        for attempt in range(2):
            message = (
                prompt
                if attempt == 0
                else (
                    f"Lần trả lời trước bị lỗi ({last_error}). "
                    "Xuất lại toàn bộ kết quả dưới dạng duy nhất 1 JSON object hợp lệ khớp schema."
                )
            )
            response = await agent.chat(message)
            raw = await response.text()
            try:
                return parse_json_output(raw, expected_keys, optional_keys=optional_keys)
            except (json.JSONDecodeError, ValueError) as exc:
                last_error = str(exc)
        raise ValueError(f"Antigravity/{pkg.role}: phản hồi sai JSON schema ({last_error}).")


def run_stage_with_sdk(
    repo: Path,
    pkg: PromptPackage,
    output_schema: dict[str, Any],
    *,
    model: str | None = None,
) -> dict[str, Any]:
    """Chạy 1 lượt vai trò bằng google-antigravity SDK và trả JSON dict đã kiểm tra."""
    ensure_sdk_auth(repo)
    return asyncio.run(_run_stage_async(repo, pkg, output_schema, model=model))

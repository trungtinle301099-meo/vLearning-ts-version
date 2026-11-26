"""Điều khiển workflow QA của Antigravity từ thư mục gốc repo hoặc chạy tự động qua SDK."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

from .agents.sdk_runner import run_stage_with_sdk
from .orchestrator import STAGE_ROLE, Workflow, output_schema_for
from .tools.notebooklm import NotebookReader
from .tools.retrieval import scan_existing_tests


def _print_scan(repo: Path, state: dict) -> None:
    hits = scan_existing_tests(
        repo,
        state["base"],
        state["query"],
        tuple(state.get("guides", ())),
    )
    if not hits:
        print(f"Quét nhanh tests/ theo từ khóa '{state['query']}': chưa thấy spec khớp.")
        return
    print(f"Quét nhanh tests/ theo từ khóa '{state['query']}' (có thể đã tồn tại sẵn):")
    for item in hits:
        print(f"  - {item['path']}")
        for test in item["tests"]:
            print(f"      L{test['line']}: {test['title']}")


def _format_report(task: str, state: dict) -> str:
    stage = state.get("stage", "")
    lines = [f"=== BÁO CÁO WORKFLOW: {task} (stage={stage}, version=V{state.get('version', 1)}) ==="]
    if stage == "covered":
        lines.append("Kết luận: Không cần tạo/sửa thêm — test case đã tồn tại trong repo.")
        review = state.get("plan_review") or {}
        if review.get("ready_case_ids"):
            lines.append("TC đã xác minh: " + ", ".join(review["ready_case_ids"]))
        lines.append("")
        lines.append(state.get("feedback") or state.get("plan_report") or "")
    elif stage == "approve_plan":
        lines.append("Kết luận: Sẵn sàng trình Tín Duyệt lần 1 (`approve-plan`).")
        if state.get("plan_report"):
            lines.append("\n--- Kế hoạch (Planner) ---\n" + state["plan_report"])
        if state.get("feedback"):
            lines.append("\n--- Đánh giá độc lập (Plan Reviewer) ---\n" + state["feedback"])
    elif stage in {"approve_merge", "await_checks"}:
        lines.append(f"Commit: {state.get('commit')} ({state.get('source')} -> {state.get('target')})")
        if state.get("feedback"):
            lines.append("\n--- Review Code ---\n" + state["feedback"])
    else:
        for label, key in (
            ("Review Plan / Feedback", "feedback"),
            ("Plan", "plan_report"),
            ("Generated", "generated"),
        ):
            val = state.get(key)
            if val:
                lines.append(f"\n--- {label} ---\n{val}")
        if not state.get("feedback") and state.get("analysis"):
            lines.append("\n--- Analysis ---\n" + state["analysis"].get("report", ""))
    return "\n".join(lines).strip()


def _run_ai_stage(flow: Workflow, state: dict, *, notebook=None, source_ids=(), model=None) -> str:
    before = state["stage"]
    if before in {"run", "checks"}:
        flow.run_tests(state)
    elif before in STAGE_ROLE:
        pkg = flow.prompt_for(state, notebook=notebook, source_ids=source_ids)
        print(f"[{flow.task}] Đang chạy {pkg.role} ({before})...", flush=True)
        result = run_stage_with_sdk(flow.repo, pkg, output_schema_for(before), model=model)
        flow.submit(state, result)
    else:
        raise ValueError(f"Bước {before} đang chờ Tín quyết định hoặc đã hoàn tất.")
    state["history"].append(dict(action="next", before=before, after=state["stage"]))
    flow.store.save(state)
    return state["stage"]


def _run_until_plan_gate(
    flow: Workflow,
    state: dict,
    *,
    notebook=None,
    source_ids=(),
    model=None,
    max_steps: int = 8,
) -> None:
    steps = 0
    while state["stage"] in {"analyze", "plan", "review_plan"}:
        if steps >= max_steps:
            raise ValueError(f"Đã vượt quá {max_steps} bước lặp trước khi chốt plan/covered.")
        _run_ai_stage(flow, state, notebook=notebook, source_ids=source_ids, model=model)
        steps += 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--task", required=True)
    commands = parser.add_subparsers(dest="action", required=True)

    start = commands.add_parser("start")
    start.add_argument("--requirement", action="append", default=[])
    start.add_argument("--case", action="append", default=[])
    start.add_argument("--query", required=True)
    start.add_argument("--target", required=True)
    start.add_argument("--guide", choices=["api", "ui"], action="append", required=True)
    start.add_argument(
        "--auto",
        action="store_true",
        help="Tự chạy analyze -> plan -> review_plan qua Antigravity SDK và in report.",
    )
    start.add_argument("--notebook-id")
    start.add_argument("--source-id", action="append", default=[])
    start.add_argument("--model")

    commands.add_parser("status")
    commands.add_parser("scan")
    commands.add_parser("report")
    commands.add_parser("activate")
    commands.add_parser("deactivate")

    next_cmd = commands.add_parser("next")
    next_cmd.add_argument("--notebook-id")
    next_cmd.add_argument("--source-id", action="append", default=[])
    next_cmd.add_argument("--model")

    run_plan = commands.add_parser("run-plan")
    run_plan.add_argument("--notebook-id")
    run_plan.add_argument("--source-id", action="append", default=[])
    run_plan.add_argument("--model")
    run_plan.add_argument("--max-steps", type=int, default=8)

    prompt = commands.add_parser("prompt")
    prompt.add_argument("--notebook-id")
    prompt.add_argument("--source-id", action="append", default=[])
    prompt.add_argument("--json", action="store_true")

    schema_cmd = commands.add_parser("schema")
    schema_cmd.add_argument(
        "--stage",
        choices=["analyze", "plan", "review_plan", "generate", "review_code"],
        required=True,
    )

    submit = commands.add_parser("submit")
    submit.add_argument("--input", required=True, help="Đường dẫn file JSON hoặc '-' đọc từ stdin")

    approve = commands.add_parser("approve-plan")
    approve.add_argument("--version", type=int, required=True)
    approve.add_argument("--batch", required=True)
    approve.add_argument("--case", action="append", required=True)
    approve.add_argument("--mode", choices=["write_only", "write_and_run"], required=True)
    approve.add_argument("--decision", required=True)

    commands.add_parser("run-tests")

    checks = commands.add_parser("allow-checks")
    checks.add_argument("--commit", required=True)
    checks.add_argument("--decision", required=True)

    merge = commands.add_parser("approve-merge")
    for flag in ("commit", "source", "target", "decision"):
        merge.add_argument("--" + flag, required=True)

    args = parser.parse_args()
    try:
        flow = Workflow(args.repo, args.task)
        if args.action == "schema":
            print(json.dumps(output_schema_for(args.stage), ensure_ascii=False, indent=2))
            return 0

        with flow.store.locked() as state:
            if args.action == "status":
                print(json.dumps(state, ensure_ascii=False, indent=2))
                return 0
            if args.action == "scan":
                if not state:
                    raise ValueError("Chưa tạo nhiệm vụ.")
                _print_scan(flow.repo, state)
                return 0
            if args.action == "report":
                if not state:
                    raise ValueError("Chưa tạo nhiệm vụ.")
                print(_format_report(args.task, state))
                return 0
            if args.action == "activate":
                if not state:
                    raise ValueError("Chưa tạo nhiệm vụ.")
                flow.store.activate()
                print(f"{args.task}: active")
                return 0
            if args.action == "deactivate":
                flow.store.deactivate()
                print(f"{args.task}: inactive")
                return 0

            before = state.get("stage")
            if args.action == "start":
                flow.start(state, args.requirement, args.case, args.query, args.target, args.guide)
                state["history"].append(dict(action="start", before=before, after=state["stage"]))
                flow.store.save(state)
                print(f"{args.task}: {state['stage']}")
                print(
                    f"Nhánh: {state['source']} (target: {state['target']}, base: {state['base'][:7]})"
                )
                _print_scan(flow.repo, state)
                if args.auto:
                    notebook = NotebookReader(args.notebook_id) if args.notebook_id else None
                    _run_until_plan_gate(
                        flow,
                        state,
                        notebook=notebook,
                        source_ids=args.source_id,
                        model=args.model,
                    )
                    print()
                    print(_format_report(args.task, state))
                else:
                    print(
                        f"Bước tiếp theo: chạy `--task {args.task} run-plan` (cần GEMINI_API_KEY/Vertex) "
                        f"hoặc nhắn Antigravity chạy workflow cho task {args.task}."
                    )
                return 0

            if not state:
                raise ValueError("Chưa tạo nhiệm vụ.")

            if args.action == "next":
                notebook = NotebookReader(args.notebook_id) if args.notebook_id else None
                _run_ai_stage(
                    flow, state, notebook=notebook, source_ids=args.source_id, model=args.model
                )
                print(f"{args.task}: {state['stage']}")
                return 0

            if args.action == "run-plan":
                notebook = NotebookReader(args.notebook_id) if args.notebook_id else None
                _run_until_plan_gate(
                    flow,
                    state,
                    notebook=notebook,
                    source_ids=args.source_id,
                    model=args.model,
                    max_steps=args.max_steps,
                )
                print(_format_report(args.task, state))
                return 0

            if args.action == "prompt":
                notebook = NotebookReader(args.notebook_id) if args.notebook_id else None
                pkg = flow.prompt_for(state, notebook=notebook, source_ids=args.source_id)
                if args.json:
                    print(
                        json.dumps(
                            {
                                "role": pkg.role,
                                "prompts": list(pkg.prompts),
                                "system_prompt": pkg.system_prompt,
                                "context": pkg.context,
                                "writable_paths": list(pkg.writable_paths),
                            },
                            ensure_ascii=False,
                            indent=2,
                        )
                    )
                else:
                    print(pkg.render())
                return 0

            if args.action == "submit":
                raw = (
                    sys.stdin.read()
                    if args.input == "-"
                    else Path(args.input).read_text(encoding="utf-8")
                )
                flow.submit(state, json.loads(raw))
            elif args.action == "approve-plan":
                flow.approve(state, args.version, args.batch, args.case, args.mode, args.decision)
            elif args.action == "run-tests":
                flow.run_tests(state)
            elif args.action == "allow-checks":
                flow.allow_checks(state, args.commit, args.decision)
            elif args.action == "approve-merge":
                flow.merge(state, args.commit, args.source, args.target, args.decision)

            state["history"].append(dict(action=args.action, before=before, after=state["stage"]))
            flow.store.save(state)
            print(f"{args.task}: {state['stage']}")
        return 0
    except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

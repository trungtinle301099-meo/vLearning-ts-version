# vLearning AI Engine (Antigravity Workflow Support)

Thư mục `ai-engine/` cung cấp **bộ điều phối trạng thái, schema bàn giao, nạp prompt vai trò, kiểm soát phạm vi Git và test runner Playwright** để chạy quy trình QA 2 lần duyệt của `vLearning-ts-version` theo **cả 2 cách** với cùng 1 kết quả chuẩn:

1. **Cách 1 — Chat trực tiếp với Antigravity App/IDE**: Antigravity nạp `AGENTS.md` + `.agents/skills/vlearning-qa-workflow/SKILL.md` + `.agents/hooks.json`, gọi các subagent độc lập và lưu tiến độ qua `cli.py`.
2. **Cách 2 — Chạy trực tiếp từ Terminal (`--auto` / `run-plan` / `next`)**: `cli.py` gọi trực tiếp `google-antigravity` Python SDK (`ai-engine/vlearning_agent/agents/sdk_runner.py`), lần lượt chạy `analyst` → `planner` → `plan_reviewer` qua cùng bộ prompt và `models.py` rồi in thẳng báo cáo cuối ra terminal. *(Cần đặt `GEMINI_API_KEY` trong shell hoặc `.env`, hoặc cấu hình Vertex AI.)*

## Lệnh CLI chính

Chạy từ thư mục gốc repo:

```bash
PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli --task <TASK_ID> <ACTION>
```

| Lệnh | Mục đích |
|---|---|
| `start --case "..." --query "..." --target main --guide api [--auto]` | Khởi tạo nhiệm vụ ở `analyze`, quét nhanh `tests/`, nếu có `--auto` thì chạy luôn tới `covered`/`approve_plan` và in report |
| `run-plan` | Tự chạy vòng `analyze` → `plan` → `review_plan` qua `google-antigravity` SDK và in report cuối |
| `next` | Chạy 1 bước tiếp theo qua `google-antigravity` SDK (hoặc `run_tests` ở bước `run`/`checks`) |
| `report` / `scan` / `status` | In báo cáo tiếng Việt / quét lại `tests/` / xem JSON state |
| `prompt [--notebook-id ID --source-id SID]` | Xuất bộ prompt + context + output schema cho bước hiện tại |
| `submit --input <file.json \| ->` | Nạp và kiểm tra JSON kết quả của bước hiện tại, chuyển sang bước kế |
| `approve-plan --version 1 --batch B1 --case TC1 --mode write_only --decision "..."` | Ghi nhận duyệt lần 1 của Tín |
| `run-tests` | Chạy Playwright JSON report cho đợt `write_and_run` hoặc `checks` |
| `allow-checks --commit <SHA> --decision "..."` | Cho phép chạy kiểm tra trước merge với đợt `write_only` |
| `approve-merge --commit <SHA> --source <src> --target <tgt> --decision "..."` | Ghi nhận duyệt lần 2 và fast-forward nhánh đích |
| `activate` / `deactivate` | Bật/tắt hook guard cho nhiệm vụ |

## Chạy unit test

```bash
cd ai-engine && .venv/bin/python -m unittest discover -s tests -v
```

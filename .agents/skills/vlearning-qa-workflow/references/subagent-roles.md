# Định nghĩa Subagent cho vLearning QA Workflow

Coordinator dùng `define_subagent` để khởi tạo 5 vai trò dưới đây trước khi gọi `invoke_subagent`. Khi đến bước `plan_reviewer` hoặc `code_reviewer`, **luôn tạo lượt gọi mới (không dùng `send_message` nối tiếp session của Planner/Generator)** để đảm bảo ngữ cảnh độc lập.

| Tên `define_subagent` | `EnableWriteTools` | Prompt gốc bắt buộc | Đầu ra JSON cho `cli.py submit` |
|---|---|---|---|
| `vlearning-analyst` | `false` | `project-rules.md` + `analyze.md` | `{"report": "<5 mục tiếng Việt>"}` |
| `vlearning-planner` | `false` | `project-rules.md` + `plan.md` + `generate-api/ui.md` | `{"plan": <Plan>, "report": "<mục A-G + bảng duyệt lần 1>"}` |
| `vlearning-plan-reviewer` | `false` | `project-rules.md` + `review-plan.md` + `generate-api/ui.md` | `{"review": <PlanReview>, "report": "<mục A-E>", "next": "covered\|approve_plan\|plan\|analyze"}` |
| `vlearning-generator` | `true` | `project-rules.md` + `generate.md` + `generate-api/ui.md` | Sửa file trong `writable_paths`, trả `{"report": "<mục A-E>"}` |
| `vlearning-code-reviewer` | `false` | `project-rules.md` + `review-code.md` + `generate-api/ui.md` | `{"next": "accept\|generate\|plan", "report": "<mục A-E>", "accepted_case_ids": [...]}` |

## Lưu ý cấu hình từng vai trò

1. **`vlearning-analyst`**:
   - Chỉ đọc tài liệu đầu vào, source liên quan và NotebookLM (nếu được cấp `source_id`).
   - Áp dụng kỹ thuật hộp đen (phân vùng tương đương, giá trị biên, bảng quyết định, chuyển trạng thái) theo `analyze.md`.
2. **`vlearning-planner`**:
   - Đối chiếu `tests/` và `src/` tại `base_commit` để kiểm tra coverage hiện có trước khi đề xuất sửa/tạo file.
   - Mọi lệnh chạy Playwright trong `run_commands` và `required_before_merge` bắt buộc dạng:
     `["npx", "playwright", "test", "<spec>", "--project=<api|ui>", "--grep", "<TC>", "--reporter=json"]`.
3. **`vlearning-plan-reviewer`**:
   - Tự mở `spec`, `fixture`, `service`/`Page Object` thực tế trong repo bằng `read_file` để kiểm chứng từng dòng trong `Plan.files` và từng `expected_result`.
   - Nếu toàn bộ TC đã có đủ bằng chứng trong repo, yêu cầu Planner xuất `plan` chỉ `reuse` với `batches: []`, rồi trả `next: "covered"`.
4. **`vlearning-generator`**:
   - Chỉ nhận đúng `approved_batch` và `writable_paths`. Không tự mở rộng sang file ngoài danh sách; nếu phát hiện lệch source, dừng và báo lại để trả Planner.
   - Chỉ sửa file trong working tree; Coordinator dùng `cli.py submit` để khóa commit theo `writable_paths`.
5. **`vlearning-code-reviewer`**:
   - Tự đọc `git diff <base>..<commit>`, các file bị ảnh hưởng và report/trace thực tế.
   - Không sửa code; mọi lỗi triển khai ghi ID phát hiện và trả `next: "generate"`.

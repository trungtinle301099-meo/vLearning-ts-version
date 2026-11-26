---
name: vlearning-qa-workflow
description: >-
  Điều phối quy trình QA automation Playwright TypeScript cho repo vLearning-ts-version
  theo đúng các prompt trong ai-engine/vlearning_agent/agents/prompts/ và cơ chế 2 lần duyệt của Tín.
  Kích hoạt bất cứ khi nào người dùng đưa requirement, manual test case, nguồn NotebookLM,
  hoặc yêu cầu phân tích, lập kế hoạch, review hay viết Playwright API/UI test cho vLearning.
---

# vLearning QA Workflow (Antigravity)

Skill này biến Antigravity thành bộ điều phối (Coordinator) kết hợp với CLI kiểm soát trạng thái trong `ai-engine/` và các subagent chuyên biệt cho từng vai trò.

## Quy tắc bất biến

1. Đọc [project-rules.md](../../../ai-engine/vlearning_agent/agents/prompts/project-rules.md) trước khi bắt đầu.
2. Không tự duyệt thay **Tín** ở **Duyệt lần 1** (`approve-plan`), **Cho phép kiểm tra** (`allow-checks`), hoặc **Duyệt lần 2** (`approve-merge`).
3. `plan_reviewer` và `code_reviewer` **luôn** chạy bằng subagent mới (context sạch, `EnableWriteTools: false`) để tự đọc source, diff và report độc lập.
4. Lệnh chạy CLI chuẩn từ thư mục gốc repo:

```bash
PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli --task <TASK_ID> <ACTION>
```

---

## Bước 0: Khởi tạo nhiệm vụ

1. Có thể chạy `start` ngay trên nhánh hiện tại (kể cả `main`) để thực hiện pha chỉ đọc (`analyze` → `plan` → `review_plan`). Nếu sau bước review cần viết/sửa code (`approve-plan`), chuyển sang nhánh làm việc riêng trước khi duyệt lần 1:
   ```bash
   git switch -c qa/<task-slug>
   ```
2. Khởi tạo hồ sơ nhiệm vụ (lưu tại `ai-engine/tasks/<TASK_ID>/state.json` — đã nằm trong `.gitignore` — và bật hook guard):
   ```bash
   PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli \
     --task <TASK_ID> start \
     --requirement "<tên hoặc tóm tắt requirement>" \
     --case "<tên hoặc mã manual TC>" \
     --query "<từ khóa tra cứu repo>" \
     --target main \
     --guide api   # và/hoặc --guide ui
   ```
3. Dùng `update_steps` để theo dõi 6 pha chính: `analyze` → `plan` → `review_plan` → `approve_plan` → `generate` → `review_code` / `approve_merge`.
4. Nếu nhiệm vụ có nguồn NotebookLM, dùng skill [notebooklm](../notebooklm/SKILL.md) ở chế độ **chỉ đọc** (hoặc truyền `--notebook-id` và `--source-id` vào lệnh `prompt`).

---

## Bước 1–3: Pha trước Duyệt lần 1 (Chỉ đọc)

Xem định nghĩa subagent chi tiết tại [subagent-roles.md](./references/subagent-roles.md).

Ở mỗi bước (`analyze`, `plan`, `review_plan`):
1. Lấy gói prompt + context + output schema đúng vai trò từ `ai-engine`:
   ```bash
   PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli --task <TASK_ID> prompt [--notebook-id <ID> --source-id <SID>]
   ```
   Lệnh này tự ghép [project-rules.md](../../../ai-engine/vlearning_agent/agents/prompts/project-rules.md) + prompt của vai trò + `generate-api.md` / `generate-ui.md` (nếu `uses_test_guides = true`) + evidence repo/NotebookLM.
2. Gọi `define_subagent` (nếu chưa định nghĩa trong hội thoại) và `invoke_subagent` cho vai trò tương ứng:
   - `analyze` → `vlearning-analyst` (prompt: [analyze.md](../../../ai-engine/vlearning_agent/agents/prompts/analyze.md))
   - `plan` → `vlearning-planner` (prompt: [plan.md](../../../ai-engine/vlearning_agent/agents/prompts/plan.md) + guide API/UI)
   - `review_plan` → `vlearning-plan-reviewer` **mới** (prompt: [review-plan.md](../../../ai-engine/vlearning_agent/agents/prompts/review-plan.md) + guide API/UI)
   - Lưu ý khi đọc các prompt gốc: các cụm `plan.md`, `review-plan.md`, `review-code.md` trong nội dung prompt chỉ **bản bàn giao (artifact/handoff)** của bước tương ứng, không phải tìm file có tên đó trên repo.
3. Ghi nhận kết quả JSON vào state qua `submit` để `models.py` kiểm tra schema và chuyển bước:
   ```bash
   PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli --task <TASK_ID> submit --input <path-to-json>
   ```
   - Nếu `review_plan` trả `next: "plan"` hoặc `"analyze"`: vòng lại bước tương ứng (`version` tự tăng).
   - Nếu `review_plan` trả `next: "covered"`: **dừng và báo cáo ngay cho Tín rằng test case đã tồn tại trong repo, không cần tạo thêm**, nêu rõ đường dẫn spec, mã test và assertion đang có.
   - Nếu `review_plan` trả `next: "approve_plan"`: chuyển sang **Duyệt lần 1**.

---

## Gate 1: Trình Tín duyệt lần 1 (`approve_plan`)

1. Trình bày cho **Tín**:
   - Tóm tắt các bảng từ Planner (`A–G` và bảng `Phạm vi chạy trình duyệt lần 1`), mã `version`, `batch_id`, danh sách `case_ids`, chế độ đề xuất (`write_only` hoặc `write_and_run`) và câu hỏi mở nếu có.
   - Kết luận độc lập của `plan_reviewer` (`"Sẵn sàng trình Tín duyệt lần 1 — ..."`).
2. **Dừng và chờ Tín xác nhận rõ ràng** (phiên bản, đợt, danh sách TC, chế độ).
3. Sau khi Tín duyệt, chạy:
   ```bash
   PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli \
     --task <TASK_ID> approve-plan \
     --version <N> --batch <BATCH_ID> --case <TC_ID> [--case ...] \
     --mode <write_only|write_and_run> --decision "<nội dung quyết định của Tín>"
   ```

---

## Bước 4–5: Triển khai, Chạy kiểm tra và Review Code

1. **Generate (`generate`)**:
   - Chạy `cli.py --task <TASK_ID> prompt` để lấy `approved_batch`, `writable_paths` và hướng dẫn [generate.md](../../../ai-engine/vlearning_agent/agents/prompts/generate.md) + `generate-api.md` / `generate-ui.md`.
   - Có thể tham khảo kỹ thuật Playwright từ [playwright-best-practices](../playwright-best-practices/SKILL.md), nhưng **tuân thủ tuyệt đối** `writable_paths`, quy tắc assertion/attachment/logger và chế độ `write_only` / `write_and_run` của đợt đã duyệt.
   - Gọi subagent `vlearning-generator` (`EnableWriteTools: true`) sửa/tạo **chỉ các file trong `writable_paths`**.
   - Chạy `cli.py --task <TASK_ID> submit --input <json>` (với `{"report": "..."}`); `git_ops.worktree_candidate` sẽ kiểm tra working tree chỉ chạm đúng `writable_paths` và tạo commit candidate sạch trên nhánh nguồn.
2. **Chạy test (`run`) — chỉ khi `mode == write_and_run`**:
   - Chạy:
     ```bash
     PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli --task <TASK_ID> run-tests
     ```
   - Nếu test fail khi điều tra lỗi, dùng quy trình [systematic-debugging](../systematic-debugging/SKILL.md), không tự ý sửa expected result đã duyệt.
3. **Review Code (`review_code`)**:
   - Chạy `cli.py --task <TASK_ID> prompt` để lấy `diff`, `runs` và hướng dẫn [review-code.md](../../../ai-engine/vlearning_agent/agents/prompts/review-code.md).
   - Gọi subagent `vlearning-code-reviewer` **mới** (`EnableWriteTools: false`), tự đọc diff, source và báo cáo chạy test.
   - Chạy `cli.py --task <TASK_ID> submit --input <json>`:
     - `generate` → quay lại `vlearning-generator` sửa theo ID phát hiện.
     - `plan` → quay lại `vlearning-planner` (`version` tự tăng).
     - `accept` + đợt `write_only` còn `required_before_merge` → chuyển sang `await_checks`: xin Tín duyệt `allow-checks`, chạy `run-tests`, rồi review lại phần kết quả chạy.
     - `accept` + mọi kiểm tra đã pass → chuyển sang **Duyệt lần 2**.

---

## Gate 2: Trình Tín duyệt lần 2 (`approve_merge`)

1. Trình bày cho **Tín** kết luận `"Sẵn sàng trình Tín duyệt lần 2"` kèm:
   - `commit` SHA chính xác
   - `source` branch và `target` branch
   - Phạm vi TC đã nghiệm thu và kết quả chạy thực tế
2. **Dừng và chờ Tín xác nhận merge**.
3. Sau khi Tín duyệt, chạy:
   ```bash
   PYTHONPATH=ai-engine ai-engine/.venv/bin/python -m vlearning_agent.cli \
     --task <TASK_ID> approve-merge \
     --commit <SHA> --source <SOURCE_BRANCH> --target <TARGET_BRANCH> \
     --decision "<nội dung quyết định của Tín>"
   ```
   Lệnh này fast-forward nhánh đích lên `commit`, chuyển trạng thái sang `done` và tự tắt hook guard.

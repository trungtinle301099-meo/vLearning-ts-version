"""Nạp prompt vai trò và bằng chứng repo/NotebookLM cho Antigravity."""
from dataclasses import asdict, dataclass
import json
from pathlib import Path
import tomllib

from ..models import FileAction, Guide, Plan, PlanApproval, PlanReview
from ..tools.notebooklm import NotebookReader
from ..tools.retrieval import RetrievalResult, retrieve


@dataclass(frozen=True)
class PromptPackage:
    role: str
    prompts: tuple[str, ...]
    system_prompt: str
    context: dict
    sources: RetrievalResult
    writable_paths: tuple[str, ...] = ()

    def render(self) -> str:
        return (
            f"{self.system_prompt}\n\n"
            "## Ngữ cảnh bàn giao (JSON)\n"
            f"```json\n{json.dumps(self.context, ensure_ascii=False, indent=2)}\n```"
        )


class AgentRunner:
    def __init__(self, repo: Path, notebook: NotebookReader | None = None):
        self.repo = repo.resolve(strict=True)
        self.engine = self.repo / "ai-engine"
        self.notebook = notebook
        with (self.engine / "config" / "agents.toml").open("rb") as file:
            self.config = tomllib.load(file)

    def prepare(
        self,
        role: str,
        *,
        task_id: str,
        revision: str,
        handoff: object,
        query: str,
        guides: tuple[Guide, ...] = (),
        source_ids: tuple[str, ...] = (),
        plan: Plan | None = None,
        review: PlanReview | None = None,
        approval: PlanApproval | None = None,
        batch_id: str | None = None,
    ) -> PromptPackage:
        if not task_id.strip():
            raise ValueError("Thiếu mã nhiệm vụ.")
        if handoff is None or (isinstance(handoff, str) and not handoff.strip()):
            raise ValueError("Thiếu nội dung bàn giao.")

        agents = self.config["agents"]
        if role not in agents:
            raise ValueError(f"Vai trò chưa khai báo: {role}.")
        agent = agents[role]

        batch = None
        writable_paths: tuple[str, ...] = ()
        if role == "generator":
            if plan is None or review is None or approval is None:
                raise ValueError("Generate cần plan, review và quyết định duyệt lần 1.")
            if (plan.ref.task_id, plan.ref.base_commit) != (task_id, revision):
                raise ValueError("Mã nhiệm vụ hoặc commit khác với plan đã duyệt.")
            authorized = approval.authorized_batches(plan, review)
            batch = next((item for item in authorized if item.batch_id == batch_id), None)
            if batch is None:
                raise ValueError("Đợt triển khai chưa được duyệt.")
            selected_ids = set(batch.case_ids)
            guides = tuple(item.guide for item in plan.cases if item.case.case_id in selected_ids)
            writable_paths = tuple(
                item.path
                for item in plan.files
                if item.action != FileAction.REUSE and selected_ids.intersection(item.case_ids)
            )

        prompt_config = self.config["prompts"]
        prompt_names = [*prompt_config["shared"], agent["prompt"]]
        if agent.get("uses_test_guides"):
            if not guides:
                raise ValueError(f"Cần chọn hướng dẫn API/UI cho vai trò {role}.")
            for guide in dict.fromkeys(guides):
                prompt_names.append(self.config["test_guides"][Guide(guide).value])

        prompt_dir = self.engine / prompt_config["directory"]
        instructions = [
            (prompt_dir / name).read_text(encoding="utf-8").strip()
            for name in prompt_names
        ]
        instructions.append(
            "Dùng evidence và repo hiện tại làm nguồn đối chiếu. Nêu rõ nguồn xung đột, "
            "đoạn còn thiếu hoặc chưa xác minh được. Chỉ thao tác trong phạm vi quyền được cấp."
        )

        handoff_text = (
            handoff if isinstance(handoff, str) else json.dumps(handoff, ensure_ascii=False)
        )
        sources = retrieve(
            self.repo,
            revision,
            query,
            notebook=self.notebook,
            source_ids=source_ids,
            handoff=handoff_text,
            guides=tuple(Guide(g).value for g in guides),
        )
        context = {
            "task_id": task_id,
            "base_commit": revision,
            "role": role,
            "handoff": handoff,
            "evidence": asdict(sources),
            "approved_batch": asdict(batch) if batch is not None else None,
            "writable_paths": writable_paths,
        }
        return PromptPackage(
            role=role,
            prompts=tuple(prompt_names),
            system_prompt="\n\n---\n\n".join(instructions),
            context=context,
            sources=sources,
            writable_paths=writable_paths,
        )

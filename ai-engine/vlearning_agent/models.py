"""Dữ liệu bàn giao giữa các vai trò của vLearning Agent (Python 3.12)."""

from dataclasses import dataclass
from enum import StrEnum


class Guide(StrEnum):
    API = "api"
    UI = "ui"


class Mode(StrEnum):
    WRITE_ONLY = "write_only"
    WRITE_AND_RUN = "write_and_run"


class FileAction(StrEnum):
    REUSE = "reuse"
    MODIFY = "modify"
    CREATE = "create"


class RunStatus(StrEnum):
    NOT_RUN = "not_run"
    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"


def _unique_ids(values: tuple[str, ...]) -> None:
    if not values or any(not v.strip() for v in values) or len(set(values)) != len(values):
        raise ValueError("Danh sách mã phải có phần tử, không trống và không trùng.")


@dataclass(frozen=True)
class TaskInput:
    task_id: str
    requirements: tuple[str, ...] = ()
    manual_cases: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if not self.task_id.strip() or not any(s.strip() for s in self.requirements + self.manual_cases):
            raise ValueError("Cần mã nhiệm vụ và ít nhất một nguồn nghiệp vụ.")


@dataclass(frozen=True)
class TestCase:
    case_id: str
    source: str
    preconditions: tuple[str, ...]
    data: tuple[str, ...]
    steps: tuple[str, ...]
    expected_results: tuple[str, ...]
    technique: str
    open_questions: tuple[str, ...] = ()


@dataclass(frozen=True)
class CasePlan:
    case: TestCase
    guide: Guide
    spec_path: str
    setup: str
    cleanup: str
    assertions_and_evidence: tuple[str, ...]


@dataclass(frozen=True)
class PlannedFile:
    path: str
    action: FileAction
    case_ids: tuple[str, ...]
    reason: str
    symbols: tuple[str, ...]
    preview: str = ""


@dataclass(frozen=True)
class RunCommand:
    project: str
    case_ids: tuple[str, ...]
    argv: tuple[str, ...]

    def __post_init__(self) -> None:
        _unique_ids(self.case_ids)
        if not self.project.strip() or not self.argv or any(not arg.strip() for arg in self.argv):
            raise ValueError("Lệnh chạy cần project, TC và danh sách đối số cụ thể.")


@dataclass(frozen=True)
class ExecutionBatch:
    batch_id: str
    case_ids: tuple[str, ...]
    mode: Mode
    run_commands: tuple[RunCommand, ...]
    required_before_merge: tuple[RunCommand, ...]

    def __post_init__(self) -> None:
        _unique_ids(self.case_ids)
        if bool(self.run_commands) != (Mode(self.mode) == Mode.WRITE_AND_RUN):
            raise ValueError("Lệnh chạy trong đợt phải khớp với chế độ của đợt.")
        for command in self.run_commands + self.required_before_merge:
            if not set(command.case_ids).issubset(self.case_ids):
                raise ValueError("Phạm vi lệnh vượt quá danh sách TC của đợt.")


@dataclass(frozen=True)
class PlanRef:
    task_id: str
    version: str
    base_commit: str

    def __post_init__(self) -> None:
        if not all(v.strip() for v in (self.task_id, self.version, self.base_commit)):
            raise ValueError("Kế hoạch cần mã nhiệm vụ, phiên bản và commit cơ sở.")


@dataclass(frozen=True)
class Plan:
    ref: PlanRef
    cases: tuple[CasePlan, ...]
    files: tuple[PlannedFile, ...]
    batches: tuple[ExecutionBatch, ...]

    def __post_init__(self) -> None:
        ids = tuple(item.case.case_id for item in self.cases)
        _unique_ids(ids)
        if self.batches:
            _unique_ids(tuple(batch.batch_id for batch in self.batches))
        else:
            for item in self.cases:
                mapped = any(f.path == item.spec_path and item.case.case_id in f.case_ids
                             for f in self.files)
                if not mapped or not item.assertions_and_evidence or item.case.open_questions:
                    raise ValueError("Plan đã bao phủ cần spec, assertion và TC đủ căn cứ.")
            if any(f.action != FileAction.REUSE for f in self.files):
                raise ValueError("Plan sửa hoặc tạo file cần đợt triển khai.")
        for item in (*self.files, *self.batches):
            if not set(item.case_ids).issubset(ids):
                raise ValueError("Kế hoạch tham chiếu TC chưa khai báo.")


@dataclass(frozen=True)
class Finding:
    finding_id: str
    case_id: str
    evidence: str
    owner: str
    resolution_needed: str


@dataclass(frozen=True)
class PlanReview:
    ref: PlanRef
    ready_case_ids: tuple[str, ...]
    findings: tuple[Finding, ...] = ()


@dataclass(frozen=True)
class BatchApproval:
    batch_id: str
    case_ids: tuple[str, ...]
    mode: Mode


@dataclass(frozen=True)
class PlanApproval:
    ref: PlanRef
    decision_record: str
    scope: tuple[BatchApproval, ...]

    def authorized_batches(self, plan: Plan, review: PlanReview) -> tuple[ExecutionBatch, ...]:
        """Áp quyết định lần 1 vào đúng plan, gồm cả trường hợp chỉ duyệt một số TC."""
        if not self.decision_record.strip() or self.ref != plan.ref or self.ref != review.ref:
            raise ValueError("Thiếu quyết định hoặc sai phiên bản bàn giao.")
        _unique_ids(tuple(part.batch_id for part in self.scope))
        batches = {batch.batch_id: batch for batch in plan.batches}
        ready = set(review.ready_case_ids)
        ready.difference_update(c.case.case_id for c in plan.cases if c.case.open_questions)
        authorized = []
        for part in self.scope:
            batch = batches.get(part.batch_id)
            _unique_ids(part.case_ids)
            selected = set(part.case_ids)
            if batch is None or not selected.issubset(ready.intersection(batch.case_ids)):
                raise ValueError("Phạm vi duyệt vượt quá đợt hoặc TC sẵn sàng.")
            commands = ()
            if Mode(part.mode) == Mode.WRITE_AND_RUN:
                commands = tuple(c for c in batch.run_commands if selected.issuperset(c.case_ids))
                if not commands:
                    raise ValueError("Chưa có lệnh đã review phù hợp phạm vi được duyệt.")
            # Điều kiện trước merge vẫn áp dụng dù đợt này chỉ cho viết.
            checks = tuple(c for c in batch.required_before_merge if selected.intersection(c.case_ids))
            if any(not selected.issuperset(c.case_ids) for c in checks):
                raise ValueError("Cần tách lệnh xác minh chung để khớp phạm vi duyệt một phần.")
            authorized.append(ExecutionBatch(part.batch_id, part.case_ids, part.mode, commands, checks))
        return tuple(authorized)


@dataclass(frozen=True)
class RunResult:
    case_id: str
    status: RunStatus
    code_revision: str
    argv: tuple[str, ...] = ()
    evidence: tuple[str, ...] = ()


@dataclass(frozen=True)
class GenerationResult:
    ref: PlanRef
    code_revision: str  # SHA hoặc định danh bản diff đang review
    source_branch: str
    target_branch: str
    changed_files: tuple[str, ...]
    implemented_case_ids: tuple[str, ...]
    runs: tuple[RunResult, ...]


@dataclass(frozen=True)
class CodeReview:
    ref: PlanRef
    code_revision: str
    accepted_case_ids: tuple[str, ...]
    findings: tuple[Finding, ...]
    verified_runs: tuple[RunResult, ...]


@dataclass(frozen=True)
class MergeApproval:
    ref: PlanRef
    commit_sha: str
    source_branch: str
    target_branch: str
    decision_record: str

    def __post_init__(self) -> None:
        if len(self.commit_sha) not in (40, 64) or any(c not in "0123456789abcdef" for c in self.commit_sha):
            raise ValueError("Duyệt merge cần SHA đầy đủ của commit đã review.")
        if not all(s.strip() for s in (self.source_branch, self.target_branch, self.decision_record)):
            raise ValueError("Thiếu nhánh nguồn, nhánh đích hoặc quyết định lần 2.")

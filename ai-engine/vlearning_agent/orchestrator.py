"""Điều phối workflow QA cho Antigravity: một nhiệm vụ, hai lần duyệt, mọi quyết định đọc lại được."""
from dataclasses import asdict, is_dataclass
from enum import Enum
import json
from typing import get_args, get_origin, get_type_hints

from .agents.runner import AgentRunner, PromptPackage
from .models import (
    BatchApproval, FileAction, Guide, MergeApproval, Mode, Plan, PlanApproval,
    PlanRef, PlanReview, TaskInput,
)
from .task_store import TaskStore
from .tools import git_ops as git
from .tools.test_runner import run_command

STAGE_ROLE = {
    "analyze": "analyst",
    "plan": "planner",
    "review_plan": "plan_reviewer",
    "generate": "generator",
    "review_code": "code_reviewer",
}


def schema(kind):
    if get_origin(kind) is tuple:
        return [schema(get_args(kind)[0])]
    if is_dataclass(kind):
        return {key: schema(value) for key, value in get_type_hints(kind).items()}
    if issubclass(kind, Enum):
        return "|".join(x.value for x in kind)
    return "string"


def decode(kind, value):
    if get_origin(kind) is tuple:
        if not isinstance(value, list):
            raise ValueError("Cần JSON array.")
        return tuple(decode(get_args(kind)[0], item) for item in value)
    if is_dataclass(kind):
        hints = get_type_hints(kind)
        if not isinstance(value, dict) or set(value) != set(hints):
            raise ValueError(f"Trường JSON không khớp {kind.__name__}.")
        return kind(**{k: decode(hints[k], v) for k, v in value.items()})
    if not isinstance(value, str):
        raise ValueError("Cần chuỗi JSON.")
    return kind(value)


def output_schema_for(stage: str) -> dict:
    if stage == "analyze":
        return {"report": "string"}
    if stage == "plan":
        return {"plan": schema(Plan), "report": "string"}
    if stage == "review_plan":
        return {
            "review": schema(PlanReview),
            "report": "string",
            "next": "covered|approve_plan|plan|analyze",
        }
    if stage == "generate":
        return {
            "report": "string",
            "patch": "optional unified Git diff (để trống nếu đã sửa trực tiếp trong working tree)",
        }
    if stage == "review_code":
        return {
            "next": "accept|generate|plan",
            "report": "string",
            "accepted_case_ids": ["string"],
        }
    raise ValueError(f"Bước {stage} không nhận bàn giao từ agent.")


class Workflow:
    def __init__(self, repo, task, runner=None):
        self.repo = repo.resolve()
        self.task = task
        self.store = TaskStore(self.repo, task)
        self.runner = runner or AgentRunner(self.repo)

    def start(self, s, requirements, cases, query, target, guides):
        if s:
            raise ValueError("Mã nhiệm vụ đã tồn tại.")
        inputs = TaskInput(self.task, tuple(requirements), tuple(cases))
        source = git.branch(self.repo)
        git.git(self.repo, "check-ref-format", "--branch", target)
        base = git.sha(self.repo)
        if git.sha(self.repo, "refs/heads/" + target) != base:
            raise ValueError("Nhiệm vụ phải bắt đầu tại cùng SHA với nhánh đích.")
        s.update(
            input=asdict(inputs),
            query=query,
            guides=list(guides),
            source=source,
            target=target,
            base=base,
            version=1,
            stage="analyze",
            history=[],
            runs=[],
        )
        self.store.activate()

    def plan_data(self, s):
        return decode(Plan, s["plan"]), decode(PlanReview, s["plan_review"])

    def scope(self, s):
        plan, review = self.plan_data(s)
        approval = decode(PlanApproval, s["approval"])
        batch, = approval.authorized_batches(plan, review)
        return plan, review, approval, batch

    def writable_actions(self, s):
        plan, _, _, batch = self.scope(s)
        parent = s.get("commit", s["base"])
        selected = set(batch.case_ids)
        actions = {
            f.path: ("A" if f.action == FileAction.CREATE else "M")
            for f in plan.files
            if f.action != FileAction.REUSE and selected.intersection(f.case_ids)
        }
        # Khi đổi plan, toàn bộ diff tích lũy cũng phải thuộc phạm vi vừa duyệt.
        previous = git.git(
            self.repo, "diff", "--no-renames", "--name-status", "-z", s["base"], parent
        ).rstrip("\0")
        if previous:
            records = previous.split("\0")
            if any(
                actions.get(path) != status
                for status, path in zip(records[::2], records[1::2], strict=True)
            ):
                raise ValueError("Diff cũ vượt phạm vi plan mới. Cần đợt mới từ base sạch.")
        for path in list(actions):
            if git.git(self.repo, "ls-tree", parent, "--", path):
                if parent != s["base"] and actions[path] == "A":
                    actions[path] = "M"
        return actions

    def prompt_for(self, s, *, notebook=None, source_ids=()) -> PromptPackage:
        stage = s["stage"]
        if stage not in STAGE_ROLE:
            raise ValueError(f"Bước {stage} đang chờ quyết định của Tín hoặc đã hoàn tất.")
        role = STAGE_ROLE[stage]
        guides = tuple(Guide(g) for g in s["guides"])
        runner = AgentRunner(self.repo, notebook=notebook) if notebook is not None else self.runner
        extra = {}
        if stage == "analyze":
            handoff = [s["input"], s.get("feedback")]
        elif stage == "plan":
            ref = PlanRef(self.task, f"V{s['version']}", s["base"])
            handoff = [
                s["input"],
                s["analysis"],
                asdict(ref),
                s.get("feedback"),
                "Dùng đúng ref. Lệnh Playwright cần --reporter=json và --project=<project>. "
                "Tách lệnh theo TC cần duyệt riêng.",
            ]
        elif stage == "review_plan":
            handoff = [s["input"], s["analysis"], s["plan"], s["plan_report"]]
        elif stage == "generate":
            plan, review, approval, batch = self.scope(s)
            actions = self.writable_actions(s)
            parent = s.get("commit", s["base"])
            contents = {
                path: git.git(self.repo, "show", f"{parent}:{path}")
                for path in actions
                if git.git(self.repo, "ls-tree", parent, "--", path)
            }
            handoff = [s["plan"], s["plan_report"], s["approval"], contents, s.get("feedback")]
            extra = dict(plan=plan, review=review, approval=approval, batch_id=batch.batch_id)
        else:  # review_code
            plan, _, _, batch = self.scope(s)
            if s.get("worktree_mode"):
                scoped = list(self.writable_actions(s))
                diff = git.git(self.repo, "diff", "--no-ext-diff", "HEAD", "--", *scoped)
            else:
                diff = git.git(self.repo, "diff", "--no-ext-diff", s["base"], s["commit"])
            guides = tuple(c.guide for c in plan.cases if c.case.case_id in batch.case_ids)
            handoff = [
                s["plan"],
                s["approval"],
                s["generated"],
                s["commit"],
                s["source"],
                s["target"],
                diff,
                s["runs"] or "NOT_RUN",
                s.get("feedback"),
            ]

        return runner.prepare(
            role,
            task_id=self.task,
            revision=s["base"],
            query=s["query"],
            handoff={"handoff": handoff, "output_schema": output_schema_for(stage)},
            guides=guides,
            source_ids=tuple(source_ids),
            **extra,
        )

    def submit(self, s, data: dict):
        stage = s["stage"]
        if stage not in STAGE_ROLE:
            raise ValueError(f"Bước {stage} đang chờ quyết định hoặc đã hoàn tất.")
        if not isinstance(data, dict):
            raise ValueError("Kết quả bàn giao phải là JSON object.")

        if stage == "analyze":
            if set(data) != {"report"} or not isinstance(data["report"], str):
                raise ValueError("Analyze cần đúng trường report.")
            s["analysis"] = {"report": data["report"]}
            s["stage"] = "plan"
            return

        if stage == "plan":
            if set(data) != {"plan", "report"}:
                raise ValueError("Plan cần đúng trường plan và report.")
            ref = PlanRef(self.task, f"V{s['version']}", s["base"])
            if decode(Plan, data["plan"]).ref != ref:
                raise ValueError("Plan trả sai phiên bản hoặc commit cơ sở.")
            s.update(plan=data["plan"], plan_report=data["report"], stage="review_plan")
            return

        if stage == "review_plan":
            if set(data) != {"review", "report", "next"}:
                raise ValueError("Review plan cần đúng trường review, report và next.")
            review = decode(PlanReview, data["review"])
            plan = decode(Plan, s["plan"])
            if review.ref != plan.ref:
                raise ValueError("Sai phiên bản review.")
            route = data["next"]
            if route == "covered":
                ids = {item.case.case_id for item in plan.cases}
                if (
                    plan.batches
                    or set(review.ready_case_ids) != ids
                    or review.findings
                    or s.get("commit")
                ):
                    raise ValueError("Chưa đủ căn cứ kết thúc nhiệm vụ bằng coverage có sẵn.")
            if route == "approve_plan" and not plan.batches:
                raise ValueError("Plan không có đợt triển khai; Reviewer cần kết luận coverage.")
            if route not in {"covered", "approve_plan", "plan", "analyze"}:
                raise ValueError("Sai bước bàn giao.")
            if route == "approve_plan" and not review.ready_case_ids:
                raise ValueError("Chưa có TC sẵn sàng để trình duyệt.")
            s.update(plan_review=data["review"], feedback=data["report"], stage=route)
            if route in {"plan", "analyze"}:
                s["version"] += 1
            if route == "covered":
                self.store.deactivate()
            return

        if stage == "generate":
            if not {"report"}.issubset(data) or not set(data).issubset({"report", "patch"}):
                raise ValueError("Generate cần report (và tùy chọn patch).")
            plan, _, _, batch = self.scope(s)
            parent = s.get("commit", s["base"])
            if git.branch(self.repo) != s["source"] or git.sha(self.repo) != parent:
                raise ValueError("Sai nhánh hoặc SHA để generate.")
            actions = self.writable_actions(s)
            message = f"{self.task}: {plan.ref.version} {batch.batch_id}"
            patch = (data.get("patch") or "").strip()
            if s.get("worktree_mode"):
                # Giữ thay đổi trong working tree khi Tín duyệt test trực tiếp trên nhánh đích.
                commit = parent
            elif patch:
                git.clean(self.repo)
                commit = git.candidate(self.repo, parent, actions, patch + "\n", message)
                git.advance(self.repo, s["source"], parent, commit)
            else:
                commit = git.worktree_candidate(self.repo, parent, actions, message)
            s.update(
                parent=parent,
                candidate=commit,
                commit=commit,
                generated=data["report"],
                runs=[],
                stage="run" if batch.run_commands else "review_code",
            )
            return

        # review_code
        if set(data) != {"next", "report", "accepted_case_ids"}:
            raise ValueError("Review code cần đúng trường next, report và accepted_case_ids.")
        _, _, _, batch = self.scope(s)
        if s.get("worktree_mode"):
            scoped = list(self.writable_actions(s))
            diff = git.git(self.repo, "diff", "--no-ext-diff", "HEAD", "--", *scoped)
        else:
            diff = git.git(self.repo, "diff", "--no-ext-diff", s["base"], s["commit"])
        route = data["next"]
        if route not in {"accept", "generate", "plan"}:
            raise ValueError("Sai kết luận review code.")
        s.update(feedback=data["report"], code_review=data)
        if route == "plan":
            s["feedback"] += "\nDiff hiện tại:\n" + diff
            s["version"] += 1
        elif route == "accept":
            if set(data["accepted_case_ids"]) != set(batch.case_ids):
                raise ValueError("Review chưa bao phủ toàn bộ phạm vi đợt.")
            if any(not self.passed(s, c) for c in batch.run_commands):
                route = "generate"
            elif any(not self.passed(s, c) for c in batch.required_before_merge):
                route = "await_checks"
            else:
                route = "approve_merge"
        s["stage"] = route

    def approve(self, s, version, batch_id, case_ids, mode, decision):
        if s["stage"] != "approve_plan" or version != s["version"]:
            raise ValueError("Sai bước hoặc phiên bản plan.")
        current_branch = git.branch(self.repo)
        s["source"] = current_branch
        s["worktree_mode"] = current_branch == s["target"]
        plan, review = self.plan_data(s)
        approval = PlanApproval(
            plan.ref,
            decision,
            (BatchApproval(batch_id, tuple(case_ids), Mode(mode)),),
        )
        approved, = approval.authorized_batches(plan, review)
        for cmd in (*approved.run_commands, *approved.required_before_merge):
            if (
                cmd.argv[:3] != ("npx", "playwright", "test")
                or "--reporter=json" not in cmd.argv
                or f"--project={cmd.project}" not in cmd.argv
            ):
                raise ValueError("Lệnh Playwright cần --project=<project> và --reporter=json.")
        s.update(approval=json.loads(json.dumps(asdict(approval))), stage="generate")

    def run_tests(self, s):
        stage = s["stage"]
        if stage not in {"run", "checks"}:
            raise ValueError(f"Bước {stage} không cho phép chạy kiểm tra.")
        _, _, _, batch = self.scope(s)
        commands = batch.run_commands if stage == "run" else batch.required_before_merge
        for command in commands:
            if self.passed(s, command):
                continue
            result = run_command(
                self.repo,
                command,
                s["commit"],
                self.store.directory,
                len(s["history"]) + len(s["runs"]),
                allow_dirty=bool(s.get("worktree_mode")),
            )
            result["project"] = command.project
            s["runs"].append(result)
            self.store.save(s)
        s["stage"] = "review_code"

    def allow_checks(self, s, commit, decision):
        if s["stage"] != "await_checks" or s.get("commit") != commit or not decision.strip():
            raise ValueError("Sai bước, thiếu quyết định hoặc sai commit.")
        s.update(check_decision=decision, stage="checks")

    def passed(self, s, cmd):
        return any(
            r["commit"] == s["commit"]
            and r["argv"] == list(cmd.argv)
            and r["project"] == cmd.project
            and set(r["cases"]) == set(cmd.case_ids)
            and all(v == "passed" for v in r["cases"].values())
            for r in s["runs"]
        )

    def merge(self, s, commit, source, target, decision):
        if s["stage"] not in {"approve_merge", "merging"}:
            raise ValueError("Chưa đủ điều kiện duyệt lần 2.")
        if s.get("worktree_mode") or source == target:
            raise ValueError("Nhiệm vụ đang test trên working tree của nhánh đích; hãy tách nhánh riêng và commit trước khi merge.")
        approval = MergeApproval(decode(Plan, s["plan"]).ref, commit, source, target, decision)
        if (commit, source, target) != (s["commit"], s["source"], s["target"]):
            raise ValueError("Quyết định không khớp commit hoặc nhánh đã review.")
        git.clean(self.repo)
        if git.sha(self.repo, "refs/heads/" + source) != commit:
            raise ValueError("Nhánh nguồn đã đổi.")
        target_sha = git.sha(self.repo, "refs/heads/" + target)
        allowed = {s["base"], commit} if s["stage"] == "merging" else {s["base"]}
        if target_sha not in allowed:
            raise ValueError("Nhánh đích đã đổi; cần rà soát lại.")
        s.update(merge_approval=asdict(approval), stage="merging")
        self.store.save(s)
        git.git(self.repo, "switch", target)
        git.advance(self.repo, target, s["base"], commit)
        s["stage"] = "done"
        self.store.deactivate()

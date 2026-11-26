import contextlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from vlearning_agent.cli import main
from vlearning_agent.task_store import TaskStore

ENGINE = Path(__file__).resolve().parents[1]
PATCH = """diff --git a/tests/login.spec.ts b/tests/login.spec.ts
new file mode 100644
--- /dev/null
+++ b/tests/login.spec.ts
@@ -0,0 +1 @@
+// TC1 fixture
"""


class WorkflowTest(unittest.TestCase):
    def test_antigravity_workflow_with_worktree_and_two_approvals(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)

            def git(*args):
                return subprocess.check_output(["git", "-C", tmp, *args], text=True).strip()

            git("init", "-q", "-b", "main")
            git("config", "user.email", "test@example.invalid")
            git("config", "user.name", "Workflow Test")
            engine = repo / "ai-engine"
            shutil.copytree(
                ENGINE / "vlearning_agent/agents/prompts",
                engine / "vlearning_agent/agents/prompts",
            )
            (engine / "config").mkdir()
            (engine / "config/agents.toml").write_text(
                (ENGINE / "config/agents.toml").read_text(encoding="utf-8"),
                encoding="utf-8",
            )
            (repo / "tests").mkdir()
            (repo / "tests/base.ts").write_text("// login", encoding="utf-8")
            git("add", ".")
            git("commit", "-qm", "base")
            base = git("rev-parse", "HEAD")
            git("switch", "-qc", "qa")

            ref = dict(task_id="demo", version="V1", base_commit=base)
            case = dict(
                case_id="TC1",
                source="manual",
                preconditions=[],
                data=[],
                steps=["Login"],
                expected_results=["OK"],
                technique="manual",
                open_questions=[],
            )
            cmd = dict(
                project="api",
                case_ids=["TC1"],
                argv=[
                    "npx",
                    "playwright",
                    "test",
                    "tests/login.spec.ts",
                    "--project=api",
                    "--grep",
                    "TC1",
                    "--reporter=json",
                ],
            )
            plan = dict(
                ref=ref,
                cases=[
                    dict(
                        case=case,
                        guide="api",
                        spec_path="tests/login.spec.ts",
                        setup="",
                        cleanup="",
                        assertions_and_evidence=["OK"],
                    )
                ],
                files=[
                    dict(
                        path="tests/login.spec.ts",
                        action="create",
                        case_ids=["TC1"],
                        reason="login",
                        symbols=[],
                        preview="TC1",
                    )
                ],
                batches=[
                    dict(
                        batch_id="B1",
                        case_ids=["TC1"],
                        mode="write_only",
                        run_commands=[],
                        required_before_merge=[cmd],
                    )
                ],
            )
            accepted = dict(next="accept", report="review", accepted_case_ids=["TC1"])

            def cli(*args, stdin_obj=None, expected=0):
                out = io.StringIO()
                err = io.StringIO()
                argv = ["cli", "--repo", tmp, "--task", "demo", *args]
                if stdin_obj is not None:
                    fake_stdin = io.StringIO(json.dumps(stdin_obj))
                    with (
                        patch("sys.argv", argv),
                        patch("sys.stdin", fake_stdin),
                        contextlib.redirect_stdout(out),
                        contextlib.redirect_stderr(err),
                    ):
                        code = main()
                else:
                    with (
                        patch("sys.argv", argv),
                        contextlib.redirect_stdout(out),
                        contextlib.redirect_stderr(err),
                    ):
                        code = main()
                self.assertEqual(code, expected, f"{args}: {err.getvalue()}")
                return out.getvalue()

            statefile = repo / "ai-engine/tasks/demo/state.json"

            def state():
                return json.loads(statefile.read_text(encoding="utf-8"))

            bindir = Path(tmp) / ".git/bin"
            bindir.mkdir()
            npx = bindir / "npx"
            fixture = {
                "suites": [
                    {
                        "specs": [
                            {
                                "title": "TC1 login",
                                "tests": [
                                    {
                                        "projectName": "api",
                                        "status": "expected",
                                        "results": [{"status": "passed"}],
                                    }
                                ],
                            }
                        ]
                    }
                ]
            }
            npx.write_text("#!/bin/sh\ncat <<'EOF'\n" + json.dumps(fixture) + "\nEOF\n")
            npx.chmod(0o755)

            with patch.dict(os.environ, PATH=str(bindir) + os.pathsep + os.environ["PATH"]):
                cli("start", "--case", "TC1 login", "--query", "login", "--guide", "api", "--target", "main")
                self.assertEqual(TaskStore.active_task(repo), "demo")

                prompt_out = cli("prompt", "--json")
                self.assertEqual(json.loads(prompt_out)["role"], "analyst")

                cli("submit", "--input", "-", stdin_obj=dict(report="TC1 analysis"))
                cli("submit", "--input", "-", stdin_obj=dict(plan=plan, report="plan"))
                cli(
                    "submit",
                    "--input",
                    "-",
                    stdin_obj=dict(
                        review=dict(ref=ref, ready_case_ids=["TC1"], findings=[]),
                        report="ok",
                        next="approve_plan",
                    ),
                )
                # Chưa duyệt lần 1 thì không thể submit tiếp
                cli("submit", "--input", "-", stdin_obj=dict(report="early"), expected=1)

                cli(
                    "approve-plan",
                    "--version",
                    "1",
                    "--batch",
                    "B1",
                    "--case",
                    "TC1",
                    "--mode",
                    "write_only",
                    "--decision",
                    "Tin approved",
                )
                # Sửa file ngoài phạm vi phải bị từ chối
                (repo / "tests/other.ts").write_text("// outside\n", encoding="utf-8")
                cli("submit", "--input", "-", stdin_obj=dict(report="bad"), expected=1)
                (repo / "tests/other.ts").unlink()

                # Sửa đúng file đã duyệt trong working tree và submit
                (repo / "tests/login.spec.ts").write_text("// TC1 fixture\n", encoding="utf-8")
                cli("submit", "--input", "-", stdin_obj=dict(report="generated"))
                self.assertEqual(state()["stage"], "review_code")

                cli("submit", "--input", "-", stdin_obj=accepted)
                self.assertEqual(state()["stage"], "await_checks")
                self.assertEqual(state()["runs"], [])

                commit = state()["commit"]
                cli("allow-checks", "--commit", commit, "--decision", "Tin allowed")
                cli("run-tests")
                cli("submit", "--input", "-", stdin_obj=accepted)
                self.assertEqual(state()["runs"][0]["cases"], {"TC1": "passed"})
                self.assertEqual(state()["stage"], "approve_merge")

                cli(
                    "approve-merge",
                    "--commit",
                    base,
                    "--source",
                    "qa",
                    "--target",
                    "main",
                    "--decision",
                    "Tin merge",
                    expected=1,
                )
                cli(
                    "approve-merge",
                    "--commit",
                    commit,
                    "--source",
                    "qa",
                    "--target",
                    "main",
                    "--decision",
                    "Tin merge",
                )
                self.assertEqual(git("rev-parse", "main"), commit)
                self.assertEqual(state()["stage"], "done")
                self.assertIsNone(TaskStore.active_task(repo))

    def test_covered_flow_starts_on_main_and_stops_cleanly(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)

            def git(*args):
                return subprocess.check_output(["git", "-C", tmp, *args], text=True).strip()

            git("init", "-q", "-b", "main")
            git("config", "user.email", "test@example.invalid")
            git("config", "user.name", "Covered Test")
            engine = repo / "ai-engine"
            shutil.copytree(
                ENGINE / "vlearning_agent/agents/prompts",
                engine / "vlearning_agent/agents/prompts",
            )
            (engine / "config").mkdir()
            (engine / "config/agents.toml").write_text(
                (ENGINE / "config/agents.toml").read_text(encoding="utf-8"),
                encoding="utf-8",
            )
            (repo / "tests").mkdir()
            (repo / "tests/login.spec.ts").write_text("// USER_LOGIN_API_001", encoding="utf-8")
            git("add", ".")
            git("commit", "-qm", "base")
            base = git("rev-parse", "HEAD")

            ref = dict(task_id="covered-demo", version="V1", base_commit=base)
            case = dict(
                case_id="TC1",
                source="manual",
                preconditions=[],
                data=[],
                steps=["Login"],
                expected_results=["OK"],
                technique="manual",
                open_questions=[],
            )
            plan = dict(
                ref=ref,
                cases=[
                    dict(
                        case=case,
                        guide="api",
                        spec_path="tests/login.spec.ts",
                        setup="",
                        cleanup="",
                        assertions_and_evidence=["expectStatus(200)"],
                    )
                ],
                files=[
                    dict(
                        path="tests/login.spec.ts",
                        action="reuse",
                        case_ids=["TC1"],
                        reason="Đã tồn tại USER_LOGIN_API_001",
                        symbols=["USER_LOGIN_API_001"],
                        preview="",
                    )
                ],
                batches=[],
            )

            def cli(*args, stdin_obj=None, expected=0):
                out, err = io.StringIO(), io.StringIO()
                argv = ["cli", "--repo", tmp, "--task", "covered-demo", *args]
                if stdin_obj is not None:
                    with (
                        patch("sys.argv", argv),
                        patch("sys.stdin", io.StringIO(json.dumps(stdin_obj))),
                        contextlib.redirect_stdout(out),
                        contextlib.redirect_stderr(err),
                    ):
                        code = main()
                else:
                    with (
                        patch("sys.argv", argv),
                        contextlib.redirect_stdout(out),
                        contextlib.redirect_stderr(err),
                    ):
                        code = main()
                self.assertEqual(code, expected, f"{args}: {err.getvalue()}")

            cli("start", "--case", "Login hợp lệ", "--query", "login", "--guide", "api", "--target", "main")
            cli("submit", "--input", "-", stdin_obj=dict(report="analysis"))
            cli("submit", "--input", "-", stdin_obj=dict(plan=plan, report="covered report"))
            cli(
                "submit",
                "--input",
                "-",
                stdin_obj=dict(
                    review=dict(ref=ref, ready_case_ids=["TC1"], findings=[]),
                    report="Không cần tạo thêm — test case đã tồn tại",
                    next="covered",
                ),
            )
            state = json.loads((repo / "ai-engine/tasks/covered-demo/state.json").read_text())
            self.assertEqual(state["stage"], "covered")
            self.assertIsNone(TaskStore.active_task(repo))

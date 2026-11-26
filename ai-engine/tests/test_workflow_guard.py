import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

from vlearning_agent.task_store import TaskStore

GUARD_PATH = Path(__file__).resolve().parents[2] / ".agents" / "hooks" / "workflow_guard.py"
SPEC = importlib.util.spec_from_file_location("workflow_guard", GUARD_PATH)
GUARD = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(GUARD)


def _init_repo(root: Path) -> None:
    subprocess.check_call(["git", "-C", str(root), "init", "-q", "-b", "main"])


class WorkflowGuardHookTest(unittest.TestCase):
    def test_allows_when_no_active_task(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            _init_repo(repo)
            decision = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "write_file",
                        "args": {"Path": str(repo / "tests/a.spec.ts")},
                    },
                }
            )
            self.assertEqual(decision["decision"], "allow")

    def test_blocks_test_edits_before_approve_plan_and_enforces_writable_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            _init_repo(repo)
            store = TaskStore(repo, "VL-100")
            store.save({"stage": "plan"})
            store.activate()

            blocked_plan = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "edit_file",
                        "args": {"Path": str(repo / "tests/a.spec.ts")},
                    },
                }
            )
            self.assertEqual(blocked_plan["decision"], "deny")

            store.save(
                {
                    "stage": "generate",
                    "plan": {
                        "files": [
                            {"path": "tests/a.spec.ts", "action": "create", "case_ids": ["TC1"]},
                            {"path": "tests/b.spec.ts", "action": "reuse", "case_ids": ["TC1"]},
                        ]
                    },
                    "approval": {"scope": [{"case_ids": ["TC1"], "mode": "write_only"}]},
                }
            )
            allowed_gen = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "write_file",
                        "args": {"Path": str(repo / "tests/a.spec.ts")},
                    },
                }
            )
            self.assertEqual(allowed_gen["decision"], "allow")

            blocked_reuse = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "edit_file",
                        "args": {"Path": str(repo / "tests/b.spec.ts")},
                    },
                }
            )
            self.assertEqual(blocked_reuse["decision"], "deny")

            blocked_pw = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "run_command",
                        "args": {"CommandLine": "npx playwright test tests/a.spec.ts"},
                    },
                }
            )
            self.assertEqual(blocked_pw["decision"], "deny")

            blocked_merge = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "run_command",
                        "args": {"CommandLine": "git merge qa"},
                    },
                }
            )
            self.assertEqual(blocked_merge["decision"], "deny")

            ask_notebook = GUARD.evaluate_hook(
                {
                    "cwd": str(repo),
                    "toolCall": {
                        "name": "run_command",
                        "args": {"CommandLine": "notebooklm source add ./doc.md"},
                    },
                }
            )
            self.assertEqual(ask_notebook["decision"], "ask")

from pathlib import Path
import subprocess
import tempfile
import unittest

from vlearning_agent.task_store import TaskStore


def _init_repo(root: Path) -> None:
    subprocess.check_call(["git", "-C", str(root), "init", "-q", "-b", "main"])


class TaskStoreTest(unittest.TestCase):
    def test_rejects_invalid_task_id(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            _init_repo(repo)
            with self.assertRaises(ValueError):
                TaskStore(repo, "../bad")

    def test_save_locked_and_active_task_lifecycle(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            _init_repo(repo)
            store = TaskStore(repo, "VL-001")
            with store.locked() as state:
                self.assertEqual(state, {})
                state["stage"] = "analyze"
                state["note"] = "Tiếng Việt UTF-8"
                store.save(state)
            store.activate()
            self.assertEqual(TaskStore.active_task(repo), "VL-001")

            with store.locked() as reloaded:
                self.assertEqual(reloaded["stage"], "analyze")
                self.assertEqual(reloaded["note"], "Tiếng Việt UTF-8")

            store.deactivate()
            self.assertIsNone(TaskStore.active_task(repo))

"""Lưu trạng thái từng bước vào ai-engine/tasks/ để chạy được trong sandbox và không lẫn vào diff code."""
from contextlib import contextmanager
import fcntl
import json
import os
from pathlib import Path
import re
import tempfile

TASK_RE = re.compile(r"[A-Za-z0-9_-]{1,80}")


def _tasks_root(repo: Path) -> Path:
    root = Path(repo).resolve() / "ai-engine" / "tasks"
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    return root


class TaskStore:
    def __init__(self, repo: Path, task: str):
        if not TASK_RE.fullmatch(task):
            raise ValueError("Mã nhiệm vụ chỉ gồm chữ, số, dấu gạch ngang hoặc gạch dưới.")
        self.repo = Path(repo).resolve()
        self.task = task
        self.root = _tasks_root(self.repo)
        self.directory = self.root / task
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.path = self.directory / "state.json"

    @contextmanager
    def locked(self):
        with (self.directory / "lock").open("a", encoding="utf-8") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            yield json.loads(self.path.read_text(encoding="utf-8")) if self.path.exists() else {}

    def save(self, state: dict) -> None:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=self.directory, delete=False
        ) as tmp:
            json.dump(state, tmp, ensure_ascii=False, indent=2)
            tmp.flush()
            os.fsync(tmp.fileno())
        os.replace(tmp.name, self.path)

    def activate(self) -> None:
        active = self.root / ".active"
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=self.root, delete=False
        ) as tmp:
            tmp.write(self.task)
            tmp.flush()
            os.fsync(tmp.fileno())
        os.replace(tmp.name, active)

    def deactivate(self) -> None:
        active = self.root / ".active"
        if active.exists() and active.read_text(encoding="utf-8").strip() == self.task:
            active.unlink()

    @classmethod
    def active_task(cls, repo: Path) -> str | None:
        root = Path(repo).resolve() / "ai-engine" / "tasks"
        active = root / ".active"
        if not active.exists():
            return None
        task = active.read_text(encoding="utf-8").strip()
        return task if TASK_RE.fullmatch(task) else None

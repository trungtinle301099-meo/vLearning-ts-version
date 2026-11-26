from dataclasses import dataclass
import json
import subprocess


@dataclass(frozen=True)
class NotebookSource:
    notebook_id: str
    source_id: str
    title: str
    content: str


class NotebookReadError(RuntimeError):
    """Không đọc được nguồn NotebookLM đã chọn."""


class NotebookReader:
    def __init__(
        self,
        notebook_id: str,
        executable: str = "notebooklm",
        timeout: int = 60,
    ):
        if not notebook_id.strip():
            raise ValueError("Cần chỉ định notebook_id của dự án.")

        self.notebook_id = notebook_id
        self.executable = executable
        self.timeout = timeout

    def read(self, source_id: str) -> NotebookSource:
        if not source_id.strip() or source_id.startswith("-"):
            raise ValueError("source_id không hợp lệ.")

        command = [
            self.executable,
            "source",
            "fulltext",
            "-n",
            self.notebook_id,
            "--json",
            "--",
            source_id,
        ]

        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True,
                timeout=self.timeout,
            )
            data = json.loads(result.stdout)
            if data["source_id"] != source_id:
                raise ValueError("ID nguồn trả về khác ID được yêu cầu.")
            if not isinstance(data["content"], str):
                raise ValueError("Nội dung nguồn không hợp lệ.")

            return NotebookSource(
                notebook_id=self.notebook_id,
                source_id=source_id,
                title=data["title"],
                content=data["content"],
            )
        except (
            OSError,
            subprocess.SubprocessError,
            KeyError,
            TypeError,
            ValueError,
        ) as exc:
            raise NotebookReadError(
                f"Chưa đọc được nguồn {source_id}: {type(exc).__name__}."
            ) from exc
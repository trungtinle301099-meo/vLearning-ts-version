import json
import subprocess
import unittest
from unittest.mock import patch

from vlearning_agent.tools.notebooklm import NotebookReadError, NotebookReader


class NotebookReaderTest(unittest.TestCase):
    def test_rejects_empty_notebook_id_and_bad_source_id(self):
        with self.assertRaises(ValueError):
            NotebookReader("   ")
        reader = NotebookReader("nb-123")
        with self.assertRaises(ValueError):
            reader.read("")
        with self.assertRaises(ValueError):
            reader.read("--bad-flag")

    def test_read_success_returns_notebook_source(self):
        reader = NotebookReader("nb-123")
        payload = {
            "source_id": "src-1",
            "title": "vLearning Spec",
            "content": "Quy định ghi danh khóa học",
        }
        completed = subprocess.CompletedProcess(
            args=["notebooklm"], returncode=0, stdout=json.dumps(payload), stderr=""
        )
        with patch("vlearning_agent.tools.notebooklm.subprocess.run", return_value=completed) as run:
            source = reader.read("src-1")
        self.assertEqual(source.notebook_id, "nb-123")
        self.assertEqual(source.source_id, "src-1")
        self.assertEqual(source.title, "vLearning Spec")
        self.assertIn("ghi danh", source.content)
        run.assert_called_once()

    def test_read_raises_notebook_read_error_on_mismatch_or_failure(self):
        reader = NotebookReader("nb-123")
        mismatch = subprocess.CompletedProcess(
            args=["notebooklm"],
            returncode=0,
            stdout=json.dumps({"source_id": "other", "title": "t", "content": "c"}),
            stderr="",
        )
        with patch("vlearning_agent.tools.notebooklm.subprocess.run", return_value=mismatch):
            with self.assertRaises(NotebookReadError):
                reader.read("src-1")

        with patch(
            "vlearning_agent.tools.notebooklm.subprocess.run",
            side_effect=subprocess.CalledProcessError(1, "notebooklm"),
        ):
            with self.assertRaises(NotebookReadError):
                reader.read("src-1")

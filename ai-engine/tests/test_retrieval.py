from pathlib import Path
import subprocess
import tempfile
import unittest

from vlearning_agent.tools.notebooklm import NotebookSource
from vlearning_agent.tools.retrieval import read_source, retrieve, scan_existing_tests


class _StubNotebook:
    def read(self, source_id: str) -> NotebookSource:
        return NotebookSource(
            notebook_id="nb-1",
            source_id=source_id,
            title="Business Rules",
            content="Quy định approveEnroll: học viên đăng ký khóa học sẽ vào danh sách chờ xét duyệt.",
        )


def _setup_repo(root: Path) -> str:
    def run(*args):
        return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()

    run("init", "-q", "-b", "main")
    run("config", "user.email", "test@example.invalid")
    run("config", "user.name", "Retrieval Test")
    (root / "src" / "api" / "services").mkdir(parents=True)
    (root / "tests" / "api" / "users").mkdir(parents=True)
    (root / "tests" / "ui" / "login").mkdir(parents=True)
    (root / "src" / "api" / "services" / "user.service.ts").write_text(
        "export async function approveEnroll() { return 'ok'; }\n", encoding="utf-8"
    )
    (root / "tests" / "api" / "users" / "enroll.api.spec.ts").write_text(
        "test('TC-01 approveEnroll', async () => {});\n", encoding="utf-8"
    )
    (root / "tests" / "ui" / "login" / "login.ui.spec.ts").write_text(
        "test('UI login', async () => {});\n", encoding="utf-8"
    )
    run("add", ".")
    run("commit", "-qm", "init")
    return run("rev-parse", "HEAD")


class RetrievalTest(unittest.TestCase):
    def test_retrieve_finds_code_and_notebook_evidence_and_reads_pages(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            sha = _setup_repo(repo)
            result = retrieve(
                repo,
                sha,
                "approveEnroll",
                source_ids=("src-1",),
                notebook=_StubNotebook(),
                handoff="Tham chiếu tests/api/users/enroll.api.spec.ts",
                guides=("api",),
            )
            locations = [item.location for item in result.evidence]
            self.assertTrue(any("enroll.api.spec.ts" in loc for loc in locations))
            self.assertTrue(any("NotebookLM/nb-1/src-1" in loc for loc in locations))
            self.assertEqual(result.unresolved, ())

            page = read_source(repo, sha, result.files, "src/api/services/user.service.ts", 1)
            self.assertIn("approveEnroll", page.text)

    def test_retrieve_reports_missing_notebook_and_read_source_validates_bounds(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            sha = _setup_repo(repo)
            result = retrieve(repo, sha, "approveEnroll", source_ids=("src-404",))
            self.assertTrue(any("src-404" in msg for msg in result.unresolved))

            with self.assertRaises(ValueError):
                read_source(repo, sha, result.files, "outside/file.ts", 1)
            with self.assertRaises(ValueError):
                read_source(repo, sha, result.files, "src/api/services/user.service.ts", 99)

    def test_scan_existing_tests_lists_matching_specs_and_titles(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            sha = _setup_repo(repo)
            hits = scan_existing_tests(repo, sha, "approveEnroll", ("api",))
            self.assertEqual(len(hits), 1)
            self.assertEqual(hits[0]["path"], "tests/api/users/enroll.api.spec.ts")
            self.assertEqual(hits[0]["tests"][0]["title"], "TC-01 approveEnroll")

from pathlib import Path
import subprocess
import tempfile
import unittest

from vlearning_agent.tools import git_ops as git


def _init_repo(root: Path) -> str:
    def run(*args):
        return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()

    run("init", "-q", "-b", "main")
    run("config", "user.email", "test@example.invalid")
    run("config", "user.name", "GitOps Test")
    (root / "tests").mkdir()
    (root / "tests" / "base.spec.ts").write_text("// base\n", encoding="utf-8")
    run("add", ".")
    run("commit", "-qm", "base")
    return run("rev-parse", "HEAD")


class GitOpsTest(unittest.TestCase):
    def test_candidate_blocks_paths_outside_src_or_tests(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            base = _init_repo(repo)
            patch = (
                "diff --git a/README.md b/README.md\n"
                "new file mode 100644\n"
                "--- /dev/null\n"
                "+++ b/README.md\n"
                "@@ -0,0 +1 @@\n"
                "+blocked\n"
            )
            with self.assertRaises(ValueError):
                git.candidate(repo, base, {"README.md": "A"}, patch, "bad")

    def test_worktree_candidate_commits_scoped_changes_and_cleans_status(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            base = _init_repo(repo)
            git.git(repo, "switch", "-qc", "qa/demo")
            (repo / "tests" / "new.spec.ts").write_text("// new\n", encoding="utf-8")
            (repo / "AGENTS.md").write_text("# untracked tooling\n", encoding="utf-8")

            commit = git.worktree_candidate(repo, base, {"tests/new.spec.ts": "A"}, "demo: V1 B1")
            self.assertEqual(git.sha(repo), commit)
            git.clean(repo)

    def test_worktree_candidate_rejects_extra_modified_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            base = _init_repo(repo)
            (repo / "tests" / "base.spec.ts").write_text("// changed\n", encoding="utf-8")
            (repo / "tests" / "extra.spec.ts").write_text("// extra\n", encoding="utf-8")

            with self.assertRaises(ValueError):
                git.worktree_candidate(repo, base, {"tests/base.spec.ts": "M"}, "bad")

    def test_advance_fast_forwards_target_branch(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            base = _init_repo(repo)
            git.git(repo, "switch", "-qc", "qa/demo")
            (repo / "tests" / "a.spec.ts").write_text("// a\n", encoding="utf-8")
            commit = git.worktree_candidate(repo, base, {"tests/a.spec.ts": "A"}, "add a")
            git.git(repo, "switch", "-q", "main")
            git.advance(repo, "main", base, commit)
            self.assertEqual(git.sha(repo, "refs/heads/main"), commit)

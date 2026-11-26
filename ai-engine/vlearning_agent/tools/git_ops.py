"""Áp patch hoặc commit thay đổi working tree vào index tạm theo đúng phạm vi plan."""
import os
from pathlib import PurePosixPath
import subprocess
import tempfile

TRACKED_SCOPE = ("src", "tests", "playwright.config.ts", "package.json")


def git(repo, *args, data=None, env=None):
    result = subprocess.run(
        ["git", "-C", str(repo), *args], input=data, capture_output=True,
        text=True, env=env, check=False,
    )
    if result.returncode:
        raise ValueError(result.stderr.strip() or f"Git thất bại: {args[0]}")
    return result.stdout


def branch(repo):
    return git(repo, "symbolic-ref", "--short", "HEAD").strip()


def sha(repo, ref="HEAD"):
    return git(repo, "rev-parse", "--verify", ref + "^{commit}").strip()


def worktree_changes(repo):
    dirty = {}
    for raw in (
        git(repo, "status", "--porcelain", "--untracked-files=no", "-z"),
        git(repo, "status", "--porcelain", "--untracked-files=all", "-z", "--", *TRACKED_SCOPE),
    ):
        for entry in raw.split("\0"):
            if not entry:
                continue
            code, path = entry[:2], entry[3:]
            if "R" in code or "C" in code:
                raise ValueError(f"Không hỗ trợ rename/copy trong phạm vi generate: {path}")
            dirty[path] = code
    return dirty


def clean(repo):
    if worktree_changes(repo):
        raise ValueError("Worktree có thay đổi. Cần worktree sạch để đối chiếu commit.")


def _validate_scope(changes):
    if not changes:
        raise ValueError("Đợt chưa có file được phép sửa.")
    for path in changes:
        parts = PurePosixPath(path).parts
        if not parts or parts[0] not in {"src", "tests"} or ".." in parts:
            raise ValueError(f"Đường dẫn ngoài phạm vi test: {path}")


def _verify_tree(repo, parent, tree, changes):
    raw = git(repo, "diff", "--name-status", "--no-renames", "-z", parent, tree)
    fields = raw.rstrip("\0").split("\0") if raw.rstrip("\0") else []
    actual = dict(zip(fields[1::2], fields[::2], strict=True))
    if not actual or any(changes.get(p) != status for p, status in actual.items()):
        raise ValueError(f"Patch có thao tác ngoài plan: {actual}")
    for path in actual:
        mode = git(repo, "ls-tree", tree, "--", path).split()[0]
        if mode != "100644":
            raise ValueError(f"Chỉ nhận file source thông thường: {path}")


def candidate(repo, parent, changes, patch, message):
    _validate_scope(changes)
    with tempfile.TemporaryDirectory() as directory:
        env = dict(os.environ, GIT_INDEX_FILE=directory + "/index")
        git(repo, "read-tree", parent, env=env)
        git(repo, "apply", "--cached", "--whitespace=nowarn", "-", data=patch, env=env)
        tree = git(repo, "write-tree", env=env).strip()
    _verify_tree(repo, parent, tree, changes)
    return git(repo, "commit-tree", tree, "-p", parent, "-m", message).strip()


def worktree_candidate(repo, parent, changes, message):
    _validate_scope(changes)
    if sha(repo) != parent:
        raise ValueError("HEAD khác commit cơ sở của đợt.")
    dirty = worktree_changes(repo)
    if not dirty:
        raise ValueError("Chưa có thay đổi nào trong working tree để commit.")
    extra = [path for path in dirty if path not in changes]
    if extra:
        raise ValueError(f"Có thay đổi ngoài phạm vi plan: {', '.join(extra)}")

    cur_branch = branch(repo)
    with tempfile.TemporaryDirectory() as directory:
        env = dict(os.environ, GIT_INDEX_FILE=directory + "/index")
        git(repo, "read-tree", parent, env=env)
        git(repo, "update-index", "--add", "--", *dirty.keys(), env=env)
        tree = git(repo, "write-tree", env=env).strip()
    _verify_tree(repo, parent, tree, changes)
    commit = git(repo, "commit-tree", tree, "-p", parent, "-m", message).strip()
    git(repo, "update-ref", f"refs/heads/{cur_branch}", commit, parent)
    git(repo, "read-tree", commit)
    clean(repo)
    return commit


def advance(repo, source, parent, commit):
    clean(repo)
    if branch(repo) != source or sha(repo) not in {parent, commit}:
        raise ValueError("Nhánh hoặc commit nguồn đã thay đổi.")
    git(repo, "merge", "--ff-only", commit)
    if sha(repo) != commit:
        raise ValueError("HEAD khác commit dự kiến.")

from dataclasses import dataclass
from pathlib import Path
import re
import subprocess

from .notebooklm import NotebookReader, NotebookReadError


@dataclass(frozen=True)
class Evidence:
    location: str
    first_line: int
    text: str


@dataclass(frozen=True)
class RetrievalResult:
    evidence: tuple[Evidence, ...]
    unresolved: tuple[str, ...]
    files: tuple[str, ...] = ()


def _passages(location: str, content: str):
    lines = content.splitlines()
    for start in range(0, len(lines), 20):
        snippet = "\n".join(lines[start : start + 24])
        if snippet.strip():
            yield Evidence(
                location=location,
                first_line=start + 1,
                text=snippet[:4000],
            )


def _rank(items: list[Evidence], query: str, limit: int) -> list[Evidence]:
    exact = query.strip().casefold()
    direct = [
        item
        for item in items
        if exact in (item.location + "\n" + item.text).casefold()
    ]
    if direct:
        direct.sort(key=lambda item: exact not in item.text.casefold())
        return direct[:limit]

    tokens = re.findall(r"\w+", exact)
    query_words = set(tokens)
    corpus = [
        re.findall(r"\w+", (item.location + " " + item.text).casefold())
        for item in items
    ]
    candidates = [
        index
        for index, words in enumerate(corpus)
        if query_words.intersection(words)
    ]
    if not candidates:
        return []

    from rank_bm25 import BM25Plus

    scores = BM25Plus(corpus).get_scores(tokens)
    candidates.sort(key=lambda index: scores[index], reverse=True)
    return [items[index] for index in candidates[:limit]]


def retrieve(
    repo: Path,
    revision: str,
    query: str,
    *,
    source_ids: tuple[str, ...] = (),
    notebook: NotebookReader | None = None,
    limit: int = 6,
    handoff: str = "",
    guides: tuple[str, ...] = (),
) -> RetrievalResult:
    if not query.strip():
        raise ValueError("Cần nội dung tra cứu.")
    if limit < 1:
        raise ValueError("limit phải lớn hơn 0.")
    if not re.fullmatch(r"[a-fA-F0-9]{7,64}", revision):
        raise ValueError("revision phải là mã commit Git.")

    def git(*args: str) -> bytes:
        return subprocess.check_output(
            ["git", "-C", str(repo), *args],
            timeout=30,
        )

    sha = git("rev-parse", "--verify", revision + "^{commit}").decode().strip()
    paths = git(
        "ls-tree",
        "-rz",
        "--name-only",
        sha,
        "--",
        "src",
        "tests",
        "playwright.config.ts",
        "package.json",
    ).decode().split("\x00")

    passages: list[Evidence] = []
    source_text: dict[str, str] = {}
    for path in paths:
        if not path.endswith((".ts", ".tsx", ".js", ".json")):
            continue

        content = git("show", f"{sha}:{path}").decode(
            "utf-8", errors="replace"
        )
        if path.endswith((".ts", ".tsx", ".js")) or path == "package.json":
            source_text[path] = content
        passages.extend(_passages(f"{sha}:{path}", content))

    found = _rank(passages, query, limit)
    missing: list[str] = []
    if not found:
        missing.append("Chưa tìm thấy bằng chứng trong phạm vi source đã tra.")

    if handoff:
        # Ưu tiên spec thật và các đường dẫn xuất hiện trong bàn giao.
        words = set(re.findall(r"\w+", query.casefold()))
        mentioned = set(re.findall(r"(?:src|tests)/[\w./-]+", handoff))
        folders = {str(Path(path).parent) for path in mentioned if path.endswith(".spec.ts")}
        specs = []
        for path in source_text:
            if not path.endswith(".spec.ts") or (guides and not any(
                path.startswith(f"tests/{guide}/") for guide in guides
            )):
                continue
            if str(Path(path).parent) in folders or words.intersection(re.findall(r"\w+", path.casefold())):
                specs.append(path)
        selected = sorted(specs, key=lambda path: path not in mentioned)
        selected.extend(path for path in source_text if path in mentioned)
        remaining = 16000
        pages = []
        for path in dict.fromkeys(selected):
            if remaining <= 0:
                break
            content = source_text[path]
            excerpt = content[:min(3200, remaining)]
            remaining -= len(excerpt)
            note = "toàn bộ" if len(excerpt) == len(content) else "trích đầu file; có thể yêu cầu đọc tiếp"
            pages.append(Evidence(f"{sha}:{path}", 1, f"[Tự gửi: {note}]\n{excerpt}"))
        found = pages + found

    for source_id in dict.fromkeys(source_ids):
        if notebook is None:
            missing.append(f"Chưa cấu hình NotebookLM để đọc {source_id}.")
            continue

        try:
            source = notebook.read(source_id)
        except NotebookReadError as exc:
            missing.append(str(exc))
            continue

        location = (
            f"NotebookLM/{source.notebook_id}/{source.source_id}: {source.title}"
        )
        hits = _rank(list(_passages(location, source.content)), query, limit)
        if hits:
            found.extend(hits)
        else:
            missing.append(f"Chưa tìm thấy đoạn phù hợp trong {source_id}.")

    return RetrievalResult(
        evidence=tuple(found), unresolved=tuple(missing),
        files=tuple(p for p in paths if p.endswith((".ts", ".tsx", ".js"))
                    or p == "package.json"),
    )


def read_source(repo: Path, revision: str, files: tuple[str, ...], path: str, line: int) -> Evidence:
    if not isinstance(path, str) or path not in files:
        raise ValueError("Đường dẫn cần có trong danh sách file tại commit.")
    if type(line) is not int or line < 1:
        raise ValueError("Dòng bắt đầu phải là số nguyên dương.")
    content = subprocess.check_output(
        ["git", "-C", str(repo), "show", f"{revision}:{path}"], timeout=30,
    ).decode("utf-8", errors="replace")
    lines = content.splitlines()
    if line > max(1, len(lines)):
        raise ValueError(f"{path} chỉ có {len(lines)} dòng.")
    page = lines[line - 1:line + 79]
    return Evidence(f"{revision}:{path}", line,
                    f"[Tổng {len(lines)} dòng]\n" + "\n".join(page))


_TEST_TITLE_RE = re.compile(r"""^\s*(?:test|it)(?:\.(?:only|skip))?\(\s*(['"`])(.+?)\1""")


def scan_existing_tests(
    repo: Path,
    revision: str,
    query: str,
    guides: tuple[str, ...] = (),
) -> list[dict]:
    """Quét nhanh các spec và tên test đang có trong tests/ khớp từ khóa tìm kiếm."""
    if not query.strip():
        return []
    sha = subprocess.check_output(
        ["git", "-C", str(repo), "rev-parse", "--verify", revision + "^{commit}"],
        timeout=30,
    ).decode().strip()
    paths = subprocess.check_output(
        ["git", "-C", str(repo), "ls-tree", "-rz", "--name-only", sha, "--", "tests"],
        timeout=30,
    ).decode().split("\x00")
    tokens = [tok for tok in re.findall(r"\w+", query.casefold()) if len(tok) >= 2]
    hits = []
    for path in sorted(paths):
        if not path.endswith(".spec.ts"):
            continue
        if guides and not any(path.startswith(f"tests/{g}/") for g in guides):
            continue
        content = subprocess.check_output(
            ["git", "-C", str(repo), "show", f"{sha}:{path}"], timeout=30
        ).decode("utf-8", errors="replace")
        matched_tests = []
        for idx, line in enumerate(content.splitlines(), start=1):
            m = _TEST_TITLE_RE.match(line)
            if not m:
                continue
            title = m.group(2)
            haystack = f"{path} {title}".casefold()
            if not tokens or any(tok in haystack for tok in tokens):
                matched_tests.append({"line": idx, "title": title})
        if matched_tests:
            hits.append({"path": path, "tests": matched_tests})
    return hits

"""Chỉ công nhận TC có kết quả Playwright trên đúng project và commit."""
import json
import re
import subprocess
from .git_ops import clean, sha


def specs(suite):
    yield from suite.get("specs", [])
    for child in suite.get("suites", []):
        yield from specs(child)


def _parse_playwright_json(raw: str) -> dict:
    text = raw.lstrip("\ufeff").strip()
    try:
        return json.loads(text)
    except ValueError:
        for match in re.finditer(r"^\{", text, flags=re.MULTILINE):
            try:
                return json.loads(text[match.start():])
            except ValueError:
                continue
        raise


def run_command(repo, command, commit, directory, number, *, allow_dirty: bool = False):
    if not allow_dirty:
        clean(repo)
    if sha(repo) != commit:
        raise ValueError("Sai phiên bản cần chạy.")
    argv = command.argv
    if argv[:3] != ("npx", "playwright", "test") or "--reporter=json" not in argv:
        raise ValueError("Lệnh cần npx playwright test và --reporter=json trong plan.")
    if f"--project={command.project}" not in argv:
        raise ValueError("Project trong argv phải khớp project đã duyệt.")
    report = directory / f"run-{number}.json"
    stderr = directory / f"run-{number}.stderr"
    with report.open("w") as out, stderr.open("w") as err:
        proc = subprocess.run(argv, cwd=repo, stdout=out, stderr=err, check=False)
    statuses = {case: [] for case in command.case_ids}
    try:
        payload = _parse_playwright_json(report.read_text(encoding="utf-8", errors="replace"))
        for top in payload["suites"]:
            for spec in specs(top):
                for test in spec["tests"]:
                    for case in statuses:
                        if test["projectName"] == command.project and re.search(
                            rf"(?<!\w){re.escape(case)}(?!\w)", spec["title"]
                        ):
                            results = test.get("results", [])
                            statuses[case].append(bool(results) and
                                results[-1]["status"] == "passed" and test["status"] == "expected")
    except (KeyError, ValueError, TypeError, IndexError):
        statuses = {case: [] for case in command.case_ids}
    if not allow_dirty:
        clean(repo)
    passed = proc.returncode == 0 and sha(repo) == commit
    return dict(commit=commit, argv=list(argv), exit_code=proc.returncode,
                report=str(report), stderr=str(stderr),
                cases={case: "passed" if passed and hits and all(hits) else "failed"
                       for case, hits in statuses.items()})

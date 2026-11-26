import contextlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from vlearning_agent.agents.runner import AgentRunner
from vlearning_agent.agents.sdk_runner import _build_local_config, ensure_sdk_auth, parse_json_output
from vlearning_agent.cli import main
from vlearning_agent.models import Guide
from vlearning_agent.task_store import TaskStore
from vlearning_agent.tools.test_runner import _parse_playwright_json

ENGINE = Path(__file__).resolve().parents[1]


class SdkRunnerAndCliAutoTest(unittest.TestCase):
    def test_parse_json_output_strips_markdown_fence_and_validates_keys(self):
        parsed = parse_json_output(
            "```json\n{\"report\": \"ok\"}\n```",
            {"report"},
        )
        self.assertEqual(parsed, {"report": "ok"})
        with self.assertRaises(ValueError):
            parse_json_output("{\"wrong\": \"x\"}", {"report"})

    def test_ensure_sdk_auth_reads_dotenv_and_errors_cleanly_when_missing(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            with patch.dict(os.environ, {}, clear=True):
                with self.assertRaises(RuntimeError) as ctx:
                    ensure_sdk_auth(repo)
                self.assertIn("GEMINI_API_KEY", str(ctx.exception))

                (repo / ".env").write_text("GEMINI_API_KEY=test-key-from-dotenv\n", encoding="utf-8")
                ensure_sdk_auth(repo)
                self.assertEqual(os.environ.get("GEMINI_API_KEY"), "test-key-from-dotenv")

    def test_build_local_config_restricts_readonly_roles(self):
        repo = ENGINE.parent
        sha = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
        pkg = AgentRunner(repo).prepare(
            "analyst",
            task_id="SDK-CFG",
            revision=sha,
            handoff={"handoff": ["Login"], "output_schema": {"report": "string"}},
            query="login",
            guides=(Guide.API,),
        )
        cfg = _build_local_config(repo, pkg)
        tool_names = {t.value for t in cfg.capabilities.enabled_tools or []}
        self.assertIn("view_file", tool_names)
        self.assertNotIn("edit_file", tool_names)
        self.assertNotIn("run_command", tool_names)

    def test_parse_playwright_json_ignores_dotenv_stdout_banner(self):
        raw = (
            "◇ injected env (8) from .env\n"
            "◇ injected env (0) from .env // tip: multiple files { path: ['.env.local', '.env'] }\n"
            "{\"suites\": [], \"stats\": {\"expected\": 1}}\n"
        )
        parsed = _parse_playwright_json(raw)
        self.assertEqual(parsed["stats"]["expected"], 1)

    def test_cli_start_auto_runs_analyze_plan_review_and_prints_covered_report(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)

            def git(*args):
                return subprocess.check_output(["git", "-C", tmp, *args], text=True).strip()

            git("init", "-q", "-b", "main")
            git("config", "user.email", "test@example.invalid")
            git("config", "user.name", "Auto Test")
            engine = repo / "ai-engine"
            shutil.copytree(
                ENGINE / "vlearning_agent/agents/prompts",
                engine / "vlearning_agent/agents/prompts",
            )
            (engine / "config").mkdir()
            (engine / "config/agents.toml").write_text(
                (ENGINE / "config/agents.toml").read_text(encoding="utf-8"),
                encoding="utf-8",
            )
            (repo / "tests/api/users").mkdir(parents=True)
            (repo / "tests/api/users/login.api.spec.ts").write_text(
                "test('USER_LOGIN_API_001 - login', async () => {});\n",
                encoding="utf-8",
            )
            git("add", ".")
            git("commit", "-qm", "base")
            base = git("rev-parse", "HEAD")

            ref = dict(task_id="AUTO-1", version="V1", base_commit=base)
            case = dict(
                case_id="USER_LOGIN_API_001",
                source="manual",
                preconditions=[],
                data=[],
                steps=["Login"],
                expected_results=["OK"],
                technique="manual",
                open_questions=[],
            )
            plan = dict(
                ref=ref,
                cases=[
                    dict(
                        case=case,
                        guide="api",
                        spec_path="tests/api/users/login.api.spec.ts",
                        setup="",
                        cleanup="",
                        assertions_and_evidence=["expectStatus(200)"],
                    )
                ],
                files=[
                    dict(
                        path="tests/api/users/login.api.spec.ts",
                        action="reuse",
                        case_ids=["USER_LOGIN_API_001"],
                        reason="Đã có sẵn",
                        symbols=["USER_LOGIN_API_001"],
                        preview="",
                    )
                ],
                batches=[],
            )

            replies = iter(
                [
                    {"report": "Phân tích xong"},
                    {"plan": plan, "report": "Kế hoạch reuse"},
                    {
                        "review": {"ref": ref, "ready_case_ids": ["USER_LOGIN_API_001"], "findings": []},
                        "report": "Không cần tạo thêm — test case đã tồn tại tại tests/api/users/login.api.spec.ts",
                        "next": "covered",
                    },
                ]
            )

            def fake_sdk(repo_arg, pkg, schema_arg, model=None):
                return next(replies)

            out, err = io.StringIO(), io.StringIO()
            argv = [
                "cli",
                "--repo",
                tmp,
                "--task",
                "AUTO-1",
                "start",
                "--case",
                "Login thành công với tài khoản hợp lệ",
                "--query",
                "login",
                "--target",
                "main",
                "--guide",
                "api",
                "--auto",
            ]
            with (
                patch("vlearning_agent.cli.run_stage_with_sdk", side_effect=fake_sdk),
                patch("sys.argv", argv),
                contextlib.redirect_stdout(out),
                contextlib.redirect_stderr(err),
            ):
                code = main()

            self.assertEqual(code, 0, err.getvalue())
            output = out.getvalue()
            self.assertIn("USER_LOGIN_API_001 - login", output)
            self.assertIn("stage=covered", output)
            self.assertIn("Không cần tạo/sửa thêm — test case đã tồn tại trong repo", output)
            self.assertIsNone(TaskStore.active_task(repo))

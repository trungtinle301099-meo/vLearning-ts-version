import fs from 'node:fs';
import path from 'node:path';

const RESULTS_DIR = path.resolve('reports/playwright/allure-results');

const OUTPUT_FILE = path.resolve('slack-payload.json');

const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || 'LOCAL';

const RUN_ID = process.env.GITHUB_RUN_ID || '';

const BRANCH = process.env.GITHUB_REF_NAME || 'local';

const REPOSITORY = process.env.GITHUB_REPOSITORY || 'vLearning-ts-version';

const COMMIT = process.env.GITHUB_SHA || '';

const EVENT_NAME = process.env.GITHUB_EVENT_NAME || 'local';

const SERVER_URL = process.env.GITHUB_SERVER_URL || 'https://github.com';

const ALLURE_REPORT_URL = process.env.ALLURE_REPORT_URL || '';

/**
 * -------------------------------------------------------
 * Helpers
 * -------------------------------------------------------
 */

function getTriggerName(eventName) {
  switch (eventName) {
    case 'schedule':
      return 'Scheduled';

    case 'push':
      return 'Push';

    case 'pull_request':
      return 'Pull Request';

    case 'workflow_dispatch':
      return 'Manual';

    default:
      return eventName || 'Local';
  }
}

function getVietnamDateTime() {
  const now = new Date();

  const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return {
    date: dateFormatter.format(now),
    time: timeFormatter.format(now)
  };
}

function getDuration(results) {
  if (!results.length) {
    return '00m 00s';
  }

  const starts = results.map((result) => result.start).filter(Boolean);

  const stops = results.map((result) => result.stop).filter(Boolean);

  if (!starts.length || !stops.length) {
    return '00m 00s';
  }

  const start = Math.min(...starts);
  const stop = Math.max(...stops);

  const durationMs = Math.max(0, stop - start);

  const totalSeconds = Math.floor(durationMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(
      seconds
    ).padStart(2, '0')}s`;
  }

  return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function getProject(result) {
  /**
   * Playwright Allure stores project
   * information in parameters:
   *
   * [
   *   {
   *     name: "Project",
   *     value: "api"
   *   }
   * ]
   */

  const projectParameter = result.parameters?.find(
    (parameter) => parameter.name?.toLowerCase() === 'project'
  );

  if (projectParameter?.value) {
    return projectParameter.value.toLowerCase();
  }

  /**
   * Fallback:
   * Try to get project from labels.
   */

  const projectLabel = result.labels?.find((label) => label.name?.toLowerCase() === 'project');

  if (projectLabel?.value) {
    return projectLabel.value.toLowerCase();
  }

  /**
   * Final fallback:
   * Use test result historyId / fullName.
   */

  const fullName = result.fullName?.toLowerCase() || '';

  if (fullName.includes('api') || fullName.includes('/api/')) {
    return 'api';
  }

  if (fullName.includes('ui') || fullName.includes('/ui/')) {
    return 'ui';
  }

  return 'uncategorized';
}

function normalizeProject(project) {
  if (project === 'api') {
    return 'api';
  }

  if (project === 'ui') {
    return 'ui';
  }

  return 'uncategorized';
}

function getStatus(result) {
  const status = result.status?.toLowerCase();

  if (status === 'passed') {
    return 'passed';
  }

  if (status === 'failed' || status === 'broken') {
    return 'failed';
  }

  if (status === 'skipped' || status === 'unknown') {
    return 'skipped';
  }

  return 'skipped';
}

function createStats() {
  return {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  };
}

function addResultToStats(stats, result) {
  stats.total += 1;

  const status = getStatus(result);

  stats[status] += 1;
}

function getPassRate(stats) {
  if (!stats.total) {
    return '0.0%';
  }

  return `${((stats.passed / stats.total) * 100).toFixed(1)}%`;
}

function getDisplayProject(project) {
  if (project === 'api') {
    return 'API';
  }

  if (project === 'ui') {
    return 'UI';
  }

  return 'Uncategorized';
}

function pad(value, length) {
  return String(value).padStart(length, ' ');
}

/**
 * -------------------------------------------------------
 * Allure result loading
 * -------------------------------------------------------
 */

function loadAllureResults() {
  if (!fs.existsSync(RESULTS_DIR)) {
    throw new Error(`Allure results directory not found: ${RESULTS_DIR}`);
  }

  const files = fs.readdirSync(RESULTS_DIR).filter((file) => file.endsWith('-result.json'));

  if (!files.length) {
    throw new Error('No Allure result files found.');
  }

  const results = [];

  for (const file of files) {
    const filePath = path.join(RESULTS_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      const result = JSON.parse(content);

      results.push(result);
    } catch (error) {
      console.warn(`Unable to read Allure result: ${file}`, error);
    }
  }

  return results;
}

/**
 * -------------------------------------------------------
 * Statistics
 * -------------------------------------------------------
 */

function buildReport(results) {
  const overall = createStats();

  const byProject = {
    api: {
      stats: createStats(),
      results: []
    },

    ui: {
      stats: createStats(),
      results: []
    },

    uncategorized: {
      stats: createStats(),
      results: []
    }
  };

  for (const result of results) {
    const project = normalizeProject(getProject(result));

    addResultToStats(overall, result);

    addResultToStats(byProject[project].stats, result);

    byProject[project].results.push(result);
  }

  return {
    overall,
    byProject
  };
}

/**
 * -------------------------------------------------------
 * Slack table
 * -------------------------------------------------------
 */

function buildSummaryTable(apiStats, uiStats, overall) {
  const header = 'Type     │ Total    │ Passed   │ Failed   │ Skipped   │ Pass Rate  ';

  const separator = '─────────┼──────────┼──────────┼──────────┼───────────┼────────────';

  const apiRow =
    `API      │ ${pad(apiStats.total, 8)} │ ` +
    `${pad(apiStats.passed, 8)} │ ` +
    `${pad(apiStats.failed, 8)} │ ` +
    `${pad(apiStats.skipped, 9)} │ ` +
    `${pad(getPassRate(apiStats), 10)}`;

  const uiRow =
    `UI       │ ${pad(uiStats.total, 8)} │ ` +
    `${pad(uiStats.passed, 8)} │ ` +
    `${pad(uiStats.failed, 8)} │ ` +
    `${pad(uiStats.skipped, 9)} │ ` +
    `${pad(getPassRate(uiStats), 10)}`;

  const totalRow =
    `TOTAL    │ ${pad(overall.total, 8)} │ ` +
    `${pad(overall.passed, 8)} │ ` +
    `${pad(overall.failed, 8)} │ ` +
    `${pad(overall.skipped, 9)} │ ` +
    `${pad(getPassRate(overall), 10)}`;

  return [header, separator, apiRow, uiRow, separator, totalRow].join('\n');
}

/**
 * -------------------------------------------------------
 * Slack payload
 * -------------------------------------------------------
 */

function buildSlackPayload(results, report) {
  const { overall, byProject } = report;

  const { date, time } = getVietnamDateTime();

  const trigger = getTriggerName(EVENT_NAME);

  const duration = getDuration(results);

  const statusEmoji = overall.failed > 0 ? '❌' : '✅';

  const statusText = overall.failed > 0 ? 'FAILED' : 'PASSED';

  const runUrl = RUN_ID
    ? `${SERVER_URL}/${REPOSITORY}/actions/runs/${RUN_ID}`
    : `${SERVER_URL}/${REPOSITORY}/actions`;

  /**
   * Always keep the Allure button.
   *
   * GitHub Actions overrides
   * ALLURE_REPORT_URL through env.
   */

  const allureReportUrl =
    ALLURE_REPORT_URL || 'https://trungtinle301099-meo.github.io/vLearning-ts-version/';

  const blocks = [];

  /**
   * ---------------------------------------------------
   * Header
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'header',

    text: {
      type: 'plain_text',

      text: '🧪 vLearning — Playwright Test Report',

      emoji: true
    }
  });

  /**
   * ---------------------------------------------------
   * Execution information
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text:
        `*${statusEmoji} ${statusText}*  •  ` +
        `*Run #${RUN_NUMBER}*\n` +
        `📅 ${date}    ` +
        `🕐 ${time} GMT+7\n` +
        `🌿 Branch: \`${BRANCH}\`    ` +
        `⚡ Trigger: \`${trigger}\`\n` +
        `📦 Repository: \`${REPOSITORY}\``
    }
  });

  blocks.push({
    type: 'divider'
  });

  /**
   * ---------------------------------------------------
   * Test summary
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text: '📊 *TEST SUMMARY*'
    }
  });

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text:
        `\`\`\`\n` +
        `${buildSummaryTable(byProject.api.stats, byProject.ui.stats, overall)}\n` +
        `\`\`\``
    }
  });

  /**
   * ---------------------------------------------------
   * Pass rate / duration
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text:
        `🎯 *Pass Rate:* ` +
        `${getPassRate(overall)}` +
        `    •    ` +
        `🧪 *Total:* ` +
        `${overall.total}` +
        `    •    ` +
        `⏱️ *Duration:* ` +
        `${duration}`
    }
  });

  /**
   * ---------------------------------------------------
   * Execution status
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text:
        `📈 *Execution Status*\n` +
        `✅ ${overall.passed} Passed    ` +
        `❌ ${overall.failed} Failed    ` +
        `⏭️ ${overall.skipped} Skipped`
    }
  });

  blocks.push({
    type: 'divider'
  });

  /**
   * ---------------------------------------------------
   * Exactly TWO buttons
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'actions',

    elements: [
      {
        type: 'button',

        text: {
          type: 'plain_text',

          text: '🔗 Open GitHub Actions',

          emoji: true
        },

        url: runUrl,

        action_id: 'open_github_actions'
      },

      {
        type: 'button',

        text: {
          type: 'plain_text',

          text: '📋 Open Allure Report',

          emoji: true
        },

        url: allureReportUrl,

        action_id: 'open_allure_report'
      }
    ]
  });

  /**
   * ---------------------------------------------------
   * Footer
   * ---------------------------------------------------
   */

  blocks.push({
    type: 'context',

    elements: [
      {
        type: 'mrkdwn',

        text:
          `🤖 vLearning Playwright Automation • ` +
          `Run #${RUN_NUMBER}` +
          (COMMIT ? ` • Commit \`${COMMIT.substring(0, 7)}\`` : '')
      }
    ]
  });

  return {
    text: `${statusEmoji} ` + `vLearning Playwright Test Report — ` + `Run #${RUN_NUMBER}`,

    blocks
  };
}

/**
 * -------------------------------------------------------
 * Failed tests HTML
 * -------------------------------------------------------
 */

function generateFailedTestsHtml(results) {
  const failedTests = results.filter((result) => getStatus(result) === 'failed');

  const htmlPath = path.resolve('reports/playwright/allure-report/failed-tests.html');

  const outputDir = path.dirname(htmlPath);

  fs.mkdirSync(outputDir, {
    recursive: true
  });

  const rows = failedTests
    .map((result, index) => {
      const project = getDisplayProject(normalizeProject(getProject(result)));

      const name = result.name || 'Unnamed test';

      const fullName = result.fullName || '';

      return `
<tr>
    <td>${index + 1}</td>
    <td>${escapeHtml(project)}</td>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(fullName)}</td>
    <td>❌ FAILED</td>
</tr>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        vLearning - Failed Tests
    </title>

    <style>
        body {
            font-family:
                Arial,
                Helvetica,
                sans-serif;

            margin: 0;
            padding: 40px;

            background: #f5f7fa;
            color: #1f2937;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        h1 {
            margin-bottom: 8px;
        }

        .summary {
            margin-bottom: 24px;
            color: #6b7280;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th,
        td {
            padding: 12px;
            border: 1px solid #e5e7eb;
            text-align: left;
        }

        th {
            background: #111827;
            color: white;
        }

        tr:nth-child(even) {
            background: #f9fafb;
        }
    </style>
</head>

<body>

<div class="container">

    <h1>
        ❌ vLearning - Failed Tests
    </h1>

    <div class="summary">
        Total failed tests:
        <strong>${failedTests.length}</strong>
    </div>

    <table>

        <thead>
            <tr>
                <th>#</th>
                <th>Project</th>
                <th>Test Name</th>
                <th>Full Name</th>
                <th>Status</th>
            </tr>
        </thead>

        <tbody>
            ${
              rows ||
              `
<tr>
    <td colspan="5">
        No failed tests.
    </td>
</tr>
`
            }
        </tbody>

    </table>

</div>

</body>
</html>
`;

  fs.writeFileSync(htmlPath, html, 'utf8');

  return htmlPath;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * -------------------------------------------------------
 * Main
 * -------------------------------------------------------
 */

function main() {
  console.log('========================================');

  console.log('Generate Slack Test Report');

  console.log('========================================');

  console.log(`Allure results: ${RESULTS_DIR}`);

  console.log(`Output file: ${OUTPUT_FILE}`);

  console.log(`Run: #${RUN_NUMBER}`);

  console.log(`Branch: ${BRANCH}`);

  console.log(`Trigger: ${getTriggerName(EVENT_NAME)}`);

  console.log('');

  /**
   * Load Allure results
   */

  const results = loadAllureResults();

  console.log(`Loaded ${results.length} Allure results.`);

  /**
   * Build statistics
   */

  const report = buildReport(results);

  console.log('');

  console.log('===== TEST SUMMARY =====');

  console.log(`Total   : ${report.overall.total}`);

  console.log(`Passed  : ${report.overall.passed}`);

  console.log(`Failed  : ${report.overall.failed}`);

  console.log(`Skipped : ${report.overall.skipped}`);

  console.log(`PassRate: ${getPassRate(report.overall)}`);

  console.log('');

  console.log(`API: ${report.byProject.api.stats.total}`);

  console.log(`UI : ${report.byProject.ui.stats.total}`);

  /**
   * Generate failed-tests.html
   *
   * This is kept for GitHub Pages.
   * It is NOT displayed inside Slack.
   */

  const failedTestsHtml = generateFailedTestsHtml(results);

  console.log('');

  console.log(`Failed tests page: ${failedTestsHtml}`);

  /**
   * Build Slack payload
   */

  const payload = buildSlackPayload(results, report);

  /**
   * Write payload
   */

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');

  console.log('');

  console.log(`Slack payload written to: ${OUTPUT_FILE}`);

  console.log(
    `Slack buttons: ${
      payload.blocks.filter((block) => block.type === 'actions')[0]?.elements.length || 0
    }`
  );

  console.log('');

  console.log('Slack payload generated successfully.');

  console.log('========================================');
}

main();

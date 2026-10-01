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

function getLabel(result, labelName, fallback = 'N/A') {
  const label = result.labels?.find((item) => item.name === labelName);

  return label?.value || fallback;
}

function getProject(result) {
  /**
   * 1. Playwright Allure stores project
   *    information in parameters.
   */
  const projectParameter = result.parameters?.find(
    (parameter) => parameter.name?.toLowerCase() === 'project'
  );

  if (projectParameter?.value) {
    return String(projectParameter.value).toLowerCase();
  }

  /**
   * 2. Fallback: parentSuite
   */
  const parentSuite = getLabel(result, 'parentSuite', '').toLowerCase();

  if (parentSuite === 'api' || parentSuite === 'ui') {
    return parentSuite;
  }

  /**
   * 3. Fallback: titlePath
   */
  if (Array.isArray(result.titlePath)) {
    const titlePath = result.titlePath.map((item) => String(item).toLowerCase());

    if (titlePath.includes('api')) {
      return 'api';
    }

    if (titlePath.includes('ui')) {
      return 'ui';
    }
  }

  /**
   * 4. Fallback: package name
   */
  const packageLabel = getLabel(result, 'package', '').toLowerCase();

  if (packageLabel.includes('.api.') || packageLabel.includes('/api/')) {
    return 'api';
  }

  if (packageLabel.includes('.ui.') || packageLabel.includes('/ui/')) {
    return 'ui';
  }

  return 'unknown';
}

function getFeature(result) {
  return getLabel(result, 'feature', 'Uncategorized');
}

function getEpic(result) {
  return getLabel(result, 'epic', 'Uncategorized');
}

function normalizeStatus(status) {
  switch (status) {
    case 'passed':
      return 'passed';

    case 'skipped':
      return 'skipped';

    case 'failed':
    case 'broken':
    case 'unknown':
      return 'failed';

    default:
      return 'failed';
  }
}

function createStats() {
  return {
    total: 0,
    passed: 0,
    failed: 0,
    flaky: 0,
    skipped: 0
  };
}

function addToStats(stats, status) {
  stats.total += 1;

  if (status === 'flaky') {
    stats.flaky += 1;
  } else if (status === 'passed') {
    stats.passed += 1;
  } else if (status === 'skipped') {
    stats.skipped += 1;
  } else {
    stats.failed += 1;
  }
}

function getPassRate(stats) {
  if (!stats.total) {
    return '0.0%';
  }

  /**
   * Flaky tests eventually passed,
   * therefore they count as passing
   * for Pass Rate.
   */
  return `${(((stats.passed + stats.flaky) / stats.total) * 100).toFixed(1)}%`;
}

function sanitizeTableValue(value) {
  return String(value ?? 'N/A')
    .replace(/\|/g, '/')
    .replace(/\r?\n/g, ' ');
}

function padRight(value, length) {
  const text = sanitizeTableValue(value);

  if (text.length >= length) {
    return text.substring(0, length);
  }

  return text + ' '.repeat(length - text.length);
}

function padLeft(value, length) {
  const text = sanitizeTableValue(value);

  if (text.length >= length) {
    return text.substring(0, length);
  }

  return ' '.repeat(length - text.length) + text;
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

  const files = fs
    .readdirSync(RESULTS_DIR)
    .filter((file) => file.endsWith('-result.json') && !file.endsWith('-container.json'));

  const rawResults = [];

  for (const file of files) {
    const filePath = path.join(RESULTS_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      const result = JSON.parse(content);

      rawResults.push(result);
    } catch {
      console.warn(`Unable to parse Allure result: ${file}`);
    }
  }

  /**
   * Count logical test cases,
   * not individual Allure result files.
   *
   * A Playwright retry can create multiple
   * Allure result files for the same test case.
   *
   * Retries = ONE logical test case.
   *
   * Parameterized tests remain separate.
   */
  const resultMap = new Map();

  const retryMap = new Map();

  for (const result of rawResults) {
    const project = getProject(result);

    const key = getLogicalTestKey(result, project);

    retryMap.set(key, (retryMap.get(key) || 0) + 1);

    const existing = resultMap.get(key);

    if (!existing) {
      resultMap.set(key, result);
      continue;
    }

    /**
     * Keep the latest result so the logical
     * test case has its final status.
     */
    const existingStop = existing.stop || existing.start || 0;

    const currentStop = result.stop || result.start || 0;

    if (currentStop >= existingStop) {
      resultMap.set(key, result);
    }
  }

  /**
   * A test is Flaky when:
   *
   * 1. It needed a retry
   * 2. The final result passed
   *
   * It still counts as exactly ONE
   * logical test case.
   */
  for (const [key, result] of resultMap) {
    const attempts = retryMap.get(key) || 1;

    result.isFlaky = attempts > 1 && result.status === 'passed';

    result.retryCount = Math.max(0, attempts - 1);
  }

  return Array.from(resultMap.values());
}

/**
 * Build a stable identity for one
 * logical Playwright test case.
 *
 * - project separates API and UI tests
 * - fullName identifies the test itself
 * - parameters keep parameterized tests separate
 * - retry-specific fields are ignored
 */
function getLogicalTestKey(result, project) {
  const fullName = result.fullName || result.name || 'Unnamed test';

  const parameters = Array.isArray(result.parameters)
    ? result.parameters
        .filter((parameter) => {
          const name = String(parameter?.name || '').toLowerCase();

          return !['project', 'retry', 'retryindex'].includes(name);
        })
        .map((parameter) => ({
          name: String(parameter?.name || ''),
          value: String(parameter?.value ?? '')
        }))
        .sort((a, b) => `${a.name}=${a.value}`.localeCompare(`${b.name}=${b.value}`))
    : [];

  return JSON.stringify({
    project,
    fullName,
    parameters
  });
}

/**
 * -------------------------------------------------------
 * Build statistics
 * -------------------------------------------------------
 */

function buildReport(results) {
  const overall = createStats();

  const byProject = {
    api: {
      stats: createStats(),
      features: new Map()
    },

    ui: {
      stats: createStats(),
      features: new Map()
    }
  };

  const failedTests = [];

  for (const result of results) {
    const project = getProject(result);

    if (project !== 'api' && project !== 'ui') {
      continue;
    }

    const status = result.isFlaky ? 'flaky' : normalizeStatus(result.status);

    const feature = getFeature(result);

    const epic = getEpic(result);

    addToStats(overall, status);

    addToStats(byProject[project].stats, status);

    if (!byProject[project].features.has(feature)) {
      byProject[project].features.set(feature, {
        stats: createStats(),
        epics: new Map()
      });
    }

    const featureData = byProject[project].features.get(feature);

    addToStats(featureData.stats, status);

    if (!featureData.epics.has(epic)) {
      featureData.epics.set(epic, {
        stats: createStats()
      });
    }

    const epicData = featureData.epics.get(epic);

    addToStats(epicData.stats, status);

    if (status === 'failed') {
      failedTests.push({
        project,
        feature,
        epic,
        name: result.name || result.fullName || 'Unnamed test'
      });
    }
  }

  return {
    overall,
    byProject,
    failedTests
  };
}

/**
 * -------------------------------------------------------
 * Summary table
 * -------------------------------------------------------
 */

function buildSummaryTable(apiStats, uiStats, overall) {
  const headers = ['Type', 'Total', 'Passed', 'Failed', 'Flaky', 'Skipped', 'Pass Rate'];

  const rows = [
    [
      'API',
      apiStats.total,
      apiStats.passed,
      apiStats.failed,
      apiStats.flaky,
      apiStats.skipped,
      getPassRate(apiStats)
    ],

    [
      'UI',
      uiStats.total,
      uiStats.passed,
      uiStats.failed,
      uiStats.flaky,
      uiStats.skipped,
      getPassRate(uiStats)
    ],

    [
      'TOTAL',
      overall.total,
      overall.passed,
      overall.failed,
      overall.flaky,
      overall.skipped,
      getPassRate(overall)
    ]
  ];

  const widths = [8, 8, 8, 8, 8, 9, 11];

  const header = headers.map((value, index) => padRight(value, widths[index])).join(' │ ');

  const separator = widths.map((width) => '─'.repeat(width)).join('─┼─');

  const body = rows
    .map((row) =>
      row
        .map((value, index) =>
          index === 0 ? padRight(value, widths[index]) : padLeft(value, widths[index])
        )
        .join(' │ ')
    )
    .join('\n');

  return `${header}\n${separator}\n${body}`;
}

/**
 * -------------------------------------------------------
 * Slack blocks
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
   * Keep the Allure button available
   * in local runs as well.
   */
  const allureReportUrl =
    ALLURE_REPORT_URL || 'https://trungtinle301099-meo.github.io/vLearning-ts-version/';

  const blocks = [];

  blocks.push({
    type: 'header',

    text: {
      type: 'plain_text',

      text: '🧪 vLearning — Playwright Test Report',

      emoji: true
    }
  });

  /**
   * Compact execution information
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
   * Test statistics
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

  blocks.push({
    type: 'section',

    text: {
      type: 'mrkdwn',

      text:
        `📈 *Execution Status*\n` +
        `✅ ${overall.passed} Passed    ` +
        `⚠️ ${overall.flaky} Flaky    ` +
        `❌ ${overall.failed} Failed    ` +
        `⏭️ ${overall.skipped} Skipped`
    }
  });

  blocks.push({
    type: 'divider'
  });

  /**
   * Exactly two report buttons
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
 * Generate Failed Tests HTML
 * -------------------------------------------------------
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateFailedTestsHtml(results, report) {
  const outputDir = path.resolve('reports/playwright/allure-report');

  const outputFile = path.join(outputDir, 'failed-tests.html');

  const failedTests = report.failedTests;

  fs.mkdirSync(outputDir, {
    recursive: true
  });

  const rows = failedTests.length
    ? failedTests
        .map(
          (test, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(test.project.toUpperCase())}</td>
              <td>${escapeHtml(test.feature)}</td>
              <td>${escapeHtml(test.epic)}</td>
              <td>${escapeHtml(test.name)}</td>
              <td>❌ FAILED</td>
            </tr>`
        )
        .join('')
    : `<tr><td colspan="6">
                🎉 No failed test cases
              </td></tr>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>
<title>vLearning — Failed Test Cases</title>
<style>
body{
    font-family:Arial,sans-serif;
    background:#f5f7fb;
    color:#172033;
    margin:0;
    padding:32px
}
main{
    max-width:1500px;
    margin:auto;
    background:#fff;
    padding:28px;
    border-radius:16px
}
table{
    width:100%;
    border-collapse:collapse;
    margin-top:24px
}
th,td{
    padding:12px;
    border-bottom:1px solid #e5e7eb;
    text-align:left
}
th{
    background:#f8fafc
}
.failed{
    color:#b42318;
    font-weight:700
}
</style>
</head>

<body>

<main>

<h1>
    vLearning — Failed Test Cases
</h1>

<p>
    Total logical tests:
    ${results.length}
    · Failed:
    ${failedTests.length}
    · Flaky:
    ${report.overall.flaky}
</p>

<table>

<thead>
<tr>
    <th>#</th>
    <th>Type</th>
    <th>Feature</th>
    <th>Epic</th>
    <th>Test Case</th>
    <th>Status</th>
</tr>
</thead>

<tbody>
${rows}
</tbody>

</table>

</main>

</body>
</html>`;

  fs.writeFileSync(outputFile, html, 'utf8');

  console.log(`Failed tests HTML created: ${outputFile}`);
}

/**
 * -------------------------------------------------------
 * Main
 * -------------------------------------------------------
 */

function main() {
  console.log('========================================');

  console.log('vLearning Slack Report Generator');

  console.log('========================================');

  console.log(`Allure results: ${RESULTS_DIR}`);

  const results = loadAllureResults();

  console.log(`Logical test cases counted: ${results.length}`);

  if (!results.length) {
    throw new Error('No Allure result files found.');
  }

  const report = buildReport(results);

  console.log(`Total tests: ${report.overall.total}`);

  console.log(`Passed: ${report.overall.passed}`);

  console.log(`Failed: ${report.overall.failed}`);

  console.log(`Flaky: ${report.overall.flaky}`);

  console.log(`Skipped: ${report.overall.skipped}`);

  console.log(`Failed test cases: ${report.failedTests.length}`);

  /**
   * Generate:
   *
   * reports/playwright/allure-report/
   * └── failed-tests.html
   */
  generateFailedTestsHtml(results, report);

  /**
   * Generate Slack payload
   */
  const payload = buildSlackPayload(results, report);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`Slack payload created: ${OUTPUT_FILE}`);

  console.log('========================================');
}

try {
  main();
} catch (error) {
  console.error('Failed to generate Slack report:');

  console.error(error);

  process.exit(1);
}

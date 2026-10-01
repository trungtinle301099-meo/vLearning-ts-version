import fs from 'node:fs';
import path from 'node:path';

const RESULTS_DIR = path.resolve(
    'reports/playwright/allure-results',
);

const OUTPUT_FILE = path.resolve('slack-payload.json');

const RUN_NUMBER =
    process.env.GITHUB_RUN_NUMBER || 'LOCAL';

const RUN_ID =
    process.env.GITHUB_RUN_ID || '';

const BRANCH =
    process.env.GITHUB_REF_NAME || 'local';

const REPOSITORY =
    process.env.GITHUB_REPOSITORY || 'vLearning-ts-version';

const COMMIT =
    process.env.GITHUB_SHA || '';

const EVENT_NAME =
    process.env.GITHUB_EVENT_NAME || 'local';

const SERVER_URL =
    process.env.GITHUB_SERVER_URL ||
    'https://github.com';

const ALLURE_REPORT_URL =
    process.env.ALLURE_REPORT_URL || '';

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

    const dateFormatter = new Intl.DateTimeFormat(
        'vi-VN',
        {
            timeZone: 'Asia/Ho_Chi_Minh',
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        },
    );

    const timeFormatter = new Intl.DateTimeFormat(
        'vi-VN',
        {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        },
    );

    return {
        date: dateFormatter.format(now),
        time: timeFormatter.format(now),
    };
}

function getDuration(results) {
    if (!results.length) {
        return '00m 00s';
    }

    const starts = results
        .map((result) => result.start)
        .filter(Boolean);

    const stops = results
        .map((result) => result.stop)
        .filter(Boolean);

    if (!starts.length || !stops.length) {
        return '00m 00s';
    }

    const start = Math.min(...starts);
    const stop = Math.max(...stops);

    const durationMs = Math.max(0, stop - start);

    const totalSeconds = Math.floor(
        durationMs / 1000,
    );

    const hours = Math.floor(
        totalSeconds / 3600,
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60,
    );

    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}h ${String(
            minutes,
        ).padStart(2, '0')}m ${String(seconds).padStart(
            2,
            '0',
        )}s`;
    }

    return `${String(minutes).padStart(
        2,
        '0',
    )}m ${String(seconds).padStart(2, '0')}s`;
}

function getLabel(
    result,
    labelName,
    fallback = 'N/A',
) {
    const label = result.labels?.find(
        (item) => item.name === labelName,
    );

    return label?.value || fallback;
}

function getProject(result) {
    /**
     * 1. Playwright Allure stores project
     *    information in parameters:
     *
     *    [
     *      {
     *        name: "Project",
     *        value: "api"
     *      }
     *    ]
     */
    const projectParameter =
        result.parameters?.find(
            (parameter) =>
                parameter.name?.toLowerCase() ===
                'project',
        );

    if (projectParameter?.value) {
        return String(
            projectParameter.value,
        ).toLowerCase();
    }

    /**
     * 2. Fallback: parentSuite
     */
    const parentSuite = getLabel(
        result,
        'parentSuite',
        '',
    ).toLowerCase();

    if (
        parentSuite === 'api' ||
        parentSuite === 'ui'
    ) {
        return parentSuite;
    }

    /**
     * 3. Fallback: titlePath
     */
    if (Array.isArray(result.titlePath)) {
        const titlePath =
            result.titlePath.map(
                (item) =>
                    String(item).toLowerCase(),
            );

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
    const packageLabel = getLabel(
        result,
        'package',
        '',
    ).toLowerCase();

    if (
        packageLabel.includes('.api.') ||
        packageLabel.includes('/api/')
    ) {
        return 'api';
    }

    if (
        packageLabel.includes('.ui.') ||
        packageLabel.includes('/ui/')
    ) {
        return 'ui';
    }

    return 'unknown';
}

function getFeature(result) {
    return getLabel(
        result,
        'feature',
        'Uncategorized',
    );
}

function getEpic(result) {
    return getLabel(
        result,
        'epic',
        'Uncategorized',
    );
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
        skipped: 0,
    };
}

function addToStats(
    stats,
    status,
) {
    stats.total += 1;

    if (status === 'passed') {
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

    return `${(
        (stats.passed / stats.total) *
        100
    ).toFixed(1)}%`;
}

function sanitizeTableValue(value) {
    return String(value ?? 'N/A')
        .replace(/\|/g, '/')
        .replace(/\r?\n/g, ' ');
}

function padRight(
    value,
    length,
) {
    const text =
        sanitizeTableValue(value);

    if (text.length >= length) {
        return text.substring(
            0,
            length,
        );
    }

    return (
        text +
        ' '.repeat(
            length - text.length,
        )
    );
}

function padLeft(
    value,
    length,
) {
    const text =
        sanitizeTableValue(value);

    if (text.length >= length) {
        return text.substring(
            0,
            length,
        );
    }

    return (
        ' '.repeat(
            length - text.length,
        ) + text
    );
}

/**
 * -------------------------------------------------------
 * Allure result loading
 * -------------------------------------------------------
 */

function loadAllureResults() {
    if (!fs.existsSync(RESULTS_DIR)) {
        throw new Error(
            `Allure results directory not found: ${RESULTS_DIR}`,
        );
    }

    const files = fs
        .readdirSync(RESULTS_DIR)
        .filter(
            (file) =>
                file.endsWith(
                    '-result.json',
                ) &&
                !file.endsWith(
                    '-container.json',
                ),
        );

    const rawResults = [];

    for (const file of files) {
        const filePath =
            path.join(
                RESULTS_DIR,
                file,
            );

        try {
            const content =
                fs.readFileSync(
                    filePath,
                    'utf8',
                );

            const result =
                JSON.parse(content);

            rawResults.push(result);
        } catch {
            console.warn(
                `Unable to parse Allure result: ${file}`,
            );
        }
    }

    /**
     * Playwright retries can generate
     * more than one result for the
     * same logical test.
     *
     * historyId is used to keep
     * the latest result.
     */
    const resultMap =
        new Map();

    for (const result of rawResults) {
        const key =
            result.historyId ||
            result.fullName ||
            result.uuid;

        const existing =
            resultMap.get(key);

        if (!existing) {
            resultMap.set(
                key,
                result,
            );

            continue;
        }

        const existingStop =
            existing.stop || 0;

        const currentStop =
            result.stop || 0;

        if (
            currentStop >=
            existingStop
        ) {
            resultMap.set(
                key,
                result,
            );
        }
    }

    return Array.from(
        resultMap.values(),
    );
}

/**
 * -------------------------------------------------------
 * Build statistics
 * -------------------------------------------------------
 */

function buildReport(results) {
    const overall =
        createStats();

    const byProject = {
        api: {
            stats: createStats(),
            features: new Map(),
        },

        ui: {
            stats: createStats(),
            features: new Map(),
        },
    };

    const failedTests = [];

    for (const result of results) {
        const project =
            getProject(result);

        if (
            project !== 'api' &&
            project !== 'ui'
        ) {
            continue;
        }

        const status =
            normalizeStatus(
                result.status,
            );

        const feature =
            getFeature(result);

        const epic =
            getEpic(result);

        /**
         * Overall
         */
        addToStats(
            overall,
            status,
        );

        /**
         * API / UI
         */
        addToStats(
            byProject[project].stats,
            status,
        );

        /**
         * Feature
         */
        if (
            !byProject[
                project
            ].features.has(feature)
        ) {
            byProject[
                project
            ].features.set(
                feature,
                {
                    stats:
                        createStats(),
                    epics:
                        new Map(),
                },
            );
        }

        const featureData =
            byProject[
                project
            ].features.get(
                feature,
            );

        addToStats(
            featureData.stats,
            status,
        );

        /**
         * Epic
         */
        if (
            !featureData.epics.has(
                epic,
            )
        ) {
            featureData.epics.set(
                epic,
                {
                    stats:
                        createStats(),
                },
            );
        }

        const epicData =
            featureData.epics.get(
                epic,
            );

        addToStats(
            epicData.stats,
            status,
        );

        /**
         * Failed test
         */
        if (
            status === 'failed'
        ) {
            failedTests.push({
                project,
                feature,
                epic,
                name:
                    result.name ||
                    result.fullName ||
                    'Unnamed test',
            });
        }
    }

    return {
        overall,
        byProject,
        failedTests,
    };
}

/**
 * -------------------------------------------------------
 * Summary table
 * -------------------------------------------------------
 */

function buildSummaryTable(
    apiStats,
    uiStats,
    overall,
) {
    const headers = [
        'Type',
        'Total',
        'Passed',
        'Failed',
        'Skipped',
        'Pass Rate',
    ];

    const rows = [
        [
            'API',
            apiStats.total,
            apiStats.passed,
            apiStats.failed,
            apiStats.skipped,
            getPassRate(apiStats),
        ],

        [
            'UI',
            uiStats.total,
            uiStats.passed,
            uiStats.failed,
            uiStats.skipped,
            getPassRate(uiStats),
        ],

        [
            'TOTAL',
            overall.total,
            overall.passed,
            overall.failed,
            overall.skipped,
            getPassRate(overall),
        ],
    ];

    const widths = [
        8,
        8,
        8,
        8,
        9,
        11,
    ];

    const header =
        headers
            .map(
                (value, index) =>
                    padRight(
                        value,
                        widths[index],
                    ),
            )
            .join(' │ ');

    const separator =
        widths
            .map((width) =>
                '─'.repeat(width),
            )
            .join('─┼─');

    const body =
        rows
            .map((row) =>
                row
                    .map(
                        (
                            value,
                            index,
                        ) =>
                            index === 0
                                ? padRight(
                                    value,
                                    widths[index],
                                )
                                : padLeft(
                                    value,
                                    widths[index],
                                ),
                    )
                    .join(' │ '),
            )
            .join('\n');

    return `${header}\n${separator}\n${body}`;
}

/**
 * -------------------------------------------------------
 * Feature / Epic table
 * -------------------------------------------------------
 */

function buildBreakdownTable(
    projectData,
) {
    const headers = [
        'Feature',
        'Epic',
        'Total',
        'Passed',
        'Failed',
        'Skipped',
        'Pass Rate',
    ];

    const rows = [];

    for (
        const [
            feature,
            featureData,
        ] of projectData.features
    ) {
        for (
            const [
                epic,
                epicData,
            ] of featureData.epics
        ) {
            rows.push([
                feature,
                epic,
                epicData.stats.total,
                epicData.stats.passed,
                epicData.stats.failed,
                epicData.stats.skipped,
                getPassRate(
                    epicData.stats,
                ),
            ]);
        }
    }

    if (!rows.length) {
        return 'No feature / epic data';
    }

    const widths = [
        32,
        28,
        7,
        8,
        8,
        9,
        11,
    ];

    const header =
        headers
            .map(
                (value, index) =>
                    padRight(
                        value,
                        widths[index],
                    ),
            )
            .join(' │ ');

    const separator =
        widths
            .map((width) =>
                '─'.repeat(width),
            )
            .join('─┼─');

    const body =
        rows
            .map((row) =>
                row
                    .map(
                        (
                            value,
                            index,
                        ) =>
                            index >= 2
                                ? padLeft(
                                    value,
                                    widths[index],
                                )
                                : padRight(
                                    value,
                                    widths[index],
                                ),
                    )
                    .join(' │ '),
            )
            .join('\n');

    return `${header}\n${separator}\n${body}`;
}

/**
 * -------------------------------------------------------
 * Failed tests table
 * -------------------------------------------------------
 */

function buildFailedTestsTable(
    failedTests,
) {
    if (!failedTests.length) {
        return 'No failed test cases 🎉';
    }

    const headers = [
        '#',
        'Type',
        'Feature',
        'Epic',
        'Test Case',
        'Status',
    ];

    const rows =
        failedTests.map(
            (
                test,
                index,
            ) => [
                    index + 1,
                    test.project.toUpperCase(),
                    test.feature,
                    test.epic,
                    test.name,
                    '❌ FAILED',
                ],
        );

    const widths = [
        4,
        8,
        28,
        24,
        48,
        12,
    ];

    const header =
        headers
            .map(
                (value, index) =>
                    padRight(
                        value,
                        widths[index],
                    ),
            )
            .join(' │ ');

    const separator =
        widths
            .map((width) =>
                '─'.repeat(width),
            )
            .join('─┼─');

    const body =
        rows
            .map((row) =>
                row
                    .map(
                        (
                            value,
                            index,
                        ) =>
                            index === 0
                                ? padLeft(
                                    value,
                                    widths[index],
                                )
                                : padRight(
                                    value,
                                    widths[index],
                                ),
                    )
                    .join(' │ '),
            )
            .join('\n');

    return `${header}\n${separator}\n${body}`;
}

/**
 * -------------------------------------------------------
 * Slack blocks
 * -------------------------------------------------------
 */

function buildSlackPayload(
    results,
    report,
) {
    const {
        overall,
        byProject,
        failedTests,
    } = report;

    const {
        date,
        time,
    } =
        getVietnamDateTime();

    const trigger =
        getTriggerName(
            EVENT_NAME,
        );

    const duration =
        getDuration(results);

    const statusEmoji =
        overall.failed > 0
            ? '❌'
            : '✅';

    const statusText =
        overall.failed > 0
            ? 'FAILED'
            : 'PASSED';

    const runUrl =
        RUN_ID
            ? `${SERVER_URL}/${REPOSITORY}/actions/runs/${RUN_ID}`
            : `${SERVER_URL}/${REPOSITORY}/actions`;

    const blocks = [];

    /**
     * Header
     */
    blocks.push({
        type: 'header',

        text: {
            type: 'plain_text',

            text:
                '🚀 vLearning — Automated Test Report',

            emoji: true,
        },
    });

    /**
     * Run information
     */
    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                `*Run #${RUN_NUMBER}*  •  *${statusText}*\n` +
                `📅 ${date}\n` +
                `🕐 ${time} GMT+7\n` +
                `🌿 Branch: \`${BRANCH}\`\n` +
                `⚙️ Trigger: \`${trigger}\`\n` +
                `📦 Repository: \`${REPOSITORY}\``,
        },
    });

    blocks.push({
        type: 'divider',
    });

    /**
     * Overall summary
     */
    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                '📊 *OVERALL SUMMARY*',
        },
    });

    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                `\`\`\`\n${buildSummaryTable(
                    byProject.api.stats,
                    byProject.ui.stats,
                    overall,
                )}\n\`\`\``,
        },
    });

    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                `📈 *Pass Rate:* ${getPassRate(
                    overall,
                )}    •    ` +
                `🧪 *Tests:* ${overall.total}    •    ` +
                `⏱️ *Duration:* ${duration}`,
        },
    });

    /**
     * API
     */
    if (
        byProject.api.stats.total >
        0
    ) {
        blocks.push({
            type: 'divider',
        });

        blocks.push({
            type: 'section',

            text: {
                type: 'mrkdwn',

                text:
                    `🔌 *API — FEATURE / EPIC BREAKDOWN*\n` +
                    `${byProject.api.stats.total} tests • ` +
                    `✅ ${byProject.api.stats.passed} passed • ` +
                    `❌ ${byProject.api.stats.failed} failed • ` +
                    `⏭️ ${byProject.api.stats.skipped} skipped`,
            },
        });

        blocks.push({
            type: 'section',

            text: {
                type: 'mrkdwn',

                text:
                    `\`\`\`\n${buildBreakdownTable(
                        byProject.api,
                    )}\n\`\`\``,
            },
        });
    }

    /**
     * UI
     */
    if (
        byProject.ui.stats.total >
        0
    ) {
        blocks.push({
            type: 'divider',
        });

        blocks.push({
            type: 'section',

            text: {
                type: 'mrkdwn',

                text:
                    `🖥️ *UI — FEATURE / EPIC BREAKDOWN*\n` +
                    `${byProject.ui.stats.total} tests • ` +
                    `✅ ${byProject.ui.stats.passed} passed • ` +
                    `❌ ${byProject.ui.stats.failed} failed • ` +
                    `⏭️ ${byProject.ui.stats.skipped} skipped`,
            },
        });

        blocks.push({
            type: 'section',

            text: {
                type: 'mrkdwn',

                text:
                    `\`\`\`\n${buildBreakdownTable(
                        byProject.ui,
                    )}\n\`\`\``,
            },
        });
    }

    /**
     * Failed tests
     */
    blocks.push({
        type: 'divider',
    });

    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                failedTests.length >
                    0
                    ? `🚨 *FAILED TEST CASES — ${failedTests.length}*`
                    : '🎉 *FAILED TEST CASES — 0*',
        },
    });

    blocks.push({
        type: 'section',

        text: {
            type: 'mrkdwn',

            text:
                `\`\`\`\n${buildFailedTestsTable(
                    failedTests,
                )}\n\`\`\``,
        },
    });

    /**
     * Report links
     */
    blocks.push({
        type: 'divider',
    });

    const reportActions = [
        {
            type: 'button',

            text: {
                type: 'plain_text',

                text:
                    '📊 Open GitHub Actions',

                emoji: true,
            },

            url: runUrl,

            action_id:
                'open_github_actions',
        },
    ];

    /**
     * Add Allure button only when
     * ALLURE_REPORT_URL exists.
     */
    if (ALLURE_REPORT_URL) {
        reportActions.push({
            type: 'button',

            text: {
                type: 'plain_text',

                text:
                    '📋 Open Allure Report',

                emoji: true,
            },

            url:
                ALLURE_REPORT_URL,

            action_id:
                'open_allure_report',
        });
    }

    blocks.push({
        type: 'actions',

        elements:
            reportActions,
    });

    /**
     * Footer
     */
    blocks.push({
        type: 'context',

        elements: [
            {
                type: 'mrkdwn',

                text:
                    `vLearning Playwright Automation • ` +
                    `Run #${RUN_NUMBER}` +
                    (
                        COMMIT
                            ? ` • Commit \`${COMMIT.substring(
                                0,
                                7,
                            )}\``
                            : ''
                    ),
            },
        ],
    });

    return {
        text:
            `${statusEmoji} vLearning Automated Test Report — ` +
            `Run #${RUN_NUMBER}`,

        blocks,
    };
}

/**
 * -------------------------------------------------------
 * Main
 * -------------------------------------------------------
 */

function main() {
    console.log(
        '========================================',
    );

    console.log(
        'vLearning Slack Report Generator',
    );

    console.log(
        '========================================',
    );

    console.log(
        `Allure results: ${RESULTS_DIR}`,
    );

    const results =
        loadAllureResults();

    console.log(
        `Allure result files loaded: ${results.length}`,
    );

    if (!results.length) {
        throw new Error(
            'No Allure result files found.',
        );
    }

    const report =
        buildReport(results);

    console.log(
        `Total tests: ${report.overall.total}`,
    );

    console.log(
        `Passed: ${report.overall.passed}`,
    );

    console.log(
        `Failed: ${report.overall.failed}`,
    );

    console.log(
        `Skipped: ${report.overall.skipped}`,
    );

    console.log(
        `Failed test cases: ${report.failedTests.length}`,
    );

    const payload =
        buildSlackPayload(
            results,
            report,
        );

    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(
            payload,
            null,
            2,
        ),
        'utf8',
    );

    console.log(
        `Slack payload created: ${OUTPUT_FILE}`,
    );

    console.log(
        '========================================',
    );
}

try {
    main();
} catch (error) {
    console.error(
        'Failed to generate Slack report:',
    );

    console.error(error);

    process.exit(1);
}
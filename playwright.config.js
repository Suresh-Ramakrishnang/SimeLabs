import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://automationexercise.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://reqres.in';

function detectReportScope() {
  if (process.env.REPORT_SCOPE) {
    return process.env.REPORT_SCOPE;
  }

  const args = process.argv.join(' ').toLowerCase();
  const isApiRun = args.includes('tests/api') || args.includes('api/') || args.includes('--project=api');
  const isUiRun =
    args.includes('tests/web') ||
    args.includes('web/') ||
    args.includes('--project=chromium') ||
    args.includes('--project=firefox') ||
    args.includes('--project=webkit');

  if (isApiRun && !isUiRun) {
    return 'api';
  }

  if (isUiRun && !isApiRun) {
    return 'ui';
  }

  return 'all';
}

const REPORT_SCOPE = detectReportScope();

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  timeout: 60_000,
  expect: {
    timeout: 30_000,
  },
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 0 : 1,
  // forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { outputFolder: `reports/${REPORT_SCOPE}/html`, open: 'never' }],
    ['allure-playwright', { resultsDir: `reports/${REPORT_SCOPE}/allure-results`, detail: true }],
    ['json', { outputFile: `reports/${REPORT_SCOPE}/results.json` }],
  ],
  use: {
    baseURL: BASE_URL,
    headless: process.env.HEADLESS !== 'true',
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
    launchOptions: {
      slowMo: 500
    }
  },
  outputDir: `test-results/${REPORT_SCOPE}`,
  snapshotDir: 'screenshots',
  projects: [
    {
      name: 'chromium',
      testMatch: ['tests/web/**/*.spec.js'],
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'api',
      testMatch: ['tests/api/**/*.spec.js'],
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
    },
  ],
});

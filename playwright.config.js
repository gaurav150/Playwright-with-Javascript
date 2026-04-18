// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */

// `viewport: null` cannot be combined with `deviceScaleFactor` from device presets (Playwright throws).
const { deviceScaleFactor: _omit, ...desktopChrome } = devices['Desktop Chrome'];

/** @type {import('@playwright/test').Project} */
const chromiumDesktop = {
  name: 'chromium',
  use: {
    ...desktopChrome,
    trace: 'retain-on-failure',
    headless: true,
    viewport: null,
    /** @type {'on'} */
    screenshot: 'on',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },
};

/** Set ALL_BROWSERS=1 (or true) to also run firefox and webkit. Default is chromium only. */
const runAllBrowsers =
  process.env.ALL_BROWSERS === '1' || process.env.ALL_BROWSERS === 'true';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 40 * 1000,
  expect: {
    timeout: 5000,
  },
  
  /* Default: chromium only. ALL_BROWSERS=1 adds firefox + webkit. */
  projects: runAllBrowsers
    ? [
        chromiumDesktop,
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ]
    : [chromiumDesktop],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


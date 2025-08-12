import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const isHeadless = process.env.HEADLESS === 'true';

export default defineConfig({
  testDir: './tests',
  timeout: 90 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    headless: isHeadless,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'on',            // ✅ Always record video
    trace: 'on',            // ✅ Always collect trace
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});

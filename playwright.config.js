import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      timeout: 45000,
      actionTimeout: 20000,
      navigationTimeout: 45000,
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      timeout: 45000,
      actionTimeout: 20000,
      navigationTimeout: 45000,
    },
  ],
});

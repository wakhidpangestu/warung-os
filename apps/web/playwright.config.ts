import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : undefined,
    ...devices["Pixel 5"]
  },
  webServer: process.env.PLAYWRIGHT_REUSE_SERVER ? undefined : { command: "pnpm dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI }
});

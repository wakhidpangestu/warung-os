import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const localEnvPath = path.join(__dirname, ".env.local");
if (existsSync(localEnvPath)) {
  for (const line of readFileSync(localEnvPath, "utf8").split(/\r?\n/u)) {
    const match = /^([A-Z0-9_]+)=(.*)$/u.exec(line);
    if (match) process.env[match[1]] ??= match[2];
  }
}

const systemChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const executablePath =
  process.env.PLAYWRIGHT_EXECUTABLE_PATH ??
  (process.platform === "win32" && existsSync(systemChrome) ? systemChrome : undefined);

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    launchOptions: executablePath ? { executablePath } : undefined,
    ...devices["Pixel 5"],
  },
  webServer: process.env.PLAYWRIGHT_REUSE_SERVER
    ? undefined
    : { command: "pnpm dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI },
});

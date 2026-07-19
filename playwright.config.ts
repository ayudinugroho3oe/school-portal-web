import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config({ path: ".env.local", override: false, quiet: true });
config({ path: ".env.test", override: true, quiet: true });

export default defineConfig({
  testDir: "./tests/e2e", workers: 1, use: { baseURL: "http://localhost:3100", trace: "on-first-retry" },
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1"
    ? undefined
    : { command: "node node_modules/next/dist/bin/next start -p 3100", url: "http://localhost:3100", reuseExistingServer: true, timeout: 120_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

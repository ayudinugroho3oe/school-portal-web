import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({ test: { environment: "node", include: ["tests/**/*.test.ts"], setupFiles: ["tests/setup.ts"], fileParallelism: false, sequence: { concurrent: false } }, resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } } });

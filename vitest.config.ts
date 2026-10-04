import { defineConfig } from "vitest/config";

// Separate from vite.config.ts so the demo/library plugins (sample list generation etc.) do not run in tests.
export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});

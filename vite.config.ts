import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import sweaterVest from "./suede.sweater-vest/vite-plugin/plugin.ts";
import namespaceTests from "./suede.nests/vite-plugin/plugin.mts";

const libraries = ["suede.*/**"];

export default defineConfig({
  server: { host: "0.0.0.0" },
  plugins: [sveltekit(), sweaterVest({ exclude: libraries })],
  test: {
    expect: { requireAssertions: true },
    projects: [
      sweaterVest.project(),
      {
        extends: true,
        plugins: [namespaceTests({ exclude: libraries })],
        test: { name: "unit", environment: "node", include: ["src/**/*.test.ts"] },
      },
    ],
  },
});

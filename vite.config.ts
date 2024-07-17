import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: ["cobertura", "html"],
      provider: "v8",
      reportsDirectory: "./coverage",
      exclude: [
        ...configDefaults.exclude,
        "**/packages/common/src/constants/**",
        "**/packages/*/build/**", // ignore every build/ of every sub directory of packages
      ],
    },
    exclude: [...configDefaults.exclude],
  },
});

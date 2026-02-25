// [Task 2.5.6] ESLint config for @repo/infra — extends shared package rules
import config from "@repo/eslint-config/package.js";

export default [
  ...config,
  {
    files: ["**/*.ts"],
    rules: {
      // Infrastructure code may need console for structured logging internals
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      // Enforce type safety; use unknown over any for intentional type bypass
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

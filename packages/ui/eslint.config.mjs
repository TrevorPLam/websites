// [Task 2.2.1] ESLint config for @repo/ui — extends shared package rules
import config from "@repo/eslint-config/package.js";

export default [
  ...config,
  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      // Enforce type safety (no any in UI components)
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

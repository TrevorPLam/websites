// [Task 2.2.1] ESLint config for @repo/features — extends shared package rules
import config from "@repo/eslint-config/package.js";
import { integrationBoundaryRules } from "@repo/eslint-config/boundaries.js";

export default [
  ...config,
  // evol-1: Warn when integration-specific types leak into feature modules.
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...integrationBoundaryRules,
    },
  },
];

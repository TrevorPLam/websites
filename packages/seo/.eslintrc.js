/**
 * @file packages/seo/.eslintrc.js
 * @summary SEO configuration: .eslintrc.
 * @description Search engine optimization and metadata configuration.
 * @security none
 * @adr none
 * @requirements SEO-2026
 */

module.exports = {
  extends: ['@repo/eslint-config/base.js'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    // SEO-specific rules here
  },
};

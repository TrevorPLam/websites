#!/usr/bin/env node
/**
 * @file scripts/ai/automate-technical-debt-reduction.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Converts code metric hotspots into prioritized technical debt actions.
 * @security low
 * @adr none
 * @requirements DOMAIN-37-5-13
 */

import fs from 'node:fs';

const metricsPath = 'docs/quality/metrics/code-metrics-report.json';
const now = new Date().toISOString();

const fallback = {
  files: [
    { path: 'packages/ui/src/button.tsx', complexity: 18, churn: 5 },
    { path: 'packages/features/src/lead-form.tsx', complexity: 22, churn: 8 },
  ],
};

const metrics = fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath, 'utf8')) : fallback;
const backlog = (metrics.files ?? [])
  .map((file) => ({
    target: file.path,
    debtScore: file.complexity * 2 + file.churn,
    recommendation:
      file.complexity >= 20 ? 'split-module-and-add-tests' : 'schedule-refactor-and-measure-again',
  }))
  .sort((a, b) => b.debtScore - a.debtScore);

fs.writeFileSync(
  'docs/quality/metrics/technical-debt-backlog.json',
  `${JSON.stringify({ generatedAt: now, backlog }, null, 2)}\n`,
);

console.log(`✅ Generated technical debt backlog with ${backlog.length} prioritized entries`);

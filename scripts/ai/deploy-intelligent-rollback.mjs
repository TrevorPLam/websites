#!/usr/bin/env node
/**
 * @file scripts/ai/deploy-intelligent-rollback.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Detects release regressions and emits rollback actions with rationale.
 * @security medium
 * @adr none
 * @requirements DOMAIN-37-5-11
 */

import fs from 'node:fs';

const inputPath = 'docs/quality/metrics/release-health.json';
const now = new Date().toISOString();

const baseline = {
  timestamp: now,
  releases: [
    { id: 'web@2026.02.24.1', errorRate: 0.8, p95LatencyMs: 420, budgetErrorRate: 1, budgetP95LatencyMs: 450 },
  ],
};

const data = fs.existsSync(inputPath) ? JSON.parse(fs.readFileSync(inputPath, 'utf8')) : baseline;

const decisions = (data.releases ?? []).map((release) => {
  const shouldRollback =
    release.errorRate > release.budgetErrorRate || release.p95LatencyMs > release.budgetP95LatencyMs;

  return {
    releaseId: release.id,
    decision: shouldRollback ? 'rollback' : 'hold',
    reasons: [
      release.errorRate > release.budgetErrorRate ? 'error-rate-budget-breach' : null,
      release.p95LatencyMs > release.budgetP95LatencyMs ? 'latency-budget-breach' : null,
    ].filter(Boolean),
  };
});

const report = { evaluatedAt: now, decisions };
fs.writeFileSync('docs/quality/metrics/intelligent-rollback-report.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(`✅ Evaluated ${decisions.length} releases for intelligent rollback decisions`);

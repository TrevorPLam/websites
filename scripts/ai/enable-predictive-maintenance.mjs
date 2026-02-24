#!/usr/bin/env node
/**
 * @file scripts/ai/enable-predictive-maintenance.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Projects service risk from trend data and writes actionable maintenance alerts.
 * @security medium
 * @adr none
 * @requirements DOMAIN-37-5-12
 */

import fs from 'node:fs';

const now = new Date().toISOString();
const trendPath = 'docs/quality/metrics/service-health-trends.json';

const defaultTrend = {
  series: [
    { service: 'web-runtime', cpuPct: 58, errorRate: 0.4, saturationPct: 61 },
    { service: 'background-jobs', cpuPct: 73, errorRate: 0.9, saturationPct: 79 },
  ],
};

const trend = fs.existsSync(trendPath) ? JSON.parse(fs.readFileSync(trendPath, 'utf8')) : defaultTrend;
const alerts = (trend.series ?? []).map((sample) => {
  const riskScore = Math.round(sample.cpuPct * 0.4 + sample.saturationPct * 0.4 + sample.errorRate * 20);
  return {
    service: sample.service,
    riskScore,
    severity: riskScore >= 75 ? 'high' : riskScore >= 55 ? 'medium' : 'low',
    action: riskScore >= 75 ? 'schedule-maintenance-window' : 'monitor',
  };
});

fs.writeFileSync(
  'docs/quality/metrics/predictive-maintenance-alerts.json',
  `${JSON.stringify({ generatedAt: now, alerts }, null, 2)}\n`,
);

console.log(`✅ Generated predictive maintenance alerts for ${alerts.length} services`);

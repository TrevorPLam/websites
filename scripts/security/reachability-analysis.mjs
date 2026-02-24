/**
 * @file scripts/security/reachability-analysis.mjs
 * @summary Generates dependency reachability report from pnpm audit output and fails on reachable high/critical findings.
 * @description Enriches advisories with pnpm why dependency-path evidence and writes a markdown artifact for triage.
 * @security Uses local dependency metadata only; does not handle credentials or secrets.
 * @adr none
 * @requirements DOMAIN-37-4-12
 */

#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [, , inputPath = 'audit-results.json', outputPath = 'artifacts/security/reachability-report.md'] = process.argv;

const severityRank = {
  info: 0,
  low: 1,
  moderate: 2,
  medium: 2,
  high: 3,
  critical: 4,
};

const blockingThreshold = severityRank.high;

function normalizeAdvisories(payload) {
  if (!payload || typeof payload !== 'object') return [];

  if (payload.vulnerabilities && typeof payload.vulnerabilities === 'object') {
    return Object.entries(payload.vulnerabilities).map(([name, detail]) => ({
      name,
      severity: detail?.severity ?? 'unknown',
      range: detail?.range ?? 'unknown',
      via: Array.isArray(detail?.via) ? detail.via : [],
    }));
  }

  if (payload.advisories && typeof payload.advisories === 'object') {
    return Object.values(payload.advisories).map((advisory) => ({
      name: advisory?.module_name ?? advisory?.name ?? 'unknown',
      severity: advisory?.severity ?? 'unknown',
      range: advisory?.vulnerable_versions ?? 'unknown',
      via: [advisory?.url].filter(Boolean),
    }));
  }

  return [];
}

function runPnpmWhy(packageName) {
  try {
    return execSync(`pnpm why ${packageName}`, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch (error) {
    const stderr = error?.stderr?.toString?.().trim();
    const stdout = error?.stdout?.toString?.().trim();
    return stderr || stdout || 'unavailable';
  }
}

const auditPayload = JSON.parse(readFileSync(inputPath, 'utf8'));
const advisories = normalizeAdvisories(auditPayload);

const enriched = advisories.map((entry) => {
  const whyOutput = runPnpmWhy(entry.name);
  const reachable = /dependencies:|devDependencies:|optionalDependencies:/i.test(whyOutput) || /\bdepends on\b/i.test(whyOutput);

  return {
    ...entry,
    reachable,
    whyOutput,
  };
});

const blockingFindings = enriched.filter((item) => (severityRank[item.severity] ?? -1) >= blockingThreshold && item.reachable);

mkdirSync(dirname(outputPath), { recursive: true });

const lines = [
  '# Dependency Reachability Analysis',
  '',
  `- Source: \`${inputPath}\``,
  `- Findings analyzed: **${enriched.length}**`,
  `- Blocking reachable findings (high+): **${blockingFindings.length}**`,
  '',
  '## Findings',
  '',
];

if (enriched.length === 0) {
  lines.push('No vulnerabilities were reported by `pnpm audit`.');
} else {
  for (const finding of enriched) {
    lines.push(`### ${finding.name}`);
    lines.push(`- Severity: **${finding.severity}**`);
    lines.push(`- Vulnerable range: \`${finding.range}\``);
    lines.push(`- Reachable: **${finding.reachable ? 'yes' : 'unknown/no'}**`);
    if (finding.via.length > 0) {
      lines.push(`- References: ${finding.via.map((item) => `\`${typeof item === 'string' ? item : JSON.stringify(item)}\``).join(', ')}`);
    }
    lines.push('```text');
    lines.push(finding.whyOutput || 'unavailable');
    lines.push('```');
    lines.push('');
  }
}

writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');

if (blockingFindings.length > 0) {
  console.error(`Reachable high/critical vulnerabilities detected: ${blockingFindings.length}`);
  process.exit(1);
}

console.log(`Reachability report written to ${outputPath}`);

#!/usr/bin/env node
/**
 * @file scripts/ai/validate-ai-policy.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Supports TODO task execution and QA automation.
 * @security medium
 * @adr none
 * @requirements DOMAIN-37-5
 */

import fs from 'node:fs';

const policyPath = 'policy/ai-agent-policy.yaml';
const source = fs.readFileSync(policyPath, 'utf8');

const requiredSnippets = ['version:', 'name:', 'rules:', 'id:', 'when:', 'action:'];
const missing = requiredSnippets.filter((snippet) => !source.includes(snippet));

if (missing.length > 0) {
  console.error(`❌ AI policy missing required entries: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('✅ AI policy baseline is structurally valid');

#!/usr/bin/env node
/**
 * @file scripts/ai/flag-requirement-conflicts.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Supports TODO task execution and QA automation.
 * @security medium
 * @adr none
 * @requirements DOMAIN-37-5
 */

import fs from 'node:fs';

const path = 'docs/plan/domain-37/requirements-synthesis.json';
const requirements = JSON.parse(fs.readFileSync(path, 'utf8'));

const conflicts = [];
for (let i = 0; i < requirements.length; i += 1) {
  for (let j = i + 1; j < requirements.length; j += 1) {
    const a = requirements[i];
    const b = requirements[j];
    if (a.description && b.description && a.description === b.description) {
      conflicts.push([a.id, b.id]);
    }
  }
}

if (conflicts.length) {
  console.error('❌ Requirement conflicts found:', conflicts);
  process.exit(1);
}

console.log('✅ No duplicate requirement descriptions found');

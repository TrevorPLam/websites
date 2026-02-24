#!/usr/bin/env node
/**
 * @file scripts/testing/self-healing-vitest.mjs
 * @summary Domain 37 AI-native automation utility.
 * @description Supports TODO task execution and QA automation.
 * @security medium
 * @adr none
 * @requirements DOMAIN-37-5
 */

import { spawnSync } from 'node:child_process';

const retries = 2;
let attempt = 0;

while (attempt <= retries) {
  attempt += 1;
  const result = spawnSync('pnpm', ['vitest', 'run'], { stdio: 'inherit' });
  if (result.status === 0) {
    console.log(`✅ Tests passed on attempt ${attempt}`);
    process.exit(0);
  }
  if (attempt <= retries) {
    console.log(`⚠️ Retry attempt ${attempt} failed, re-running...`);
  }
}

console.error(`❌ Tests failed after ${retries + 1} attempts`);
process.exit(1);

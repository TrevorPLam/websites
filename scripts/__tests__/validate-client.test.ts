/**
 * @file scripts/__tests__/validate-client.test.ts
 * @role test
 * @summary Unit tests for validate-client script (CaCA client validation).
 *
 * Note: Only tests against the existing `clients/testing-not-a-client` fixture
 * plus dynamically-created temp directories. Named client stubs (luxe-salon, etc.)
 * are not created until those clients are bootstrapped; tests for them are
 * deferred via TODO comments.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { validateClient } from '../validate-client';

const ROOT = path.resolve(process.cwd());

describe('validateClient', () => {
  describe('with valid testing-not-a-client fixture', () => {
    it('passes validation', () => {
      const result = validateClient('clients/testing-not-a-client', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
      expect(result.passed).toBeGreaterThan(0);
    });
  });

  // TODO: Uncomment when client directories are bootstrapped:
  // describe('with valid starter-template', () => { ... });
  // describe('with valid luxe-salon', () => { ... });
  // describe('with valid bistro-central', () => { ... });
  // describe('with valid chen-law', () => { ... });
  // describe('with valid sunrise-dental', () => { ... });
  // describe('with valid urban-outfitters', () => { ... });

  describe('with non-existent path', () => {
    it('fails with package.json not found', () => {
      const tmpDir = path.join(os.tmpdir(), `validate-client-test-${Date.now()}`);
      fs.mkdirSync(tmpDir, { recursive: true });
      try {
        const result = validateClient(tmpDir, ROOT, { silent: true });
        expect(result.ok).toBe(false);
        expect(result.failed).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe('with invalid package.json name', () => {
    it('fails when name does not start with @clients/', () => {
      const tmpDir = path.join(os.tmpdir(), `validate-client-test-${Date.now()}`);
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          name: '@wrong/name',
          scripts: { dev: 'next dev', build: 'next build', 'type-check': 'tsc --noEmit' },
        })
      );
      try {
        const result = validateClient(tmpDir, ROOT, { silent: true });
        expect(result.ok).toBe(false);
        expect(result.failed).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });

  describe('cross-client import detection', () => {
    it('detects @clients/ imports in app code', () => {
      const tmpDir = path.join(os.tmpdir(), `validate-client-test-${Date.now()}`);
      const appDir = path.join(tmpDir, 'app');
      fs.mkdirSync(appDir, { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({
          name: '@clients/test',
          scripts: { dev: 'next dev', build: 'next build', 'type-check': 'tsc --noEmit' },
        })
      );
      fs.writeFileSync(
        path.join(tmpDir, 'site.config.ts'),
        `import type { SiteConfig } from '@repo/types';
const siteConfig: SiteConfig = { id: 't', name: 'T', tagline: 'T', description: 'D', url: 'https://x.com', industry: 'general', features: {}, theme: { colors: {} }, conversionFlow: { type: 'none' } };
export default siteConfig;`
      );
      fs.writeFileSync(path.join(tmpDir, 'next.config.js'), 'module.exports = {};');
      fs.writeFileSync(
        path.join(tmpDir, 'tsconfig.json'),
        JSON.stringify({ extends: '@repo/typescript-config/base.json' })
      );
      fs.writeFileSync(
        path.join(appDir, 'layout.tsx'),
        'export default function Layout({ children }) { return children; }'
      );
      fs.writeFileSync(
        path.join(appDir, 'page.tsx'),
        'import x from "@clients/other"; export default () => null;'
      );
      try {
        const result = validateClient(tmpDir, ROOT, { silent: true });
        expect(result.ok).toBe(false);
        expect(result.failed).toBeGreaterThan(0);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });
});

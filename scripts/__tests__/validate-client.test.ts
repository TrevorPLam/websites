/**
 * @file scripts/__tests__/validate-client.test.ts
 * @role test
 * @summary Unit tests for validate-client script (CaCA client validation).
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { validateClient } from '../validate-client';

const ROOT = path.resolve(process.cwd());

describe('validateClient', () => {
  describe('with valid starter-template', () => {
    it('passes validation', () => {
      const result = validateClient('clients/starter-template', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
      expect(result.passed).toBeGreaterThan(0);
    });
  });

  describe('with valid luxe-salon', () => {
    it('passes validation', () => {
      const result = validateClient('clients/luxe-salon', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
    });
  });

  describe('with valid bistro-central', () => {
    it('passes validation', () => {
      const result = validateClient('clients/bistro-central', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
    });
  });

  describe('with valid chen-law', () => {
    it('passes validation', () => {
      const result = validateClient('clients/chen-law', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
    });
  });

  describe('with valid sunrise-dental', () => {
    it('passes validation', () => {
      const result = validateClient('clients/sunrise-dental', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
    });
  });

  describe('with valid urban-outfitters', () => {
    it('passes validation', () => {
      const result = validateClient('clients/urban-outfitters', ROOT, { silent: true });
      expect(result.ok).toBe(true);
      expect(result.failed).toBe(0);
    });
  });

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
      fs.writeFileSync(path.join(appDir, 'layout.tsx'), 'export default function Layout({ children }) { return children; }');
      fs.writeFileSync(path.join(appDir, 'page.tsx'), 'import x from "@clients/other"; export default () => null;');
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

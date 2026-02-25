/**
 * @file tooling/validation/src/__tests__/validate-site-config.test.ts
 * @summary Tests for site.config.ts validator functionality.
 * @description Validates configuration parsing, error handling, and batch validation operations.
 * @security none
 * @adr none
 * @requirements VALIDATION-001, VALIDATION-002
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { validateSiteConfig, validateAllClients } from '../validate-site-config';

// ─── Helpers ──────────────────────────────────────────────────────────────────

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writeTmpConfig(name: string, content: string): string {
  const filePath = path.join(tmpDir, name);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// ─── Valid config ─────────────────────────────────────────────────────────────

const VALID_CONFIG = `
import type { SiteConfig } from '@repo/types';

const siteConfig: SiteConfig = {
  id: 'test-site',
  name: 'Test Site',
  tagline: 'Great site',
  description: 'A test site',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3101',
  industry: 'salon',
  features: {
    hero: 'split',
  },
  integrations: {
    analytics: { provider: 'none' },
  },
  navLinks: [{ href: '/', label: 'Home' }],
  footer: {
    columns: [],
    legalLinks: [],
    copyrightTemplate: '© {year} Test',
  },
  contact: {
    email: 'test@example.com',
  },
  conversionFlow: {
    type: 'booking',
    serviceCategories: ['Haircut'],
    timeSlots: [],
    maxAdvanceDays: 30,
  },
  theme: {
    colors: {
      primary: '174 85% 33%',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    borderRadius: 'medium',
    shadows: 'medium',
  },
};

export default siteConfig;
`;

describe('validateSiteConfig — valid config', () => {
  it('returns valid: true for a correct config', () => {
    const fp = writeTmpConfig('site.config.ts', VALID_CONFIG);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── Missing required fields ──────────────────────────────────────────────────

describe('validateSiteConfig — missing required fields', () => {
  it('flags missing id', () => {
    const content = VALID_CONFIG.replace(/id:\s*'[^']*',/, '');
    const fp = writeTmpConfig('site.config.ts', content);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'id')).toBe(true);
  });

  it('flags missing theme', () => {
    // Remove the theme section entirely
    const content = VALID_CONFIG.replace(/\s*theme:\s*\{[\s\S]*?borderRadius[^}]+\},/m, '');
    const fp = writeTmpConfig('site.config.ts', content);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'theme')).toBe(true);
  });

  it('flags missing default export', () => {
    const content = VALID_CONFIG.replace('export default siteConfig;', '');
    const fp = writeTmpConfig('site.config.ts', content);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'export')).toBe(true);
  });
});

// ─── Invalid values ───────────────────────────────────────────────────────────

describe('validateSiteConfig — invalid values', () => {
  it('flags unknown industry', () => {
    const content = VALID_CONFIG.replace("industry: 'salon'", "industry: 'unicorn'");
    const fp = writeTmpConfig('site.config.ts', content);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'industry')).toBe(true);
  });

  it('accepts valid industry (dental)', () => {
    const content = VALID_CONFIG.replace("industry: 'salon'", "industry: 'dental'");
    const fp = writeTmpConfig('site.config.ts', content);
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(true);
  });
});

// ─── File not found ───────────────────────────────────────────────────────────

describe('validateSiteConfig — file errors', () => {
  it('returns invalid for non-existent file', () => {
    const result = validateSiteConfig('/nonexistent/site.config.ts');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('file');
  });

  it('returns invalid for non-.ts extension', () => {
    const fp = writeTmpConfig('config.json', '{}');
    const result = validateSiteConfig(fp);
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('file');
  });
});

// ─── validateAllClients ───────────────────────────────────────────────────────

describe('validateAllClients', () => {
  it('returns empty map when no clients dir', () => {
    const results = validateAllClients('/nonexistent-dir');
    expect(results.size).toBe(0);
  });

  it('validates each client in the clients dir', () => {
    // Set up a fake clients dir with two clients
    const clientsDir = path.join(tmpDir, 'clients');
    const client1 = path.join(clientsDir, 'client-a');
    const client2 = path.join(clientsDir, 'client-b');
    fs.mkdirSync(client1, { recursive: true });
    fs.mkdirSync(client2, { recursive: true });
    fs.writeFileSync(path.join(client1, 'site.config.ts'), VALID_CONFIG, 'utf8');
    // client-b has no site.config.ts — should be skipped
    const results = validateAllClients(tmpDir);
    expect(results.has('client-a')).toBe(true);
    expect(results.has('client-b')).toBe(false);
    expect(results.get('client-a')?.valid).toBe(true);
  });
});

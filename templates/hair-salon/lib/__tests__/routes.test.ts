// File: lib/__tests__/routes.test.ts  [TRACE:FILE=lib.routes.test]
// Purpose: Unit tests for unified route registry. Verifies route structure, sitemap and
//          search entry generation, and single-source-of-truth behavior.
//
// Related: Task 0.25 — Create Unified Route Registry

import { getStaticRoutes, getSitemapEntries, getSearchEntries } from '../routes';

describe('lib/routes', () => {
  describe('getStaticRoutes', () => {
    it('returns 16 static routes', () => {
      const routes = getStaticRoutes();
      expect(routes).toHaveLength(16);
    });

    it('includes home, about, services, and key pages', () => {
      const paths = getStaticRoutes().map((r) => r.path);
      expect(paths).toContain('/');
      expect(paths).toContain('/about');
      expect(paths).toContain('/services');
      expect(paths).toContain('/book');
      expect(paths).toContain('/contact');
      expect(paths).toContain('/blog');
      expect(paths).toContain('/privacy');
      expect(paths).toContain('/terms');
    });

    it('includes all service sub-routes', () => {
      const paths = getStaticRoutes().map((r) => r.path);
      expect(paths).toContain('/services/haircuts');
      expect(paths).toContain('/services/coloring');
      expect(paths).toContain('/services/treatments');
      expect(paths).toContain('/services/special-occasions');
    });

    it('has valid changeFrequency and priority for each route', () => {
      const routes = getStaticRoutes();
      const validFreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      for (const r of routes) {
        expect(validFreq).toContain(r.changeFrequency);
        expect(r.priority).toBeGreaterThanOrEqual(0);
        expect(r.priority).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('getSitemapEntries', () => {
    it('returns sitemap entries with correct URLs for baseUrl', () => {
      const entries = getSitemapEntries('https://example.com');
      expect(entries).toHaveLength(16);
      expect(entries[0].url).toBe('https://example.com');
      expect(entries.find((e) => e.url?.endsWith('/about'))).toBeDefined();
    });

    it('handles baseUrl with trailing slash', () => {
      const entries = getSitemapEntries('https://example.com/');
      expect(entries[0].url).toBe('https://example.com');
    });
  });

  describe('getSearchEntries', () => {
    it('returns 16 search items (all routes have search metadata)', () => {
      const items = getSearchEntries();
      expect(items).toHaveLength(16);
    });

    it('all items have type Page', () => {
      const items = getSearchEntries();
      expect(items.every((i) => i.type === 'Page')).toBe(true);
    });

    it('all items have required SearchItem fields', () => {
      const items = getSearchEntries();
      for (const item of items) {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('href');
      }
    });
  });
});

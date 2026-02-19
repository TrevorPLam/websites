/**
 * @file packages/integrations/maps/__tests__/consent.test.ts
 * Task: [4.5] Unit tests for maps consent (browser APIs mocked for node env).
 */

import { getMapsConsent, hasMapsConsent, setMapsConsent } from '../consent';

const MAPS_CONSENT_KEY = 'ydm_maps_consent';

function mockBrowserEnv() {
  const cookie: string[] = [];
  const storage: Record<string, string> = {};
  const win = {
    localStorage: {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        for (const k of Object.keys(storage)) delete storage[k];
      },
      length: 0,
      key: () => null,
    },
    location: { protocol: 'http:' },
  };
  const doc = {
    get cookie() {
      return cookie.join('; ');
    },
    set cookie(value: string) {
      const [part] = value.split(';');
      const [name, ...rest] = part.split('=');
      const key = name?.trim() ?? '';
      const val = rest.join('=').trim();
      const idx = cookie.findIndex((c) => c.startsWith(`${key}=`));
      if (idx >= 0) cookie.splice(idx, 1);
      if (val) cookie.push(`${key}=${val}`);
    },
  };
  (globalThis as unknown as { window: unknown; document: unknown }).window = win;
  (globalThis as unknown as { window: unknown; document: unknown }).document = doc;
  return { cookie, storage, win, doc };
}

function unmockBrowserEnv() {
  delete (globalThis as unknown as { window?: unknown }).window;
  delete (globalThis as unknown as { document?: unknown }).document;
}

describe('Maps consent (4.5)', () => {
  afterEach(() => {
    unmockBrowserEnv();
  });

  describe('when not in browser', () => {
    it('getMapsConsent returns unknown', () => {
      expect(getMapsConsent()).toBe('unknown');
    });

    it('hasMapsConsent returns false', () => {
      expect(hasMapsConsent()).toBe(false);
    });

    it('setMapsConsent is a no-op', () => {
      expect(() => setMapsConsent('granted')).not.toThrow();
    });
  });

  describe('when in browser (mocked)', () => {
    beforeEach(() => {
      mockBrowserEnv();
    });

    it('getMapsConsent returns unknown when nothing stored', () => {
      expect(getMapsConsent()).toBe('unknown');
    });

    it('hasMapsConsent returns false when nothing stored', () => {
      expect(hasMapsConsent()).toBe(false);
    });

    it('setMapsConsent then getMapsConsent returns granted', () => {
      setMapsConsent('granted');
      expect(getMapsConsent()).toBe('granted');
      expect(hasMapsConsent()).toBe(true);
    });

    it('setMapsConsent then getMapsConsent returns denied', () => {
      setMapsConsent('denied');
      expect(getMapsConsent()).toBe('denied');
      expect(hasMapsConsent()).toBe(false);
    });

    it('setMapsConsent unknown clears storage', () => {
      setMapsConsent('granted');
      expect(getMapsConsent()).toBe('granted');
      setMapsConsent('unknown');
      expect(getMapsConsent()).toBe('unknown');
    });

    it('persists to localStorage and cookie', () => {
      setMapsConsent('granted');
      const win = (globalThis as unknown as { window: { localStorage: Storage } }).window;
      expect(win.localStorage.getItem(MAPS_CONSENT_KEY)).toBe('granted');
      const doc = (globalThis as unknown as { document: { cookie: string } }).document;
      expect(doc.cookie).toContain(MAPS_CONSENT_KEY);
      expect(doc.cookie).toContain('granted');
    });
  });
});

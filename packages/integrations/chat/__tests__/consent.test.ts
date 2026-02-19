/**
 * @file packages/integrations/chat/__tests__/consent.test.ts
 * Task: [4.3] Unit tests for chat consent (browser APIs mocked for node env).
 */

import { getChatConsent, hasChatConsent, setChatConsent } from '../consent';

const CHAT_CONSENT_KEY = 'ydm_chat_consent';

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

describe('Chat consent (4.3)', () => {
  afterEach(() => {
    unmockBrowserEnv();
  });

  describe('when not in browser', () => {
    it('getChatConsent returns unknown', () => {
      expect(getChatConsent()).toBe('unknown');
    });

    it('hasChatConsent returns false', () => {
      expect(hasChatConsent()).toBe(false);
    });

    it('setChatConsent is a no-op', () => {
      expect(() => setChatConsent('granted')).not.toThrow();
    });
  });

  describe('when in browser (mocked)', () => {
    beforeEach(() => {
      mockBrowserEnv();
    });

    it('getChatConsent returns unknown when nothing stored', () => {
      expect(getChatConsent()).toBe('unknown');
    });

    it('hasChatConsent returns false when nothing stored', () => {
      expect(hasChatConsent()).toBe(false);
    });

    it('setChatConsent then getChatConsent returns granted', () => {
      setChatConsent('granted');
      expect(getChatConsent()).toBe('granted');
      expect(hasChatConsent()).toBe(true);
    });

    it('setChatConsent then getChatConsent returns denied', () => {
      setChatConsent('denied');
      expect(getChatConsent()).toBe('denied');
      expect(hasChatConsent()).toBe(false);
    });

    it('setChatConsent unknown clears storage', () => {
      setChatConsent('granted');
      expect(getChatConsent()).toBe('granted');
      setChatConsent('unknown');
      expect(getChatConsent()).toBe('unknown');
    });

    it('persists to localStorage and cookie', () => {
      setChatConsent('granted');
      const win = (globalThis as unknown as { window: { localStorage: Storage } }).window;
      expect(win.localStorage.getItem(CHAT_CONSENT_KEY)).toBe('granted');
      const doc = (globalThis as unknown as { document: { cookie: string } }).document;
      expect(doc.cookie).toContain(CHAT_CONSENT_KEY);
      expect(doc.cookie).toContain('granted');
    });
  });
});

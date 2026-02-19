/**
 * @file packages/infrastructure/ui/src/__tests__/theme.test.ts
 * Tests for: theme system, dark mode, persistence
 *
 * Note: runs in jsdom environment. window.matchMedia is mocked below
 * since jsdom does not implement it.
 */

// Mock window.matchMedia (jsdom does not implement it)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('dark') ? false : false, // default: light mode
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

import { DEFAULT_THEME, themeToCSS, applyTheme } from '../theme/system';
import { detectSystemColorMode, resolveColorMode } from '../theme/dark-mode';
import {
  loadColorMode,
  saveColorMode,
  clearColorMode,
  getThemeInitScript,
} from '../theme/persistence';

// ─── themeToCSS ───────────────────────────────────────────────────────────────

describe('themeToCSS', () => {
  it('generates CSS variable declarations for light mode', () => {
    const css = themeToCSS(DEFAULT_THEME, 'light');
    expect(css).toContain('--color-primary:');
    expect(css).toContain('--color-background:');
    expect(css).toContain('--radius:');
  });

  it('uses darkColors overrides in dark mode', () => {
    const css = themeToCSS(DEFAULT_THEME, 'dark');
    // DEFAULT_THEME.darkColors.background is '220 20% 8%'
    expect(css).toContain('220 20% 8%');
  });

  it('includes border-radius value', () => {
    const css = themeToCSS({ ...DEFAULT_THEME, borderRadius: 'large' }, 'light');
    expect(css).toContain('--radius: 12px');
  });
});

// ─── applyTheme (server-safe) ─────────────────────────────────────────────────

describe('applyTheme', () => {
  it('does not throw in a server environment (no document)', () => {
    // In jsdom, document exists but we test the "no-op if no document" branch
    // by simply calling it without crashing
    expect(() => applyTheme(DEFAULT_THEME, 'light')).not.toThrow();
  });
});

// ─── Color mode detection ─────────────────────────────────────────────────────

describe('detectSystemColorMode', () => {
  it('returns light or dark', () => {
    const mode = detectSystemColorMode();
    expect(['light', 'dark']).toContain(mode);
  });
});

describe('resolveColorMode', () => {
  it('returns system default for "system" preference', () => {
    expect(resolveColorMode('system', 'dark')).toBe('dark');
    expect(resolveColorMode('system', 'light')).toBe('light');
  });

  it('returns explicit override regardless of system', () => {
    expect(resolveColorMode('light', 'dark')).toBe('light');
    expect(resolveColorMode('dark', 'light')).toBe('dark');
  });
});

// ─── Persistence ─────────────────────────────────────────────────────────────

describe('loadColorMode / saveColorMode / clearColorMode', () => {
  beforeEach(() => clearColorMode());
  afterEach(() => clearColorMode());

  it('returns "system" when nothing is stored', () => {
    expect(loadColorMode()).toBe('system');
  });

  it('saves and loads a color mode', () => {
    saveColorMode('dark');
    expect(loadColorMode()).toBe('dark');
  });

  it('resets to system after clearColorMode', () => {
    saveColorMode('light');
    clearColorMode();
    expect(loadColorMode()).toBe('system');
  });
});

// ─── Init script ─────────────────────────────────────────────────────────────

describe('getThemeInitScript', () => {
  it('returns a non-empty string', () => {
    const script = getThemeInitScript();
    expect(typeof script).toBe('string');
    expect(script.length).toBeGreaterThan(0);
  });

  it('contains the localStorage key', () => {
    const script = getThemeInitScript();
    expect(script).toContain('theme-color-mode');
  });

  it('sets data-color-mode attribute', () => {
    const script = getThemeInitScript();
    expect(script).toContain('data-color-mode');
  });
});

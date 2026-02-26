/**
 * Logger module tests.
 * Verifies production JSON output (Vercel Log Drain compatible) and sanitization.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { logInfo, logError, logWarn, sanitizeLogContext } from '../logger';

describe('Logger Module', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('production mode — JSON format', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('logs info as single-line JSON with timestamp, level, message', () => {
      const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
      logInfo('test message');
      expect(spy).toHaveBeenCalledTimes(1);
      const payload = spy.mock.calls[0][0];
      const parsed = JSON.parse(payload);
      expect(parsed).toMatchObject({
        level: 'info',
        message: 'test message',
      });
      expect(parsed.timestamp).toBeDefined();
      expect(typeof parsed.timestamp).toBe('string');
      spy.mockRestore();
    });

    it('logs error as single-line JSON with timestamp, level, message, error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const err = new Error('test error');
      logError('failed', err);
      expect(spy).toHaveBeenCalledTimes(1);
      const payload = spy.mock.calls[0][0];
      const parsed = JSON.parse(payload);
      expect(parsed).toMatchObject({
        level: 'error',
        message: 'failed',
      });
      expect(parsed.error).toMatchObject({ name: 'Error', message: 'test error' });
      expect(parsed.timestamp).toBeDefined();
      spy.mockRestore();
    });

    it('logs warn as single-line JSON', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logWarn('warning');
      expect(spy).toHaveBeenCalledTimes(1);
      const payload = spy.mock.calls[0][0];
      const parsed = JSON.parse(payload);
      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warning');
      spy.mockRestore();
    });
  });

  describe('sanitizeLogContext', () => {
    it('redacts sensitive keys', () => {
      const out = sanitizeLogContext({ password: 'secret', user: 'alice' });
      expect(out).toEqual({ password: '[REDACTED]', user: 'alice' });
    });

    it('returns undefined for undefined input', () => {
      expect(sanitizeLogContext(undefined)).toBeUndefined();
    });
  });
});

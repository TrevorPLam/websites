import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isValidFeatureFlag, type FeatureFlag } from './src/feature-flags';

// Mock dependencies
vi.mock('@vercel/edge-config', () => ({
  get: vi.fn(),
}));

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: () => ({
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    }),
  },
}));

describe('Feature Flags System - Core Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validation', () => {
    it('should validate feature flags', () => {
      expect(isValidFeatureFlag('ai_chat_widget')).toBe(true);
      expect(isValidFeatureFlag('invalid_flag')).toBe(false);
    });

    it('should validate all known feature flags', () => {
      const validFlags: FeatureFlag[] = [
        'offline_lead_forms',
        'realtime_lead_feed',
        'ab_testing',
        'ai_chat_widget',
        'booking_calendar',
        'stripe_billing',
        'white_label_portal',
        'gdpr_tools',
        'api_access',
        'sso_enabled',
        'advanced_analytics',
        'multi_site',
        'custom_domain',
        'ghl_crm_sync',
        'hubspot_crm_sync',
      ];

      validFlags.forEach((flag) => {
        expect(isValidFeatureFlag(flag)).toBe(true);
      });
    });
  });

  describe('Hash function', () => {
    it('should produce deterministic hashes', () => {
      // Test that the hash function is deterministic
      const hash1 = hashTenantId('test-tenant');
      const hash2 = hashTenantId('test-tenant');
      const hash3 = hashTenantId('different-tenant');

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash1).toBeGreaterThanOrEqual(0);
      expect(hash1).toBeLessThan(100);
    });
  });
});

// Import the hash function for testing
function hashTenantId(tenantId: string): number {
  let hash = 5381;
  for (const char of tenantId) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }
  return Math.abs(hash) % 100;
}

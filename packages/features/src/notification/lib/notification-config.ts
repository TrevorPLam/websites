/**
 * @file packages/features/src/notification/lib/notification-config.ts
 * Purpose: Notification feature configuration stub
 */

export type NotificationProvider = 'sonner' | 'toast' | 'push' | 'email' | 'none';

export interface NotificationFeatureConfig {
  provider?: NotificationProvider;
  enabled?: boolean;
}

export function createNotificationConfig(overrides: Partial<NotificationFeatureConfig> = {}): NotificationFeatureConfig {
  return { provider: 'none', enabled: false, ...overrides };
}

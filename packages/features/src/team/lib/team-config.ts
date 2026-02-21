/**
 * @file packages/features/src/team/lib/team-config.ts
 * Purpose: Team feature configuration and types
 */

import type { TeamMember } from '@repo/marketing-components';

export interface TeamFeatureConfig {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Layout variant */
  layout?: 'grid' | 'carousel' | 'detailed';
  /** Team members (config-based source) */
  members?: TeamMember[];
}

export function createTeamConfig(overrides: Partial<TeamFeatureConfig> = {}): TeamFeatureConfig {
  return {
    layout: 'grid',
    ...overrides,
  };
}

/**
 * @file packages/features/src/team/lib/adapters/config.ts
 * Purpose: Config-based team adapter — returns members from TeamFeatureConfig
 */

import type { TeamMember } from '@repo/marketing-components';
import type { TeamFeatureConfig } from '../team-config';

export type TeamSource = 'config' | 'api' | 'cms';

export async function getTeamFromConfig(config: TeamFeatureConfig): Promise<TeamMember[]> {
  return config.members ?? [];
}

/**
 * @file packages/features/src/team/index.ts
 * Purpose: Team feature barrel export
 */

export { TeamSection } from './components/TeamSection';
export type { TeamSectionProps } from './components/TeamSection';
export * from './lib/team-config';
export { getTeamFromConfig } from './lib/adapters/config';

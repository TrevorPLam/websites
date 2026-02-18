/**
 * @file packages/marketing-components/src/hero/HeroSplitImageRight.tsx
 * @role component
 * @summary Split hero with image on right
 *
 * Convenience wrapper for HeroSplit with imagePosition="right".
 */

import { HeroSplit, HeroSplitProps } from './HeroSplit';

/**
 * Split hero with image on the right side.
 *
 * @param props - HeroSplitProps
 * @returns Hero section component
 */
export function HeroSplitImageRight(props: HeroSplitProps) {
  return <HeroSplit {...props} imagePosition="right" />;
}

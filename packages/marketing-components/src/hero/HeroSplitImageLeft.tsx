/**
 * @file packages/marketing-components/src/hero/HeroSplitImageLeft.tsx
 * @role component
 * @summary Split hero with image on left
 *
 * Convenience wrapper for HeroSplit with imagePosition="left".
 */

import { HeroSplit, HeroSplitProps } from './HeroSplit';

/**
 * Split hero with image on the left side.
 *
 * @param props - HeroSplitProps
 * @returns Hero section component
 */
export function HeroSplitImageLeft(props: HeroSplitProps) {
  return <HeroSplit {...props} imagePosition="left" />;
}

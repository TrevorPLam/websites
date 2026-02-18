// Task: [3.1] Section registry — Map<string, Component>
// Status: Stub — TODO implement

import type React from 'react';
import type { SectionProps } from './types';

export const sectionRegistry = new Map<string, React.ComponentType<SectionProps>>();

export function composePage(_config: unknown, _siteConfig: unknown): React.ReactElement | null {
  return null;
}

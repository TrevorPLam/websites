// Task: [3.1] SectionProps, TemplateConfig
// Status: Stub — TODO extend

import type React from 'react';

export interface SectionProps {
  id?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export interface TemplateConfig {
  sections?: string[];
  [key: string]: unknown;
}

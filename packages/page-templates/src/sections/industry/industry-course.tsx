import * as React from 'react';
import { CourseGrid } from '@repo/marketing-components';
import { registerSection } from '../../registry';
import type { SectionProps } from '../../types';
import { getSiteConfig } from './shared';

function CourseAdapter(props: SectionProps) {
  const config = getSiteConfig(props);
  if (!config.features.course) return null;
  return React.createElement(CourseGrid, { courses: [] });
}
registerSection('industry-course', CourseAdapter);

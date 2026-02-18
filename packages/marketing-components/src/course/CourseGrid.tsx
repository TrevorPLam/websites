/**
 * @file packages/marketing-components/src/course/CourseGrid.tsx
 * @role component
 * @summary Grid of course cards
 */

import { Container, Section } from '@repo/ui';
import { cn } from '@repo/utils';
import { CourseCard } from './CourseCard';
import type { Course } from './types';

export interface CourseGridProps {
  title?: string;
  courses: Course[];
  columns?: 2 | 3 | 4;
  onEnroll?: (course: Course) => void;
  className?: string;
}

export function CourseGrid({
  title,
  courses,
  columns = 3,
  onEnroll,
  className,
}: CourseGridProps) {
  const gridClasses = cn(
    'grid gap-4',
    columns === 2 && 'grid-cols-1 sm:grid-cols-2',
    columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  );

  return (
    <Section className={className}>
      <Container>
        {title && <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>}
        <div className={gridClasses}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onEnroll={onEnroll} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

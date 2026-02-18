/**
 * @file packages/marketing-components/src/course/CourseCard.tsx
 * @role component
 * @summary Single course card
 */

import { Card, Rating } from '@repo/ui';
import { cn } from '@repo/utils';
import type { Course } from './types';

export interface CourseCardProps {
  course: Course;
  href?: string;
  onEnroll?: (course: Course) => void;
  className?: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function CourseCard({ course, href, onEnroll, className }: CourseCardProps) {
  const link = href ?? course.href ?? `/courses/${course.slug}`;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <a href={link} className="block">
        {course.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img src={course.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground">{course.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {course.category && <span>{course.category}</span>}
            {course.duration && <span>• {course.duration}</span>}
            {course.level && <span>• {course.level}</span>}
          </div>
          {course.rating != null && (
            <div className="mt-2 flex items-center gap-2">
              <Rating value={course.rating} readOnly size="sm" />
              {course.reviewCount != null && course.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">({course.reviewCount})</span>
              )}
            </div>
          )}
          {course.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {course.description}
            </p>
          )}
          {course.price != null && (
            <p className="mt-2 font-semibold">{formatPrice(course.price)}</p>
          )}
        </div>
      </a>
      {onEnroll && (
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onEnroll(course);
            }}
            className="min-h-[44px] w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Enroll
          </button>
        </div>
      )}
    </Card>
  );
}

/**
 * @file admin/src/shared/lib/format-date.ts
 * @summary Shared utilities and components.
 * @description Reusable functionality across admin application.
 * @security none
 * @requirements none
 */
import { format } from 'date-fns';

export function formatDate(date: Date | string, formatStr = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(date);
}

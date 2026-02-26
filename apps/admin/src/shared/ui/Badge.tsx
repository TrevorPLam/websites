/**
 * Badge Component
 *
 * A reusable badge component for status indicators and labels.
 * Follows 2026 accessibility standards with semantic color coding.
 *
 * @feature Shared UI
 * @layer shared/ui
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

'use client';

import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({
  children,
  className,
  variant = 'default',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-800',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  return <span className={classes}>{children}</span>;
}

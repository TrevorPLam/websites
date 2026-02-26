'use client';
import { cn } from '@/shared/lib/cn';
import { Button } from '@repo/ui';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminHeader({ title, subtitle, actions, className }: AdminHeaderProps) {
  return (
    <header className={cn('bg-white border-b border-gray-200 px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

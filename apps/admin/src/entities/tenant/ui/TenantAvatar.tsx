'use client';
import { cn } from '@/shared/lib/cn';
import type { Tenant } from '../model/tenant.schema';

interface TenantAvatarProps {
  tenant: Tenant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TenantAvatar({ tenant, size = 'md', className }: TenantAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold',
      sizeClasses[size],
      className
    )}>
      {tenant.name.charAt(0).toUpperCase()}
    </div>
  );
}

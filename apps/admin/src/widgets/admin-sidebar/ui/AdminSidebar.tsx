/**
 * @file admin/src/widgets/admin-sidebar/ui/AdminSidebar.tsx
 * @summary admin-sidebar widget component.
 * @description Layout component for admin interface admin-sidebar section.
 * @security none
 * @requirements none
 */
'use client';
import { cn } from '@/shared/lib/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Tenants', href: '/tenants', icon: '🏢' },
  { name: 'Users', href: '/users', icon: '👥' },
  { name: 'System', href: '/system', icon: '⚙️' },
  { name: 'Settings', href: '/settings', icon: '🔧' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      <div className="flex items-center h-16 px-4">
        <h2 className="text-white text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

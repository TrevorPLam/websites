/**
 * @file admin/src/widgets/admin-footer/ui/AdminFooter.tsx
 * @summary admin-footer widget component.
 * @description Layout component for admin interface admin-footer section.
 * @security none
 * @requirements none
 */
'use client';
import { cn } from '@/shared/lib/cn';

export function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2026 Marketing Websites Admin. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Documentation
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Support
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

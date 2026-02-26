/**
 * @file admin/src/app/layout.tsx
 * @summary 
 * @description 
 * @security none
 * @requirements none
 */
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Admin Panel" />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}

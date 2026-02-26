'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/widgets/admin-header';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminFooter } from '@/widgets/admin-footer';
import { UserList } from '@/features/users/ui/UserList';
import { User, UserSession, UserFormData } from '@/features/users/model/user.model';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'super_admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 3600000),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        mfaEnabled: true,
        permissions: ['all'],
      },
      {
        id: '2',
        email: 'tenant-admin@example.com',
        name: 'Tenant Admin',
        role: 'tenant_admin',
        tenantId: '1',
        status: 'active',
        lastLogin: new Date(Date.now() - 7200000),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        mfaEnabled: false,
        permissions: ['tenant_management', 'user_management'],
      },
      {
        id: '3',
        email: 'billing@example.com',
        name: 'Billing Admin',
        role: 'billing_admin',
        tenantId: '1',
        status: 'active',
        lastLogin: new Date(Date.now() - 86400000),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        mfaEnabled: true,
        permissions: ['billing_management', 'invoice_view'],
      },
    ];

    const mockSessions: UserSession[] = [
      {
        userId: '1',
        tenantId: undefined,
        role: 'super_admin',
        permissions: ['all'],
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        userId: '2',
        tenantId: '1',
        role: 'tenant_admin',
        permissions: ['tenant_management', 'user_management'],
        expiresAt: new Date(Date.now() + 7200000),
        createdAt: new Date(Date.now() - 7200000),
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setUsers(mockUsers);
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUserUpdate = async (id: string, data: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, ...data, updatedAt: new Date() } : u
      ));
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleUserDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(prev => prev.filter(u => u.id !== id));
        setSessions(prev => prev.filter(s => s.userId !== id));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleUserSuspend = async (id: string) => {
    await handleUserUpdate(id, { status: 'suspended' });
  };

  const handleUserActivate = async (id: string) => {
    await handleUserUpdate(id, { status: 'active' });
  };

  const handlePasswordReset = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Password reset email sent');
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title="Users"
            subtitle="Manage user accounts and permissions"
          />
          <main className="flex-1 p-6">
            <UserList
              users={users}
              sessions={sessions}
              loading={loading}
              error={error}
              onUserSelect={(user) => {
                // TODO: Implement user edit modal
                console.log('Edit user:', user);
              }}
              onUserUpdate={handleUserUpdate}
              onUserDelete={handleUserDelete}
              onUserSuspend={handleUserSuspend}
              onUserActivate={handleUserActivate}
              onPasswordReset={handlePasswordReset}
              onRefresh={handleRefresh}
            />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

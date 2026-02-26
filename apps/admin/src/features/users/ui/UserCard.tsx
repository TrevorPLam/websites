/**
 * @file admin/src/features/users/ui/UserCard.tsx
 * @summary users feature implementation for admin interface.
 * @description Provides users management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
'use client';

import React from 'react';
import { User, UserSession } from '../model/user.model';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface UserCardProps {
  user: User;
  sessions: UserSession[];
  selected?: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onUpdate: (id: string, data: Partial<User>) => void;
  onDelete: (id: string) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onPasswordReset: (id: string) => void;
}

export function UserCard({
  user,
  sessions,
  selected,
  onSelect,
  onEdit,
  onUpdate,
  onDelete,
  onSuspend,
  onActivate,
  onPasswordReset,
}: UserCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'tenant_admin':
        return 'bg-blue-100 text-blue-800';
      case 'billing_admin':
        return 'bg-orange-100 text-orange-800';
      case 'analytics_viewer':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeSessions = sessions.filter(session => 
    session.expiresAt > new Date()
  ).length;

  const formatLastLogin = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer ${
        selected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(user.status)}>
            {user.status}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Role</span>
          <Badge className={getRoleColor(user.role)}>
            {user.role.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">MFA</span>
          <Badge className={user.mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {user.mfaEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Active Sessions</span>
          <span className="text-sm font-medium text-gray-900">
            {activeSessions}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Last Login</span>
          <span className="text-sm font-medium text-gray-900">
            {formatLastLogin(user.lastLogin)}
          </span>
        </div>

        {/* Permissions */}
        {user.permissions.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Permissions</div>
            <div className="flex flex-wrap gap-1">
              {user.permissions.slice(0, 3).map((permission) => (
                <span
                  key={permission}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {permission}
                </span>
              ))}
              {user.permissions.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{user.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </Button>
          
          {user.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSuspend(user.id);
              }}
            >
              Suspend
            </Button>
          ) : user.status === 'suspended' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onActivate(user.id);
              }}
            >
              Activate
            </Button>
          ) : null}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPasswordReset(user.id);
            }}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            Reset
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user.id);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

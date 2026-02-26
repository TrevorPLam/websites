/**
 * @file admin/src/features/users/ui/UserList.tsx
 * @summary users feature implementation for admin interface.
 * @description Provides users management functionality with proper error handling and user feedback.
 * @security none
 * @requirements none
 */
'use client';

import React, { useState } from 'react';
import { User, UserSession } from '../model/user.model';
import { UserCard } from './UserCard';
import { UserSearch } from './UserSearch';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface UserListProps {
  users: User[];
  sessions: UserSession[];
  loading: boolean;
  error: string | null;
  onUserSelect: (user: User) => void;
  onUserUpdate: (id: string, data: Partial<User>) => void;
  onUserDelete: (id: string) => void;
  onUserSuspend: (id: string) => void;
  onUserActivate: (id: string) => void;
  onPasswordReset: (id: string) => void;
  onRefresh: () => void;
}

export function UserList({
  users,
  sessions,
  loading,
  error,
  onUserSelect,
  onUserUpdate,
  onUserDelete,
  onUserSuspend,
  onUserActivate,
  onPasswordReset,
  onRefresh,
}: UserListProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserSessions = (userId: string): UserSession[] => {
    return sessions.filter(session => session.userId === userId);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
          {selectedUsers.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedUsers.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="primary">
            Add User
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <UserSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name or email..."
        />
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedUsers.forEach(onUserActivate)}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedUsers.forEach(onUserSuspend)}
              >
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedUsers.forEach(onPasswordReset)}
              >
                Reset Password
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => selectedUsers.forEach(onUserDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchQuery ? 'No users found matching your search.' : 'No users found.'}
          </div>
          {!searchQuery && (
            <Button variant="primary" className="mt-4">
              Create your first user
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              sessions={getUserSessions(user.id)}
              selected={selectedUsers.includes(user.id)}
              onSelect={() => handleSelectUser(user.id)}
              onEdit={() => onUserSelect(user)}
              onUpdate={onUserUpdate}
              onDelete={onUserDelete}
              onSuspend={onUserSuspend}
              onActivate={onUserActivate}
              onPasswordReset={onPasswordReset}
            />
          ))}
        </div>
      )}
    </div>
  );
}

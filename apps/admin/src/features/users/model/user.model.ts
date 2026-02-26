import { User, UserSession } from '@/entities/user';

export interface UserListState {
  users: User[];
  sessions: UserSession[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedUser: User | null;
  filters: {
    status: string[];
    role: string[];
    tenantId: string[];
  };
}

export interface UserFormData {
  email: string;
  name: string;
  role: 'super_admin' | 'tenant_admin' | 'billing_admin' | 'analytics_viewer';
  tenantId?: string;
  permissions: string[];
  mfaEnabled?: boolean;
}

export interface UserActions {
  fetchUsers: () => Promise<void>;
  fetchUserSessions: (userId: string) => Promise<void>;
  createUser: (data: UserFormData) => Promise<User>;
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  resetPassword: (id: string) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  setFilters: (filters: Partial<UserListState['filters']>) => void;
  selectUser: (user: User | null) => void;
}

// Re-export entity types for convenience
export type { User, UserSession } from '@/entities/user';

/**
 * API Client Configuration
 * 
 * Centralized API client with authentication, error handling,
 * and request/response interceptors for the admin application.
 * 
 * @feature API Integration
 * @layer lib
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

import { z } from 'zod';

// API Response Schema
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;

// API Client Configuration
class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse & { data?: T }> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      const validatedData = ApiResponseSchema.parse(data);

      if (!response.ok) {
        throw new Error(validatedData.error || 'API request failed');
      }

      return validatedData;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse & { data?: T }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: any
  ): Promise<ApiResponse & { data?: T }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any
  ): Promise<ApiResponse & { data?: T }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse & { data?: T }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    body?: any
  ): Promise<ApiResponse & { data?: T }> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// API Endpoints
export const apiClient = new ApiClient();

// Tenant API
export const tenantApi = {
  getAll: () => apiClient.get('/tenants'),
  getById: (id: string) => apiClient.get(`/tenants/${id}`),
  create: (data: any) => apiClient.post('/tenants', data),
  update: (id: string, data: any) => apiClient.put(`/tenants/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tenants/${id}`),
  suspend: (id: string) => apiClient.patch(`/tenants/${id}/suspend`),
  activate: (id: string) => apiClient.patch(`/tenants/${id}/activate`),
  getMetrics: (id: string) => apiClient.get(`/tenants/${id}/metrics`),
};

// User API
export const userApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: any) => apiClient.post('/users', data),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
  suspend: (id: string) => apiClient.patch(`/users/${id}/suspend`),
  activate: (id: string) => apiClient.patch(`/users/${id}/activate`),
  resetPassword: (id: string) => apiClient.post(`/users/${id}/reset-password`),
  getSessions: (id: string) => apiClient.get(`/users/${id}/sessions`),
};

// System API
export const systemApi = {
  getMetrics: (timeRange: string) => apiClient.get(`/system/metrics?range=${timeRange}`),
  getHealth: () => apiClient.get('/system/health'),
  getAlerts: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiClient.get(`/system/alerts${query}`);
  },
  acknowledgeAlert: (id: string) => apiClient.patch(`/system/alerts/${id}/acknowledge`),
  resolveAlert: (id: string) => apiClient.patch(`/system/alerts/${id}/resolve`),
  getLogs: (level?: string) => {
    const query = level ? `?level=${level}` : '';
    return apiClient.get(`/system/logs${query}`);
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: (timeRange: string) => apiClient.get(`/analytics/dashboard?range=${timeRange}`),
  getTrafficSources: (timeRange: string) => apiClient.get(`/analytics/traffic-sources?range=${timeRange}`),
  getTopPages: (timeRange: string) => apiClient.get(`/analytics/top-pages?range=${timeRange}`),
  getConversionFunnel: (timeRange: string) => apiClient.get(`/analytics/conversion-funnel?range=${timeRange}`),
  exportData: (format: 'csv' | 'pdf' | 'excel', timeRange: string) => 
    apiClient.post(`/analytics/export?format=${format}&range=${timeRange}`),
};

// Settings API
export const settingsApi = {
  getAll: () => apiClient.get('/settings'),
  update: (data: any) => apiClient.put('/settings', data),
  getTheme: () => apiClient.get('/settings/theme'),
  updateTheme: (theme: any) => apiClient.put('/settings/theme', theme),
  getNotifications: () => apiClient.get('/settings/notifications'),
  updateNotifications: (notifications: any) => apiClient.put('/settings/notifications', notifications),
};

// Activity Logs API
export const activityApi = {
  getAll: (filters?: any) => {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get(`/activity${query}`);
  },
  getById: (id: string) => apiClient.get(`/activity/${id}`),
  export: (format: 'csv' | 'json', filters?: any) => {
    const query = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return apiClient.post(`/activity/export?format=${format}${query}`);
  },
};

// Export API
export const exportApi = {
  tenants: (format: 'csv' | 'excel') => apiClient.post(`/export/tenants?format=${format}`),
  users: (format: 'csv' | 'excel') => apiClient.post(`/export/users?format=${format}`),
  analytics: (format: 'csv' | 'pdf' | 'excel', timeRange: string) => 
    apiClient.post(`/export/analytics?format=${format}&range=${timeRange}`),
  reports: (type: string, format: 'pdf' | 'excel', timeRange: string) => 
    apiClient.post(`/export/reports?type=${type}&format=${format}&range=${timeRange}`),
};

// Import API
export const importApi = {
  tenants: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/import/tenants', formData);
  },
  users: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/import/users', formData);
  },
  validateImport: (file: File, type: 'tenants' | 'users') => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/import/validate?type=${type}`, formData);
  },
};

// Notification API
export const notificationApi = {
  getAll: () => apiClient.get('/notifications'),
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  create: (data: any) => apiClient.post('/notifications', data),
  getSettings: () => apiClient.get('/notifications/settings'),
  updateSettings: (settings: any) => apiClient.put('/notifications/settings', settings),
};

// Backup API
export const backupApi = {
  create: (type: 'full' | 'tenants' | 'users' | 'analytics') => 
    apiClient.post(`/backup/create?type=${type}`),
  getAll: () => apiClient.get('/backup'),
  download: (id: string) => apiClient.get(`/backup/${id}/download`),
  restore: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/backup/restore', formData);
  },
  delete: (id: string) => apiClient.delete(`/backup/${id}`),
  schedule: (data: any) => apiClient.post('/backup/schedule', data),
  getSchedules: () => apiClient.get('/backup/schedules'),
  updateSchedule: (id: string, data: any) => apiClient.put(`/backup/schedules/${id}`, data),
  deleteSchedule: (id: string) => apiClient.delete(`/backup/schedules/${id}`),
};

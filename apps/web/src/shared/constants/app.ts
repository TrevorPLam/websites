/**
 * @file apps/web/src/shared/constants/app.ts
 * @summary Application constants.
 * @description Common application constants.
 */

export const APP_NAME = 'Marketing Websites Platform'
export const APP_VERSION = '1.0.0'

export const API_ENDPOINTS = {
  LEADS: '/api/leads',
  USERS: '/api/users',
  CONTENT: '/api/content',
  ANALYTICS: '/api/analytics',
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
} as const

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

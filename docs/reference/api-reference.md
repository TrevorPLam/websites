---
title: API Reference
description: Complete API reference for the marketing websites platform
last_updated: 2026-02-26
tags: [#reference #api #endpoints #documentation]
estimated_read_time: 30 minutes
difficulty: intermediate
---

# API Reference

## Overview

Complete API reference for all endpoints, data structures, and authentication methods used in the marketing websites platform.

## Base URLs

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging.example.com/api`
- **Production**: `https://api.example.com`

## Authentication

### OAuth 2.1 with PKCE

All API endpoints require authentication using OAuth 2.1 with PKCE flow.

```typescript
// Authorization Code Flow
const authUrl = `https://auth.example.com/oauth/authorize?` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256`

// Token Exchange
const tokenResponse = await fetch('https://auth.example.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: authCode,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri
  })
})
```

### API Keys

For server-to-server communication:

```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'X-API-Version': '2026-02-26'
}
```

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and return access token.

**Request Body**:
```typescript
interface LoginRequest {
  email: string
  password: string
  tenant_id?: string
}
```

**Response**:
```typescript
interface LoginResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  user: User
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body**:
```typescript
interface RefreshRequest {
  refresh_token: string
}
```

### Users

#### GET /users/me
Get current user profile.

**Response**:
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'viewer'
  tenant_id: string
  created_at: string
  updated_at: string
}
```

#### PUT /users/me
Update current user profile.

**Request Body**:
```typescript
interface UpdateUserRequest {
  name?: string
  email?: string
  preferences?: UserPreferences
}
```

### Sites

#### GET /sites
List all sites for current tenant.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (`active`, `inactive`, `archived`)

**Response**:
```typescript
interface SitesResponse {
  sites: Site[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

#### POST /sites
Create a new site.

**Request Body**:
```typescript
interface CreateSiteRequest {
  name: string
  domain: string
  config: SiteConfig
  template?: string
}
```

**Response**:
```typescript
interface Site {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive' | 'archived'
  config: SiteConfig
  created_at: string
  updated_at: string
  tenant_id: string
}
```

#### GET /sites/{id}
Get site details by ID.

**Response**: `Site` object

#### PUT /sites/{id}
Update site configuration.

**Request Body**: `UpdateSiteRequest`

#### DELETE /sites/{id}
Delete a site.

### Content

#### GET /sites/{siteId}/pages
List all pages for a site.

**Response**:
```typescript
interface PagesResponse {
  pages: Page[]
}
```

#### POST /sites/{siteId}/pages
Create a new page.

**Request Body**:
```typescript
interface CreatePageRequest {
  title: string
  slug: string
  content: string
  meta: PageMeta
  status: 'draft' | 'published'
}
```

#### GET /sites/{siteId}/pages/{pageId}
Get page details.

#### PUT /sites/{siteId}/pages/{pageId}
Update page content.

#### DELETE /sites/{siteId}/pages/{pageId}
Delete a page.

### Analytics

#### GET /analytics/sites/{siteId}/visitors
Get visitor analytics for a site.

**Query Parameters**:
- `start_date`: Start date (ISO 8601)
- `end_date`: End date (ISO 8601)
- `granularity`: `day`, `week`, `month`

**Response**:
```typescript
interface VisitorAnalytics {
  total_visitors: number
  unique_visitors: number
  page_views: number
  bounce_rate: number
  avg_session_duration: number
  data: AnalyticsDataPoint[]
}
```

#### GET /analytics/sites/{siteId}/performance
Get performance metrics.

**Response**:
```typescript
interface PerformanceAnalytics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  score: number // Overall performance score
}
```

### Forms

#### GET /sites/{siteId}/forms
List all forms for a site.

#### POST /sites/{siteId}/forms
Create a new form.

**Request Body**:
```typescript
interface CreateFormRequest {
  name: string
  fields: FormField[]
  settings: FormSettings
}
```

#### POST /sites/{siteId}/forms/{formId}/submit
Submit form data.

**Request Body**: Form submission data

**Response**:
```typescript
interface FormSubmissionResponse {
  id: string
  status: 'success' | 'error'
  message?: string
}
```

## Data Structures

### SiteConfig

```typescript
interface SiteConfig {
  site: {
    name: string
    description: string
    logo?: string
    favicon?: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    og_image?: string
  }
  theme: {
    primary_color: string
    secondary_color: string
    font_family: string
  }
  company: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  integrations: {
    google_analytics?: string
    facebook_pixel?: string
    hotjar?: string
  }
}
```

### Page

```typescript
interface Page {
  id: string
  site_id: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  meta: PageMeta
  created_at: string
  updated_at: string
}
```

### PageMeta

```typescript
interface PageMeta {
  title?: string
  description?: string
  keywords?: string[]
  og_image?: string
  canonical_url?: string
  no_index?: boolean
}
```

### FormField

```typescript
interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select fields
  validation?: {
    min_length?: number
    max_length?: number
    pattern?: string
  }
}
```

## Error Responses

All errors follow a consistent format:

```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
  request_id: string
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid request data
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate limited:

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Burst limit**: 10 requests per second

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Configuration

Webhooks can be configured to receive real-time notifications:

```typescript
interface WebhookConfig {
  url: string
  events: string[]
  secret: string
  active: boolean
}
```

### Events

- `site.created`
- `site.updated`
- `site.deleted`
- `page.published`
- `form.submitted`
- `user.created`

### Webhook Delivery

Webhook payloads are signed using HMAC-SHA256:

```typescript
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex')
```

Verify webhook signatures:

```typescript
const receivedSignature = request.headers['x-webhook-signature']
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(request.body)
  .digest('hex')

if (receivedSignature !== expectedSignature) {
  return { status: 401, body: 'Invalid signature' }
}
```

## SDKs

### JavaScript/TypeScript

```bash
npm install @repo/api-client
```

```typescript
import { MarketingWebsitesAPI } from '@repo/api-client'

const client = new MarketingWebsitesAPI({
  baseURL: 'https://api.example.com',
  apiKey: process.env.API_KEY
})

const sites = await client.sites.list()
```

### Python

```bash
pip install marketing-websites-sdk
```

```python
from marketing_websites import MarketingWebsitesAPI

client = MarketingWebsitesAPI(
    base_url='https://api.example.com',
    api_key='your-api-key'
)

sites = client.sites.list()
```

## Related Resources

- [Authentication Guide](../guides-new/security/authentication.md)
- [Integration Examples](../guides-new/integrations/)
- [Webhook Documentation](../guides-new/integrations/webhooks.md)

# Patterns Mappable to your-dedicated-marketer

**Analysis of which patterns from new apps can be directly applied to your-dedicated-marketer**

---

## Current your-dedicated-marketer State

### ✅ What your-dedicated-marketer Has
- **Next.js 15.5.2** with App Router
- **TypeScript** (strict mode)
- **Security middleware** with **nonce-based CSP** (more advanced than firm-template!)
- **Vitest** for testing
- **Playwright** for E2E
- **ESLint + Prettier** for linting/formatting
- **Sentry** for error tracking
- **Upstash Redis** for rate limiting
- **Supabase** integration (REST API for leads)
- **HubSpot** integration (CRM sync)
- **Blog functionality** (MDX-based)
- **Contact forms** with lead capture
- **Governance framework** (`.repo/` structure)
- **Extensive automation scripts** (intelligent, ultra, vibranium)

### ❌ What your-dedicated-marketer Lacks
- **No repository pattern** (uses direct Supabase REST calls)
- **No factory pattern** for providers (HubSpot is hardcoded)
- **No persistent configuration** (only environment variables)
- **No multi-provider abstraction** (can't easily switch CRM/email providers)

---

## 🎯 High-Priority Mappings

### 1. **Biome Configuration** (from cal.com)

**Why it fits:**
- Same as firm-template: currently uses **ESLint + Prettier** separately
- Biome is a **unified tool** that replaces both
- Better performance and simpler configuration
- Already TypeScript-focused

**What to extract:**
```json
// biome.json
{
  "formatter": {
    "lineWidth": 100,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "nursery": {
        "noUnresolvedImports": "warn"
      }
    }
  },
  "overrides": [
    {
      "includes": ["app/**/page.tsx", "app/**/layout.tsx"],
      "linter": {
        "rules": {
          "style": {
            "noDefaultExport": "off"
          }
        }
      }
    }
  ]
}
```

**Implementation Steps:**
1. Install Biome: `npm install --save-dev @biomejs/biome`
2. Replace ESLint config with `biome.json`
3. Replace Prettier with Biome formatter
4. Update `package.json` scripts
5. Remove ESLint and Prettier dependencies

**Files to modify:**
- `package.json` (scripts, dependencies)
- `eslint.config.mjs` → `biome.json` (replace)
- `.prettierrc` (remove)
- `.lintstagedrc.json` (update to use Biome)

**Benefits:**
- ✅ Single tool instead of two
- ✅ Faster linting/formatting
- ✅ Better TypeScript support
- ✅ Simpler configuration

---

### 2. **Repository Pattern for Supabase** (from cal.com, adapted)

**Why it fits:**
- Currently uses **direct Supabase REST calls** in `lib/supabase-leads.ts`
- Repository pattern provides **type safety** and **testability**
- Makes it easier to **switch databases** or **add caching**
- **Select-based queries** improve performance (when using Supabase client)

**Current State:**
```typescript
// lib/supabase-leads.ts (current)
export async function insertSupabaseLead(
  payload: Record<string, unknown>,
): Promise<SupabaseLeadRow> {
  const response = await fetch(getSupabaseLeadsUrl(), {
    method: 'POST',
    headers: buildSupabaseHeaders(),
    body: JSON.stringify([payload]),
  })
  // ...
}
```

**What to extract:**
```typescript
// lib/repositories/base-repository.ts
export interface IRepository<T, TWhere, TSelect, TCreate, TUpdate> {
  findById(id: string): Promise<T | null>
  findMany(where: TWhere): Promise<T[]>
  create(data: TCreate): Promise<T>
  update(where: TWhere, data: TUpdate): Promise<T>
  delete(where: TWhere): Promise<void>
}

export abstract class BaseRepository<T, TWhere, TSelect, TCreate, TUpdate>
  implements IRepository<T, TWhere, TSelect, TCreate, TUpdate>
{
  constructor(protected supabaseUrl: string, protected serviceRoleKey: string) {}

  protected buildHeaders(): Record<string, string> {
    return {
      apikey: this.serviceRoleKey,
      Authorization: `Bearer ${this.serviceRoleKey}`,
      'Content-Type': 'application/json',
    }
  }

  abstract findById(id: string): Promise<T | null>
  abstract findMany(where: TWhere): Promise<T[]>
  abstract create(data: TCreate): Promise<T>
  abstract update(where: TWhere, data: TUpdate): Promise<T>
  abstract delete(where: TWhere): Promise<void>
}
```

**Example implementation:**
```typescript
// lib/repositories/lead-repository.ts
import { BaseRepository } from './base-repository'
import { validatedEnv } from '../env'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  is_suspicious: boolean
  hubspot_sync_status: 'pending' | 'synced' | 'needs_sync'
  created_at: string
}

const leadMinimalSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  is_suspicious: true,
  hubspot_sync_status: true,
  created_at: true,
} as const

export class LeadRepository extends BaseRepository<
  Lead,
  { id?: string; email?: string },
  typeof leadMinimalSelect,
  Omit<Lead, 'id' | 'created_at'>,
  Partial<Omit<Lead, 'id' | 'created_at'>>
> {
  private readonly leadsPath = '/rest/v1/leads'

  constructor() {
    super(validatedEnv.SUPABASE_URL, validatedEnv.SUPABASE_SERVICE_ROLE_KEY)
  }

  async findById(id: string): Promise<Lead | null> {
    const response = await fetch(
      `${this.supabaseUrl}${this.leadsPath}?id=eq.${id}&select=${Object.keys(leadMinimalSelect).join(',')}`,
      {
        method: 'GET',
        headers: this.buildHeaders(),
      }
    )

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as Lead[]
    return data[0] || null
  }

  async create(data: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
    const response = await fetch(`${this.supabaseUrl}${this.leadsPath}`, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify([data]),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Supabase insert failed: ${errorText}`)
    }

    const result = (await response.json()) as Lead[]
    return result[0]
  }

  async update(
    where: { id: string },
    data: Partial<Omit<Lead, 'id' | 'created_at'>>
  ): Promise<void> {
    const response = await fetch(
      `${this.supabaseUrl}${this.leadsPath}?id=eq.${where.id}`,
      {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase update failed: ${response.status}`)
    }
  }

  // ... other methods
}
```

**Implementation Steps:**
1. Create `lib/repositories/` directory
2. Add base repository interface and class
3. Refactor `lib/supabase-leads.ts` to use `LeadRepository`
4. Update `lib/actions/supabase.ts` to use repository
5. Add tests for repository
6. Document pattern

**Files to create:**
- `lib/repositories/base-repository.ts`
- `lib/repositories/lead-repository.ts`
- `__tests__/lib/repositories/lead-repository.test.ts`
- `docs/patterns/repository-pattern.md`

**Files to modify:**
- `lib/supabase-leads.ts` (refactor to use repository)
- `lib/actions/supabase.ts` (use repository)

**Benefits:**
- ✅ Type-safe data access
- ✅ Easier testing (mock repository)
- ✅ Better performance (select vs full objects)
- ✅ Consistent patterns across codebase
- ✅ Easier to switch to Supabase client library later

---

### 3. **Factory Pattern for CRM Providers** (from esperanto)

**Why it fits:**
- Currently has **hardcoded HubSpot** integration
- Marketing sites often need **multiple CRM options** (HubSpot, Salesforce, Pipedrive, etc.)
- Factory pattern enables **easy provider switching**
- Reduces vendor lock-in

**Current State:**
```typescript
// lib/actions/hubspot.ts (current)
export async function retryHubSpotUpsert(...) {
  // Hardcoded HubSpot logic
}
```

**What to extract:**
```typescript
// lib/providers/crm/base.ts
export interface CRMProvider {
  upsertContact(properties: Record<string, unknown>): Promise<{ id: string }>
  getContact(id: string): Promise<Record<string, unknown> | null>
  updateContact(id: string, properties: Record<string, unknown>): Promise<void>
}

// lib/providers/crm/factory.ts
import { HubSpotProvider } from './hubspot'
import { SalesforceProvider } from './salesforce'
import { PipedriveProvider } from './pipedrive'

export type CRMProviderType = 'hubspot' | 'salesforce' | 'pipedrive'

export class CRMProviderFactory {
  static create(
    provider: CRMProviderType,
    config: Record<string, string>
  ): CRMProvider {
    switch (provider) {
      case 'hubspot':
        return new HubSpotProvider(config)
      case 'salesforce':
        return new SalesforceProvider(config)
      case 'pipedrive':
        return new PipedriveProvider(config)
      default:
        throw new Error(`Unknown CRM provider: ${provider}`)
    }
  }

  static createFromEnv(): CRMProvider {
    const provider = (process.env.CRM_PROVIDER || 'hubspot') as CRMProviderType
    const config = {
      apiKey: process.env.CRM_API_KEY || '',
      // ... other config
    }
    return this.create(provider, config)
  }
}

// lib/providers/crm/hubspot.ts
export class HubSpotProvider implements CRMProvider {
  constructor(private config: { apiKey: string }) {}

  async upsertContact(properties: Record<string, unknown>) {
    // HubSpot-specific implementation
    // Move logic from lib/actions/hubspot.ts
  }
}
```

**Implementation Steps:**
1. Create `lib/providers/crm/` directory
2. Define `CRMProvider` interface
3. Create factory class
4. Refactor HubSpot logic into `HubSpotProvider`
5. Update `lib/actions/supabase.ts` to use factory
6. Add environment variable for provider selection
7. Document pattern

**Files to create:**
- `lib/providers/crm/base.ts`
- `lib/providers/crm/factory.ts`
- `lib/providers/crm/hubspot.ts`
- `lib/providers/crm/salesforce.ts` (example, optional)
- `docs/patterns/factory-pattern.md`

**Files to modify:**
- `lib/actions/hubspot.ts` (refactor to provider)
- `lib/actions/supabase.ts` (use factory)
- `env.example` (add CRM_PROVIDER)

**Benefits:**
- ✅ Easy to switch CRM providers
- ✅ Reduces vendor lock-in
- ✅ Consistent interface across providers
- ✅ Easier to test (mock provider)
- ✅ Can support multiple CRMs simultaneously

---

### 4. **Factory Pattern for Email Providers** (from esperanto)

**Why it fits:**
- Marketing sites often send **transactional emails** (contact confirmations, newsletters)
- Multiple email providers available (SendGrid, Resend, AWS SES, Mailgun, etc.)
- Factory pattern enables **easy provider switching**

**What to extract:**
```typescript
// lib/providers/email/base.ts
export interface EmailProvider {
  sendEmail(params: {
    to: string
    from: string
    subject: string
    html: string
    text?: string
  }): Promise<{ messageId: string }>
}

// lib/providers/email/factory.ts
import { SendGridProvider } from './sendgrid'
import { ResendProvider } from './resend'
import { SESProvider } from './ses'

export type EmailProviderType = 'sendgrid' | 'resend' | 'ses' | 'mailgun'

export class EmailProviderFactory {
  static create(
    provider: EmailProviderType,
    config: Record<string, string>
  ): EmailProvider {
    switch (provider) {
      case 'sendgrid':
        return new SendGridProvider(config)
      case 'resend':
        return new ResendProvider(config)
      case 'ses':
        return new SESProvider(config)
      case 'mailgun':
        return new MailgunProvider(config)
      default:
        throw new Error(`Unknown email provider: ${provider}`)
    }
  }

  static createFromEnv(): EmailProvider {
    const provider = (process.env.EMAIL_PROVIDER || 'resend') as EmailProviderType
    const config = {
      apiKey: process.env.EMAIL_API_KEY || '',
      // ... other config
    }
    return this.create(provider, config)
  }
}
```

**Implementation Steps:**
1. Create `lib/providers/email/` directory
2. Define `EmailProvider` interface
3. Create factory class
4. Implement providers (start with one, add others as needed)
5. Update contact form to use email provider
6. Document pattern

**Files to create:**
- `lib/providers/email/base.ts`
- `lib/providers/email/factory.ts`
- `lib/providers/email/resend.ts` (example)
- `docs/patterns/email-provider.md`

**Benefits:**
- ✅ Easy to switch email providers
- ✅ Reduces vendor lock-in
- ✅ Consistent interface
- ✅ Easier to test

---

### 5. **Persistent Configuration** (from open-webui)

**Why it fits:**
- Currently uses **environment variables only**
- Some config should be **user-editable** (blog settings, SEO defaults, analytics config)
- Database-backed config allows **runtime changes** without redeployment
- Falls back to environment variables (backward compatible)

**What to extract:**
```typescript
// lib/config/persistent-config.ts
import { getConfig, saveConfig } from './config-db'

export class PersistentConfig<T> {
  private envValue: T
  private configPath: string
  private envName: string

  constructor(envName: string, configPath: string, envValue: T) {
    this.envName = envName
    this.configPath = configPath
    this.envValue = envValue
    
    // Try to load from database, fallback to env
    const dbValue = getConfigValue(configPath)
    this.value = dbValue ?? envValue
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    this._value = newValue
    saveConfig(this.configPath, newValue)
  }
}

// Usage
export const BLOG_POSTS_PER_PAGE = new PersistentConfig<number>(
  'BLOG_POSTS_PER_PAGE',
  'blog.postsPerPage',
  parseInt(process.env.BLOG_POSTS_PER_PAGE || '10')
)

export const SEO_DEFAULT_TITLE = new PersistentConfig<string>(
  'SEO_DEFAULT_TITLE',
  'seo.defaultTitle',
  process.env.SEO_DEFAULT_TITLE || 'Your Dedicated Marketer'
)
```

**Implementation Steps:**
1. Add Supabase table for config (or use existing)
2. Create `lib/config/persistent-config.ts`
3. Create `lib/config/config-db.ts` for database operations
4. Migrate existing env vars to PersistentConfig where appropriate
5. Add config management UI (optional, for blog settings)

**Files to create:**
- `lib/config/persistent-config.ts`
- `lib/config/config-db.ts`
- `app/api/config/route.ts` (API for config management)
- `docs/patterns/persistent-config.md`

**Benefits:**
- ✅ Runtime configuration changes
- ✅ User-editable settings (blog, SEO)
- ✅ Environment variable fallback
- ✅ Type-safe configuration

---

### 6. **Testing Patterns** (from cal.com)

**Why it fits:**
- Already uses **Vitest**
- Repository pattern makes testing easier
- Better test organization patterns

**What to extract:**
```typescript
// __tests__/lib/repositories/lead-repository.test.ts
import { describe, it, expect, vi } from 'vitest'
import { LeadRepository } from '@/lib/repositories/lead-repository'

describe('LeadRepository', () => {
  it('should create lead with minimal select', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
      }],
    })

    global.fetch = mockFetch

    const repo = new LeadRepository()
    const lead = await repo.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: null,
      message: 'Test message',
      is_suspicious: false,
      hubspot_sync_status: 'pending',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/rest/v1/leads'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )

    expect(lead.id).toBe('test-id')
  })
})
```

**Implementation Steps:**
1. Create test utilities for mocking Supabase
2. Add example repository tests
3. Document testing patterns
4. Add to testing guidelines

**Files to create:**
- `__tests__/lib/repositories/lead-repository.test.ts` (example)
- `__tests__/utils/mock-supabase.ts` (test utilities)
- `docs/testing/repository-pattern.md`

**Benefits:**
- ✅ Easier to test data access
- ✅ Better test performance
- ✅ Consistent testing patterns

---

## 🟡 Medium-Priority Mappings

### 7. **GraphQL Setup** (from hoppscotch)

**Why it fits:**
- Marketing sites might add **content management** features
- Better for **complex queries** (blog posts, search, filtering)
- Can expose **public API** for content

**When to implement:**
- When adding content management
- When needing complex queries
- When exposing public API

---

## 🔴 Low-Priority Mappings

### 8. **Plugin System** (from eliza)

**Why it's low priority:**
- your-dedicated-marketer is a **marketing site template**
- Plugin system adds **complexity**
- Most users won't need extensibility

**When to implement:**
- If becomes a framework
- If users request plugin support

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 days)
1. ✅ **Biome Configuration**
   - Replace ESLint + Prettier
   - Update scripts
   - Test linting/formatting

### Phase 2: Foundation (3-5 days)
2. ✅ **Repository Pattern for Supabase**
   - Create base repository
   - Refactor `lib/supabase-leads.ts`
   - Add tests
   - Document pattern

3. ✅ **Testing Patterns**
   - Add test utilities
   - Document testing guidelines
   - Add example tests

### Phase 3: Provider Abstraction (1 week)
4. ✅ **Factory Pattern for CRM**
   - Create CRM provider interface
   - Refactor HubSpot to provider
   - Add factory
   - Document pattern

5. ✅ **Factory Pattern for Email**
   - Create email provider interface
   - Implement providers
   - Add factory
   - Document pattern

### Phase 4: Enhancement (1 week)
6. ✅ **Persistent Configuration**
   - Add Supabase table for config
   - Create PersistentConfig class
   - Add API routes
   - Document usage

### Phase 5: Future (as needed)
7. ⏳ **GraphQL** (when needed)
8. ⏳ **Plugin System** (if becomes framework)

---

## Summary

### Immediate Actions
1. **Replace ESLint + Prettier with Biome** (high impact, low effort)
2. **Add repository pattern for Supabase** (foundation for data access)
3. **Add factory pattern for CRM** (enables multi-provider support)
4. **Add factory pattern for Email** (enables multi-provider support)

### Future Considerations
- Persistent configuration when adding user-editable settings
- GraphQL when adding content management
- Plugin system if template becomes framework

---

## Files to Create/Modify

### New Files
```
lib/
├── repositories/
│   ├── base-repository.ts
│   └── lead-repository.ts
├── providers/
│   ├── crm/
│   │   ├── base.ts
│   │   ├── factory.ts
│   │   └── hubspot.ts
│   └── email/
│       ├── base.ts
│       ├── factory.ts
│       └── resend.ts
└── config/
    ├── persistent-config.ts
    └── config-db.ts

__tests__/
├── lib/
│   └── repositories/
│       └── lead-repository.test.ts
└── utils/
    └── mock-supabase.ts

docs/
├── patterns/
│   ├── repository-pattern.md
│   ├── factory-pattern.md
│   └── persistent-config.md
└── testing/
    └── repository-pattern.md
```

### Modified Files
```
package.json (scripts, dependencies)
eslint.config.mjs → biome.json (replace)
.prettierrc (remove)
.lintstagedrc.json (update)
lib/supabase-leads.ts (refactor to use repository)
lib/actions/hubspot.ts (refactor to provider)
lib/actions/supabase.ts (use factory)
env.example (add CRM_PROVIDER, EMAIL_PROVIDER)
```

---

## Key Differences from firm-template

1. **Supabase instead of Prisma**
   - Repository pattern adapted for Supabase REST API
   - Can switch to Supabase client library later

2. **CRM Integration**
   - Factory pattern for CRM providers (HubSpot, Salesforce, etc.)
   - More relevant for marketing sites

3. **Email Providers**
   - Factory pattern for email providers (SendGrid, Resend, etc.)
   - Marketing sites send more emails

4. **Nonce-based CSP**
   - Already more advanced than firm-template
   - No changes needed here

---

**Last Updated:** 2024-12-19  
**Target:** your-dedicated-marketer  
**Source Repositories:** cal.com, esperanto, open-webui, hoppscotch

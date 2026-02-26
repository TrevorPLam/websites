# Master Documentation Guide

> **Complete Technical Documentation for Marketing Websites Platform — February 2026**

## Overview

This master guide consolidates all technical documentation for the multi-tenant Next.js 16 marketing platform. It provides comprehensive coverage of architecture, implementation patterns, and best practices for building scalable, secure, and performant SaaS applications.

## 📚 Table of Contents

### 🏗️ Architecture & Foundation

- [Feature-Sliced Design v2.1](#feature-sliced-design-v21)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [System Architecture Patterns](#system-architecture-patterns)
- [Build System & Monorepo](#build-system--monorepo)

### 🔧 Backend & Data Integration

- [Backend Integration Guide](#backend-integration-guide)
- [Database Architecture](#database-architecture)
- [API Integration Patterns](#api-integration-patterns)
- [Caching & Performance](#caching--performance)

### 🎨 Frontend Development

- [Frontend Implementation Guide](#frontend-implementation-guide)
- [React 19 & Next.js 16](#react-19--nextjs-16)
- [Component Architecture](#component-architecture)
- [Performance Optimization](#performance-optimization)

### 🔒 Security & Compliance

- [Security Implementation Guide](#security-implementation-guide)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Compliance Standards](#compliance-standards)

### 📧 Email & Communication

- [Email Integration Guide](#email-integration-guide)
- [Multi-Tenant Email Routing](#multi-tenant-email-routing)
- [Template Management](#template-management)
- [Delivery Analytics](#delivery-analytics)

### 💳 Payments & Billing

- [Payments Integration Guide](#payments-integration-guide)
- [Stripe Integration](#stripe-integration)
- [Subscription Management](#subscription-management)
- [Billing Analytics](#billing-analytics)

### 🔍 SEO & Metadata

- [SEO Optimization Guide](#seo-optimization-guide)
- [Metadata Generation](#metadata-generation)
- [Structured Data](#structured-data)
- [AI Search Optimization](#ai-search-optimization)

### 🤖 AI & Automation

- [AI Integration Guide](#ai-integration-guide)
- [Agent Context Management](#agent-context-management)
- [Automation Patterns](#automation-patterns)
- [Cold-Start Optimization](#cold-start-optimization)

### 📊 Testing & Quality Assurance

- [Testing Strategies](#testing-strategies)
- [Quality Assurance](#quality-assurance)
- [CI/CD Integration](#cicd-integration)
- [Performance Testing](#performance-testing)

### 🏢 Infrastructure & DevOps

- [Infrastructure Patterns](#infrastructure-patterns)
- [Deployment Strategies](#deployment-strategies)
- [Monitoring & Observability](#monitoring--observability)
- [Scaling Patterns](#scaling-patterns)

---

## 🏗️ Architecture & Foundation

### Feature-Sliced Design v2.1

**Location**: `docs/guides/best-practices/feature-sliced-design-docs.md`

Feature-Sliced Design (FSD) is a methodology for structuring frontend applications with clear separation of concerns. Our implementation follows FSD v2.1 with strict layer organization.

#### Core Layers

1. **app** - Application-wide configuration and providers
2. **pages** - Page-level components and routing
3. **widgets** - Composed UI components
4. **features** - Business logic and user interactions
5. **entities** - Domain entities and business rules
6. **shared** - Reusable utilities and types

#### Import Rules

```typescript
// ✅ Correct: Unidirectional dependencies
import { Button } from '@/shared/ui';
import { UserCard } from '@/entities/user';
import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/widgets/auth';
import { LoginPage } from '@/pages/auth';

// ❌ Incorrect: Reverse dependencies
import { LoginPage } from '@/pages/auth'; // From feature layer
```

#### @x Notation for Cross-Slice Imports

```typescript
// Cross-slice import using @x notation
import { UserEntity } from '@x/entities/user';
import { AuthFeature } from '@x/features/auth';
```

### Multi-Tenant Architecture

**Location**: `docs/guides/multi-tenant/`

Our multi-tenant architecture supports thousands of clients with shared infrastructure and isolated data.

#### Tenant Resolution

```typescript
// Tenant resolution priority
1. Custom domain (client.com)
2. Subdomain (client.app.com)
3. Path prefix (app.com/client)
4. Header/cookie fallback
```

#### Data Isolation

- **Row Level Security**: Database-level tenant isolation
- **Cache Isolation**: Tenant-scoped caching keys
- **File Storage**: Separate storage buckets per tenant
- **API Rate Limiting**: Per-tenant rate limiting

### System Architecture Patterns

**Location**: `docs/guides/architecture/`

#### Decision Records (ADRs)

All architectural decisions are documented using Architecture Decision Records (ADRs) for transparency and maintainability.

#### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Service creation
- **Observer Pattern**: Event-driven architecture
- **Strategy Pattern**: Algorithm selection

### Build System & Monorepo

**Location**: `docs/guides/build-monorepo/`

#### Turborepo Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

#### Package Management

- **pnpm**: Fast, disk space efficient package manager
- **Workspace Protocol**: Efficient dependency resolution
- **Changesets**: Automated version management

---

## 🔧 Backend & Data Integration

### Backend Integration Guide

**Location**: `docs/guides/backend-data/backend-integration-guide.md`

Comprehensive backend integration covering databases, APIs, caching, and third-party services.

#### Database Integration

```typescript
// Tenant-aware database client
export class TenantDatabase {
  constructor(private tenantId: string) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = await pool.connect();

    try {
      // Set tenant context for RLS
      await client.query('SET app.current_tenant_id = $1', [this.tenantId]);
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
```

#### Caching Strategies

Multi-layer caching with Redis:

- **L1 Cache**: In-memory cache (60s TTL)
- **L2 Cache**: Redis cache (1h TTL)
- **L3 Cache**: Database cache (24h TTL)

### Database Architecture

**Location**: `docs/guides/backend-data/databases/`

#### PostgreSQL with RLS

Row Level Security (RLS) ensures tenant data isolation:

```sql
-- Tenant isolation policy
CREATE POLICY tenant_isolation_policy ON users
  FOR ALL
  TO authenticated_user
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

#### Connection Pooling

PgBouncer/Supavisor configuration for optimal performance:

- **Transaction Mode**: Best for web applications
- **Connection Limits**: 20 max, 5 min connections
- **Timeout Settings**: 2s connection, 30s idle

### API Integration Patterns

**Location**: `docs/guides/backend-data/integrations/`

#### OAuth 2.1 with PKCE

```typescript
export class OAuth2Client {
  generatePKCE(): { verifier: string; challenge: string } {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    return { verifier, challenge };
  }
}
```

#### Rate Limiting

Sliding window algorithm for burst protection:

```typescript
class SlidingWindowRateLimiter {
  async isAllowed(identifier: string): Promise<{ allowed: boolean }> {
    const now = Math.floor(Date.now() / 1000);
    await this.redis.zremrangebyscore(key, 0, now - window);
    const current = await this.redis.zcard(key);
    return current < maxRequests;
  }
}
```

### Caching & Performance

**Location**: `docs/guides/backend-data/caching/`

#### Redis Integration

```typescript
export class CacheManager {
  async getWithFallback<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Try memory cache first
    let value = await this.get<T>(key);
    if (value) return value;

    // Try Redis cache
    value = await this.get<T>(key);
    if (value) return value;

    // Fetch from database
    value = await fetcher();
    await this.set(key, value);
    return value;
  }
}
```

---

## 🎨 Frontend Development

### Frontend Implementation Guide

**Location**: `docs/guides/frontend/frontend-implementation-guide.md`

Modern frontend development with Next.js 16, React 19, and TypeScript.

#### React 19 Server Components

```typescript
// Server Component - Default pattern
export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Client Component for interactivity
'use client';

export function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    await followUser(userId);
    setIsFollowing(!isFollowing);
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

#### Performance Optimization

- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Regular size monitoring

### React 19 & Next.js 16

**Location**: `docs/guides/frontend/react/`

#### New React 19 Features

- **useActionState**: Form state management
- **useFormStatus**: Form submission status
- **Server Components**: Default rendering pattern
- **React Compiler**: Automatic optimization

#### Next.js 16 Features

- **Partial Pre-rendering (PPR)**: Static shell + dynamic content
- **Turbopack**: Fast bundler
- **App Router**: Recommended routing pattern
- **Server Actions**: Mutations without client-side JavaScript

### Component Architecture

**Location**: `docs/guides/frontend/`

#### Component Patterns

```typescript
// Compound Component Pattern
export function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

#### Accessibility Patterns

- **Semantic HTML**: Proper element usage
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard access
- **Focus Management**: Logical focus flow

### Performance Optimization

**Location**: `docs/guides/frontend/performance/`

#### Core Web Vitals

- **LCP < 2.5s**: Largest contentful paint
- **INP < 200ms**: Interaction to next paint
- **CLS < 0.1**: Cumulative layout shift

#### Optimization Techniques

```typescript
// Image optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>

// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

---

## 🔒 Security & Compliance

### Security Implementation Guide

**Location**: `docs/guides-new/security/security-patterns-guide.md`

Production-ready security implementation with defense-in-depth architecture.

#### Security Headers

```typescript
export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();
  const nonce = crypto.randomBytes(16).toString('base64');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
    ].join('; ')
  );

  // Additional headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}
```

#### Secrets Management

```typescript
export class SecretsManager {
  encrypt(secret: string, tenantId: string): EncryptedData {
    const tenantKey = crypto
      .createHash('sha256')
      .update(tenantId + this.encryptionKey)
      .digest();

    const cipher = crypto.createCipher('aes-256-gcm', tenantKey);
    // ... encryption logic
  }
}
```

### Authentication & Authorization

**Location**: `docs/guides/security/authentication/`

#### OAuth 2.1 Implementation

```typescript
export class AuthService {
  async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    return response.json();
  }
}
```

#### Multi-Tenant Authorization

```typescript
export function authorizeTenant(tenantId: string) {
  return async (request: NextRequest) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.tenantId !== tenantId) {
      throw new Error('Unauthorized tenant access');
    }

    return decoded;
  };
}
```

### Data Protection

**Location**: `docs/guides/security/encryption/`

#### Encryption at Rest

- **Database Encryption**: Column-level encryption
- **File Storage**: Server-side encryption
- **Backup Encryption**: Encrypted backups

#### Data Masking

```typescript
export function maskSensitiveData(data: any): any {
  return {
    ...data,
    email: maskEmail(data.email),
    phone: maskPhone(data.phone),
    ssn: maskSSN(data.ssn),
  };
}

function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  return `${username.slice(0, 2)}***@${domain}`;
}
```

### Compliance Standards

**Location**: `docs/guides/security/compliance/`

#### GDPR/CCPA Compliance

- **Data Portability**: Export user data
- **Right to Deletion**: Remove user data
- **Consent Management**: Track user consent
- **Data Processing Records**: Maintain audit logs

#### SOC 2 Compliance

- **Security Controls**: Access management
- **Availability Controls**: Backup and recovery
- **Processing Integrity**: Data validation
- **Confidentiality**: Data encryption

---

## 📧 Email & Communication

### Email Integration Guide

**Location**: `docs/guides/email/email-integration-guide.md`

Comprehensive email integration covering multiple providers, templates, and multi-tenant routing.

#### Multi-Provider Support

```typescript
export class EmailService {
  private providers: Map<string, EmailProvider> = new Map();

  constructor() {
    this.providers.set('postmark', new PostmarkEmailProvider());
    this.providers.set('resend', new ResendEmailProvider());
  }

  async sendEmail(params: EmailParams, provider?: string): Promise<EmailResult> {
    const selectedProvider = provider || this.defaultProvider;
    const emailProvider = this.providers.get(selectedProvider);

    const tenantConfig = await this.getTenantConfig(params.tenantId);
    const brandedParams = await this.applyTenantBranding(params, tenantConfig);

    return emailProvider.sendEmail(brandedParams);
  }
}
```

#### Template Management

```typescript
// React Email template
export function WelcomeEmail({ userName, tenantName }: WelcomeEmailProps) {
  return (
    <Email>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1>Welcome to {tenantName}!</h1>
        <p>Hi {userName},</p>
        <p>Thank you for joining our platform.</p>
      </div>
    </Email>
  );
}
```

### Multi-Tenant Email Routing

**Location**: `docs/guides/email/`

#### Tenant-Aware Routing

```typescript
export class EmailRouter {
  async routeEmail(tenantId: string, params: EmailParams): Promise<EmailResult> {
    const tenantConfig = await this.loadTenantConfig(tenantId);
    const provider = this.selectProvider(tenantConfig, params);
    const routedParams = await this.applyRoutingRules(tenantId, params, tenantConfig);

    return this.emailService.sendEmail(
      {
        ...routedParams,
        tenantId,
      },
      provider
    );
  }
}
```

#### Branding Integration

- **Dynamic Branding**: Tenant-specific logos and colors
- **Custom Domains**: Per-tenant sending domains
- **Template Customization**: Tenant-specific templates

### Template Management

**Location**: `docs/guides/email/`

#### React Email Integration

```typescript
export class EmailTemplateService {
  async renderTemplate(
    templateId: string,
    data: Record<string, any>,
    tenantBranding?: TenantBranding
  ): Promise<{ html: string; text: string }> {
    const templateData = { ...data, ...tenantBranding };
    const html = render(this.getTemplate(templateId, templateData));
    const text = this.generateTextVersion(html);

    return { html, text };
  }
}
```

### Delivery Analytics

**Location**: `docs/guides/email/`

#### Email Analytics

```typescript
export class EmailAnalytics {
  async getTenantStats(tenantId: string): Promise<EmailStats> {
    const [sent, delivered, opened, clicked] = await Promise.all([
      this.getSentCount(tenantId),
      this.getDeliveredCount(tenantId),
      this.getOpenedCount(tenantId),
      this.getClickedCount(tenantId),
    ]);

    return {
      sent,
      delivered,
      opened,
      clicked,
      deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
    };
  }
}
```

---

## 💳 Payments & Billing

### Payments Integration Guide

**Location**: `docs/guides/payments-billing/payments-integration-guide.md`

Complete payment processing with Stripe, checkout sessions, and subscription management.

#### Stripe Integration

```typescript
export class PaymentIntentService {
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency || 'usd',
      customer: params.customerId,
      metadata: {
        tenantId: params.tenantId,
        invoiceId: params.invoiceId || '',
      },
      automatic_payment_methods: { enabled: true },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }
}
```

#### Checkout Sessions

```typescript
export class CheckoutService {
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: params.customerEmail,
      mode: params.mode || 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { tenantId: params.tenantId },
    };

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return {
      success: true,
      sessionId: session.id,
      url: session.url!,
    };
  }
}
```

### Stripe Integration

**Location**: `docs/guides/payments-billing/`

#### Payment Processing

- **Payment Intents**: Secure payment processing
- **Webhook Handling**: Event processing
- **Error Handling**: Graceful failure management
- **Security**: PCI compliance

#### Customer Portal

```typescript
export class CustomerPortalService {
  async createPortalSession(params: CreatePortalSessionParams): Promise<PortalSessionResult> {
    const customerId = await this.getOrCreateCustomer(params.tenantId, params.customerEmail);

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: params.returnUrl,
    });

    return { success: true, url: session.url };
  }
}
```

### Subscription Management

**Location**: `docs/guides/payments-billing/`

#### Subscription Lifecycle

```typescript
export class SubscriptionService {
  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;

    await db.tenantSubscriptions.update({
      where: { tenantId },
      data: {
        status: 'active',
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }
}
```

### Billing Analytics

**Location**: `docs/guides/payments-billing/`

#### Revenue Tracking

```typescript
export class BillingAnalytics {
  async getRevenueMetrics(tenantId?: string): Promise<RevenueMetrics> {
    const whereClause = tenantId
      ? { tenantId, createdAt: { gte: startDate } }
      : { createdAt: { gte: startDate } };

    const [totalRevenue, activeSubscriptions, churnRate, mrr] = await Promise.all([
      this.getTotalRevenue(whereClause),
      this.getActiveSubscriptions(whereClause),
      this.getChurnRate(whereClause),
      this.getMonthlyRecurringRevenue(whereClause),
    ]);

    return { totalRevenue, activeSubscriptions, churnRate, monthlyRecurringRevenue: mrr };
  }
}
```

---

## 🔍 SEO & Metadata

### SEO Optimization Guide

**Location**: `docs/guides/seo-metadata/seo-optimization-guide.md`

Comprehensive SEO optimization covering metadata, structured data, and AI search optimization.

#### Metadata Generation

```typescript
export class MetadataFactory {
  generateMetadata(config: Partial<MetadataConfig>): Metadata {
    return {
      title: config.title,
      description: config.description,
      openGraph: {
        title: config.title,
        description: config.description,
        images: config.image ? [{ url: config.image, width: 1200, height: 630 }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
      },
    };
  }
}
```

#### Dynamic Sitemaps

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenants = await db.tenants.findMany({
    where: { status: 'active', seo: { noIndex: false } },
    include: { pages: true, services: true, blogPosts: true },
  });

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const tenant of tenants) {
    sitemapEntries.push({
      url: `${baseUrl}/${tenant.subdomain}`,
      lastModified: tenant.updatedAt,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  return sitemapEntries;
}
```

### Metadata Generation

**Location**: `docs/guides/seo-metadata/`

#### Tenant-Aware Metadata

```typescript
export class TenantMetadataService {
  generatePageMetadata(pageType: string, pageData: any): Metadata {
    switch (pageType) {
      case 'home':
        return this.generateMetadata({
          title: `${this.tenantConfig.branding?.companyName} | Home`,
          description: this.tenantConfig.branding?.tagline,
        });
      case 'service':
        return this.generateMetadata({
          title: `${pageData.name} | ${this.tenantConfig.branding?.companyName}`,
          description: pageData.description,
        });
    }
  }
}
```

### Structured Data

**Location**: `docs/guides/seo-metadata/`

#### Schema.org Implementation

```typescript
export class StructuredDataService {
  generateOrganizationSchema(tenantConfig: TenantConfig): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: tenantConfig.branding?.companyName,
      description: tenantConfig.branding?.description,
      url: tenantConfig.websiteUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: tenantConfig.contact?.phone,
        contactType: 'customer service',
      },
    };
  }
}
```

### AI Search Optimization

**Location**: `docs/guides/seo-metadata/`

#### Generative Engine Optimization

```typescript
export class GEOService {
  async generateLLMsTxt(tenantId: string): Promise<string> {
    const tenant = await this.getTenantWithContent(tenantId);

    return `# LLMs.txt for ${tenant.branding?.companyName}

## Company Information
${tenant.branding?.companyName} specializes in ${tenant.services?.map((s) => s.name).join(', ')}.

## Services Offered
${tenant.services
  ?.map(
    (service) => `
### ${service.name}
${service.description}
`
  )
  .join('\n')}
`;
  }
}
```

---

## 🤖 AI & Automation

### AI Integration Guide

**Location**: `docs/guides/ai-automation/ai-integration-guide.md`

Practical AI agent patterns for development workflows and automation.

#### Agent Context Management

```typescript
export class AIContextLoader {
  async loadContext(packageName?: string): Promise<AIContext> {
    const root = await this.loadRootContext();
    const packageContext = packageName ? await this.loadPackageContext(packageName) : '';
    const subAgents = await this.loadSubAgents();

    return { root, package: packageContext, subAgents };
  }
}
```

#### Sub-Agent Definitions

```markdown
## FSD Enforcer Agent

**Trigger**: File creation or modification in packages/
**Rules**:

- Enforce FSD v2.1 layer structure
- Validate import directions
- Check @x notation for cross-slice imports

## A11y Auditor Agent

**Trigger**: UI component changes
**Rules**:

- Validate WCAG 2.2 AA compliance
- Check semantic HTML structure
- Verify keyboard navigation
```

### Agent Context Management

**Location**: `docs/guides/ai-automation/`

#### Hierarchical Context Structure

```markdown
# Root AGENTS.md (Master coordination - 60 lines max)

## Repository Overview

Multi-tenant Next.js 16 marketing platform with FSD v2.1 architecture.

## Quick Start Commands

pnpm install
pnpm dev
pnpm build
pnpm test

## Per-Package AGENTS.md References

See packages/\*/AGENTS.md for package-specific guidance.
```

### Automation Patterns

**Location**: `docs/guides/ai-automation/`

#### GitHub Copilot Integration

```typescript
// .github/copilot-instructions.md
## Architecture Guidelines
- Follow Feature-Sliced Design v2.1
- Use TypeScript strict mode
- Implement proper error handling
- Add comprehensive tests

## Code Patterns
export async function createAction(input: CreateInput) {
  const validated = createSchema.parse(input);
  const result = await createRecord(validated);
  return result;
}
```

### Cold-Start Optimization

**Location**: `docs/guides/ai-automation/`

#### Fast Initialization Pattern

```typescript
export class AIColdStart {
  private contextCache: Map<string, AIContext> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getOptimizedContext(packageName?: string): Promise<AIContext> {
    const cacheKey = packageName || 'root';
    const now = Date.now();

    if (this.contextCache.has(cacheKey) && now - this.lastRefresh < this.CACHE_TTL) {
      return this.contextCache.get(cacheKey)!;
    }

    const context = await this.loadFreshContext(packageName);
    this.contextCache.set(cacheKey, context);
    return context;
  }
}
```

---

## 📊 Testing & Quality Assurance

### Testing Strategies

**Location**: `docs/guides/testing/`

#### Unit Testing

```typescript
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const user = await userService.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

#### Integration Testing

```typescript
describe('User API Integration', () => {
  it('should create user via API', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body.name).toBe('John');
  });
});
```

### Quality Assurance

**Location**: `docs/guides/testing/`

#### Code Quality Checks

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Steiger**: FSD architecture validation

#### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

it('should be accessible', async () => {
  const { container } = render(<UserProfile />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### CI/CD Integration

**Location**: `docs/guides/infrastructure-devops/github-workflows.md`

#### GitHub Actions Workflow

```yaml
name: Test and Build
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

### Performance Testing

**Location**: `docs/guides/testing/`

#### Core Web Vitals Testing

```typescript
import { getMetrics } from 'web-vitals';

export function reportWebVitals() {
  getMetrics((metric) => {
    console.log(metric);
    // Send to analytics service
  });
}
```

---

## 🏢 Infrastructure & DevOps

### Infrastructure Patterns

**Location**: `docs/guides/infrastructure-devops/`

#### Infrastructure as Code

```hcl
# Terraform configuration
resource "vercel_project" "main" {
  name = "marketing-platform"
  framework = "nextjs"

  build_command = "pnpm build"
  output_directory = ".next"

  environment_variables = {
    NODE_ENV = "production"
  }
}
```

#### Container Orchestration

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm build

FROM base AS runner
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Deployment Strategies

**Location**: `docs/guides/infrastructure-devops/`

#### Blue-Green Deployment

- **Zero Downtime**: Seamless deployment
- **Rollback Capability**: Quick rollback if issues
- **Health Checks**: Automated health verification
- **Traffic Splitting**: Gradual traffic migration

#### Canary Releases

```typescript
// Feature flag for canary deployment
const isCanary = process.env.CANARY_RELEASE === 'true';

export function useNewFeature() {
  return isCanary || featureFlag.isEnabled('new-feature');
}
```

### Monitoring & Observability

**Location**: `docs/guides/observability/`

#### OpenTelemetry Integration

```typescript
// instrumentation.ts
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('marketing-platform');

export function withTracing<T extends (...args: any[]) => any>(name: string, fn: T): T {
  return ((...args: any[]) => {
    const span = tracer.startSpan(name);
    try {
      const result = fn(...args);
      span.end();
      return result;
    } catch (error) {
      span.recordException(error);
      span.end();
      throw error;
    }
  }) as T;
}
```

#### Error Tracking

```typescript
// Sentry configuration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Scaling Patterns

**Location**: `docs/guides/infrastructure-devops/`

#### Horizontal Scaling

- **Load Balancing**: Distribute traffic
- **Auto Scaling**: Dynamic resource allocation
- **Database Sharding**: Distribute data load
- **CDN Integration**: Global content delivery

#### Performance Optimization

```typescript
// Redis caching for scalability
export class CacheService {
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const data = await fetcher();
    await this.redis.setex(key, ttl, JSON.stringify(data));
    return data;
  }
}
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation Setup

- [ ] **Architecture**: Implement FSD v2.1 structure
- [ ] **Database**: Set up PostgreSQL with RLS
- [ ] **Authentication**: Configure OAuth 2.1 with PKCE
- [ ] **Security**: Implement security headers and middleware
- [ ] **CI/CD**: Set up GitHub Actions workflows

### Phase 2: Core Features

- [ ] **Multi-Tenancy**: Implement tenant resolution and isolation
- [ ] **Frontend**: Set up Next.js 16 with React 19
- [ ] **Email**: Configure multi-provider email service
- [ ] **Payments**: Integrate Stripe payment processing
- [ ] **SEO**: Implement metadata and structured data

### Phase 3: Advanced Features

- [ ] **AI Integration**: Set up AI agents and context management
- [ ] **Analytics**: Implement tracking and monitoring
- [ ] **Performance**: Optimize Core Web Vitals
- [ ] **Testing**: Add comprehensive test coverage
- [ ] **Documentation**: Complete technical documentation

### Phase 4: Production Ready

- [ ] **Security Audit**: Conduct security assessment
- [ ] **Performance Testing**: Load testing and optimization
- [ ] **Monitoring**: Set up production monitoring
- [ ] **Backup Strategy**: Implement backup and recovery
- [ ] **Compliance**: Ensure regulatory compliance

---

## 🔗 References & Resources

### Documentation Standards

- **2026 Compliance**: All documentation follows 2026 standards
- **Authoritative Sources**: References to official documentation
- **Practical Examples**: Production-ready code examples
- **TypeScript First**: Full type safety throughout

### Best Practices

- **Security First**: Defense-in-depth security architecture
- **Performance Optimized**: Core Web Vitals compliance
- **Accessibility**: WCAG 2.2 AA compliance
- **Scalability**: Multi-tenant architecture patterns

### Support & Community

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Keep documentation up to date
- **Contributing**: Follow contribution guidelines
- **Code Review**: All changes require review

---

This master documentation guide provides comprehensive coverage of the marketing websites platform while maintaining logical organization and eliminating redundant documentation. Each section references detailed implementation guides for specific topics.

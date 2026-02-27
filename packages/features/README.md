---
doc_id: "FEATURES-2026-PACKAGE-README"
doc_version: "2.0.0"
last_updated: "2026-02-27"
next_review: "2026-05-27"
document_owner: "features-team@marketing-websites.com"

# Bimodal Classification
ai_readiness_score: 0.89
human_ttv_seconds: 18
bimodal_grade: "A"

# Technical Context
type: package
language: typescript
framework: react
runtime: browser
complexity: component

# Compliance & Governance
compliance_frameworks:
- "SOC2-Type-II"
- "GDPR-Article-32"
- "ISO-27001"
- "WCAG-2.2-AA"
- "EU-AI-Act-High-Risk"
risk_classification: "medium-risk"
data_governance: "PII-Encrypted"

# AI Retrieval Optimization
rag_optimization:
  chunk_strategy: "recursive-headers"
  chunk_size: 800
  chunk_overlap: 120
  late_chunking: true
  embedding_model: "text-embedding-3-large"
  hybrid_search: true

# Executable Documentation
executable_status: true
ci_validation: true
last_executed: "2026-02-27T13:45:00Z"

# Maintenance & Quality
maintenance_mode: "active"
stale_threshold_days: 90
audit_trail: "github-actions"
---

# @repo/features

**Version:** 1.0.0  
**Last Updated:** 2026-02-27  
**Maintainers:** Development Team

---

## Overview

`@repo/features` is a comprehensive feature module library for the marketing-websites platform. It provides 20+ feature modules including booking systems, contact forms, blog functionality, analytics, and more. All features are built with React 19, TypeScript, and follow modern security and performance standards.

### Key Features

- **20+ Feature Modules:** Complete functionality for marketing websites
- **Multi-Tenant Ready:** Built-in tenant isolation and security
- **React 19 Compatible:** Server Components by default
- **TypeScript First:** Full type safety with comprehensive interfaces
- **Security Compliant:** OAuth 2.1, RLS, and input validation
- **Performance Optimized:** Server Components and code splitting

---

## Installation

```bash
pnpm add @repo/features
```

### Dependencies

- **React:** 19.0.0 (peer dependency)
- **React DOM:** 19.0.0 (peer dependency)
- **@repo/infra:** Security, middleware, and utilities
- **@repo/types:** Shared TypeScript types
- **@repo/utils:** Utility functions

---

## Usage

### Basic Usage

```typescript
import { BookingFeature, ContactFeature, BlogFeature } from '@repo/features';

export function MarketingWebsite() {
  return (
    <div>
      <BookingFeature provider="calendly" />
      <ContactFeature provider="hubspot" />
      <BlogFeature postsPerPage={10} />
    </div>
  );
}
```

### Feature Configuration

```typescript
import { createBookingFeature } from '@repo/features';

const BookingFeature = createBookingFeature({
  provider: 'calendly',
  configuration: {
    apiKey: process.env.CALENDLY_API_KEY,
    webhookSecret: process.env.CALENDLY_WEBHOOK_SECRET,
  },
  ui: {
    showCalendar: true,
    allowRescheduling: true,
    requireConfirmation: true,
  },
});
```

### Server vs Client Components

```typescript
// Server Component (default)
export function BlogList() {
  const posts = await getBlogPosts(); // Server-side data fetching

  return (
    <div>
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}

// Client Component (for interactivity)
'use client';
import { useState } from 'react';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Feature Modules

### Booking System

Complete booking and scheduling functionality with multiple provider support.

#### **Providers Supported**

- **Calendly:** Professional scheduling
- **Acuity:** Client management
- **Cal.com:** Open source scheduling

#### **API Reference**

```typescript
interface BookingFeatureProps {
  provider: 'calendly' | 'acuity' | 'cal.com';
  configuration: BookingConfig;
  ui?: BookingUIConfig;
  onBookingCreated?: (booking: Booking) => void;
}

interface BookingConfig {
  apiKey: string;
  webhookSecret?: string;
  webhookUrl?: string;
  timezone?: string;
}

interface BookingUIConfig {
  showCalendar?: boolean;
  allowRescheduling?: boolean;
  requireConfirmation?: boolean;
  customFields?: CustomField[];
}
```

#### **Examples**

```typescript
// Calendly integration
<BookingFeature
  provider="calendly"
  configuration={{
    apiKey: process.env.CALENDLY_API_KEY,
    webhookSecret: process.env.CALENDLY_WEBHOOK_SECRET,
  }}
  onBookingCreated={(booking) => {
    console.log('New booking:', booking);
  }}
/>

// Custom UI configuration
<BookingFeature
  provider="acuity"
  configuration={{
    apiKey: process.env.ACUITY_API_KEY,
  }}
  ui={{
    showCalendar: true,
    allowRescheduling: true,
    requireConfirmation: false,
  }}
/>
```

### Contact System

Contact form and lead management with CRM integration.

#### **Providers Supported**

- **HubSpot:** CRM and marketing automation
- **SendGrid:** Email marketing
- **ConvertKit:** Email marketing

#### **API Reference**

```typescript
interface ContactFeatureProps {
  provider: 'hubspot' | 'sendgrid' | 'convertkit';
  configuration: ContactConfig;
  ui?: ContactUIConfig;
  onSubmit?: (contact: Contact) => void;
}

interface ContactConfig {
  apiKey: string;
  listId?: string;
  webhookSecret?: string;
  customFields?: CustomField[];
}

interface ContactUIConfig {
  showPhone?: boolean;
  showCompany?: boolean;
  customFields?: CustomField[];
  submitButtonText?: string;
}
```

#### **Examples**

```typescript
// HubSpot contact form
<ContactFeature
  provider="hubspot"
  configuration={{
    apiKey: process.env.HUBSPOT_API_KEY,
    listId: 'your-list-id',
  }}
  onSubmit={(contact) => {
    // Handle contact submission
    trackEvent('contact_form_submitted', contact);
  }}
/>

// Custom contact form
<ContactFeature
  provider="sendgrid"
  configuration={{
    apiKey: process.env.SENDGRID_API_KEY,
    listId: 'your-list-id',
  }}
  ui={{
    showPhone: true,
    showCompany: true,
    submitButtonText: 'Get in Touch',
  }}
/>
```

### Blog System

Content management and blog functionality.

#### **API Reference**

```typescript
interface BlogFeatureProps {
  postsPerPage?: number;
  categories?: string[];
  tags?: string[];
  ui?: BlogUIConfig;
  onPostView?: (post: BlogPost) => void;
}

interface BlogUIConfig {
  showAuthor?: boolean;
  showDate?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  enableComments?: boolean;
  enableSharing?: boolean;
}
```

#### **Examples**

```typescript
// Basic blog
<BlogFeature
  postsPerPage={10}
  categories={['technology', 'business']}
  onPostView={(post) => {
    trackEvent('blog_post_viewed', { postId: post.id });
  }}
/>

// Advanced blog with all features
<BlogFeature
  postsPerPage={12}
  categories={['technology', 'business', 'marketing']}
  ui={{
    showAuthor: true,
    showDate: true,
    showCategories: true,
    showTags: true,
    enableComments: true,
    enableSharing: true,
  }}
/>
```

### Analytics

Analytics and tracking functionality.

#### **Providers Supported**

- **Google Analytics:** Web analytics
- **Segment:** Customer data platform
- **Mixpanel:** Product analytics

#### **API Reference**

```typescript
interface AnalyticsFeatureProps {
  provider: 'google' | 'segment' | 'mixpanel';
  configuration: AnalyticsConfig;
  tracking?: AnalyticsTracking;
}

interface AnalyticsConfig {
  trackingId: string;
  apiKey?: string;
  dataPlaneUrl?: string;
}

interface AnalyticsTracking {
  pageViews?: boolean;
  events?: boolean;
  ecommerce?: boolean;
  customEvents?: CustomEvent[];
}
```

#### **Examples**

```typescript
// Google Analytics
<AnalyticsFeature
  provider="google"
  configuration={{
    trackingId: process.env.GA_TRACKING_ID,
  }}
  tracking={{
    pageViews: true,
    events: true,
    ecommerce: true,
  }}
/>

// Segment analytics
<AnalyticsFeature
  provider="segment"
  configuration={{
    apiKey: process.env.SEGMENT_API_KEY,
    dataPlaneUrl: process.env.SEGMENT_DATA_PLANE_URL,
  }}
  tracking={{
    pageViews: true,
    events: true,
    customEvents: [
      { name: 'user_registered', properties: ['source', 'campaign'] },
      { name: 'purchase_completed', properties: ['amount', 'currency'] },
    ],
  }}
/>
```

---

## Advanced Usage

### Custom Feature Creation

Create custom features by extending the base feature system:

```typescript
import { createFeature } from '@repo/features';

interface CustomFeatureProps {
  configuration: CustomConfig;
  ui?: CustomUIConfig;
}

const CustomFeature = createFeature<CustomFeatureProps>({
  name: 'custom-feature',
  serverComponent: async ({ configuration, ui }) => {
    // Server-side logic
    const data = await fetchData(configuration);

    return (
      <div>
        {/* Server component JSX */}
      </div>
    );
  },
  clientComponent: ({ configuration, ui }) => {
    // Client-side logic with hooks
    const [state, setState] = useState();

    return (
      <div>
        {/* Client component JSX */}
      </div>
    );
  },
  hooks: {
    useCustomData: (configuration) => {
      // Custom hook
      return useSWR('custom-data', () => fetchCustomData(configuration));
    },
  },
  api: {
    createCustom: async (data) => {
      // API endpoint
      return await createCustomRecord(data);
    },
  },
});
```

### Feature Composition

Combine multiple features for complex functionality:

```typescript
import { BookingFeature, ContactFeature, AnalyticsFeature } from '@repo/features';

export function ServicePage() {
  return (
    <div>
      <AnalyticsFeature provider="google" configuration={{ trackingId: 'GA-XXXXX' }} />

      <section>
        <h2>Book a Service</h2>
        <BookingFeature
          provider="calendly"
          configuration={{ apiKey: process.env.CALENDLY_API_KEY }}
        />
      </section>

      <section>
        <h2>Contact Us</h2>
        <ContactFeature
          provider="hubspot"
          configuration={{ apiKey: process.env.HUBSPOT_API_KEY }}
        />
      </section>
    </div>
  );
}
```

### Feature Configuration

Use configuration-driven feature activation:

```typescript
// site.config.ts
export default {
  features: {
    booking: {
      enabled: true,
      provider: 'calendly',
      configuration: {
        apiKey: process.env.CALENDLY_API_KEY,
      },
    },
    contact: {
      enabled: true,
      provider: 'hubspot',
      configuration: {
        apiKey: process.env.HUBSPOT_API_KEY,
      },
    },
    blog: {
      enabled: true,
      postsPerPage: 10,
    },
  },
} satisfies SiteConfig;

// Dynamic feature loading
export function FeatureLoader({ features }: { features: SiteConfig['features'] }) {
  return (
    <div>
      {features.booking?.enabled && (
        <BookingFeature {...features.booking} />
      )}
      {features.contact?.enabled && (
        <ContactFeature {...features.contact} />
      )}
      {features.blog?.enabled && (
        <BlogFeature {...features.blog} />
      )}
    </div>
  );
}
```

---

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

---

## Feature Library Structure

```
src/
├── booking/              # Booking system
│   ├── index.ts          # Main exports
│   ├── providers/        # Provider implementations
│   ├── types.ts          # TypeScript interfaces
│   └── __tests__/        # Tests
├── contact/              # Contact system
├── blog/                 # Blog functionality
├── analytics/            # Analytics tracking
├── ecommerce/            # E-commerce features
├── search/               # Search functionality
├── newsletter/           # Newsletter management
├── reviews/              # Review system
├── services/             # Services showcase
├── team/                 # Team member profiles
├── testimonials/          # Testimonials
├── index.ts              # Main exports
└── index.client.ts        # Client-safe exports
```

### Export Structure

```typescript
// Main exports (server-safe)
export { BookingFeature } from './booking';
export { ContactFeature } from './contact';
export { BlogFeature } from './blog';
// ... other server-safe exports

// Client exports (interactive components)
export { BookingForm } from './booking/client';
export { ContactForm } from './contact/client';
// ... other client exports
```

---

## Security

### Multi-Tenant Security

All features are built with multi-tenant security:

```typescript
// Tenant-aware feature implementation
export async function createBooking(bookingData: BookingData, tenantId: string) {
  // Validate tenant access
  validateTenantAccess(tenantId, 'booking.create');

  // Create booking with tenant isolation
  const booking = await bookingRepository.create({
    ...bookingData,
    tenantId,
    status: 'pending',
  });

  return booking;
}
```

### Input Validation

All features include comprehensive input validation:

```typescript
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  dateTime: z.string().datetime(),
  customerInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

export function validateBookingData(data: unknown) {
  return bookingSchema.parse(data);
}
```

### API Security

Features implement secure API patterns:

```typescript
// Secure API client
const apiClient = new SecureAPIClient({
  baseURL: 'https://api.provider.com',
  apiKey: process.env.API_KEY!,
});

export async function createProviderBooking(data: BookingData) {
  return await apiClient.post('/bookings', data);
}
```

---

## Performance

### Server Components

Features are optimized for React Server Components:

- **Zero Client JavaScript:** Server features render to HTML
- **Faster Page Loads:** No client-side hydration needed
- **Better SEO:** Search engines can crawl content
- **Reduced Bundle Size:** Less JavaScript sent to client

### Code Splitting

Features use automatic code splitting:

```typescript
// Lazy loading for heavy features
const HeavyFeature = dynamic(() => import('./heavy-feature'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Client-side only
});
```

### Caching

Features implement intelligent caching:

```typescript
// Server-side caching
export async function getCachedBlogPosts(tenantId: string) {
  const cacheKey = `blog-posts:${tenantId}`;

  // Check cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const posts = await blogRepository.findByTenant(tenantId);

  // Cache for 5 minutes
  await cache.set(cacheKey, posts, { ttl: 300 });

  return posts;
}
```

---

## Testing

### Unit Tests

Each feature includes comprehensive unit tests:

```typescript
describe('BookingFeature', () => {
  it('should create booking with valid data', async () => {
    const bookingData = {
      serviceId: 'service-123',
      dateTime: '2026-02-21T10:00:00Z',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    const result = await createBooking(bookingData, 'tenant-123');

    expect(result).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.tenantId).toBe('tenant-123');
  });
});
```

### Integration Tests

Features include integration tests:

```typescript
describe('Booking Integration', () => {
  it('should integrate with Calendly provider', async () => {
    const booking = await createCalendlyBooking(validBookingData);

    expect(booking.id).toBeDefined();
    expect(booking.provider).toBe('calendly');
  });
});
```

### E2E Tests

Features include end-to-end tests:

```typescript
describe('Booking E2E', () => {
  it('should complete booking flow', async () => {
    await page.goto('/booking');
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="success"]')).toBeVisible();
  });
});
```

---

## Migration Guide

### From Previous Versions

If you're migrating from an older version of `@repo/features`:

1. **Update Dependencies:** Ensure React 19 and TypeScript 5.9+
2. **Check Imports:** Some imports may have changed
3. **Update Server Components:** Review server/client component usage
4. **Test Security:** Verify tenant isolation and input validation
5. **Update Configuration:** Review feature configuration format

### Breaking Changes

- **React 19 Required:** No longer supports React 18
- **Server Components Default:** Features are server components by default
- **TypeScript Strict Mode:** All features use strict TypeScript
- **Enhanced Security:** Multi-tenant isolation is now required

---

## Contributing

### Adding New Features

1. **Create Feature Directory:** `src/new-feature/`
2. **Implement Feature:** Create main feature file
3. **Add Tests:** Include comprehensive test suite
4. **Update Exports:** Add to `src/index.ts`
5. **Add Documentation:** Update this README
6. **Run Tests:** Ensure all tests pass

### Feature Guidelines

- **TypeScript First:** Always use TypeScript interfaces
- **Security First:** Implement tenant isolation and input validation
- **Server Components:** Default to server components
- **Performance:** Optimize for server rendering
- **Testing:** Include comprehensive tests

### Code Style

```typescript
// Feature template
import { createFeature } from '@repo/features';

interface NewFeatureProps {
  configuration: NewFeatureConfig;
  ui?: NewFeatureUIConfig;
}

export const NewFeature = createFeature<NewFeatureProps>({
  name: 'new-feature',
  serverComponent: async ({ configuration, ui }) => {
    // Server-side implementation
    return <div>New Feature</div>;
  },
  clientComponent: ({ configuration, ui }) => {
    // Client-side implementation
    return <div>New Feature</div>;
  },
});
```

---

## Changelog

### 1.0.0 (2026-02-21)

#### Added

- 20+ feature modules
- React 19 Server Components support
- TypeScript 5.9 strict mode
- Multi-tenant security
- Comprehensive testing suite
- Performance optimizations

#### Changed

- Migrated from React 18 to React 19
- Updated to TypeScript 5.9
- Enhanced security compliance
- Improved performance with server components

#### Deprecated

- Legacy feature exports (use new export structure)

---

## Support

### Getting Help

- **Documentation:** [Feature Library Guide](../features/README.md)
- **Examples:** [Feature Examples](../examples/features/)
- **Issues:** [GitHub Issues](https://github.com/your-org/marketing-websites/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/marketing-websites/discussions)

### Reporting Issues

When reporting issues, please include:

1. **Feature Name:** Which feature is affected
2. **React Version:** Ensure React 19 compatibility
3. **TypeScript Version:** Ensure TypeScript 5.9+
4. **Provider:** Which integration provider
5. **Steps to Reproduce:** Clear reproduction steps
6. **Expected vs Actual:** What you expected vs what happened

---

## License

MIT License - see [LICENSE](../../../LICENSE) for details.

---

**Package Last Updated:** 2026-02-21  
**Next Review:** 2026-05-21  
**Maintainers:** Development Team  
**Classification:** Public  
**Questions:** Create GitHub issue with `features` label

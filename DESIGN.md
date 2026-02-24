# 🎨 Design Philosophy & Architecture

> **Complete design system and architectural patterns for the marketing websites monorepo**

This document captures the core design philosophy, architectural decisions, and design patterns that guide the development of the marketing websites platform. It serves as the authoritative source for design principles, system architecture, and implementation guidelines.

---

## 🏛️ Design Philosophy

### **Core Principles**

#### **1. Multi-Tenant First**

- **Data Isolation**: Complete tenant separation at all layers
- **Security**: Zero-trust architecture with defense-in-depth
- **Scalability**: Designed for 1000+ concurrent tenants
- **Performance**: Sub-5ms tenant resolution times

#### **2. Feature-Sliced Design (FSD) v2.1**

- **Layered Architecture**: Clear separation of concerns
- **Unidirectional Dependencies**: app → pages → widgets → features → entities → shared
- **Cross-Slice Communication**: @x notation for intentional cross-layer imports
- **Scalable Structure**: Each layer has clear responsibilities and boundaries

#### **3. Performance-First Development**

- **Core Web Vitals**: LCP <2.5s, INP <200ms, CLS <0.1
- **Progressive Enhancement**: Graceful degradation for all users
- **Edge Optimization**: Global CDN distribution with edge computing
- **Bundle Discipline**: Strict size budgets and optimization

#### **4. Security by Design**

- **OAuth 2.1 with PKCE**: Modern authentication standards
- **Row Level Security**: Database-level tenant isolation
- **Defense-in-Depth**: Multiple independent security layers
- **Post-Quantum Ready**: Future-proof cryptography abstraction

#### **5. AI-Powered Development**

- **Agent Context**: Comprehensive AI agent guidance
- **Automated Generation**: Code and documentation generation
- **Quality Assurance**: AI-assisted testing and validation
- **Continuous Learning**: Adaptive improvement patterns

---

## 🏗️ System Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Edge Layer (Vercel)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Admin     │  │   Portal    │  │     Marketing Web    │  │
│  │   Dashboard │  │   Client    │  │       Sites          │  │
│  │             │  │   Portal    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │     UI      │  │  Features   │  │    Infrastructure    │  │
│  │ Components  │  │   Layer     │  │      Package         │  │
│  │             │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Supabase   │  │   Redis     │  │    Tinybird         │  │
│  │ PostgreSQL  │  │   Cache     │  │   Analytics          │  │
│  │   + RLS     │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Multi-Tenant Architecture**

#### **Tenant Resolution Flow**

```
Incoming Request
       ↓
Edge Middleware (Tenant Detection)
       ↓
Custom Domain → Subdomain → Path → Header/Cookie
       ↓
Tenant Cache (Redis, 5min TTL)
       ↓
Tenant Context (AsyncLocalStorage)
       ↓
JWT Claims (tenant_id, permissions)
       ↓
Database RLS (tenant_id filter)
       ↓
Response (Tenant-isolated)
```

#### **Data Isolation Strategy**

- **Application Layer**: Tenant context validation
- **Database Layer**: Row Level Security (RLS) policies
- **Cache Layer**: Tenant-specific cache keys
- **API Layer**: Per-tenant rate limiting
- **File Storage**: Tenant-isolated storage paths

---

## 🎨 Feature-Sliced Design (FSD) v2.1

### **Layer Architecture**

#### **App Layer** (`app/`)

**Purpose**: Application-specific pages and layouts
**Responsibilities**:

- Route definitions
- Layout components
- Application-wide providers
- Error boundaries

```typescript
// Example app layer structure
app/
├── layout.tsx           # Root layout
├── page.tsx            # Home page
├── dashboard/
│   ├── layout.tsx      # Dashboard layout
│   └── page.tsx        # Dashboard page
└── loading.tsx         # Loading states
```

#### **Pages Layer** (`pages/`)

**Purpose**: Route-specific page components
**Responsibilities**:

- Page composition
- Data fetching
- SEO metadata
- Page-specific logic

```typescript
// Example pages layer
pages/
├── HomePage/
│   ├── HomePage.tsx
│   └── HomePage.test.tsx
├── DashboardPage/
│   ├── DashboardPage.tsx
│   └── DashboardPage.test.tsx
└── _templates/
    └── PageTemplate.tsx
```

#### **Widgets Layer** (`widgets/`)

**Purpose**: Composed UI components
**Responsibilities**:

- Component composition
- Business logic integration
- User interaction handling
- State management

```typescript
// Example widgets layer
widgets/
├── BookingWidget/
│   ├── BookingWidget.tsx
│   ├── BookingWidget.test.tsx
│   └── BookingWidget.stories.tsx
├── LeadFormWidget/
│   ├── LeadFormWidget.tsx
│   └── LeadFormWidget.test.tsx
└── _templates/
    └── WidgetTemplate.tsx
```

#### **Features Layer** (`features/`)

**Purpose**: Business logic and domain features
**Responsibilities**:

- Domain logic implementation
- Data processing
- Business rules
- Feature-specific utilities

```typescript
// Example features layer
features/
├── booking/
│   ├── api/
│   │   ├── createBooking.ts
│   │   └── cancelBooking.ts
│   ├── lib/
│   │   ├── bookingValidation.ts
│   │   └── bookingCalculations.ts
│   └── model/
│       └── bookingModel.ts
├── lead-management/
│   ├── api/
│   ├── lib/
│   └── model/
└── _templates/
    └── FeatureTemplate.ts
```

#### **Entities Layer** (`entities/`)

**Purpose**: Core domain entities
**Responsibilities**:

- Entity definitions
- Domain types
- Entity validation
- Entity utilities

```typescript
// Example entities layer
entities/
├── user/
│   ├── User.ts
│   ├── User.types.ts
│   ├── User.validation.ts
│   └── User.test.ts
├── tenant/
│   ├── Tenant.ts
│   ├── Tenant.types.ts
│   └── Tenant.validation.ts
└── _templates/
    └── EntityTemplate.ts
```

#### **Shared Layer** (`shared/`)

**Purpose**: Shared utilities and types
**Responsibilities**:

- Common utilities
- Shared types
- Helper functions
- Configuration

```typescript
// Example shared layer
shared/
├── lib/
│   ├── dateUtils.ts
│   ├── formatters.ts
│   └── validators.ts
├── types/
│   ├── api.types.ts
│   └── common.types.ts
├── config/
│   └── constants.ts
└── ui/
    └── theme.ts
```

### **Cross-Slice Communication**

#### **@x Notation**

Use `@x/` prefix for intentional cross-slice imports:

```typescript
// Import from another slice
import { Button } from '@x/ui/shared';
import { UserEntity } from '@x/entities/user';
import { BookingFeature } from '@x/features/booking';
```

#### **Import Rules**

- **Allowed**: Parent layers can import from child layers
- **Allowed**: Same layer imports
- **Allowed**: Cross-slice imports with @x notation
- **Forbidden**: Child layers importing from parent layers
- **Forbidden**: Circular dependencies

---

## 🔒 Security Architecture

### **Defense-in-Depth Strategy**

#### **Layer 1: Edge Security**

```typescript
// Edge Middleware
export async function middleware(request: NextRequest) {
  // Tenant resolution
  const tenant = await resolveTenant(request);

  // Rate limiting
  await checkRateLimit(request, tenant.id);

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}
```

#### **Layer 2: Application Security**

```typescript
// Server Action Security
export const secureAction = createServerAction()
  .input(z.object({ tenantId: z.string().uuid() }))
  .middleware(async ({ input }) => {
    // Re-authenticate
    await verifyAuthentication();

    // Tenant validation
    const tenant = await getTenant(input.tenantId);
    if (!tenant) throw new Error('Tenant not found');

    return { tenant };
  })
  .handler(async ({ input, tenant }) => {
    // Business logic with tenant context
  });
```

#### **Layer 3: Database Security**

```sql
-- Row Level Security Policy
CREATE POLICY tenant_isolation ON bookings
  FOR ALL TO authenticated
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());
```

#### **Layer 4: Infrastructure Security**

- **Secrets Management**: Encrypted per-tenant storage
- **Audit Logging**: Comprehensive security event tracking
- **Network Security**: VPC isolation and firewall rules
- **Compliance**: GDPR/CCPA, SOC 2, HIPAA ready

### **OAuth 2.1 Implementation**

#### **PKCE Flow**

```typescript
// PKCE Manager
export class PKCEManager {
  async generateChallenge(): Promise<{
    codeVerifier: string;
    codeChallenge: string;
  }> {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256(codeVerifier);
    return { codeVerifier, codeChallenge };
  }

  async verifyChallenge(codeVerifier: string, codeChallenge: string): Promise<boolean> {
    const expectedChallenge = await sha256(codeVerifier);
    return constantTimeCompare(expectedChallenge, codeChallenge);
  }
}
```

---

## 🚀 Performance Architecture

### **Core Web Vitals Optimization**

#### **LCP (Largest Contentful Paint) < 2.5s**

```typescript
// Image optimization
export function OptimizedImage({ src, alt, priority }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      placeholder="blur"
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}

// Font optimization
export function FontOptimization() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
    </>
  )
}
```

#### **INP (Interaction to Next Paint) < 200ms**

```typescript
// Optimistic UI updates
export function useOptimisticUpdate<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [optimisticValue, setOptimisticValue] = useState(initialValue);

  const update = useCallback(
    async (newValue: T) => {
      // Optimistic update
      setOptimisticValue(newValue);

      // Server update
      try {
        await updateServer(newValue);
        setValue(newValue);
      } catch (error) {
        // Rollback on error
        setOptimisticValue(value);
      }
    },
    [value]
  );

  return [optimisticValue, update] as const;
}
```

#### **CLS (Cumulative Layout Shift) < 0.1**

```typescript
// Layout stability
export function StableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100px] flex items-center justify-center">
      {children}
    </div>
  )
}

// Skeleton loading
export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  )
}
```

### **Edge Optimization Strategy**

#### **Global Distribution**

```typescript
// Edge function for tenant resolution
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'hnd1', 'sin1'], // US East, Asia Pacific, Singapore
};

export default async function handler(request: Request) {
  const tenant = await resolveTenantFromEdge(request);
  return new Response(JSON.stringify(tenant), {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
```

#### **Cache Strategy**

```typescript
// Multi-layer caching
export function getCachingStrategy(type: 'static' | 'dynamic' | 'tenant') {
  switch (type) {
    case 'static':
      return {
        revalidate: 86400, // 1 day
        tags: ['static'],
      };
    case 'dynamic':
      return {
        revalidate: 300, // 5 minutes
        tags: ['dynamic'],
      };
    case 'tenant':
      return {
        revalidate: 60, // 1 minute
        tags: ['tenant'],
      };
  }
}
```

---

## 🎨 UI/UX Design System

### **Design Tokens**

#### **Color System**

```typescript
// Design tokens
export const colors = {
  // Brand colors
  brand: {
    50: '#f0f9ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },

  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Neutral colors
  neutral: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  },
};
```

#### **Typography System**

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
  },
};
```

#### **Spacing System**

```typescript
export const spacing = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
};
```

### **Component Design Patterns**

#### **Atomic Design**

```typescript
// Atoms
export const Button = ({ variant = 'primary', size = 'md', ...props }) => (
  <button
    className={clsx(
      'btn',
      `btn-${variant}`,
      `btn-${size}`
    )}
    {...props}
  />
)

// Molecules
export const InputGroup = ({ label, error, ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input className="input-field" {...props} />
    {error && <span className="input-error">{error}</span>}
  </div>
)

// Organisms
export const BookingForm = ({ onSubmit }) => (
  <form className="booking-form" onSubmit={onSubmit}>
    <InputGroup label="Name" name="name" required />
    <InputGroup label="Email" name="email" type="email" required />
    <Button type="submit">Book Now</Button>
  </form>
)
```

#### **Progressive Enhancement**

```typescript
// Base component with enhancement
export function BookingWidget({ enhanced = false }) {
  if (enhanced) {
    return <EnhancedBookingWidget />
  }

  return <BasicBookingWidget />
}

// Enhanced version with modern features
function EnhancedBookingWidget() {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  return (
    <div className="booking-widget enhanced">
      <BookingCalendar state={state} dispatch={dispatch} />
      <BookingForm state={state} dispatch={dispatch} />
      <BookingSummary state={state} />
    </div>
  )
}
```

---

## 🤖 AI Integration Design

### **Agent Context Architecture**

#### **Context Hierarchy**

```
Root AGENTS.md (60-line limit)
├── Package AGENTS.md (40-60 lines each)
├── Module-specific context
└── File-level context
```

#### **Agent Coordination**

```typescript
// Agent coordination system
export class AgentCoordinator {
  private agents: Map<string, Agent> = new Map();

  async executeTask(task: Task): Promise<Result> {
    // Route to appropriate agent
    const agent = this.selectAgent(task.type);

    // Execute with context
    const context = await this.buildContext(task);
    const result = await agent.execute(task, context);

    // Update context based on result
    await this.updateContext(result);

    return result;
  }

  private selectAgent(taskType: string): Agent {
    return this.agents.get(taskType) || this.agents.get('default');
  }
}
```

### **AI-Powered Development Patterns**

#### **Code Generation**

```typescript
// Code generation template
export function generateComponent(template: ComponentTemplate) {
  return {
    component: generateReactComponent(template),
    tests: generateTests(template),
    stories: generateStories(template),
    docs: generateDocumentation(template),
  };
}
```

#### **Quality Assurance**

```typescript
// AI-assisted testing
export function generateTests(component: Component) {
  return {
    unit: generateUnitTests(component),
    integration: generateIntegrationTests(component),
    e2e: generateE2ETests(component),
    accessibility: generateAccessibilityTests(component),
  };
}
```

---

## 📊 Data Architecture

### **Multi-Store Strategy**

#### **Primary Database (Supabase)**

```sql
-- Tenant-isolated schema
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  -- RLS ensures tenant isolation
  CONSTRAINT bookings_tenant_check CHECK (tenant_id IS NOT NULL)
);

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON bookings
  FOR ALL TO authenticated
  USING (tenant_id = auth.tenant_id());
```

#### **Cache Layer (Redis)**

```typescript
// Multi-tier caching
export class CacheManager {
  async get<T>(key: string, tenantId: string): Promise<T | null> {
    const tenantKey = `tenant:${tenantId}:${key}`;
    return await this.redis.get(tenantKey);
  }

  async set<T>(key: string, value: T, tenantId: string, ttl: number = 300): Promise<void> {
    const tenantKey = `tenant:${tenantId}:${key}`;
    await this.redis.setex(tenantKey, ttl, JSON.stringify(value));
  }
}
```

#### **Analytics Store (Tinybird)**

```sql
-- Analytics data source
CREATE TABLE page_views (
  timestamp DateTime,
  tenant_id String,
  page_url String,
  user_agent String,
  referrer String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tenant_id, timestamp, page_url);

-- Analytics pipe
CREATE PIPELINE leads_over_time AS
SELECT
  tenant_id,
  toHour(timestamp) as hour,
  count() as leads
FROM leads
WHERE timestamp > now() - INTERVAL '24 hour'
GROUP BY tenant_id, hour
ORDER BY hour DESC;
```

---

## 🔄 Integration Architecture

### **Third-Party Integration Patterns**

#### **OAuth Integration**

```typescript
// OAuth integration pattern
export class OAuthIntegration {
  async connect(provider: 'stripe' | 'hubspot' | 'calcom') {
    const config = this.getProviderConfig(provider);
    const authUrl = this.buildAuthUrl(config);

    // Store state for verification
    await this.storeAuthState(config.state);

    return authUrl;
  }

  async callback(provider: string, code: string, state: string) {
    // Verify state
    await this.verifyAuthState(state);

    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(provider, code);

    // Store encrypted tokens
    await this.storeTokens(provider, tokens);

    return tokens;
  }
}
```

#### **Webhook Handling**

```typescript
// Webhook handler pattern
export function createWebhookHandler(provider: string) {
  return async (request: Request) => {
    // Verify signature
    const signature = request.headers.get('x-signature');
    const payload = await request.text();

    if (!verifySignature(payload, signature, provider)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Process event
    const event = JSON.parse(payload);
    await processWebhookEvent(provider, event);

    return new Response('OK');
  };
}
```

---

## 📈 Scalability Architecture

### **Horizontal Scaling**

#### **Application Scaling**

```typescript
// Stateless application design
export function createApp() {
  return NextServer({
    // Stateless configuration
    hostname: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),

    // Edge optimization
    experimental: {
      serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },
  });
}
```

#### **Database Scaling**

```typescript
// Connection pooling
export class DatabasePool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
```

#### **Cache Scaling**

```typescript
// Distributed caching
export class DistributedCache {
  private redis: Redis;
  private localCache: LRUCache<string, any>;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.localCache = new LRUCache({ max: 1000, ttl: 60000 });
  }

  async get(key: string): Promise<any> {
    // Check local cache first
    const local = this.localCache.get(key);
    if (local) return local;

    // Check distributed cache
    const distributed = await this.redis.get(key);
    if (distributed) {
      this.localCache.set(key, JSON.parse(distributed));
      return JSON.parse(distributed);
    }

    return null;
  }
}
```

---

## 🛡️ Reliability Architecture

### **Error Handling**

#### **Global Error Boundary**

```typescript
export class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring
    Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

#### **Circuit Breaker Pattern**

```typescript
export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure > 60000) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= 5) {
      this.state = 'OPEN';
    }
  }
}
```

---

## 🎯 Implementation Guidelines

### **Code Standards**

#### **TypeScript Standards**

```typescript
// Strict TypeScript configuration
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}

// Type-safe patterns
export interface Booking {
  readonly id: string
  readonly tenantId: string
  readonly createdAt: Date
  readonly status: BookingStatus
}

// Discriminated unions
export type BookingEvent =
  | { type: 'CREATED'; booking: Booking }
  | { type: 'CANCELLED'; bookingId: string; reason: string }
  | { type: 'RESCHEDULED'; bookingId: string; newDate: Date }
```

#### **React Patterns**

```typescript
// Server components
export async function BookingList({ tenantId }: { tenantId: string }) {
  const bookings = await getBookings(tenantId)

  return (
    <div>
      {bookings.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}

// Client components with proper boundaries
'use client'

export function BookingCard({ booking }: { booking: Booking }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="booking-card">
      <h3>{booking.title}</h3>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide' : 'Show'} Details
      </button>
      {isExpanded && <BookingDetails booking={booking} />}
    </div>
  )
}
```

### **Testing Standards**

#### **Unit Testing**

```typescript
// Test structure
describe('BookingService', () => {
  let service: BookingService;
  let mockDb: jest.Mocked<Database>;

  beforeEach(() => {
    mockDb = createMockDatabase();
    service = new BookingService(mockDb);
  });

  describe('createBooking', () => {
    it('should create a booking with valid data', async () => {
      // Arrange
      const bookingData = createValidBookingData();
      mockDb.booking.create.mockResolvedValue(createBooking());

      // Act
      const result = await service.createBooking(bookingData);

      // Assert
      expect(result).toBeDefined();
      expect(mockDb.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: bookingData.tenantId,
          status: 'PENDING',
        })
      );
    });

    it('should throw error for invalid data', async () => {
      // Arrange
      const invalidData = { ...createValidBookingData(), tenantId: '' };

      // Act & Assert
      await expect(service.createBooking(invalidData)).rejects.toThrow('Invalid tenant ID');
    });
  });
});
```

#### **Integration Testing**

```typescript
// Integration test with test database
describe('Booking Integration', () => {
  let testDb: TestDatabase;
  let app: NextApplication;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    app = createTestApp({ database: testDb });
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  it('should handle complete booking flow', async () => {
    // Create booking via API
    const response = await app.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(createValidBookingData()),
    });

    expect(response.status).toBe(201);

    // Verify booking exists in database
    const booking = await testDb.booking.findById(response.json().id);
    expect(booking).toBeDefined();
    expect(booking.status).toBe('PENDING');
  });
});
```

---

## 📚 Design Evolution

### **Version History**

#### **v1.0 - Foundation (Current)**

- Multi-tenant architecture
- FSD v2.1 implementation
- OAuth 2.1 security
- Core Web Vitals optimization
- AI integration foundation

#### **v1.1 - Enhanced Analytics (Planned)**

- Real-time analytics dashboard
- Advanced reporting features
- Business intelligence tools
- Predictive analytics

#### **v1.2 - AI Automation (Planned)**

- Automated content generation
- AI-powered optimization
- Intelligent recommendations
- Autonomous testing

#### **v2.0 - Enterprise Features (Future)**

- Advanced multi-region support
- Enterprise SSO integration
- Advanced compliance features
- Custom AI model training

### **Architecture Decision Records (ADRs)**

#### **ADR-001: Multi-Tenant Architecture**

**Status**: Accepted
**Decision**: Implement shared database with RLS for tenant isolation
**Rationale**: Cost-effective, scalable, secure
**Consequences**: Requires careful RLS policy management

#### **ADR-002: Feature-Sliced Design**

**Status**: Accepted
**Decision**: Adopt FSD v2.1 for all packages
**Rationale**: Scalable architecture, clear boundaries
**Consequences**: Learning curve for new developers

#### **ADR-003: OAuth 2.1 with PKCE**

**Status**: Accepted
**Decision**: Use OAuth 2.1 with PKCE for all authentication
**Rationale**: Modern security standards, mobile-friendly
**Consequences**: More complex flow than basic OAuth

---

## 🎯 Design Principles Summary

### **Core Values**

1. **Security First**: Every decision prioritizes security
2. **Performance Obsessed**: Sub-100ms interaction targets
3. **Developer Experience**: AI-powered, intuitive development
4. **Scalability by Design**: Built for 1000+ tenants
5. **Accessibility by Default**: WCAG 2.2 AA compliance

### **Technical Excellence**

1. **Type Safety**: Strict TypeScript throughout
2. **Test Coverage**: >80% coverage requirement
3. **Code Quality**: Automated linting and formatting
4. **Documentation**: Comprehensive, AI-friendly
5. **Monitoring**: Full observability stack

### **Business Alignment**

1. **Time to Market**: Rapid development with AI assistance
2. **Cost Efficiency**: Shared infrastructure, optimized scaling
3. **Compliance Ready**: GDPR/CCPA, SOC 2, HIPAA prepared
4. **Future-Proof**: Post-quantum cryptography ready
5. **Innovation Focus**: AI-powered competitive advantage

---

_This design document serves as the authoritative source for all architectural decisions and design patterns in the marketing websites monorepo. It should be updated as the system evolves and new patterns emerge._

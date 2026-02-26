---
name: code-review-best-practices
description: |
  **REFERENCE GUIDE** - Comprehensive code review best practices and standards.
  USE FOR: Understanding review methodologies, quality standards, and optimization patterns.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# Code Review Best Practices

## Overview
This document outlines comprehensive best practices for code review in the marketing websites monorepo, focusing on security, performance, architecture, and quality standards.

## Review Philosophy

### 1. Review Objectives

#### Primary Goals
- **Quality Assurance**: Ensure code meets high quality standards
- **Security Validation**: Identify and prevent security vulnerabilities
- **Performance Optimization**: Maintain and improve system performance
- **Knowledge Sharing**: Facilitate team learning and collaboration
- **Architecture Consistency**: Maintain coherent system architecture

#### Secondary Goals
- **Mentorship**: Help developers improve their skills
- **Documentation**: Ensure code is well-documented and maintainable
- **Testing**: Verify comprehensive test coverage
- **Standards Compliance**: Ensure adherence to coding standards

### 2. Review Principles

#### Constructive Feedback
- Focus on code, not the person
- Provide specific, actionable suggestions
- Explain the "why" behind recommendations
- Offer alternative solutions when possible
- Recognize good work and positive patterns

#### Efficiency and Effectiveness
- Review early and often
- Keep reviews focused and manageable
- Use automated tools where appropriate
- Prioritize critical issues over minor style concerns
- Balance thoroughness with development velocity

#### Collaboration and Learning
- Treat reviews as collaborative discussions
- Share knowledge and expertise
- Be open to different perspectives
- Document decisions and rationale
- Follow up on implemented changes

## Security Review Best Practices

### 1. Security-First Mindset

#### Threat Modeling
- Consider potential attack vectors
- Evaluate data exposure risks
- Assess privilege escalation possibilities
- Review authentication and authorization flows
- Identify injection vulnerabilities

#### Defense in Depth
- Implement multiple security layers
- Validate inputs at multiple levels
- Use principle of least privilege
- Implement proper error handling
- Monitor and log security events

### 2. Common Security Issues

#### Authentication and Authorization
```typescript
// ❌ Bad: Hardcoded credentials
const apiKey = "sk-1234567890abcdef";

// ✅ Good: Environment variables
const apiKey = process.env.API_KEY;

// ❌ Bad: No tenant isolation
const users = await db.query("SELECT * FROM users");

// ✅ Good: Tenant-aware queries
const users = await db.query(
  "SELECT * FROM users WHERE tenant_id = $1",
  [tenantId]
);

// ❌ Bad: Weak password validation
if (password.length < 6) return false;

// ✅ Good: Strong password requirements
const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain special character");
```

#### Input Validation and Output Encoding
```typescript
// ❌ Bad: Direct string interpolation
const query = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ Good: Parameterized queries
const query = "SELECT * FROM users WHERE name = $1";
await db.query(query, [userName]);

// ❌ Bad: Unescaped HTML output
const html = `<div>${userInput}</div>`;

// ✅ Good: Proper output encoding
const html = `<div>${escapeHtml(userInput)}</div>`;

// ❌ Bad: Trusting client-side validation
if (isValidEmail(email)) {
  await saveEmail(email);
}

// ✅ Good: Server-side validation
const emailSchema = z.string().email();
const result = emailSchema.safeParse(email);
if (result.success) {
  await saveEmail(result.data);
}
```

#### Data Protection
```typescript
// ❌ Bad: Logging sensitive data
console.log(`User login: ${email}, password: ${password}`);

// ✅ Good: Sanitized logging
logger.info("User login attempt", { userId, timestamp });

// ❌ Bad: Storing sensitive data in plain text
const user = { name, email, password: plainPassword };

// ✅ Good: Encrypted sensitive data
const user = { 
  name, 
  email, 
  passwordHash: await hashPassword(plainPassword) 
};

// ❌ Bad: Exposing internal errors
catch (error) {
  res.status(500).json({ error: error.message });
}

// ✅ Good: Generic error messages
catch (error) {
  logger.error("Internal server error", { error: error.stack });
  res.status(500).json({ error: "Internal server error" });
}
```

### 3. Security Review Checklist

#### Critical Security Checks
- [ ] No hardcoded secrets or credentials
- [ ] All database queries include tenant filtering
- [ ] Input validation on all user inputs
- [ ] Proper error handling without information disclosure
- [ ] Authentication and authorization implemented

#### High Priority Security Checks
- [ ] SQL injection prevention measures
- [ ] XSS prevention through output encoding
- [ ] CSRF protection for state-changing operations
- [ ] Secure file upload handling
- [ ] Rate limiting and abuse prevention

#### Medium Priority Security Checks
- [ ] Security headers configured
- [ ] Dependency vulnerability scanning
- [ ] Audit logging implemented
- [ ] Data encryption at rest and in transit
- [ ] Session management security

## Performance Review Best Practices

### 1. Performance Optimization Principles

#### Measurement-First Approach
- Establish performance budgets
- Measure before optimizing
- Use real-world data for testing
- Monitor performance continuously
- Set up performance regression detection

#### Optimization Hierarchy
1. **Critical Path**: Optimize user-visible performance first
2. **Bundle Size**: Reduce JavaScript and CSS bundle sizes
3. **Network**: Minimize network requests and data transfer
4. **Rendering**: Optimize rendering and painting performance
5. **Memory**: Prevent memory leaks and excessive allocations

### 2. Frontend Performance Best Practices

#### Core Web Vitals Optimization
```typescript
// ❌ Bad: Large images without optimization
<img src="huge-image.jpg" alt="Product" />

// ✅ Good: Optimized images with proper sizing
<img 
  src="product-800w.webp" 
  srcSet="product-400w.webp 400w, product-800w.webp 800w"
  sizes="(max-width: 400px) 400px, 800px"
  alt="Product"
  loading="lazy"
  width="800"
  height="600"
/>

// ❌ Bad: Blocking JavaScript imports
import { HeavyComponent } from './heavy-component';

// ✅ Good: Lazy loading with code splitting
const HeavyComponent = lazy(() => import('./heavy-component'));

// ❌ Bad: Synchronous operations
const data = fs.readFileSync('large-file.json');

// ✅ Good: Asynchronous operations
const data = await fs.readFile('large-file.json', 'utf8');
```

#### Bundle Size Optimization
```typescript
// ❌ Bad: Importing entire library
import _ from 'lodash';
const result = _.get(obj, 'deep.property');

// ✅ Good: Tree-shakeable imports
import get from 'lodash/get';
const result = get(obj, 'deep.property');

// ❌ Bad: Moment.js (large bundle)
import moment from 'moment';
const formatted = moment(date).format('YYYY-MM-DD');

// ✅ Good: Lightweight alternatives
import { format } from 'date-fns';
const formatted = format(date, 'yyyy-MM-dd');

// ❌ Bad: Unused dependencies
import { unusedFunction, usedFunction } from './utils';
usedFunction();

// ✅ Good: Import only what's needed
import { usedFunction } from './utils';
usedFunction();
```

#### React Performance Patterns
```typescript
// ❌ Bad: Unnecessary re-renders
function ExpensiveComponent({ data, onUpdate }) {
  return (
    <div>
      {data.map(item => (
        <Item key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

// ✅ Good: Optimized with memo and callbacks
const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onUpdate 
}) {
  const handleUpdate = useCallback((id, updates) => {
    onUpdate(id, updates);
  }, [onUpdate]);

  return (
    <div>
      {data.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onUpdate={handleUpdate} 
        />
      ))}
    </div>
  );
});

// ❌ Bad: Expensive calculations in render
function List({ items }) {
  const expensiveResult = heavyCalculation(items);
  return <div>{expensiveResult}</div>;
}

// ✅ Good: Memoized expensive calculations
function List({ items }) {
  const expensiveResult = useMemo(() => 
    heavyCalculation(items), 
    [items]
  );
  return <div>{expensiveResult}</div>;
}
```

### 3. Backend Performance Best Practices

#### Database Optimization
```typescript
// ❌ Bad: N+1 query problem
async function getUsersWithPosts() {
  const users = await db.query("SELECT * FROM users");
  for (const user of users) {
    user.posts = await db.query(
      "SELECT * FROM posts WHERE user_id = $1", 
      [user.id]
    );
  }
  return users;
}

// ✅ Good: Efficient queries with joins
async function getUsersWithPosts() {
  return await db.query(`
    SELECT 
      u.*, 
      array_agg(p.*) as posts
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE u.tenant_id = $1
    GROUP BY u.id
  `, [tenantId]);
}

// ❌ Bad: Missing indexes
async function findUserByEmail(email) {
  return await db.query(
    "SELECT * FROM users WHERE email = $1 AND tenant_id = $2",
    [email, tenantId]
  );
}

// ✅ Good: Proper indexing
// CREATE INDEX idx_users_email_tenant ON users(email, tenant_id);
async function findUserByEmail(email) {
  return await db.query(
    "SELECT * FROM users WHERE email = $1 AND tenant_id = $2",
    [email, tenantId]
  );
}
```

#### Caching Strategies
```typescript
// ❌ Bad: No caching
async function getProduct(id) {
  return await db.query(
    "SELECT * FROM products WHERE id = $1 AND tenant_id = $2",
    [id, tenantId]
  );
}

// ✅ Good: Multi-layer caching
async function getProduct(id) {
  const cacheKey = `product:${tenantId}:${id}`;
  
  // Try memory cache first
  let product = memoryCache.get(cacheKey);
  if (product) return product;
  
  // Try Redis cache
  product = await redis.get(cacheKey);
  if (product) {
    memoryCache.set(cacheKey, product);
    return product;
  }
  
  // Fetch from database
  product = await db.query(
    "SELECT * FROM products WHERE id = $1 AND tenant_id = $2",
    [id, tenantId]
  );
  
  // Cache in both layers
  await redis.setex(cacheKey, 3600, product);
  memoryCache.set(cacheKey, product);
  
  return product;
}
```

### 4. Performance Review Checklist

#### Critical Performance Checks
- [ ] Bundle size under 250KB gzipped
- [ ] Core Web Vitals within thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Database queries optimized with proper indexing
- [ ] No synchronous operations in critical paths
- [ ] Proper caching strategies implemented

#### High Priority Performance Checks
- [ ] Code splitting and lazy loading implemented
- [ ] Images optimized and responsive
- [ ] API response times under 200ms
- [ ] Memory leaks prevented
- [ ] Efficient rendering patterns

#### Medium Priority Performance Checks
- [ ] Font loading optimization
- [ ] CDN utilization
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Resource compression enabled
- [ ] Performance monitoring implemented

## Architecture Review Best Practices

### 1. Feature-Sliced Design (FSD) Principles

#### Layer Responsibilities
```typescript
// ❌ Bad: Business logic in UI layer
function UserProfilePage() {
  const [user, setUser] = useState(null);
  
  // Business logic should be in features layer
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      
      // Validation logic should be in entities layer
      if (userData.email && userData.name) {
        setUser(userData);
      }
    }
    fetchUser();
  }, [id]);
  
  return <div>{user?.name}</div>;
}

// ✅ Good: Proper FSD layering
// entities/user/model/user.model.ts
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  tenantId: z.string().uuid()
});

// features/user/api/user-api.ts
export async function getUserById(id: string, tenantId: string) {
  const response = await fetch(`/api/users/${id}`, {
    headers: { 'X-Tenant-ID': tenantId }
  });
  return userSchema.parse(await response.json());
}

// pages/user/ui/UserProfilePage.tsx
function UserProfilePage({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <UserProfile user={user} />;
}
```

#### Import Direction Rules
```typescript
// ❌ Bad: Higher layer importing from lower layer
// entities/user/model/user.model.ts
import { UserProfile } from '../../../features/user/ui/UserProfile'; // WRONG

// ✅ Good: Lower layer can import from higher layer
// features/user/ui/UserProfile.tsx
import { User } from '../../../entities/user/model/user.model'; // CORRECT

// ❌ Bad: Cross-slice imports without @x notation
// features/auth/ui/LoginForm.tsx
import { User } from '../user/model/user.model'; // WRONG

// ✅ Good: Cross-slice imports with @x notation
// features/auth/ui/LoginForm.tsx
import { User } from '@x/user/model/user.model'; // CORRECT
```

### 2. Multi-Tenant Architecture Best Practices

#### Tenant Isolation Patterns
```typescript
// ❌ Bad: No tenant context
class UserService {
  async getUser(id: string) {
    return await db.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
  }
}

// ✅ Good: Tenant-aware service
class UserService {
  constructor(private tenantId: string) {}
  
  async getUser(id: string) {
    return await db.query(
      "SELECT * FROM users WHERE id = $1 AND tenant_id = $2",
      [id, this.tenantId]
    );
  }
}

// ❌ Bad: Global state
let currentTenant: string;

function setTenant(tenantId: string) {
  currentTenant = tenantId;
}

// ✅ Good: Context-based tenant management
interface TenantContext {
  tenantId: string;
  plan: TenantPlan;
  features: string[];
}

class TenantContextManager {
  private context = AsyncLocalStorage<TenantContext>();
  
  async withTenant<T>(
    tenantId: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const tenantData = await this.getTenantData(tenantId);
    return this.context.run({ tenantId, ...tenantData }, operation);
  }
  
  getCurrentTenant(): TenantContext | undefined {
    return this.context.getStore();
  }
}
```

#### Scalability Patterns
```typescript
// ❌ Bad: Monolithic approach
class MarketingWebsite {
  async handleRequest(req: Request) {
    // All logic in one place
    const tenant = this.getTenant(req);
    const user = this.authenticateUser(req);
    const data = this.processData(req, tenant);
    return this.renderResponse(data, tenant, user);
  }
}

// ✅ Good: Modular, scalable approach
// Core request handling
class RequestHandler {
  constructor(
    private tenantResolver: TenantResolver,
    private authenticator: Authenticator,
    private dataProcessor: DataProcessor,
    private responseRenderer: ResponseRenderer
  ) {}
  
  async handleRequest(req: Request): Promise<Response> {
    const tenant = await this.tenantResolver.resolve(req);
    const user = await this.authenticator.authenticate(req, tenant);
    const data = await this.dataProcessor.process(req, tenant, user);
    return this.responseRenderer.render(data, tenant, user);
  }
}

// Tenant-specific optimizations
class TenantDataProcessor implements DataProcessor {
  async process(req: Request, tenant: Tenant, user: User): Promise<Data> {
    // Tenant-specific processing logic
    switch (tenant.plan) {
      case 'enterprise':
        return this.processEnterpriseData(req, user);
      case 'professional':
        return this.processProfessionalData(req, user);
      case 'basic':
        return this.processBasicData(req, user);
      default:
        throw new Error(`Unknown tenant plan: ${tenant.plan}`);
    }
  }
}
```

### 3. Design Patterns Best Practices

#### Repository Pattern
```typescript
// ❌ Bad: Direct database access everywhere
class UserService {
  async createUser(userData: UserData) {
    await db.query(
      "INSERT INTO users (name, email, tenant_id) VALUES ($1, $2, $3)",
      [userData.name, userData.email, userData.tenantId]
    );
  }
  
  async getUser(id: string, tenantId: string) {
    return await db.query(
      "SELECT * FROM users WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );
  }
}

// ✅ Good: Repository pattern with abstraction
interface UserRepository {
  create(userData: UserData): Promise<User>;
  findById(id: string, tenantId: string): Promise<User | null>;
  findByEmail(email: string, tenantId: string): Promise<User | null>;
  update(id: string, updates: Partial<UserData>): Promise<User>;
  delete(id: string, tenantId: string): Promise<void>;
}

class PostgresUserRepository implements UserRepository {
  constructor(private db: Database) {}
  
  async create(userData: UserData): Promise<User> {
    const result = await this.db.query(
      "INSERT INTO users (name, email, tenant_id) VALUES ($1, $2, $3) RETURNING *",
      [userData.name, userData.email, userData.tenantId]
    );
    return UserSchema.parse(result.rows[0]);
  }
  
  async findById(id: string, tenantId: string): Promise<User | null> {
    const result = await this.db.query(
      "SELECT * FROM users WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );
    return result.rows[0] ? UserSchema.parse(result.rows[0]) : null;
  }
}

class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async createUser(userData: UserData): Promise<User> {
    // Business logic here
    const validatedData = UserSchema.parse(userData);
    return await this.userRepository.create(validatedData);
  }
}
```

#### Dependency Injection
```typescript
// ❌ Bad: Hard dependencies
class UserService {
  private userRepository = new PostgresUserRepository(db);
  private emailService = new SendGridEmailService();
  private cache = new RedisCache();
}

// ✅ Good: Dependency injection
interface UserServiceDependencies {
  userRepository: UserRepository;
  emailService: EmailService;
  cache: CacheService;
}

class UserService {
  constructor(private deps: UserServiceDependencies) {}
  
  async createUser(userData: UserData): Promise<User> {
    const user = await this.deps.userRepository.create(userData);
    
    // Send welcome email
    await this.deps.emailService.sendWelcomeEmail(user.email);
    
    // Cache user data
    await this.deps.cache.set(`user:${user.id}`, user);
    
    return user;
  }
}

// Container setup
class DIContainer {
  private services = new Map<string, any>();
  
  register<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }
  
  get<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not registered`);
    }
    return factory();
  }
}

// Usage
const container = new DIContainer();
container.register('userRepository', () => new PostgresUserRepository(db));
container.register('emailService', () => new SendGridEmailService());
container.register('cache', () => new RedisCache());
container.register('userService', () => new UserService({
  userRepository: container.get('userRepository'),
  emailService: container.get('emailService'),
  cache: container.get('cache')
}));
```

### 4. Architecture Review Checklist

#### Critical Architecture Checks
- [ ] FSD layer boundaries respected
- [ ] No circular dependencies
- [ ] Proper import directions (unidirectional)
- [ ] Tenant isolation implemented
- [ ] Single Responsibility Principle followed

#### High Priority Architecture Checks
- [ ] Design patterns implemented correctly
- [ ] Dependency injection used
- [ ] Proper abstraction layers
- [ ] Consistent error handling
- [ ] Repository pattern for data access

#### Medium Priority Architecture Checks
- [ ] Code organization and structure
- [ ] Interface design consistency
- [ ] Documentation completeness
- [ ] Testing architecture
- [ ] Configuration management

## Code Quality Best Practices

### 1. TypeScript Best Practices

#### Type Safety
```typescript
// ❌ Bad: Using 'any' type
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ Good: Proper typing
interface DataItem {
  id: string;
  value: number;
  timestamp: Date;
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value);
}

// ❌ Bad: Type assertion without validation
const user = response.data as User;

// ✅ Good: Runtime validation with Zod
const userResult = UserSchema.safeParse(response.data);
if (!userResult.success) {
  throw new Error('Invalid user data');
}
const user = userResult.data;
```

#### Generic Programming
```typescript
// ❌ Bad: Duplicated code for different types
function getNumberById(id: string): Promise<number | null> {
  // implementation
}

function getStringById(id: string): Promise<string | null> {
  // similar implementation
}

// ✅ Good: Generic function
async function getById<T>(
  id: string, 
  validator: z.ZodSchema<T>
): Promise<T | null> {
  const response = await fetch(`/api/data/${id}`);
  const data = await response.json();
  const result = validator.safeParse(data);
  return result.success ? result.data : null;
}

// Usage
const user = await getById<User>(userId, UserSchema);
const product = await getById<Product>(productId, ProductSchema);
```

### 2. Testing Best Practices

#### Test Organization
```typescript
// ❌ Bad: Unclear test structure
describe('UserService', () => {
  it('should work', async () => {
    // Multiple test cases in one test
    const user = await userService.createUser(userData);
    expect(user).toBeDefined();
    
    const foundUser = await userService.findById(user.id);
    expect(foundUser).toEqual(user);
    
    // Test error case too
    try {
      await userService.createUser(invalidData);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
    }
  });
});

// ✅ Good: Clear, focused tests
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const user = await userService.createUser(validUserData);
      
      expect(user).toMatchObject({
        name: validUserData.name,
        email: validUserData.email
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
    
    it('should throw ValidationError with invalid data', async () => {
      await expect(
        userService.createUser(invalidUserData)
      ).rejects.toThrow(ValidationError);
    });
  });
  
  describe('findById', () => {
    it('should return user when found', async () => {
      const createdUser = await userService.createUser(validUserData);
      const foundUser = await userService.findById(createdUser.id);
      
      expect(foundUser).toEqual(createdUser);
    });
    
    it('should return null when not found', async () => {
      const foundUser = await userService.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });
});
```

#### Mock Strategies
```typescript
// ❌ Bad: Complex mock setup
const mockUserService = {
  createUser: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// ✅ Good: Factory function for mocks
function createMockUserService(overrides: Partial<UserService> = {}) {
  return {
    createUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides
  };
}

// Usage in tests
describe('UserController', () => {
  it('should create user successfully', async () => {
    const mockUser = { id: '123', name: 'John', email: 'john@example.com' };
    const userService = createMockUserService({
      createUser: jest.fn().mockResolvedValue(mockUser)
    });
    
    const controller = new UserController(userService);
    const result = await controller.createUser(validUserData);
    
    expect(result).toEqual(mockUser);
    expect(userService.createUser).toHaveBeenCalledWith(validUserData);
  });
});
```

### 3. Documentation Best Practices

#### Code Documentation
```typescript
// ❌ Bad: No documentation
function calculateTax(amount, rate) {
  return amount * rate;
}

// ✅ Good: Comprehensive documentation
/**
 * Calculates tax amount for a given base amount and tax rate.
 * 
 * @param amount - The base amount to calculate tax on (must be positive)
 * @param rate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns The calculated tax amount
 * @throws {ValidationError} If amount is negative or rate is invalid
 * 
 * @example
 * ```typescript
 * const tax = calculateTax(100, 0.08); // Returns 8
 * ```
 */
function calculateTax(amount: number, rate: number): number {
  if (amount < 0) {
    throw new ValidationError('Amount must be positive');
  }
  if (rate < 0 || rate > 1) {
    throw new ValidationError('Rate must be between 0 and 1');
  }
  
  return amount * rate;
}
```

#### API Documentation
```typescript
// ❌ Bad: No API documentation
app.post('/api/users', async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
});

// ✅ Good: Comprehensive API documentation
/**
 * Create a new user
 * 
 * @route POST /api/users
 * @param {CreateUserRequest} req.body - User creation data
 * @returns {User} Created user object
 * @throws {400} ValidationError - If request data is invalid
 * @throws {409} ConflictError - If user already exists
 * @throws {500} InternalServerError - If server error occurs
 * 
 * @example
 * ```json
 * POST /api/users
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 * ```
 */
app.post('/api/users', 
  validateRequest(CreateUserSchema),
  async (req: Request<{}, {}, CreateUserRequest>, res: Response<User>) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);
```

## Review Process Best Practices

### 1. Review Workflow

#### Pre-Review Preparation
1. **Understand Context**: Review the PR description and related issues
2. **Set Up Environment**: Ensure local environment is ready
3. **Run Tests**: Verify all tests pass locally
4. **Check Build**: Ensure build process succeeds
5. **Review Documentation**: Read relevant documentation

#### Review Execution
1. **Automated Checks**: Run automated review tools first
2. **Security Review**: Focus on security implications
3. **Performance Review**: Assess performance impact
4. **Architecture Review**: Verify architectural compliance
5. **Code Quality Review**: Check code quality and maintainability

#### Post-Review Actions
1. **Provide Feedback**: Give constructive, specific feedback
2. **Discuss Issues**: Address questions and concerns
3. **Verify Fixes**: Review implemented changes
4. **Approve Merge**: Approve when all issues resolved
5. **Document Decisions**: Record important decisions

### 2. Feedback Best Practices

#### Constructive Feedback
```markdown
## ❌ Bad Feedback Examples

" This code is bad. " - Not specific or constructive
" You should use better variable names. " - Vague and unhelpful
" This is wrong. " - Doesn't explain why or how to fix

## ✅ Good Feedback Examples

### Security Issue
**Issue**: Hardcoded API key detected in line 23
**Risk**: Exposes credentials in source code
**Suggestion**: Move to environment variable
```typescript
// Current (line 23)
const apiKey = "sk-1234567890abcdef";

// Suggested fix
const apiKey = process.env.API_KEY;
```

### Performance Issue
**Issue**: N+1 query problem in getUserPosts function
**Impact**: Database performance degradation with multiple users
**Suggestion**: Use JOIN query or batch loading
```typescript
// Current approach creates N+1 queries
// Suggested: Use single query with JOIN
```

### Architecture Issue
**Issue**: Business logic in UI component violates FSD
**Impact**: Reduced maintainability and testability
**Suggestion**: Move logic to features layer
```

#### Feedback Structure
1. **Issue Identification**: Clearly state the problem
2. **Impact Assessment**: Explain why it matters
3. **Suggested Solution**: Provide specific recommendations
4. **Code Examples**: Show before/after when helpful
5. **Resources**: Link to relevant documentation

### 3. Review Metrics and Quality Gates

#### Quality Metrics
- **Security Score**: No critical/high security issues
- **Performance Score**: Core Web Vitals within thresholds
- **Architecture Score**: FSD compliance verified
- **Code Quality Score**: Test coverage > 80%, no lint errors
- **Documentation Score**: All public APIs documented

#### Quality Gates
```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates
on: [pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - name: Security Scan
        run: pnpm audit --audit-level high
        
      - name: Type Check
        run: pnpm type-check
        
      - name: Lint
        run: pnpm lint
        
      - name: Test
        run: pnpm test --coverage
        
      - name: Bundle Size Check
        run: pnpm build && pnpm check-bundle-size
        
      - name: Architecture Check
        run: pnpm check-fsd-compliance
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

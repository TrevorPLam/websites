# Secure Coding Guidelines

These guidelines define secure-by-default practices for this monorepo, incorporating 2026 OWASP standards and enterprise security best practices for modern software development.

## 🎯 2026 Security Landscape Analysis

### Current Threat Environment
- **AI-Powered Attacks**: 400% increase in AI-assisted vulnerability discovery
- **Supply Chain Attacks**: 300% rise in third-party component compromises
- **API Security Breaches**: 250% increase in API-specific attacks
- **Cloud-Native Threats**: Multi-cloud environments introduce new attack vectors
- **Zero-Day Exploitation**: Reduced time from discovery to exploitation

### Regulatory Compliance Drivers
- **Executive Order 14028**: U.S. government software security requirements
- **EU Cyber Resilience Act**: Mandatory security standards for digital products
- **NIST Cybersecurity Framework 2.0**: Updated guidelines for modern threats
- **ISO 27001:2022**: Enhanced information security management standards
- **SOC 2 Type II**: Expanded requirements for security controls

## 🔧 Core Security Principles

### Defense in Depth

**Multi-Layer Security Architecture**
```typescript
interface SecurityLayers {
  application: {
    input_validation: boolean;
    output_encoding: boolean;
    error_handling: boolean;
    logging: boolean;
  };
  network: {
    encryption: boolean;
    authentication: boolean;
    rate_limiting: boolean;
    monitoring: boolean;
  };
  infrastructure: {
    hardening: boolean;
    segmentation: boolean;
    backup: boolean;
    monitoring: boolean;
  };
  data: {
    encryption_at_rest: boolean;
    encryption_in_transit: boolean;
    access_control: boolean;
    retention: boolean;
  };
}
```

### Secure by Default

**Security-First Development**
- **Input Validation**: All external inputs validated by default
- **Output Encoding**: All outputs encoded to prevent injection
- **Least Privilege**: Minimum required permissions for all operations
- **Fail Secure**: Systems fail to secure state by default
- **Zero Trust**: Never trust, always verify all requests

## 🛡️ General Security Practices

### Input Validation

**Validation Framework**
```typescript
interface ValidationRules {
  string_inputs: {
    length_validation: boolean;
    character_validation: boolean;
    encoding_validation: boolean;
    pattern_validation: boolean;
  };
  numeric_inputs: {
    range_validation: boolean;
    type_validation: boolean;
    precision_validation: boolean;
  };
  file_inputs: {
    type_validation: boolean;
    size_validation: boolean;
    content_validation: boolean;
    virus_scanning: boolean;
  };
  api_inputs: {
    schema_validation: boolean;
    authentication: boolean;
    authorization: boolean;
    rate_limiting: boolean;
  };
}
```

**Validation Implementation**
```typescript
// Example: Input validation middleware
const validateInput = (input: unknown, schema: ValidationSchema): ValidationResult => {
  // 1. Type validation
  if (!isValidType(input, schema.type)) {
    return { valid: false, error: 'Invalid type' };
  }
  
  // 2. Length validation
  if (schema.maxLength && input.length > schema.maxLength) {
    return { valid: false, error: 'Input too long' };
  }
  
  // 3. Pattern validation
  if (schema.pattern && !schema.pattern.test(input)) {
    return { valid: false, error: 'Invalid format' };
  }
  
  // 4. Encoding validation
  if (containsMaliciousContent(input)) {
    return { valid: false, error: 'Malicious content detected' };
  }
  
  return { valid: true, value: sanitizeInput(input) };
};
```

### Output Encoding

**Encoding Strategies**
```typescript
interface EncodingStrategies {
  html_output: {
    context: 'html' | 'html_attribute' | 'javascript' | 'css';
    encoding: 'escape' | 'sanitize' | 'strip';
    framework: 'dompurify' | 'helmet' | 'custom';
  };
  json_output: {
    serialization: 'json_stringify' | 'custom';
    validation: 'schema_validation' | 'type_validation';
    encoding: 'unicode_escape' | 'base64';
  };
  url_output: {
    encoding: 'url_encode' | 'url_safe_base64';
    validation: 'url_validation' | 'domain_validation';
  };
  database_output: {
    parameterization: 'prepared_statements' | 'orm';
    escaping: 'sql_escape' | 'parameter_binding';
  };
}
```

### Authentication & Authorization

**Multi-Factor Authentication**
```typescript
interface AuthenticationConfig {
  factors: {
    knowledge: 'password' | 'pin' | 'security_question';
    possession: 'hardware_token' | 'software_token' | 'mobile_app';
    biometric: 'fingerprint' | 'facial_recognition' | 'voice';
    location: 'ip_geolocation' | 'device_fingerprint';
  };
  requirements: {
    high_risk_operations: 2;    // Minimum 2 factors
    administrative_access: 3;   // Minimum 3 factors
    api_access: 2;             // Minimum 2 factors
    user_access: 1;             // Minimum 1 factor
  };
}
```

**Authorization Framework**
```typescript
interface AuthorizationModel {
  rbac: {
    roles: Role[];
    permissions: Permission[];
    role_assignments: RoleAssignment[];
  };
  abac: {
    attributes: Attribute[];
    policies: Policy[];
    decision_engine: 'pdp' | 'custom';
  };
  context_aware: {
    time_constraints: TimeConstraint[];
    location_constraints: LocationConstraint[];
    device_constraints: DeviceConstraint[];
  };
}
```

## 🖥️ TypeScript/Node.js Security

### Type Safety

**Secure Type Definitions**
```typescript
// Secure type definitions with validation
interface SecureUser {
  id: string;                    // UUID validated
  email: string;                  // Email format validated
  role: UserRole;                // Enum validated
  permissions: Permission[];     // Array of validated permissions
  lastLogin: Date;               // Date validated
  isActive: boolean;             // Boolean validated
  tenantId: string;               // UUID validated
}

// Validation decorators
@validateUUID()
@validateEmail()
@validateEnum(UserRole)
class User implements SecureUser {
  // Implementation with runtime validation
}
```

### Input Validation

**Request Validation**
```typescript
import { z } from 'zod';

// Schema validation with Zod
const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(12).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  role: z.enum(['user', 'admin', 'moderator']),
  tenantId: z.string().uuid(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Middleware implementation
const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateUserSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: error.errors 
    });
  }
};
```

### Database Security

**Secure Database Operations**
```typescript
// Parameterized queries with prepared statements
class SecureDatabase {
  async getUserById(id: string, tenantId: string): Promise<User | null> {
    const query = `
      SELECT id, email, role, last_login, is_active, tenant_id
      FROM users 
      WHERE id = $1 
        AND tenant_id = $2 
        AND is_active = true
    `;
    
    try {
      const result = await this.pool.query(query, [id, tenantId]);
      return result.rows[0] || null;
    } catch (error) {
      // Log error without exposing details
      console.error('Database query failed');
      throw new DatabaseError('Query failed');
    }
  }
  
  // ORM with built-in protection
  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.userRepository.create({
      ...userData,
      password: await this.hashPassword(userData.password),
      createdAt: new Date(),
      isActive: true,
    });
  }
}
```

### Error Handling

**Secure Error Handling**
```typescript
// Error handling without information leakage
class SecureErrorHandler {
  handleError(error: Error, req: Request): ErrorResponse {
    const errorId = generateErrorId();
    
    // Log full error for debugging
    logger.error('Application error', {
      errorId,
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      tenantId: req.tenantId,
    });
    
    // Return generic error to client
    return {
      error: 'Internal server error',
      errorId,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Specific error types
  handleValidationError(error: ValidationError): ErrorResponse {
    return {
      error: 'Validation failed',
      details: error.validationErrors,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## 🌐 Frontend Security

### Client-Side Validation

**Input Validation**
```typescript
// Client-side validation (never trust client input alone)
const validateFormInput = (input: string, type: 'email' | 'phone' | 'url'): boolean => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    url: /^https?:\/\/.+/,
  };
  
  return patterns[type].test(input);
};

// React form validation
const SecureForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!validateFormInput(formData.email, 'email')) {
      setErrors({ email: 'Invalid email format' });
      return;
    }
    
    try {
      // Server-side validation (always required)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      // Success handling
      setFormData({});
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Submission failed' });
    }
  };
  
  return (
    // Form implementation with validation
    <form onSubmit={handleSubmit}>
      {/* Form fields with validation */}
    </form>
  );
};
```

### Content Security Policy

**CSP Implementation**
```typescript
// Content Security Policy header
const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https:'],
  'connect-src': ["'self'", 'https://api.example.com'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

// Next.js middleware for CSP
const securityMiddleware = (req: NextRequest, res: NextResponse) => {
  const cspHeader = Object.entries(cspPolicy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
    
  res.setHeader('Content-Security-Policy', cspHeader);
  return res;
};
```

### Authentication Security

**Secure Authentication**
```typescript
// JWT token validation
const validateToken = (token: string): TokenValidation => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
    // Additional validation
    if (!decoded.userId || !decoded.tenantId) {
      return { valid: false, error: 'Invalid token structure' };
    }
    
    if (decoded.exp < Date.now() / 1000) {
      return { valid: false, error: 'Token expired' };
    }
    
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
};

// Secure API client
class SecureAPIClient {
  private token: string;
  
  constructor(token: string) {
    this.token = token;
  }
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'X-Tenant-ID': getTenantId(),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

## 🔗 Supply Chain Security

### Dependency Management

**Secure Package Management**
```json
{
  "package.json": {
    "scripts": {
      "audit": "npm audit --audit-level high",
      "audit:fix": "npm audit fix",
      "outdated": "npm outdated",
      "license-check": "npx license-checker",
      "snyk": "snyk test",
      "retire": "npx retire"
    }
  }
}
```

**Vulnerability Scanning**
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      - name: Run npm audit
        run: npm audit --audit-level high
      - name: Check for outdated packages
        run: npm outdated
```

### Container Security

**Secure Docker Configuration**
```dockerfile
# Multi-stage build for security
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production image with security hardening
FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Security hardening
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 📊 Code Quality & Testing

### Static Analysis

**ESLint Security Configuration**
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:security/recommended"
  ],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-or-no-safety-check": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-mixed-spaces-and-tabs": "error",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-object-injection": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    "security/detect-unsafe-eval": "error",
    "security/detect-unsafe-negation": "error",
    "security/detect-unsafe-regex": "error"
  }
}
```

### Security Testing

**Security Test Suite**
```typescript
describe('Security Tests', () => {
  describe('Input Validation', () => {
    it('should reject SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const result = await validateInput(maliciousInput, 'email');
      expect(result.valid).toBe(false);
    });
    
    it('should reject XSS attempts', async () => {
      const xssInput = '<script>alert("xss")</script>';
      const result = await validateInput(xssInput, 'text');
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Authentication', () => {
    it('should reject expired tokens', () => {
      const expiredToken = generateExpiredToken();
      const result = validateToken(expiredToken);
      expect(result.valid).toBe(false);
    });
    
    it('should reject invalid tokens', () => {
      const invalidToken = 'invalid.token';
      const result = validateToken(invalidToken);
      expect(result.valid).toBe(false);
    });
  });
  
  describe('Authorization', () => {
    it('should reject unauthorized access', async () => {
      const user = await createUser({ role: 'user' });
      const response = await request('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      expect(response.status).toBe(403);
    });
  });
});
```

## 🔧 Implementation Guidelines

### Development Workflow

**Secure Development Process**
1. **Threat Modeling**: Conduct threat modeling during design phase
2. **Secure Coding**: Follow secure coding guidelines during implementation
3. **Code Review**: Security-focused code reviews for all changes
4. **Security Testing**: Automated and manual security testing
5. **Deployment**: Secure deployment with proper configuration
6. **Monitoring**: Continuous security monitoring and alerting

### Tool Integration

**Security Tools Stack**
```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "eslint-plugin-security": "^1.7.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-node": "^11.1.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0",
    "snyk": "^1.1000.0",
    "npm-audit-resolver": "^3.0.0",
    "license-checker": "^25.0.0"
  }
}
```

### CI/CD Integration

**Security Pipeline**
```yaml
# .github/workflows/security-pipeline.yml
name: Security Pipeline
on: [push, pull_request]

jobs:
  security-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run security audit
        run: npm audit --audit-level high
      - name: Run Snyk test
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      - name: Run ESLint
        run: npm run lint
      - name: Run security tests
        run: npm run test:security
```

## 📚 Related Documentation

- [Non-Human Identity Governance](./non-human-identity-governance.md)
- [Composite Identity Audit Logging](./composite-identity-audit-logging.md)
- [Threat Modeling Methodology](./threat-modeling-methodology.md)
- [Security Findings Lifecycle](./security-findings-lifecycle.md)

## 🔄 Maintenance

### Regular Updates

**Monthly Security Updates**
- Update security dependencies
- Review and update security policies
- Conduct security training
- Update threat models

**Quarterly Security Assessments**
- Comprehensive security audit
- Penetration testing
- Vulnerability assessment
- Compliance validation

### Continuous Improvement

**Security Metrics**
- Track security vulnerabilities over time
- Monitor security test coverage
- Measure security incident response time
- Assess security training effectiveness

**Tool Updates**
- Keep security tools up to date
- Evaluate new security technologies
- Update security configurations
- Improve security processes

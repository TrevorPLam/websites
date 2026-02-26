---
name: code-templates
description: |
  **ASSET SKILL** - Codex-optimized code templates for common development patterns.
  USE FOR: Code generation, pattern implementation, development acceleration.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "asset"
---

# Codex Code Templates

## Overview
This asset collection contains Codex-optimized code templates for common development patterns in the marketing websites monorepo.

## Template Categories

### 1. Multi-Tenant Component Templates

#### Tenant-Aware Component Template
```typescript
/**
 * Tenant-Aware Component Template
 * Generated for: {componentName}
 * Tenant Context: Multi-tenant SaaS architecture
 */

import { useTenantContext } from '@repo/infrastructure/tenant-context';
import { TenantConfig } from '@repo/core/tenant';

interface {componentName}Props {
  /** Component-specific props */
  {props}
}

export function {componentName}({ {propList} }: {componentName}Props): JSX.Element {
  const tenant = useTenantContext();
  
  // Tenant-specific logic
  const tenantConfig = tenant.config as TenantConfig;
  const isFeatureEnabled = (feature: string) => 
    tenantConfig.features.includes(feature);
  
  // Performance optimization
  const memoizedValue = useMemo(() => {
    return computeValue(tenant.tenantId, {propList});
  }, [tenant.tenantId, {propDependencies}]);

  return (
    <div data-tenant-id={tenant.tenantId} className="{cssClass}">
      {/* Component implementation */}
      {isFeatureEnabled('advanced-features') && (
        <AdvancedFeatures tenant={tenant} />
      )}
      <BasicContent value={memoizedValue} />
    </div>
  );
}

// Helper functions
function computeValue(tenantId: string, props: {propTypes}): ReturnType {
  // Tenant-specific computation logic
  return {defaultValue};
}

// Component-specific sub-components
function AdvancedFeatures({ tenant }: { tenant: TenantContext }): JSX.Element {
  return (
    <div className="advanced-features">
      {/* Advanced features implementation */}
    </div>
  );
}

function BasicContent({ value }: { value: any }): JSX.Element {
  return (
    <div className="basic-content">
      {/* Basic content implementation */}
    </div>
  );
}
```

#### Tenant Data Hook Template
```typescript
/**
 * Tenant Data Hook Template
 * Generated for: {hookName}
 * Purpose: {purpose}
 */

import { useTenantContext } from '@repo/infrastructure/tenant-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';

// Zod schema for data validation
const {hookNameSchema} = z.object({
  {schemaFields}
});

type {HookNameType} = z.infer<typeof {hookNameSchema}>;

interface Use{HookName}Options {
  /** Auto-refresh interval in milliseconds */
  refetchInterval?: number;
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Initial data for optimistic updates */
  initialData?: {HookNameType};
}

export function use{HookName}(options: Use{HookName}Options = {}) {
  const tenant = useTenantContext();
  
  // Query for fetching data
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['{hookName}', tenant.tenantId],
    queryFn: async () => {
      const response = await fetch(
        `/api/{apiEndpoint}?tenantId=${tenant.tenantId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch {hookName}');
      }
      
      const data = await response.json();
      return {hookNameSchema}.parse(data);
    },
    refetchInterval: options.refetchInterval,
    enabled: options.enabled !== false,
    initialData: options.initialData
  });
  
  // Mutation for updating data
  const mutation = useMutation({
    mutationFn: async (newData: Partial<{HookNameType}>) => {
      const response = await fetch(`/api/{apiEndpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newData,
          tenantId: tenant.tenantId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update {hookName}');
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  return {
    data,
    isLoading,
    error,
    update: mutation.mutate,
    isUpdating: mutation.isPending,
    refetch
  };
}
```

### 2. API Endpoint Templates

#### Tenant-Isolated API Template
```typescript
/**
 * Tenant-Isolated API Endpoint Template
 * Generated for: {endpointName}
 * Method: {method}
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentTenant } from '@repo/infrastructure/auth';
import { {serviceName} } from '@repo/services/{serviceName}';

// Request schema validation
const {endpointNameSchema} = z.object({
  {requestFields}
});

// Response schema
const {endpointNameResponseSchema} = z.object({
  {responseFields}
});

export async function {methodUpper}(request: NextRequest) {
  try {
    // Authenticate and get tenant context
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = {endpointNameSchema}.parse(body);
    
    // Validate tenant access
    if (!tenant.features.includes('{featureName}')) {
      return NextResponse.json(
        { error: 'Feature not available for this tenant' },
        { status: 403 }
      );
    }
    
    // Execute business logic with tenant isolation
    const service = new {serviceName}(tenant.tenantId);
    const result = await service.{methodName}(validatedData);
    
    // Validate and return response
    const validatedResult = {endpointNameResponseSchema}.parse(result);
    
    return NextResponse.json(validatedResult);
    
  } catch (error) {
    console.error('Error in {endpointName}:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Database Service Template
```typescript
/**
 * Database Service Template
 * Generated for: {serviceName}
 * Purpose: {purpose}
 */

import { Database } from '@repo/infrastructure/database';
import { z } from 'zod';

// Entity schema
const {entityNameSchema} = z.object({
  {entityFields}
});

type {EntityNameType} = z.infer<typeof {entityNameSchema}>;

export class {ServiceName} {
  constructor(private tenantId: string) {}
  
  async create(data: Omit<{EntityNameType}, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<{EntityNameType}> {
    const db = Database.getInstance();
    
    const query = `
      INSERT INTO {tableName} (tenant_id, {fields})
      VALUES ($1, {placeholders})
      RETURNING *
    `;
    
    const values = [
      this.tenantId,
      ...Object.values(data)
    ];
    
    const result = await db.query(query, values);
    return {entityNameSchema}.parse(result.rows[0]);
  }
  
  async findById(id: string): Promise<{EntityNameType} | null> {
    const db = Database.getInstance();
    
    const query = `
      SELECT * FROM {tableName}
      WHERE tenant_id = $1 AND id = $2
    `;
    
    const result = await db.query(query, [this.tenantId, id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {entityNameSchema}.parse(result.rows[0]);
  }
  
  async findMany(options: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
  } = {}): Promise<{EntityNameType}[]> {
    const db = Database.getInstance();
    
    let query = `
      SELECT * FROM {tableName}
      WHERE tenant_id = $1
    `;
    
    const values: any[] = [this.tenantId];
    let paramIndex = 2;
    
    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`;
    }
    
    if (options.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(options.limit);
    }
    
    if (options.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(options.offset);
    }
    
    const result = await db.query(query, values);
    return result.rows.map(row => {entityNameSchema}.parse(row));
  }
  
  async update(id: string, data: Partial<{EntityNameType}>): Promise<{EntityNameType}> {
    const db = Database.getInstance();
    
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');
    
    const query = `
      UPDATE {tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE tenant_id = $1 AND id = $2
      RETURNING *
    `;
    
    const values = [
      this.tenantId,
      id,
      ...Object.values(data)
    ];
    
    const result = await db.query(query, values);
    return {entityNameSchema}.parse(result.rows[0]);
  }
  
  async delete(id: string): Promise<void> {
    const db = Database.getInstance();
    
    const query = `
      DELETE FROM {tableName}
      WHERE tenant_id = $1 AND id = $2
    `;
    
    await db.query(query, [this.tenantId, id]);
  }
}
```

### 3. Testing Templates

#### Component Test Template
```typescript
/**
 * Component Test Template
 * Generated for: {componentName}
 * Testing Framework: React Testing Library
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { {componentName} } from './{componentName}';
import { TenantContext } from '@repo/infrastructure/tenant-context';

// Mock tenant context
const mockTenant = {
  tenantId: 'test-tenant-id',
  config: {
    plan: 'professional' as const,
    features: ['{featureName}'],
    domain: 'test.example.com'
  }
};

// Test wrapper with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <TenantContext.Provider value={mockTenant}>
        {children}
      </TenantContext.Provider>
    </QueryClientProvider>
  );
}

describe('{componentName}', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <{componentName} {defaultProps} />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('{componentName.toLowerCase()}')).toBeInTheDocument();
  });
  
  it('displays tenant-specific content', () => {
    render(
      <TestWrapper>
        <{componentName} {defaultProps} />
      </TestWrapper>
    );
    
    expect(screen.getByText(/tenant content/i)).toBeInTheDocument();
  });
  
  it('shows advanced features when enabled', () => {
    render(
      <TestWrapper>
        <{componentName} {defaultProps} />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('advanced-features')).toBeInTheDocument();
  });
  
  it('hides advanced features when disabled', () => {
    const tenantWithoutFeatures = {
      ...mockTenant,
      config: {
        ...mockTenant.config,
        features: []
      }
    };
    
    render(
      <QueryClientProvider client={new QueryClient()}>
        <TenantContext.Provider value={tenantWithoutFeatures}>
          <{componentName} {defaultProps} />
        </TenantContext.Provider>
      </QueryClientProvider>
    );
    
    expect(screen.queryByTestId('advanced-features')).not.toBeInTheDocument();
  });
  
  it('handles user interactions correctly', async () => {
    const onAction = jest.fn();
    
    render(
      <TestWrapper>
        <{componentName} {defaultProps} onAction={onAction} />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: /action/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onAction).toHaveBeenCalledWith({expectedPayload});
    });
  });
  
  it('displays loading state correctly', () => {
    render(
      <TestWrapper>
        <{componentName} {defaultProps} loading={true} />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('handles error states gracefully', () => {
    render(
      <TestWrapper>
        <{componentName} {defaultProps} error="Test error" />
      </TestWrapper>
    );
    
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
  });
});
```

#### API Test Template
```typescript
/**
 * API Endpoint Test Template
 * Generated for: {endpointName}
 * Testing Framework: Jest + Supertest
 */

import request from 'supertest';
import { app } from '../app';
import { Database } from '@repo/infrastructure/database';
import { createTestTenant } from '../test-utils';

describe('{endpointName} API', () => {
  let testTenant: any;
  let authToken: string;
  
  beforeAll(async () => {
    // Setup test tenant
    testTenant = await createTestTenant({
      plan: 'professional',
      features: ['{featureName}']
    });
    
    authToken = generateTestToken(testTenant.tenantId);
  });
  
  afterAll(async () => {
    // Cleanup test data
    await Database.getInstance().query(
      'DELETE FROM tenants WHERE id = $1',
      [testTenant.tenantId]
    );
  });
  
  describe('{methodUpper} /api/{endpointPath}', () => {
    it('returns success for valid request', async () => {
      const response = await request(app)
        .{methodLower}('/api/{endpointPath}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({validRequestData})
        .expect(200);
      
      expect(response.body).toMatchObject({
        {expectedResponseStructure}
      });
    });
    
    it('rejects requests without authentication', async () => {
      const response = await request(app)
        ..{methodLower}('/api/{endpointPath}')
        .send({validRequestData})
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
    
    it('rejects requests with invalid data', async () => {
      const response = await request(app)
        ..{methodLower}('/api/{endpointPath}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({invalidRequestData})
        .expect(400);
      
      expect(response.body.error).toContain('Invalid request data');
    });
    
    it('rejects requests from tenants without required feature', async () => {
      const basicTenant = await createTestTenant({
        plan: 'basic',
        features: []
      });
      
      const basicToken = generateTestToken(basicTenant.tenantId);
      
      const response = await request(app)
        ..{methodLower}('/api/{endpointPath}')
        .set('Authorization', `Bearer ${basicToken}`)
        .send({validRequestData})
        .expect(403);
      
      expect(response.body.error).toContain('Feature not available');
      
      // Cleanup
      await Database.getInstance().query(
        'DELETE FROM tenants WHERE id = $1',
        [basicTenant.tenantId]
      );
    });
    
    it('handles server errors gracefully', async () => {
      // Mock service to throw error
      jest.spyOn({serviceName}.prototype, '{methodName}')
        .mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        ..{methodLower}('/api/{endpointPath}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({validRequestData})
        .expect(500);
      
      expect(response.body).toEqual({
        error: 'Internal server error'
      });
      
      // Restore mock
      jest.restoreAllMocks();
    });
  });
});
```

### 4. Migration Templates

#### Database Migration Template
```typescript
/**
 * Database Migration Template
 * Generated for: {migrationName}
 * Direction: {direction}
 */

import { Database } from '@repo/infrastructure/database';
import { z } from 'zod';

// Migration schema for validation
const MigrationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  executed_at: z.date().optional()
});

type Migration = z.infer<typeof MigrationSchema>;

export async function up(db: Database): Promise<void> {
  // Create migration tracking table if not exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  // Check if migration already executed
  const existingMigration = await db.query(`
    SELECT * FROM migrations WHERE name = $1
  `, ['{migrationName}']);
  
  if (existingMigration.rows.length > 0) {
    console.log('Migration {migrationName} already executed');
    return;
  }
  
  try {
    // Begin transaction
    await db.query('BEGIN');
    
    // Execute migration SQL
    await db.query(`
      {migrationSql}
    `);
    
    // Record migration execution
    await db.query(`
      INSERT INTO migrations (name) VALUES ($1)
    `, ['{migrationName}']);
    
    // Commit transaction
    await db.query('COMMIT');
    
    console.log('Migration {migrationName} executed successfully');
    
  } catch (error) {
    // Rollback on error
    await db.query('ROLLBACK');
    console.error('Migration {migrationName} failed:', error);
    throw error;
  }
}

export async function down(db: Database): Promise<void> {
  try {
    // Begin transaction
    await db.query('BEGIN');
    
    // Execute rollback SQL
    await db.query(`
      {rollbackSql}
    `);
    
    // Remove migration record
    await db.query(`
      DELETE FROM migrations WHERE name = $1
    `, ['{migrationName}']);
    
    // Commit transaction
    await db.query('COMMIT');
    
    console.log('Migration {migrationName} rolled back successfully');
    
  } catch (error) {
    // Rollback on error
    await db.query('ROLLBACK');
    console.error('Migration {migrationName} rollback failed:', error);
    throw error;
  }
}
```

### 5. Performance Optimization Templates

#### Memoized Component Template
```typescript
/**
 * Memoized Component Template
 * Generated for: {componentName}
 * Optimization: Memoization and lazy loading
 */

import { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { useTenantContext } from '@repo/infrastructure/tenant-context';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

interface {componentName}Props {
  /** Expensive computation input */
  data: any[];
  /** Callback function */
  onAction: (item: any) => void;
  /** Display options */
  options: {
    sortBy: string;
    filterBy: string;
  };
}

// Memoized expensive computation
const useExpensiveComputation = (data: any[], options: {componentName}Props['options']) => {
  return useMemo(() => {
    console.log('Running expensive computation...');
    
    return data
      .filter(item => item.category === options.filterBy)
      .sort((a, b) => a[options.sortBy].localeCompare(b[options.sortBy]))
      .map(item => ({
        ...item,
        computed: expensiveCalculation(item)
      }));
  }, [data, options.sortBy, options.filterBy]);
};

// Memoized callback
const useActionCallback = (onAction: {componentName}Props['onAction']) => {
  return useCallback((item: any) => {
    console.log('Action callback executed');
    onAction(item);
  }, [onAction]);
};

// Memoized component
export const {componentName} = memo(function {componentName}({ data, onAction, options }: {componentName}Props) {
  const tenant = useTenantContext();
  
  const computedData = useExpensiveComputation(data, options);
  const handleAction = useActionCallback(onAction);
  
  // Memoized render item
  const renderItem = useCallback((item: any) => (
    <div key={item.id} className="item">
      <h3>{item.title}</h3>
      <p>{item.computed}</p>
      <button onClick={() => handleAction(item)}>
        Action
      </button>
    </div>
  ), [handleAction]);
  
  return (
    <div data-tenant-id={tenant.tenantId} className="{componentName.toLowerCase()}">
      <h2>{componentName}</h2>
      
      <div className="items">
        {computedData.map(renderItem)}
      </div>
      
      <Suspense fallback={<div>Loading heavy component...</div>}>
        <HeavyComponent tenant={tenant} />
      </Suspense>
    </div>
  );
});

// Display name for debugging
{componentName}.displayName = '{componentName}';

// Helper function for expensive computation
function expensiveCalculation(item: any): any {
  // Simulate expensive computation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random();
  }
  return result;
}
```

## Template Usage Guidelines

### 1. Customization Rules
- Replace placeholder values with actual implementation details
- Adjust TypeScript types based on specific requirements
- Customize error handling for specific use cases
- Optimize performance based on actual usage patterns

### 2. Integration Patterns
- Follow established naming conventions
- Maintain consistent code structure
- Use proper TypeScript typing throughout
- Implement comprehensive error handling

### 3. Testing Integration
- Include comprehensive test coverage
- Mock external dependencies appropriately
- Test both success and failure scenarios
- Validate tenant isolation in all tests

## Template Maintenance

### Version Control
- Tag templates with version numbers
- Track breaking changes and updates
- Maintain backward compatibility when possible
- Document template evolution

### Quality Assurance
- Regular template review and updates
- Testing with real-world scenarios
- Performance benchmarking
- Security validation

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

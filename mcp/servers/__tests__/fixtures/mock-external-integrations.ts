/**
 * @file mock-external-integrations.ts
 * @summary Mock external integrations for MCP server testing
 * @security Test-only mock implementations; no real external calls
 * @adr none
 * @requirements MCP-001, TEST-001
 */

import { vi } from 'vitest';

// Mock GitHub API
export const createMockGitHubServer = () => ({
  getRepository: vi.fn().mockResolvedValue({
    id: '123',
    name: 'test-repo',
    full_name: 'test-org/test-repo',
    private: false,
  }),
  createIssue: vi.fn().mockResolvedValue({
    id: '456',
    number: 1,
    title: 'Test Issue',
    state: 'open',
  }),
  getBranch: vi.fn().mockResolvedValue({
    name: 'main',
    commit: { sha: 'abc123' },
  }),
  createPullRequest: vi.fn().mockResolvedValue({
    id: '789',
    number: 1,
    title: 'Test PR',
    state: 'open',
  }),
});

// Mock AWS Services
export const createMockAWSServices = () => ({
  S3: {
    putObject: vi.fn().mockResolvedValue({
      ETag: '"test-etag"',
      Location: 'https://test-bucket.s3.amazonaws.com/test-key',
    }),
    getObject: vi.fn().mockResolvedValue({
      Body: Buffer.from('test content'),
      ContentType: 'application/json',
    }),
    deleteObject: vi.fn().mockResolvedValue({}),
  },
  CloudFormation: {
    createStack: vi.fn().mockResolvedValue({
      StackId:
        'arn:aws:cloudformation:us-east-1:123456789012:stack/test-stack/12345678-1234-1234-1234-123456789012',
    }),
    deleteStack: vi.fn().mockResolvedValue({}),
    describeStacks: vi.fn().mockResolvedValue({
      Stacks: [
        {
          StackName: 'test-stack',
          StackStatus: 'CREATE_COMPLETE',
        },
      ],
    }),
  },
  Lambda: {
    createFunction: vi.fn().mockResolvedValue({
      FunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    }),
    invokeFunction: vi.fn().mockResolvedValue({
      StatusCode: 200,
      Payload: JSON.stringify({ result: 'success' }),
    }),
  },
});

// Mock Database
export const createMockDatabase = () => {
  const data = new Map();

  return {
    query: vi.fn().mockImplementation((sql, params) => {
      // Simple mock implementation
      if (sql.includes('SELECT')) {
        return Promise.resolve({
          rows: Array.from(data.values()).filter((item) =>
            params.every((param) => Object.values(item).includes(param))
          ),
        });
      }
      if (sql.includes('INSERT')) {
        const id = Math.random().toString(36).substr(2, 9);
        const item = { id, ...params };
        data.set(id, item);
        return Promise.resolve({ rows: [item] });
      }
      if (sql.includes('UPDATE')) {
        const [id] = params;
        const item = data.get(id);
        if (item) {
          Object.assign(item, params);
          data.set(id, item);
        }
        return Promise.resolve({ rows: [item] });
      }
      if (sql.includes('DELETE')) {
        const [id] = params;
        data.delete(id);
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    }),

    transaction: vi.fn().mockImplementation((callback) => {
      return callback({
        query: vi.fn().mockImplementation((sql, params) => {
          // Same as above but within transaction
          return Promise.resolve({ rows: [] });
        }),
      });
    }),

    clear: () => data.clear(),
    size: () => data.size,
  };
};

// Mock Authentication Service
export const createMockAuthService = () => ({
  validateToken: vi.fn().mockResolvedValue({
    userId: 'test-user-id',
    tenantId: 'test-tenant-id',
    roles: ['user'],
    permissions: ['read', 'write'],
  }),

  generateToken: vi.fn().mockResolvedValue({
    token: 'mock-jwt-token',
    expiresIn: 3600,
  }),

  refreshToken: vi.fn().mockResolvedValue({
    token: 'new-mock-jwt-token',
    expiresIn: 3600,
  }),

  revokeToken: vi.fn().mockResolvedValue({}),

  getUserPermissions: vi
    .fn()
    .mockResolvedValue(['skill:execute', 'skill:deploy', 'tenant:read', 'tenant:write']),
});

// Mock Redis for caching and rate limiting
export const createMockRedis = () => {
  const store = new Map();

  return {
    get: vi.fn().mockImplementation((key) => {
      return Promise.resolve(store.get(key) || null);
    }),

    set: vi.fn().mockImplementation((key, value, options) => {
      store.set(key, value);
      if (options?.ex) {
        setTimeout(() => store.delete(key), options.ex * 1000);
      }
      return Promise.resolve('OK');
    }),

    del: vi.fn().mockImplementation((key) => {
      const result = store.has(key);
      store.delete(key);
      return Promise.resolve(result ? 1 : 0);
    }),

    exists: vi.fn().mockImplementation((key) => {
      return Promise.resolve(store.has(key) ? 1 : 0);
    }),

    incr: vi.fn().mockImplementation((key) => {
      const current = parseInt(store.get(key) || '0');
      const newValue = current + 1;
      store.set(key, newValue.toString());
      return Promise.resolve(newValue);
    }),

    expire: vi.fn().mockImplementation((key, seconds) => {
      if (store.has(key)) {
        setTimeout(() => store.delete(key), seconds * 1000);
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    }),

    flushall: vi.fn().mockImplementation(() => {
      store.clear();
      return Promise.resolve('OK');
    }),
  };
};

// Mock HTTP Client
export const createMockHttpClient = () => {
  const responses = new Map();

  return {
    get: vi.fn().mockImplementation((url) => {
      return Promise.resolve(responses.get(url) || { data: null, status: 404 });
    }),

    post: vi.fn().mockImplementation((url, data) => {
      return Promise.resolve({
        data: { success: true, ...data },
        status: 200,
      });
    }),

    put: vi.fn().mockImplementation((url, data) => {
      return Promise.resolve({
        data: { success: true, ...data },
        status: 200,
      });
    }),

    delete: vi.fn().mockImplementation((url) => {
      return Promise.resolve({ data: { success: true }, status: 200 });
    }),

    setMockResponse: (url: string, response: any) => {
      responses.set(url, response);
    },

    clearMocks: () => {
      responses.clear();
    },
  };
};

// Mock File System
export const createMockFileSystem = () => {
  const files = new Map();

  return {
    readFile: vi.fn().mockImplementation((path) => {
      return Promise.resolve(files.get(path) || Buffer.from(''));
    }),

    writeFile: vi.fn().mockImplementation((path, data) => {
      files.set(path, Buffer.from(data));
      return Promise.resolve();
    }),

    exists: vi.fn().mockImplementation((path) => {
      return Promise.resolve(files.has(path));
    }),

    unlink: vi.fn().mockImplementation((path) => {
      files.delete(path);
      return Promise.resolve();
    }),

    mkdir: vi.fn().mockResolvedValue({}),

    readdir: vi.fn().mockImplementation((path) => {
      const entries = Array.from(files.keys())
        .filter((key) => key.startsWith(path))
        .map((key) => key.split('/').pop());
      return Promise.resolve(entries);
    }),

    clear: () => files.clear(),
  };
};

// Mock Logger
export const createMockLogger = () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),

  child: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  }),

  clear: vi.fn(),
});

// Mock Metrics Collector
export const createMockMetricsCollector = () => {
  const metrics = new Map();

  return {
    increment: vi.fn().mockImplementation((name, value, tags) => {
      const key = `${name}:${JSON.stringify(tags || {})}`;
      const current = metrics.get(key) || 0;
      metrics.set(key, current + (value || 1));
    }),

    gauge: vi.fn().mockImplementation((name, value, tags) => {
      const key = `${name}:${JSON.stringify(tags || {})}`;
      metrics.set(key, value);
    }),

    histogram: vi.fn().mockImplementation((name, value, tags) => {
      const key = `${name}:${JSON.stringify(tags || {})}`;
      const values = metrics.get(key) || [];
      values.push(value);
      metrics.set(key, values);
    }),

    getMetrics: () => Object.fromEntries(metrics),

    clear: () => metrics.clear(),
  };
};

// Mock Tracer
export const createMockTracer = () => {
  const spans = [];

  return {
    startSpan: vi.fn().mockImplementation((name, options) => {
      const span = {
        name,
        startTime: Date.now(),
        endTime: null,
        tags: options?.tags || {},
        events: [],

        setTag: vi.fn().mockImplementation((key, value) => {
          span.tags[key] = value;
        }),

        logEvent: vi.fn().mockImplementation((event) => {
          span.events.push({ timestamp: Date.now(), ...event });
        }),

        finish: vi.fn().mockImplementation(() => {
          span.endTime = Date.now();
          spans.push(span);
        }),
      };
      return span;
    }),

    getSpans: () => spans,

    clear: () => (spans.length = 0),
  };
};

// Complete mock environment
export const createMockTestEnvironment = () => ({
  github: createMockGitHubServer(),
  aws: createMockAWSServices(),
  database: createMockDatabase(),
  auth: createMockAuthService(),
  redis: createMockRedis(),
  http: createMockHttpClient(),
  fs: createMockFileSystem(),
  logger: createMockLogger(),
  metrics: createMockMetricsCollector(),
  tracer: createMockTracer(),
});

// Reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks();
};

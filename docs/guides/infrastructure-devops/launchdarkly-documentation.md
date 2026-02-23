<!--
/**
 * @file launchdarkly-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for launchdarkly documentation.
 * @entrypoints docs/guides/launchdarkly-documentation.md
 * @exports launchdarkly documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# launchdarkly-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


Official LaunchDarkly documentation for feature flags, feature management, and experimentation as of February 2026.

## Overview

LaunchDarkly is a feature management platform that enables teams to release faster, break nothing, and build products customers love. It provides real-time control over feature flags, context-aware targeting, and product experimentation capabilities.

## Key Features

### Core Capabilities

- **Feature Flags**: Toggle features on/off without code changes
- **Real-time Updates**: Instant flag changes without redeployment
- **Context-Aware Targeting**: Target users by attributes, segments, or custom rules
- **Experimentation**: A/B testing and multivariate experiments
- **SDK Support**: Client and server-side SDKs for all major platforms

### Advanced Features

- **Percentage Rollouts**: Gradual feature rollouts to reduce risk
- **Prerequisites**: Chain dependencies between flags
- **Flag Dependencies**: Complex conditional logic
- **Analytics Integration**: Track flag usage and performance
- **Audit Logging**: Complete audit trail of all flag changes

## Getting Started

### 1. Sign Up for Free Trial

Create a LaunchDarkly account and start a 14-day free trial. After the trial, your account automatically converts to the developer tier plan (free up to 1,000 users/month and 10,000 experiment keys).

```bash
# Visit https://app.launchdarkly.com/signup
# Or use the demo sandbox
# https://demo.app.launchdarkly.com/
```

### 2. Install SDK

Choose the appropriate SDK for your platform:

#### JavaScript/TypeScript

```bash
npm install launchdarkly-js-client-sdk
```

#### Node.js (Server-side)

```bash
npm install launchdarkly-node-server-sdk
```

#### Python

```bash
pip install launchdarkly-server-sdk
```

#### Java

```xml
<dependency>
  <groupId>com.launchdarkly</groupId>
  <artifactId>launchdarkly-java-server-sdk</artifactId>
  <version>[7.0.0,8.0.0)</version>
</dependency>
```

#### .NET

```bash
dotnet add package LaunchDarkly.ServerSide.Sdk
```

#### Go

```bash
go get github.com/launchdarkly/go-server-sdk
```

#### Ruby

```bash
gem install launchdarkly-server-sdk
```

### 3. Initialize Client

#### Client-side Initialization

```typescript
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';

const context = {
  kind: 'user',
  key: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  custom: {
    role: 'premium',
    region: 'us-west',
  },
};

const client = LaunchDarkly.initialize('client-side-id-here', context);
```

#### Server-side Initialization

```typescript
import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

const config = new LaunchDarkly.LDConfig.Builder().build();

const client = new LaunchDarkly.LDClient('sdk-key-here', config);
```

## Feature Flag Types

### Boolean Flags

Simple on/off switches for binary decisions:

```typescript
// Boolean flag definition
const flag = {
  kind: 'boolean',
  variations: [
    { value: true, name: 'On' },
    { value: false, name: 'Off' },
  ],
};

// Usage
const isEnabled = client.variation('feature-key', context);
```

### Multivariate Flags

Multiple variations for complex features:

```typescript
// Multivariate flag definition
const flag = {
  kind: 'string',
  variations: [
    { value: 'v1', name: 'Version 1' },
    { value: 'v2', name: 'Using the new algorithm' },
    { value: 'v3', name: 'Using AI-powered algorithm' },
  ],
};

// Usage
const version = client.variation('algorithm-version', context);
```

### String Flags

Text-based flags for configuration options:

```typescript
// String flag definition
const flag = {
  kind: 'string',
  variations: [
    { value: 'blue', name: 'Blue theme' },
    { value: 'green', name: 'Green theme' },
    { value: 'purple', name: 'Purple theme' },
  ],
};
```

### JSON Flags

Complex structured data for advanced configurations:

```typescript
// JSON flag definition
const flag = {
  kind: 'json',
  variations: [
    {
      value: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderRadius: '8px',
      },
      name: 'Blue theme',
    },
    {
      value: {
        backgroundColor: '#28a745',
        textColor: '#ffffff',
        borderRadius: '12px',
      },
      name: 'Green theme',
    },
  ],
};
```

## SDK Integration

### Basic Usage

```typescript
// Initialize client
const client = LaunchDarkly.initialize('client-side-id', context);

// Wait for initialization
await client.waitForInitialization();

// Evaluate flag
const showNewFeature = client.variation('new-feature', context);
if (showNewFeature) {
  // Show new feature
  renderNewFeature();
}
```

### Safe Evaluation

```typescript
// Safe evaluation without throwing
const result = client.variation('feature-key', context);
if (result.success) {
  console.log('Flag value:', result.value);
} else {
  console.log('Error:', result.error);
}
```

### Type Safety

```typescript
// Define type-safe flag keys
type FlagKeys = 'new-feature' | 'theme' | 'algorithm-version';

// Type-safe evaluation
const getFlagValue = (key: FlagKeys) => {
  return client.variation(key, context);
};

// Usage with type safety
const theme = getFlagValue('theme'); // TypeScript knows valid values
```

## Context and Targeting

### User Context

```typescript
const userContext = {
  kind: 'user',
  key: 'user-123456',
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: 'https://example.com/avatar.jpg',
  custom: {
    role: 'admin',
    subscription: 'premium',
    region: 'us-east',
    preferences: {
      theme: 'dark',
      language: 'en',
    },
  },
};
```

### Organization Context

```typescript
const orgContext = {
  kind: 'organization',
  key: 'org-789',
  name: 'Acme Corporation',
  custom: {
    industry: 'technology',
    size: 'enterprise',
    plan: 'enterprise',
  },
};
```

### Custom Attributes

```typescript
const customContext = {
  kind: 'custom',
  key: 'custom-key',
  custom: {
    device: 'mobile',
    version: '2.1.0',
    environment: 'production',
  },
};
```

### Targeting Rules

#### Individual Targeting

```typescript
// Target specific user
const rule = {
  {
    _id: "rule-1",
    variation: 1,
    contextKind: "user",
    values: ["user-123", "user-456"]
  }
};
```

#### Attribute Targeting

```typescript
// Target by attribute
const rule = {
  {
    _id: "rule-2",
    variation: 1,
    contextKind: "user",
    attribute: "role",
    op: "in",
    values: ["admin", "moderator"]
  }
};
```

#### Segment Targeting

```typescript
// Target by segment
const rule = {
  {
    _id: "rule-3",
    variation: 1,
    contextKind: "user",
    segment: "beta-users"
  }
};
```

## Advanced Features

### Percentage Rollouts

```typescript
// Configure percentage rollout
const rollout = {
  rollout: {
    variations: [
      { variation: 0, weight: 60000 }, // 60% off
      { variation: 1, weight: 40000 }, // 40% on
    ],
    contextKind: 'user',
  },
};
```

### Prerequisites

```typescript
// Flag with prerequisites
const flag = {
  prerequisites: ['base-feature'],
  variations: [
    { value: 'v2', name: 'Advanced version' },
    { value: 'v1', name: 'Basic version' },
  ],
};

// Usage
const advancedFeature = client.variation('advanced-feature', context);
// Only returns "v2" if "base-feature" is true for the context
```

### Flag Dependencies

```typescript
// Flag with dependencies
const flag = {
  _dependencies: ['authentication-enabled', 'user-verified'],
  variations: [
    { value: 'full', name: 'Full experience' },
    { value: 'limited', name: 'Limited experience' },
  ],
};
```

## Real-Time Updates

### Flag Change Subscriptions

#### Client-side Subscriptions

```typescript
// Subscribe to flag changes
client.on('ready', () => {
  console.log('Client ready!');
});

client.on('update', (event) => {
  console.log('Flag changed:', event);

  // Handle specific flag changes
  if (event.key === 'theme') {
    updateTheme(event.value);
  }
});

client.on('error', (error) => {
  console.error('LaunchDarkly error:', error);
});
```

#### Server-side Subscriptions

```typescript
// Server-side flag change listener
client.on('update', (event) => {
  console.log(`Flag ${event.key} changed to ${event.value}`);

  // Update application state
  updateFeatureState(event.key, event.value);
});
```

### React Integration

```typescript
import { useEffect, useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';

function FeatureFlag({ flagKey, children }) {
  const client = useLDClient();
  const [flagValue, setFlagValue] = useState(null);

  useEffect(() => {
    if (!client) return;

    // Get initial value
    const initialValue = client.variation(flagKey, context);
    setFlagValue(initialValue);

    // Subscribe to changes
    const subscription = client.on("update", (event) => {
      if (event.key === flagKey) {
        setFlagValue(event.value);
      }
    });

    return () => subscription.off();
  }, [client, flagKey]);

  return flagValue ? children(flagValue) : null;
}

// Usage
function App() {
  return (
    <div>
      <FeatureFlag flagKey="new-dashboard">
        <NewDashboard />
      </FeatureFlag>
    </div>
  );
}
```

## Experimentation

### A/B Testing

```typescript
// Define experiment
const experiment = {
  key: 'checkout-flow-v2',
  kind: 'experiment',
  variations: [
    { variation: 'control', weight: 50000 },
    { variation: 'variant-a', weight: 25000 },
    { variation: 'variant-b', weight: 25000 },
  ],
  environment: 'production',
  targeting: {
    contextKind: 'user',
    segment: 'beta-users',
  },
};

// Track conversion events
client.track('checkout-completed', {
  value: true,
  metricValue: 1.0,
  data: {
    checkoutType: client.variation('checkout-flow-v2', context),
  },
});
```

### Multivariate Testing

```typescript
// Multivariate experiment
const experiment = {
  key: 'ui-redesign',
  kind: 'experiment',
  variations: [
    { variation: 'control', weight: 40000 },
    { variation: 'variant-a', weight: 20000 },
    { variation: 'platform-mobile', weight: 20000 },
    { variation: 'platform-desktop', weight: 20000 },
  ],
};

// Get experiment details
const experimentDetails = client.getExperiment(experiment.key, context);
```

### Analytics Integration

```typescript
// Track custom events
client.track('button-click', {
  value: true,
  metricValue: 1.0,
  data: {
    buttonId: 'submit-button',
    location: 'checkout-page',
  },
});

// Track conversion events
client.track('purchase-completed', {
  value: true,
  metricValue: 99.95,
  data: {
    orderId: 'order-123',
    amount: 99.95,
  },
});
```

## Platform-Specific Examples

### Next.js Integration

```typescript
// pages/api/flags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LaunchDarkly } from 'launchdarkly-node-server-sdk';

const client = LaunchDarkly.initialize(
  process.env.LAUNCHDARKLY_SDK_KEY!,
  new LaunchDarkly.LDConfig.Builder().build()
);

export async function GET(request: NextRequest) {
  const context = {
    kind: 'user',
    key: request.headers.get('x-user-id') || 'anonymous',
    ip: request.ip,
  };

  const flags = await client.allFlagsState(context);

  return NextResponse.json(flags);
}

// app/components/FeatureFlag.tsx
('use client');

import { useLDClient } from 'launchdarkly-react-client-sdk';

export function FeatureFlag({
  flagKey,
  children,
  fallback = null,
}: {
  flagKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const client = useLDClient();
  const [flagValue, setFlagValue] = useState(null);

  useEffect(() => {
    if (!client) return;

    const initialValue = client.variation(flagKey, {});
    setFlagValue(initialValue);

    const subscription = client.on('update', (event) => {
      if (event.key === flagKey) {
        setFlagValue(event.value);
      }
    });

    return () => subscription.off();
  }, [client, flagKey]);

  return flagValue ? children(flagValue) : fallback;
}
```

### Express.js Integration

```typescript
import express from 'express';
import { LaunchDarkly } from 'launchdarkly-node-server-sdk';

const app = express();
const client = LaunchDarkly.initialize(
  process.env.LAUNCHDARKLY_SDK_KEY!,
  new LaunchDarkly.LDConfig.Builder().build()
);

// Middleware to add user context
app.use((req, res, next) => {
  const user = getUserFromSession(req);
  if (user) {
    req.user = user;
    req.context = {
      kind: 'user',
      key: user.id,
      email: user.email,
      custom: user.attributes,
    };
  }
  next();
});

// Route with feature flag
app.get('/api/feature/:flagKey', async (req, res) => {
  const flagKey = req.params.flagKey;
  const flagValue = await client.variation(flagKey, req.context);

  res.json({ flagKey, flagValue });
});
```

### React Native Integration

```typescript
import { useEffect, useState } from 'react';
import { LaunchDarkly, LDUser } from 'launchdarkly-react-client-sdk';

function App() {
  const [user, setUser] = useState<LDUser | null>(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const client = LaunchDarkly.initialize(
      'mobile-key-here',
      new LaunchDarkly.LDConfig.Builder().build()
    );

    setClient(client);

    // Set user context
    client.identify({
      key: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    });

    setUser(client.getContext());
  }, []);

  const showNewFeature = client?.variation('new-feature', user || {});

  return (
    <View>
      {showNewFeature ? <NewFeature /> : <LegacyFeature />}
    </View>
  );
}
```

### Python Integration

```python
import launchdarkly

# Initialize client
client = launchdarkly.LDClient(
    sdk_key="sdk-key-here",
    config=launchdarkly.LDConfig.Builder().build()
)

# Define context
context = {
    "kind": "user",
    "key": "user-123",
    "custom": {
        "role": "admin",
        "region": "us-west"
    }
}

# Evaluate flag
show_feature = client.variation("feature-key", context)
if show_feature:
    # Enable feature
    enable_new_feature()
```

### Java Integration

```java
import com.launchdarkly.sdk.LDClient;
import com.launchdarkly.sdk.LDConfig;

// Initialize client
LDConfig config = new LDConfig.Builder().build();
LDClient client = new LDClient("sdk-key-here", config);

// Define context
LDUser user = new LDUser.Builder("user-123")
    .email("user@example.com")
    .name("John Doe")
    .custom("role", "admin")
    .build();

// Evaluate flag
boolean showNewFeature = client.boolVariation("feature-key", user);
if (showNewFeature) {
    // Enable feature
    enableNewFeature();
}
```

## Security Best Practices

### SDK Key Management

```typescript
// Environment variables (recommended)
const client = LaunchDarkly.initialize(process.env.LAUNCHDARKLY_SDK_KEY, config);

// Never hardcode keys in code
const BAD = LaunchDarkly.initialize('sdk-key-here', config);
```

### Context Validation

```typescript
// Validate context before use
const validateContext = (context: any) => {
  if (!context.kind || !context.key) {
    throw new Error('Invalid context: kind and key are required');
  }
  return context;
};

const safeEvaluation = (flagKey: string, context: any) => {
  const validContext = validateContext(context);
  return client.variation(flagKey, validContext);
};
```

### Error Handling

```typescript
// Robust error handling
try {
  const result = client.variation('feature-key', context);
  return result.success ? result.value : defaultValue;
} catch (error) {
  console.error('LaunchDarkly error:', error);
  return defaultValue;
}
```

## Performance Optimization

### Client-Side Caching

```typescript
// Client-side SDK automatically caches flag evaluations
// No additional caching needed for basic usage

// For complex context calculations
const memoizedContext = useMemo(
  () => ({
    kind: 'user',
    key: userId,
    custom: {
      role: getUserRole(userId),
      subscription: getSubscriptionTier(userId),
      region: getUserRegion(userId),
    },
  }),
  [userId, getUserRole, getSubscriptionTier, getUserRegion]
);
```

### Server-Side Initialization

```typescript
// Use connection pooling for server-side SDKs
const client = LaunchDarkly.initialize(sdkKey, config);

// Warm up the client
await client.start();
```

### Batch Operations

```typescript
// Batch evaluate multiple flags
const flagKeys = ['feature1', 'feature2', 'feature3'];
const results = await Promise.all(flagKeys.map((key) => client.variation(key, context)));
```

## Monitoring and Analytics

### Flag Usage Tracking

```typescript
// Track flag evaluation metrics
client.track('flag-evaluation', {
  value: true,
  metricValue: 1.0,
  data: {
    flagKey: 'feature-key',
    contextKind: context.kind,
    variation: result.value,
  },
});
```

### Performance Metrics

```typescript
// Monitor SDK performance
client.getFlagSettings().then((settings) => {
  console.log('Connection settings:', settings);
});

// Monitor initialization time
const startTime = Date.now();
await client.waitForInitialization();
const initTime = Date.now() - startTime;
console.log(`SDK initialized in ${initTime}ms`);
```

## Troubleshooting

### Common Issues

#### Initialization Errors

```typescript
// Check SDK key validity
if (!client.isInitialized()) {
  console.error('SDK not initialized. Check your SDK key.');
}

// Check network connectivity
if (client.isOffline()) {
  console.warn('SDK is offline. Using cached values.');
}
```

#### Context Issues

```typescript
// Ensure context has required fields
const context = {
  kind: 'user', // Required
  key: 'user-123', // Required
  // Optional custom fields
};

// Validate context before use
if (!context.kind || !context.key) {
  console.error('Invalid context: kind and key are required');
}
```

#### Targeting Issues

```typescript
// Debug targeting rules
const targeting = client.getFlagSettings();
console.log('Targeting rules:', targeting);
```

### Debug Mode

```typescript
// Enable debug logging
const config = new LaunchDarkly.LDConfig.Builder()
  .debug(true) // Enable debug mode
  .build();

const client = LaunchDarkly.initialize(sdkKey, config);
```

## Best Practices

### Schema Validation

```typescript
// Define flag schemas for type safety
interface FlagConfig {
  key: string;
  kind: 'boolean' | 'string' | 'json';
  description: string;
  tags: string[];
}

const flagConfig: FlagConfig = {
  key: 'new-feature',
  kind: 'boolean',
  description: 'Enable new feature for beta users',
  tags: ['beta', 'feature'],
};
```

### Environment Configuration

```typescript
// Environment-specific configurations
const environments = {
  development: {
    sdkKey: process.env.LAUNCHDARKLY_SDK_KEY_DEV,
    debug: true,
  },
  staging: {
    sdkKey: process.env.LAUNCHDARKLY_SDK_KEY_STAGING,
    debug: false,
  },
  production: {
    sdkKey: process.env.LAUNCHDLY_SDK_KEY_PROD,
    debug: false,
  },
};

const env = process.env.NODE_ENV || 'development';
const config = environments[env];
```

### Testing Strategies

```typescript
// Mock LaunchDarkly for testing
const mockClient = {
  variation: (key: string, context: any) => {
    // Return mock values for testing
    const mockFlags = {
      'new-feature': false,
      'old-feature': true,
    };
    return mockFlags[key] || false;
  },
  isInitialized: () => true,
  on: () => {},
  track: () => {},
};
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Resources

- [LaunchDarkly Documentation](https://launchdarkly.com/docs) - Official documentation and guides
- [Getting Started Guide](https://launchdarkly.com/docs/home/getting-started) - Quick start guide
- [SDK Documentation](https://launchdarkly.com/docs/sdk) - Complete SDK reference
- [Feature Flags API](https://launchdarkly.com/docs/api/feature-flags) - Feature flags API reference
- [Flag Changes](https://launchdarkly.com/docs/sdk/features/flag-changes) - Real-time updates documentation

### SDK References

- [JavaScript SDK](https://launchdarkly.com/docs/sdk/client-side/javascript) - Client-side JavaScript SDK
- [Node.js SDK](https://launchdarkly.com/docs/sdk/server-side/nodejs) - Server-side Node.js SDK
- [React SDK](https://launchdarkly.com/docs/sdk/client-side/react) - React SDK integration
- [Python SDK](https://launchdarkly.com/docs/sdk/server-side/python) - Python SDK documentation
- [Java SDK](https://launchdarkly.com/docs/sdk/server-side/java) - Java SDK documentation
- [.NET SDK](https://launchdarkly.com/docs/sdk/server-side/dotnet) - .NET SDK documentation

### Integration Examples

- [React Integration Guide](https://launchdarkly.com/docs/sdk/client-side/react) - React integration patterns
- [Next.js Integration](https://launchdarkly.com/docs/sdk/client-side/nextjs) - Next.js integration
- [Express.js Integration](https://launchdarkly.com/docs/sdk/server-side/nodejs) - Express.js middleware
- [Mobile Integration](https://launchdarkly.com/docs/sdk/client-side/mobile) - Mobile SDKs (iOS, Android, React Native)

### Community Resources

- [LaunchDarkly Blog](https://launchdarkly.com/blog) - Best practices and case studies
- [Community Forum](https://launchdarkly.com/community) - Community discussions
- [GitHub Repository](https://github.com/launchdarkly) - Source code and issues
- [Support Center](https://support.launchdarkly.com) - Official support

### Learning Resources

- [Feature Flag Best Practices](https://launchdarkly.com/docs/home/flags/best-practices) - Best practices guide
- [Experimentation Guide](https://launchdarkly.com/docs/home/experimentation) - Experimentation guide
- [Targeting Guide](https://launchdarkly.com/docs/home/targeting) - Targeting and segmentation guide
- [Analytics Guide](https://launchdarkly.com/docs/home/analytics) - Analytics and metrics guide


## Implementation

[Add content here]

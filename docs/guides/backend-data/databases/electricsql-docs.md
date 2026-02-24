# electricsql-docs.md

ElectricSQL is a local-first sync layer for PostgreSQL that enables developers to build reactive, real-time applications with automatic data synchronization between client devices and server databases. It provides a read-path sync engine that handles partial replication, data delivery, and fan-out to millions of concurrent users.

## Overview

ElectricSQL (formerly known as "Electric") is a comprehensive sync solution that:

- **Syncs subsets of data** from PostgreSQL into local applications
- **Supports multiple client stores** including TanStack DB, PGlite, and custom solutions
- **Handles real-time updates** via logical replication stream consumption
- **Scales to millions** of concurrent users with minimal database load
- **Provides offline-first** capabilities with automatic conflict resolution

## Architecture

### Sync Engine Components

#### Postgres Sync Service

ElectricSQL runs as a separate Elixir service between your API and database:

```elixir
# Sync service configuration
config :electric, Electric.Repo,
  database_url: System.get_env("DATABASE_URL"),
  pool_size: 10,
  ssl: true
```

#### Data Flow Architecture

```
PostgreSQL Database
       ↓ (Logical Replication Stream)
Electric Sync Service
       ↓ (HTTP API with CDN)
Client Applications
```

### Shapes and Partial Replication

ElectricSQL uses "Shapes" to define what data to sync:

```typescript
// Define a shape for syncing user data
const userShape = db.shape({
  table: 'users',
  where: 'active = true',
  columns: ['id', 'name', 'email', 'updated_at'],
});

// Subscribe to real-time updates
await userShape.subscribe();
```

## Installation and Setup

### Server-Side Setup

#### 1. Install ElectricSQL

```bash
# Using Docker
docker run --name electric \
  -e DATABASE_URL="postgresql://user:pass@localhost:5432/db" \
  -p 5133:5133 \
  electricsql/electric:latest

# Or using Elixir
mix electric.init
```

#### 2. Configure Database

```sql
-- Enable logical replication in PostgreSQL
ALTER SYSTEM SET wal_level = logical;
ALTER SYSTEM SET max_replication_slots = 10;
ALTER SYSTEM SET max_wal_senders = 10;

-- Restart PostgreSQL for changes to take effect
SELECT pg_reload_conf();

-- Create replication user
CREATE USER electric_replicator WITH REPLICATION PASSWORD 'secure_password';
GRANT rds_replication TO electric_replicator;
```

#### 3. Enable Electric on Tables

```sql
-- Enable ElectricSQL on specific tables
SELECT electric.enable_table('public.users');
SELECT electric.enable_table('public.posts');
SELECT electric.enable_table('public.comments');

-- Or enable on all tables
SELECT electric.enable_all_tables();
```

### Client-Side Setup

#### TypeScript/JavaScript Client

```bash
npm install @electric-sql/client
```

```typescript
import { ElectricClient } from '@electric-sql/client';

// Initialize Electric client
const electric = new ElectricClient({
  url: 'http://localhost:5133',
  auth: {
    token: 'your-jwt-token',
  },
});

// Connect to sync service
await electric.connect();
```

#### React Integration

```typescript
import { useElectric } from '@electric-sql/react';

function UserProfile({ userId }: { userId: string }) {
  const { db } = useElectric();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to user data
    const subscription = db.live.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    ).subscribe(setUser);

    return () => subscription.unsubscribe();
  }, [userId, db]);

  return <div>{user?.name}</div>;
}
```

## Data Synchronization

### Basic Sync Patterns

#### Shape-Based Sync

```typescript
// Define a shape for posts with comments
const postsWithComments = db.shape({
  table: 'posts',
  where: 'published = true',
  columns: ['id', 'title', 'content', 'created_at'],
  include: {
    comments: {
      table: 'comments',
      columns: ['id', 'post_id', 'content', 'author_name'],
    },
  },
});

// Sync and subscribe
await postsWithComments.subscribe();
```

#### Real-Time Queries

```typescript
// Live query that updates automatically
const activeUsers = db.live.query(`
  SELECT id, name, email, last_seen
  FROM users 
  WHERE last_seen > NOW() - INTERVAL '1 hour'
  ORDER BY last_seen DESC
`);

// Subscribe to changes
const subscription = activeUsers.subscribe((results) => {
  console.log('Active users updated:', results);
});
```

### Offline Support

#### Local Caching

```typescript
// Data is automatically cached locally
const cachedPosts = await db.query(`
  SELECT * FROM posts 
  WHERE published = true
  ORDER BY created_at DESC
  LIMIT 10
`);

// Works offline - returns cached data
```

#### Conflict Resolution

```typescript
// ElectricSQL handles conflicts automatically
// Using last-write-wins based on timestamps
// Or custom conflict resolution strategies

// Custom conflict resolution
await electric.configure({
  conflictResolution: 'last-write-wins',
  timestampColumn: 'updated_at',
});
```

## Advanced Features

### Authentication and Authorization

#### JWT Integration

```typescript
// Configure JWT authentication
const electric = new ElectricClient({
  url: 'http://localhost:5133',
  auth: {
    token: async () => {
      // Get fresh JWT token
      return await getAuthToken();
    },
    refreshToken: async () => {
      // Refresh token when expired
      return await refreshAuthToken();
    },
  },
});
```

#### Row-Level Security

```sql
-- Implement RLS in PostgreSQL for fine-grained access control
CREATE POLICY user_posts_policy ON posts
  FOR ALL
  TO authenticated_users
  USING (author_id = current_user_id());

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Performance Optimization

#### Selective Sync

```typescript
// Only sync necessary data
const userSpecificData = db.shape({
  table: 'notifications',
  where: `user_id = '${currentUserId}' AND read = false`,
  columns: ['id', 'message', 'created_at'],
});
```

#### Batch Operations

```typescript
// Batch writes for better performance
const batch = db.batch();
batch.insert('posts', {
  title: 'New Post',
  content: 'Post content',
  author_id: userId,
});
batch.update('users', { last_seen: new Date() }, { id: userId });
await batch.commit();
```

### Monitoring and Debugging

#### Sync Status

```typescript
// Monitor sync status
const syncStatus = electric.getSyncStatus();
console.log('Sync status:', {
  connected: syncStatus.connected,
  pendingChanges: syncStatus.pendingChanges,
  lastSync: syncStatus.lastSync,
});
```

#### Debug Mode

```typescript
// Enable debug logging
await electric.configure({
  debug: true,
  logLevel: 'verbose',
});
```

## Integration Examples

### Next.js Application

```typescript
// pages/api/electric.ts
import { ElectricClient } from '@electric-sql/client';

let electric: ElectricClient;

export default async function handler(req, res) {
  if (!electric) {
    electric = new ElectricClient({
      url: process.env.ELECTRIC_URL,
      auth: {
        token: req.session.token,
      },
    });
    await electric.connect();
  }

  // Handle API requests
  if (req.method === 'GET') {
    const data = await electric.db.query('SELECT * FROM posts');
    res.json(data);
  }
}
```

### React Native Application

```typescript
// App.tsx
import { ElectricClient } from '@electric-sql/client';

const electric = new ElectricClient({
  url: 'https://your-electric-service.com',
  auth: {
    token: async () => await SecureStore.getItemAsync('auth_token')
  }
});

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    electric.connect().then(() => setIsConnected(true));
  }, []);

  if (!isConnected) {
    return <LoadingScreen />;
  }

  return <AppContent electric={electric} />;
}
```

## Best Practices

### Schema Design

#### Primary Keys

```sql
-- Always include primary keys
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Timestamps for Sync

```sql
-- Include updated_at for conflict resolution
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Performance Considerations

#### Shape Optimization

```typescript
// Use specific columns instead of SELECT *
const optimizedShape = db.shape({
  table: 'posts',
  columns: ['id', 'title', 'created_at'], // Only needed columns
  where: "published = true AND created_at > NOW() - INTERVAL '30 days'",
});
```

#### Connection Management

```typescript
// Properly manage connections
class ElectricService {
  private electric: ElectricClient;

  async connect() {
    if (!this.electric) {
      this.electric = new ElectricClient(config);
      await this.electric.connect();
    }
    return this.electric;
  }

  async disconnect() {
    if (this.electric) {
      await this.electric.disconnect();
      this.electric = null;
    }
  }
}
```

### Security Best Practices

#### Authentication

```typescript
// Secure token management
const electric = new ElectricClient({
  url: process.env.ELECTRIC_URL,
  auth: {
    token: async () => {
      const token = await getSecureToken();
      if (!token) throw new Error('No auth token');
      return token;
    },
  },
});
```

#### Data Validation

```typescript
// Validate data before sync
const validatePost = (post: any) => {
  if (!post.title || post.title.length > 200) {
    throw new Error('Invalid title');
  }
  if (!post.content || post.content.length > 10000) {
    throw new Error('Invalid content');
  }
  return post;
};

// Use validation
await db.insert('posts', validatePost(newPost));
```

## Troubleshooting

### Common Issues

#### Sync Not Working

```typescript
// Check connection status
const status = electric.getSyncStatus();
if (!status.connected) {
  console.error('Not connected to sync service');
}

// Check authentication
if (status.authError) {
  console.error('Authentication error:', status.authError);
}
```

#### Performance Issues

```typescript
// Monitor query performance
const startTime = performance.now();
await db.query('SELECT * FROM large_table');
const duration = performance.now() - startTime;
console.log(`Query took ${duration}ms`);
```

### Debug Tools

#### ElectricSQL Console

```bash
# Access ElectricSQL console
open http://localhost:5133/console

# View sync status
curl http://localhost:5133/api/status
```

#### Database Monitoring

```sql
-- Monitor replication slots
SELECT * FROM pg_replication_slots;

-- Monitor replication connections
SELECT * FROM pg_stat_replication;
```

## Migration Guide

### From Traditional APIs

#### Before (REST API)

```typescript
// Traditional API approach
const posts = await fetch('/api/posts').then((r) => r.json());
setPosts(posts);

// Manual refresh needed
const refreshPosts = () => {
  fetch('/api/posts')
    .then((r) => r.json())
    .then(setPosts);
};
```

#### After (ElectricSQL)

```typescript
// ElectricSQL approach
const posts = db.live.query('SELECT * FROM posts');
const subscription = posts.subscribe(setPosts);

// Automatic real-time updates
// No manual refresh needed
```

### From Other Sync Solutions

#### Migration Steps

1. **Assess current data model** and ensure compatibility
2. **Set up ElectricSQL service** alongside existing solution
3. **Gradually migrate tables** to ElectricSQL sync
4. **Update client code** to use ElectricSQL client
5. **Decommission old sync solution**

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [ElectricSQL Official Website](https://electric-sql.com/)
- [ElectricSQL Documentation](https://electric-sql.com/docs)
- [ElectricSQL GitHub](https://github.com/electric-sql/electric)
- [PostgreSQL Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [ElectricSQL Community](https://github.com/electric-sql/electric/discussions)
- [ElectricSQL Blog](https://electric-sql.com/blog)

## Implementation

[Add content here]

## Testing

[Add content here]

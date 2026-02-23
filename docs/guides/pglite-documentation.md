<!--
/**
 * @file pglite-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for pglite documentation.
 * @entrypoints docs/guides/pglite-documentation.md
 * @exports pglite documentation
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

# pglite-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


PGlite is a lightweight WebAssembly (WASM) build of PostgreSQL packaged into a TypeScript/JavaScript client library that enables you to run a full PostgreSQL database in the browser, Node.js, and Bun without any external dependencies. Under 3MB gzipped, PGlite provides a complete PostgreSQL experience with support for many extensions including pgvector.

## Overview

PGlite represents a breakthrough in in-browser database technology by:

- **Running PostgreSQL natively in WASM** without Linux virtual machines
- **Providing full SQL compatibility** with standard PostgreSQL features
- **Supporting extensions** like pgvector for AI/ML workloads
- **Offering persistence options** via IndexedDB (browser) or filesystem (Node.js)
- **Enabling local-first applications** with offline capabilities
- **Supporting edge computing** and serverless environments

## Architecture

### WASM Implementation

Unlike previous "Postgres in browser" projects that used Linux virtual machines, PGlite is:

- **Pure PostgreSQL compiled to WASM** using single-user mode
- **Optimized for client-side usage** with minimal overhead
- **Compatible with standard PostgreSQL protocols** and SQL syntax
- **Extension-ready** with modular architecture

### Data Persistence

#### Browser Environment

```typescript
// IndexedDB persistence (default)
const db = new PGlite(); // Automatically persists to IndexedDB

// In-memory only
const db = new PGlite({ dataDir: ':memory:' });
```

#### Node.js/Bun Environment

```typescript
// Filesystem persistence
const db = new PGlite('./my-database');

// In-memory
const db = new PGlite({ dataDir: ':memory:' });
```

## Installation and Setup

### Basic Installation

```bash
npm install @electric-sql/pglite
```

### Quick Start

```typescript
import { PGlite } from '@electric-sql/pglite';

// Create database instance
const db = new PGlite();

// Execute SQL queries
await db.query("SELECT 'Hello world' as message;");
// Returns: { rows: [ { message: "Hello world" } ] }

// Create tables
await db.query(`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

// Insert data
await db.query(
  `
  INSERT INTO users (name, email) 
  VALUES ($1, $2)
`,
  ['John Doe', 'john@example.com']
);

// Query data
const result = await db.query('SELECT * FROM users');
console.log(result.rows);
```

## Core Features

### Database Operations

#### Basic CRUD Operations

```typescript
// Create
await db.query(
  `
  INSERT INTO posts (title, content, author_id)
  VALUES ($1, $2, $3)
`,
  ['My Post', 'Post content', 1]
);

// Read
const posts = await db.query(`
  SELECT p.*, u.name as author_name
  FROM posts p
  JOIN users u ON p.author_id = u.id
  WHERE p.published = true
  ORDER BY p.created_at DESC
`);

// Update
await db.query(
  `
  UPDATE posts 
  SET updated_at = NOW()
  WHERE id = $1
`,
  [postId]
);

// Delete
await db.query('DELETE FROM posts WHERE id = $1', [postId]);
```

#### Transactions

```typescript
// Transaction support
await db.transaction(async (tx) => {
  await tx.query('INSERT INTO audit_log (action) VALUES ($1)', ['create_post']);
  await tx.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
  await tx.query('UPDATE users SET post_count = post_count + 1 WHERE id = $1', [authorId]);
});
```

### Advanced Features

#### Prepared Statements

```typescript
// Prepare statement for better performance
const stmt = await db.prepare(`
  SELECT * FROM users 
  WHERE email = $1 AND active = true
`);

// Execute multiple times
const user1 = await stmt.execute(['user1@example.com']);
const user2 = await stmt.execute(['user2@example.com']);
```

#### Batch Operations

```typescript
// Batch insert for better performance
const users = [
  ['Alice', 'alice@example.com'],
  ['Bob', 'bob@example.com'],
  ['Charlie', 'charlie@example.com'],
];

const values = users.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
const flatUsers = users.flat();

await db.query(
  `
  INSERT INTO users (name, email) 
  VALUES ${values}
`,
  flatUsers
);
```

#### Database Schema Information

```typescript
// Get table information
const tables = await db.query(`
  SELECT table_name, table_type 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
`);

// Get column information
const columns = await db.query(`
  SELECT column_name, data_type, is_nullable, column_default
  FROM information_schema.columns 
  WHERE table_name = 'users'
  ORDER BY ordinal_position
`);
```

## Extensions Support

### pgvector for Vector Operations

```typescript
// Enable pgvector extension
await db.query('CREATE EXTENSION IF NOT EXISTS vector');

// Create table with vector column
await db.query(`
  CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)
  )
`);

// Insert vector data
await db.query(
  `
  INSERT INTO documents (content, embedding)
  VALUES ($1, $2)
`,
  ['Sample document', '[0.1,0.2,0.3,...]']
);

// Vector similarity search
await db.query(
  `
  SELECT content, embedding <=> $1 as distance
  FROM documents
  ORDER BY embedding <=> $1
  LIMIT 5
`,
  [queryVector]
);
```

### Other Extensions

```typescript
// Enable commonly used extensions
await db.query('CREATE EXTENSION IF NOT EXISTS uuid-ossp');
await db.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');

// Use UUID functions
const result = await db.query('SELECT uuid_generate_v4() as id');

// Use text search
await db.query(
  `
  SELECT * FROM documents 
  WHERE content % $1
  ORDER BY similarity(content, $1) DESC
`,
  ['search term']
);
```

## Integration Examples

### React Integration

```typescript
// hooks/usePGlite.ts
import { useState, useEffect } from 'react';
import { PGlite } from '@electric-sql/pglite';

export function usePGlite(dataDir?: string) {
  const [db, setDb] = useState<PGlite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      const pg = new PGlite(dataDir);
      await pg.waitReady;
      setDb(pg);
      setLoading(false);
    };

    initDB();
  }, [dataDir]);

  return { db, loading };
}

// components/UserList.tsx
import { usePGlite } from '../hooks/usePGlite';

export function UserList() {
  const { db, loading } = usePGlite();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (db) {
      db.query('SELECT * FROM users ORDER BY name').then(result => {
        setUsers(result.rows);
      });
    }
  }, [db]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}
```

### Next.js Integration

```typescript
// lib/pglite.ts
import { PGlite } from '@electric-sql/pglite';

let db: PGlite;

export async function getDatabase() {
  if (!db) {
    db = new PGlite('./data/app.db');
    await db.waitReady;

    // Initialize schema if needed
    await initializeSchema(db);
  }
  return db;
}

async function initializeSchema(db: PGlite) {
  const tables = await db.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);

  if (tables.rows.length === 0) {
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
}

// pages/api/users.ts
import { getDatabase } from '../../lib/pglite';

export default async function handler(req, res) {
  const db = await getDatabase();

  if (req.method === 'GET') {
    const users = await db.query('SELECT * FROM users ORDER BY name');
    res.json(users.rows);
  } else if (req.method === 'POST') {
    const { name, email } = req.body;
    await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).json({ message: 'User created' });
  }
}
```

### Node.js Backend Integration

```typescript
// server.ts
import express from 'express';
import { PGlite } from '@electric-sql/pglite';

const app = express();
const db = new PGlite('./data/app.db');

await db.waitReady;

// Middleware
app.use(express.json());

// Routes
app.get('/api/posts', async (req, res) => {
  const posts = await db.query(`
    SELECT p.*, u.name as author_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `);
  res.json(posts.rows);
});

app.post('/api/posts', async (req, res) => {
  const { title, content, authorId } = req.body;

  try {
    await db.transaction(async (tx) => {
      const result = await tx.query(
        `
        INSERT INTO posts (title, content, author_id)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [title, content, authorId]
      );

      await tx.query(
        `
        INSERT INTO audit_log (action, post_id)
        VALUES ('create', $1)
      `,
        [result.rows[0].id]
      );
    });

    res.status(201).json({ message: 'Post created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Use Cases

### Unit Testing

```typescript
// tests/user-service.test.ts
import { PGlite } from '@electric-sql/pglite';
import { UserService } from '../src/user-service';

describe('UserService', () => {
  let db: PGlite;
  let userService: UserService;

  beforeEach(async () => {
    // Fresh database for each test
    db = new PGlite(':memory:');
    await db.waitReady;

    // Setup test schema
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      )
    `);

    userService = new UserService(db);
  });

  it('should create a user', async () => {
    const user = await userService.createUser('John Doe', 'john@example.com');

    expect(user.id).toBeDefined();
    expect(user.name).toBe('John Doe');

    // Verify in database
    const result = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe('John Doe');
  });
});
```

### Local Development

```typescript
// scripts/dev-db.ts
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'fs';

async function setupDevDatabase() {
  const db = new PGlite('./dev-data.db');
  await db.waitReady;

  // Load schema
  const schema = readFileSync('./schema.sql', 'utf8');
  await db.query(schema);

  // Load seed data
  const seedData = readFileSync('./seed.sql', 'utf8');
  await db.query(seedData);

  console.log('Development database setup complete');

  // Keep database running for development
  process.on('SIGINT', async () => {
    console.log('Closing database...');
    await db.close();
    process.exit(0);
  });
}

setupDevDatabase();
```

### Edge AI/RAG Applications

```typescript
// edge-rag.ts
import { PGlite } from '@electric-sql/pglite';

class EdgeRAG {
  private db: PGlite;

  constructor() {
    this.db = new PGlite();
    this.initialize();
  }

  private async initialize() {
    await this.db.waitReady;

    // Setup vector database
    await this.db.query('CREATE EXTENSION IF NOT EXISTS vector');

    await this.db.query(`
      CREATE TABLE documents (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        metadata JSONB,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create vector index for fast search
    await this.db.query(`
      CREATE INDEX ON documents 
      USING ivfflat (embedding vector_cosine_ops)
    `);
  }

  async addDocument(content: string, metadata: any, embedding: number[]) {
    await this.db.query(
      `
      INSERT INTO documents (content, metadata, embedding)
      VALUES ($1, $2, $3)
    `,
      [content, JSON.stringify(metadata), embedding]
    );
  }

  async search(queryEmbedding: number[], limit: number = 5) {
    const results = await this.db.query(
      `
      SELECT content, metadata, embedding <=> $1 as distance
      FROM documents
      ORDER BY embedding <=> $1
      LIMIT $2
    `,
      [queryEmbedding, limit]
    );

    return results.rows.map((row) => ({
      content: row.content,
      metadata: JSON.parse(row.metadata),
      distance: row.distance,
    }));
  }
}
```

## Performance Optimization

### Connection Management

```typescript
// Singleton pattern for better performance
class DatabaseManager {
  private static instance: PGlite;

  static async getInstance(): Promise<PGlite> {
    if (!this.instance) {
      this.instance = new PGlite();
      await this.instance.waitReady;
    }
    return this.instance;
  }
}

// Usage
const db = await DatabaseManager.getInstance();
```

### Query Optimization

```typescript
// Use prepared statements for repeated queries
class UserRepository {
  private getUserStmt: PreparedStatement;
  private updateUserStmt: PreparedStatement;

  constructor(private db: PGlite) {
    this.prepareStatements();
  }

  private async prepareStatements() {
    this.getUserStmt = await this.db.prepare(`
      SELECT * FROM users WHERE id = $1
    `);

    this.updateUserStmt = await this.db.prepare(`
      UPDATE users SET name = $1, email = $2 WHERE id = $3
    `);
  }

  async getUser(id: number) {
    const result = await this.getUserStmt.execute([id]);
    return result.rows[0];
  }

  async updateUser(id: number, name: string, email: string) {
    await this.updateUserStmt.execute([name, email, id]);
  }
}
```

### Memory Management

```typescript
// Clean up resources when done
class DatabaseService {
  private db: PGlite;

  constructor() {
    this.db = new PGlite();
  }

  async close() {
    await this.db.close();
  }
}

// Usage with cleanup
const service = new DatabaseService();
try {
  // Use database
} finally {
  await service.close();
}
```

## Best Practices

### Schema Design

```typescript
// Use appropriate data types
await db.query(`
  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES users(id),
    published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`);

// Add indexes for performance
await db.query('CREATE INDEX idx_posts_author ON posts(author_id)');
await db.query('CREATE INDEX idx_posts_published ON posts(published)');
await db.query('CREATE INDEX idx_posts_created ON posts(created_at)');
```

### Error Handling

```typescript
// Robust error handling
class SafeDatabase {
  constructor(private db: PGlite) {}

  async query(sql: string, params?: any[]) {
    try {
      return await this.db.query(sql, params);
    } catch (error) {
      console.error('Database query error:', error);

      // Handle specific error types
      if (error.message.includes('UNIQUE constraint')) {
        throw new Error('Duplicate entry');
      } else if (error.message.includes('FOREIGN KEY constraint')) {
        throw new Error('Invalid reference');
      }

      throw error;
    }
  }
}
```

### Data Validation

```typescript
// Validate data before insertion
function validateUser(user: any) {
  if (!user.name || user.name.length > 100) {
    throw new Error('Invalid name');
  }

  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error('Invalid email');
  }

  return user;
}

async function createUser(db: PGlite, userData: any) {
  const validatedUser = validateUser(userData);

  return await db.query(
    `
    INSERT INTO users (name, email) 
    VALUES ($1, $2)
    RETURNING *
  `,
    [validatedUser.name, validatedUser.email]
  );
}
```

## Troubleshooting

### Common Issues

#### Database Not Ready

```typescript
// Always wait for database to be ready
const db = new PGlite();
await db.waitReady; // Important!
```

#### Memory Usage

```typescript
// Monitor memory usage
const stats = await db.query(`
  SELECT 
    pg_size_pretty(pg_database_size(current_database())) as db_size,
    pg_size_pretty(pg_total_relation_size('users')) as users_size
`);

console.log('Database size:', stats.rows[0]);
```

#### Performance Issues

```typescript
// Analyze query performance
await db.query('ANALYZE');

const slowQueries = await db.query(`
  SELECT query, mean_time, calls
  FROM pg_stat_statements
  ORDER BY mean_time DESC
  LIMIT 10
`);
```

## Migration Guide

### From SQLite

```typescript
// SQLite to PGlite migration
async function migrateFromSQLite(sqliteDB: any, pgliteDB: PGlite) {
  // Get SQLite schema
  const tables = await sqliteDB.all(`
    SELECT name FROM sqlite_master 
    WHERE type='table'
  `);

  // Convert and create PGlite tables
  for (const table of tables) {
    const schema = await sqliteDB.all(`PRAGMA table_info(${table.name})`);

    const pgSchema = convertSQLiteToPG(schema);
    await pgliteDB.query(pgSchema);
  }

  // Migrate data
  for (const table of tables) {
    const data = await sqliteDB.all(`SELECT * FROM ${table.name}`);

    for (const row of data) {
      const columns = Object.keys(row);
      const values = Object.values(row);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      await pgliteDB.query(
        `
        INSERT INTO ${table.name} (${columns.join(', ')})
        VALUES (${placeholders})
      `,
        values
      );
    }
  }
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [PGlite Official Website](https://pglite.dev/)
- [PGlite Documentation](https://pglite.dev/docs)
- [PGlite GitHub](https://github.com/electric-sql/pglite)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [WebAssembly Documentation](https://webassembly.org/)
- [ElectricSQL Website](https://electric-sql.com/)


## Implementation

[Add content here]


## Testing

[Add content here]

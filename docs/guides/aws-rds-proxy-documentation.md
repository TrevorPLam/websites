# AWS RDS Proxy — Connection Pooling & Database Proxy Reference

> **Version Reference:** AWS RDS Proxy (2026) | PostgreSQL & MySQL compatible | Last Updated: 2026-02-23
> **Purpose:** AI agent reference for RDS Proxy architecture, configuration, connection pooling
> optimization, and multi-tenant workload management.

---

## Table of Contents

1. [What is RDS Proxy?](#what-is-rds-proxy)
2. [Architecture Overview](#architecture-overview)
3. [Supported Engines](#supported-engines)
4. [Core Concepts](#core-concepts)
5. [Creating an RDS Proxy](#creating-an-rds-proxy)
6. [Connection Pooling Configuration](#connection-pooling-configuration)
7. [IAM Authentication](#iam-authentication)
8. [Secrets Manager Integration](#secrets-manager-integration)
9. [TLS/SSL Configuration](#tlsssl-configuration)
10. [Connection Pinning](#connection-pinning)
11. [Failover & High Availability](#failover--high-availability)
12. [Read/Write Splitting](#readwrite-splitting)
13. [Monitoring & Metrics](#monitoring--metrics)
14. [Lambda Integration](#lambda-integration)
15. [Multi-Tenant Patterns](#multi-tenant-patterns)
16. [Best Practices](#best-practices)
17. [Troubleshooting](#troubleshooting)

---

## What is RDS Proxy?

Amazon RDS Proxy is a fully managed, highly available database proxy that sits between your
application and Amazon RDS or Aurora database instances. It maintains a **pool of established
connections** to the database, reducing the overhead of connection management for applications
with high connection churn — particularly serverless functions, microservices, and multi-tenant
architectures.

**Problems RDS Proxy Solves:**

- Hundreds of Lambda functions opening/closing connections simultaneously overwhelming `max_connections`
- Connection overhead (TLS handshake, authentication) on short-lived workloads
- Database failover causing application errors (proxy absorbs failover internally)
- Secret rotation requiring application restarts (proxy handles transparently)

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          Application Layer              │
│  Lambda │ ECS │ EKS │ EC2 │ Fargate     │
└──────────────────┬──────────────────────┘
                   │  Client connections (unlimited)
                   │  Standard PostgreSQL/MySQL protocol
                   ▼
┌─────────────────────────────────────────┐
│           RDS Proxy Endpoint            │
│  ┌───────────────────────────────────┐  │
│  │        Connection Pool            │  │
│  │  ┌────────────────────────────┐   │  │
│  │  │  Multiplexing Engine       │   │  │
│  │  │  (client connections →     │   │  │
│  │  │   DB connections)          │   │  │
│  │  └────────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
│  Secrets Manager │ IAM │ ACM TLS certs  │
└──────────────────┬──────────────────────┘
                   │  Pooled DB connections (limited)
                   ▼
┌─────────────────────────────────────────┐
│    Amazon RDS / Aurora Database         │
│    Writer + Reader instances            │
└─────────────────────────────────────────┘
```

---

## Supported Engines

| Engine                    | Versions Supported     |
| ------------------------- | ---------------------- |
| Amazon RDS for PostgreSQL | 13.x, 14.x, 15.x, 16.x |
| Amazon Aurora PostgreSQL  | 13.x, 14.x, 15.x, 16.x |
| Amazon RDS for MySQL      | 5.7.x, 8.0.x           |
| Amazon Aurora MySQL       | 5.7.x, 8.0.x           |
| Amazon RDS for MariaDB    | 10.5.x, 10.6.x         |

---

## Core Concepts

| Concept                 | Description                                                            |
| ----------------------- | ---------------------------------------------------------------------- |
| **Client Connection**   | Connection from application to RDS Proxy                               |
| **Database Connection** | Connection from RDS Proxy to the actual RDS instance                   |
| **Multiplexing**        | Multiple client connections share a single database connection         |
| **Connection Pinning**  | Client connection bound 1:1 to a DB connection (disables multiplexing) |
| **Borrow Timeout**      | How long a client waits for a DB connection from the pool              |
| **Connection Pool**     | The set of pre-established connections to the DB instance              |
| **Target Group**        | Configuration for database connections (pool size, timeouts)           |
| **Proxy Endpoint**      | The DNS endpoint applications connect to                               |

---

## Creating an RDS Proxy

### Via AWS CLI

```bash
# Step 1: Store DB credentials in Secrets Manager
aws secretsmanager create-secret \
  --name "rds/my-db/proxy-credentials" \
  --secret-string '{
    "username": "app_user",
    "password": "secure-password",
    "engine": "postgres",
    "host": "my-db.cluster-xyz.us-east-1.rds.amazonaws.com",
    "port": 5432,
    "dbname": "production"
  }'

# Step 2: Create IAM role for RDS Proxy
aws iam create-role \
  --role-name RDSProxyRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": { "Service": "rds.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }]
  }'

# Step 3: Attach Secrets Manager permissions to the role
aws iam put-role-policy \
  --role-name RDSProxyRole \
  --policy-name SecretsAccess \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:rds/my-db/*"
    }]
  }'

# Step 4: Create the proxy
aws rds create-db-proxy \
  --db-proxy-name my-app-proxy \
  --engine-family POSTGRESQL \
  --auth '[{
    "AuthScheme": "SECRETS",
    "SecretArn": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:rds/my-db/proxy-credentials",
    "IAMAuth": "REQUIRED"
  }]' \
  --role-arn arn:aws:iam::ACCOUNT_ID:role/RDSProxyRole \
  --vpc-subnet-ids subnet-abc123 subnet-def456 \
  --vpc-security-group-ids sg-xyz789 \
  --require-tls \
  --idle-client-timeout 1800

# Step 5: Register the target DB
aws rds register-db-proxy-targets \
  --db-proxy-name my-app-proxy \
  --db-cluster-identifiers my-aurora-cluster
```

### Via Terraform (IaC Reference)

```hcl
resource "aws_db_proxy" "main" {
  name                   = "my-app-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_security_group_ids = [aws_security_group.rds_proxy.id]
  vpc_subnet_ids         = var.private_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    description = "Production DB credentials"
    iam_auth    = "REQUIRED"
    secret_arn  = aws_secretsmanager_secret.db_credentials.arn
  }

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

resource "aws_db_proxy_default_target_group" "main" {
  db_proxy_name = aws_db_proxy.main.name

  connection_pool_config {
    connection_borrow_timeout    = 120   # seconds
    max_connections_percent      = 70    # % of DB max_connections
    max_idle_connections_percent = 50    # % of max_connections for idle
    session_pinning_filters      = ["EXCLUDE_VARIABLE_SETS"]
  }
}

resource "aws_db_proxy_target" "main" {
  db_proxy_name         = aws_db_proxy.main.name
  target_group_name     = aws_db_proxy_default_target_group.main.name
  db_cluster_identifier = aws_rds_cluster.main.cluster_identifier
}
```

---

## Connection Pooling Configuration

### Key Parameters

```
MaxConnectionsPercent
  - Percentage of DB's max_connections the proxy can use
  - Recommendation: Set at least 30% above recent peak usage
  - Example: If DB max_connections=200 and peak usage is 100 → set to 70% (140 connections)
  - Reason: Proxy redistributes quota across nodes; 30% headroom prevents borrow latency spikes

MaxIdleConnectionsPercent
  - % of MaxConnectionsPercent kept open even when idle
  - Default: 50% of MaxConnectionsPercent
  - Higher = faster connection availability, more DB resources consumed
  - Recommendation: Start at 50%, tune based on traffic patterns

ConnectionBorrowTimeout
  - How long (seconds) a client waits for an available DB connection
  - Default: 120 seconds
  - Lower = faster error feedback; Higher = more patience for bursts
  - Recommendation: 30-60 seconds for interactive workloads
```

### Application-Side Connection Pool Configuration

```python
# Python (psycopg2 + connection pool)
import psycopg2
from psycopg2 import pool

# IMPORTANT: Configure client pool to work WITH RDS Proxy
connection_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=2,
    maxconn=20,  # Does NOT need to match DB max_connections — proxy handles that
    host="my-proxy.proxy-xyz.us-east-1.rds.amazonaws.com",
    port=5432,
    database="production",
    user="app_user",
    password=get_iam_token(),  # Use IAM auth token
    connect_timeout=10,
    options="-c statement_timeout=30000"  # 30s query timeout
)
```

```javascript
// Node.js (pg Pool)
const { Pool } = require('pg');

const pool = new Pool({
  host: 'my-proxy.proxy-xyz.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'production',
  user: 'app_user',
  password: getIAMToken, // Function that returns fresh IAM token
  max: 20, // Max client connections (not DB connections)
  idleTimeoutMillis: 1500000, // MUST be less than RDS Proxy idle timeout (1800000ms default)
  connectionTimeoutMillis: 5000,
  maxUses: 7500, // Rotate connections before proxy's 24-hour limit
});
```

### Critical Timing Constraints

```
Client connection max life:     < 24 hours  (RDS Proxy hard limit; not configurable)
Client idle timeout:            < RDS Proxy idle_client_timeout setting
Max uses per connection:        < 7500 recommended (rotate before 24h limit)

Configure your application pool accordingly:
  maxLifetime: 23 * 60 * 60 * 1000   // 23 hours in ms
  idleTimeout: proxy_idle_timeout - 30s buffer
```

---

## IAM Authentication

IAM auth is the **recommended** authentication method — it eliminates hardcoded passwords.

### Generate IAM Auth Token (Python)

```python
import boto3

def get_rds_iam_token(
    host: str,
    port: int = 5432,
    user: str = "app_user",
    region: str = "us-east-1"
) -> str:
    client = boto3.client("rds", region_name=region)
    token = client.generate_db_auth_token(
        DBHostname=host,
        Port=port,
        DBUsername=user,
        Region=region
    )
    return token  # Valid for 15 minutes
```

### IAM Policy for Applications

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "rds-db:connect",
      "Resource": "arn:aws:rds-db:us-east-1:ACCOUNT_ID:dbuser:prx-PROXY_ID/app_user"
    }
  ]
}
```

### IAM Auth for Lambda

```python
import boto3
import psycopg2
import os

PROXY_ENDPOINT = os.environ['DB_PROXY_HOST']
DB_USER = os.environ['DB_USER']
DB_NAME = os.environ['DB_NAME']
REGION = os.environ['AWS_REGION']

def get_connection():
    rds_client = boto3.client('rds', region_name=REGION)
    token = rds_client.generate_db_auth_token(
        DBHostname=PROXY_ENDPOINT,
        Port=5432,
        DBUsername=DB_USER
    )
    return psycopg2.connect(
        host=PROXY_ENDPOINT,
        port=5432,
        database=DB_NAME,
        user=DB_USER,
        password=token,
        sslmode='require',
        sslrootcert='/opt/python/rds-combined-ca-bundle.pem'
    )

# Initialize OUTSIDE handler for connection reuse
db_connection = None

def lambda_handler(event, context):
    global db_connection
    if db_connection is None or db_connection.closed:
        db_connection = get_connection()

    with db_connection.cursor() as cur:
        cur.execute("SELECT NOW()")
        return cur.fetchone().isoformat()
```

---

## Secrets Manager Integration

RDS Proxy retrieves credentials from Secrets Manager automatically, enabling **zero-downtime
credential rotation**.

```bash
# Enable automatic rotation (30-day cycle)
aws secretsmanager rotate-secret \
  --secret-id "rds/my-db/proxy-credentials" \
  --rotation-lambda-arn arn:aws:lambda:us-east-1:ACCOUNT_ID:function:SecretsManagerRDSRotation \
  --rotation-rules AutomaticallyAfterDays=30

# RDS Proxy detects rotation automatically — no restart required
# Old connections remain valid until next cycle
```

**Secret Format for RDS Proxy:**

```json
{
  "engine": "postgres",
  "host": "my-db.cluster-xyz.us-east-1.rds.amazonaws.com",
  "username": "proxy_user",
  "password": "generated-secure-password",
  "dbname": "production",
  "port": "5432"
}
```

---

## TLS/SSL Configuration

```bash
# RDS Proxy supports TLS 1.2 minimum (TLS 1.3 where supported)
# Uses ACM certificates — auto-rotated, no manual cert management

# Require TLS at proxy creation:
aws rds create-db-proxy \
  --require-tls \
  ... # other params

# Download the AWS RDS CA bundle for your application
curl -O https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

```python
# Connect with TLS verification
conn = psycopg2.connect(
    host=proxy_endpoint,
    sslmode='verify-full',
    sslrootcert='/path/to/global-bundle.pem',
    ...
)
```

---

## Connection Pinning

**Pinning** occurs when RDS Proxy cannot multiplex and must bind a client connection 1:1 to a
database connection. This severely reduces pooling efficiency.

### Causes of Pinning (PostgreSQL)

```sql
-- These operations CAUSE pinning:
SET search_path = myschema;              -- SET commands
CREATE TEMPORARY TABLE temp_data (...); -- Temp tables
DECLARE my_cursor CURSOR FOR ...;       -- Named cursors (in some configs)
SET LOCAL work_mem = '256MB';           -- Session-local settings
LISTEN channel_name;                    -- LISTEN commands

-- These do NOT cause pinning:
SET LOCAL statement_timeout = '30s';   -- transaction-scoped via SET LOCAL is OK in some versions
BEGIN; ... COMMIT;                     -- Regular transactions
PREPARE name AS ...;                   -- Prepared statements (proxy-level)
```

### Mitigation Strategies

```sql
-- Instead of SET search_path = schema (causes pinning):
-- Use schema-qualified table names in queries:
SELECT * FROM myschema.documents WHERE ...;

-- Instead of session-level SET:
-- Use transaction-level SET LOCAL (within BEGIN/COMMIT):
BEGIN;
  SET LOCAL work_mem = '256MB';
  SELECT * FROM large_aggregation;
COMMIT;
-- Note: SET LOCAL within a transaction does NOT pin in recent proxy versions

-- Avoid LISTEN/NOTIFY via proxy — use a direct connection for pub/sub
```

### Monitor Pinning via CloudWatch

```bash
# Key CloudWatch metrics for pinning detection:
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnectionsCurrentlySessionPinned \
  --dimensions Name=ProxyName,Value=my-app-proxy \
  --start-time 2026-02-22T00:00:00Z \
  --end-time 2026-02-23T00:00:00Z \
  --period 300 \
  --statistics Average,Maximum

# Alert threshold: DatabaseConnectionsCurrentlySessionPinned / ClientConnections > 20%
```

---

## Failover & High Availability

```
RDS Proxy provides automatic failover handling:

Primary fails → RDS Proxy detects within seconds
             → Redirects to new primary automatically
             → Client connections experience brief pause (~30s), NOT errors
             → No application-level reconnection logic needed

Without Proxy: Application receives connection errors, must implement retry logic
With Proxy:    Application connection stays alive through failover
```

```python
# Minimal retry still recommended for edge cases:
import time
from typing import Callable, Any

def with_retry(func: Callable, max_retries: int = 3, backoff: float = 0.5) -> Any:
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(backoff * (2 ** attempt))  # Exponential backoff
```

---

## Read/Write Splitting

```bash
# RDS Proxy creates separate endpoints for writer and reader
# Writer endpoint (default):
my-proxy.proxy-xyz.us-east-1.rds.amazonaws.com

# Reader endpoint (for read replicas):
my-proxy-read.endpoint.proxy-xyz.us-east-1.rds.amazonaws.com

# Create a read-only proxy endpoint:
aws rds create-db-proxy-endpoint \
  --db-proxy-name my-app-proxy \
  --db-proxy-endpoint-name my-app-proxy-reader \
  --vpc-subnet-ids subnet-abc123 subnet-def456 \
  --target-role READ_ONLY
```

```python
# Application pattern: separate pool per endpoint
write_pool = create_pool(host=PROXY_WRITER_ENDPOINT)
read_pool  = create_pool(host=PROXY_READER_ENDPOINT)

# Route by operation type
def execute_query(sql: str, params=None, write: bool = False):
    pool = write_pool if write else read_pool
    with pool.connection() as conn:
        return conn.execute(sql, params)
```

---

## Monitoring & Metrics

### Essential CloudWatch Metrics

| Metric                                      | Description                           | Healthy Threshold         |
| ------------------------------------------- | ------------------------------------- | ------------------------- |
| `ClientConnections`                         | Active client-to-proxy connections    | < 80% of max              |
| `DatabaseConnections`                       | Proxy-to-DB connections in use        | < `MaxConnectionsPercent` |
| `MaxDatabaseConnectionsAllowed`             | Maximum allowed DB connections        | Monitor for changes       |
| `DatabaseConnectionsCurrentlySessionPinned` | Pinned connections                    | < 10% of total            |
| `QueryDatabaseResponseLatency`              | DB response time (ms)                 | < 100ms p99               |
| `QueryResponseLatency`                      | End-to-end proxy response time        | < 200ms p99               |
| `ConnectionBorrowLatency`                   | Time to get DB connection from pool   | < 50ms p95                |
| `DatabaseConnectionRequests`                | Connection requests per second        | Trend monitoring          |
| `SQLStatementExecutionTime`                 | Statement execution time distribution | Set SLA-based alert       |

### CloudWatch Dashboard Query (boto3)

```python
import boto3
from datetime import datetime, timedelta

cw = boto3.client('cloudwatch', region_name='us-east-1')

def get_proxy_metrics(proxy_name: str, hours: int = 24):
    metrics = ['ClientConnections', 'DatabaseConnections',
               'DatabaseConnectionsCurrentlySessionPinned',
               'QueryDatabaseResponseLatency']
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)

    results = {}
    for metric in metrics:
        response = cw.get_metric_statistics(
            Namespace='AWS/RDS',
            MetricName=metric,
            Dimensions=[{'Name': 'ProxyName', 'Value': proxy_name}],
            StartTime=start_time,
            EndTime=end_time,
            Period=300,
            Statistics=['Average', 'Maximum']
        )
        results[metric] = response['Datapoints']

    return results
```

---

## Lambda Integration

RDS Proxy is specifically optimized for **Lambda + RDS** — the most common source of connection
exhaustion problems.

```python
# Lambda best practices with RDS Proxy:

import psycopg2
import boto3
import os
from contextlib import contextmanager

# 1. Initialize connection OUTSIDE handler (reused across warm invocations)
_connection = None

def _get_connection():
    global _connection
    if _connection is None or _connection.closed != 0:
        token = boto3.client('rds').generate_db_auth_token(
            DBHostname=os.environ['DB_HOST'],
            Port=5432,
            DBUsername=os.environ['DB_USER']
        )
        _connection = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=token,
            sslmode='require',
            connect_timeout=5,
            options=f"-c statement_timeout={os.environ.get('STATEMENT_TIMEOUT_MS', '10000')}"
        )
        _connection.autocommit = False
    return _connection

@contextmanager
def db_transaction():
    conn = _get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise

# 2. Lambda handler
def lambda_handler(event, context):
    with db_transaction() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name FROM users WHERE active = true")
            return [{"id": r, "name": r} for r in cur.fetchall()]
```

### Lambda Concurrency & Proxy Sizing

```
Lambda reserved concurrency: N
DB max_connections: M
Proxy MaxConnectionsPercent: P

Proxy max DB connections = M * P / 100

For efficient pooling:
  N (lambda concurrency) >> Proxy max DB connections
  Example: 500 lambda instances → 50 DB connections (10:1 multiplexing ratio)

DO NOT set Lambda concurrency == max_connections:
  This eliminates the benefit of the proxy entirely.
```

---

## Multi-Tenant Patterns

### Tenant-Per-Database with Proxy

```python
# Use separate proxy endpoints or a single proxy with multiple secrets
# Option 1: Single proxy, tenant routing via application logic

TENANT_DB_MAP = {
    "tenant_a": "tenant_a_db",
    "tenant_b": "tenant_b_db",
}

def get_tenant_connection(tenant_id: str):
    db_name = TENANT_DB_MAP.get(tenant_id)
    if not db_name:
        raise ValueError(f"Unknown tenant: {tenant_id}")
    return psycopg2.connect(
        host=PROXY_ENDPOINT,  # Single proxy endpoint handles all
        database=db_name,     # Different DB per tenant
        user=DB_USER,
        password=get_iam_token(),
        sslmode='require'
    )
```

### Connection Limits Per Tenant

```sql
-- At the PostgreSQL level, set per-role connection limits
CREATE ROLE tenant_a_user CONNECTION LIMIT 20;
CREATE ROLE tenant_b_user CONNECTION LIMIT 20;

-- RDS Proxy respects these limits and pools accordingly
```

### Preventing Noisy Neighbor via Statement Timeout

```sql
-- Set per-tenant statement timeout at connection time
-- This prevents one tenant's slow query from blocking pool connections
SET statement_timeout = '5000';   -- 5 second hard limit
SET idle_in_transaction_session_timeout = '30000';  -- Kill idle transactions
SET lock_timeout = '2000';        -- Don't wait forever for locks
```

---

## Best Practices

### Architecture

1. **Always use RDS Proxy with Lambda** — Never connect Lambda directly to RDS without proxy
2. **Use IAM authentication** — Eliminates credential exposure and enables zero-downtime rotation
3. **Require TLS** — Set `require_tls = true` at proxy creation; never disable in production
4. **Deploy proxy in same VPC** as application tier — never cross-VPC (latency + security)
5. **Use separate reader endpoint** for read-heavy workloads — distribute load to replicas

### Connection Pool Sizing

6. **Set MaxConnectionsPercent 30% above peak usage** — Internal proxy rebalancing requires headroom
7. **Set client pool `maxLifetime` < 23 hours** — Proxy enforces 24h hard client connection limit
8. **Set client idle timeout < proxy idle timeout** — Prevents unexpected connection drops
9. **Do NOT match Lambda concurrency to DB max_connections** — Defeats pooling purpose
10. **Monitor `ConnectionBorrowLatency`** — Rising p95 indicates pool undersizing

### Operational

11. **Monitor `DatabaseConnectionsCurrentlySessionPinned`** — Alert if > 20% of total connections
12. **Avoid `SET` commands in application code** — Use schema-qualified queries instead
13. **Avoid temporary tables in pooled connections** — Use CTEs or materialized subqueries
14. **Store credentials only in Secrets Manager** — Never in environment variables or code
15. **Enable automatic secret rotation** — 30-day cycle with proxy transparent handling
16. **Use AWS Certificate Manager certs** — Auto-rotated, no manual cert management needed
17. **Set `statement_timeout`** in connection options — Prevents pool exhaustion from runaway queries

---

## Troubleshooting

| Symptom                                           | Likely Cause                                  | Diagnosis                                              | Fix                                                 |
| ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| High `ConnectionBorrowLatency`                    | Pool exhausted                                | Check `DatabaseConnections` vs `MaxConnectionsPercent` | Increase `MaxConnectionsPercent` by 20%             |
| `DatabaseConnectionsCurrentlySessionPinned` > 20% | Pinning from SET/temp tables                  | Review app code for SET commands                       | Remove SET; use schema-qualified names              |
| `Too many connections` errors                     | MaxConnectionsPercent too low                 | CloudWatch: `MaxDatabaseConnectionsAllowed`            | Increase `MaxConnectionsPercent`                    |
| Intermittent connection drops                     | Client pool idle timeout > proxy idle timeout | Check pool `idleTimeoutMillis` vs proxy setting        | Set client idle < proxy idle - 30s                  |
| `SSL required` errors                             | TLS not configured in client                  | Check `sslmode` in connection string                   | Add `sslmode=require`                               |
| IAM token expiry errors                           | Token not refreshed (15min TTL)               | Check token generation timestamp                       | Generate fresh token per connection                 |
| Failover taking > 60s                             | Connection not going through proxy            | Verify endpoint is proxy, not direct RDS               | Update connection string to proxy endpoint          |
| Borrow timeout on Lambda bursts                   | Concurrency exceeds pool                      | Check Lambda concurrency limits                        | Reduce Lambda reserved concurrency or increase pool |

---

## Security Considerations

### 1. Network Security

#### VPC Configuration

```typescript
// Secure VPC setup for RDS Proxy
const secureVpcConfig = {
  vpcId: 'vpc-secure',
  subnetIds: [
    'subnet-private-a', // Private subnets only
    'subnet-private-b',
  ],
  securityGroupIds: [
    'sg-rds-proxy-ingress', // Only from application tier
    'sg-rds-proxy-egress', // Only to RDS instances
  ],

  // Network ACLs for additional security
  networkAclEntries: {
    ingress: [
      {
        protocol: 'tcp',
        ruleNumber: 100,
        cidrBlock: '10.0.0.0/8',
        portRange: { from: 5432, to: 5432 },
      },
    ],
    egress: [
      {
        protocol: 'tcp',
        ruleNumber: 100,
        cidrBlock: '10.0.0.0/8',
        portRange: { from: 5432, to: 5432 },
      },
    ],
  },
};
```

#### TLS/SSL Security

```typescript
// Enforce TLS 1.3 and modern cipher suites
const tlsConfig = {
  requireTLS: true,
  sslMode: 'require',
  tlsVersion: 'TLSv1.3',

  // Custom TLS parameters for enhanced security
  tlsParameters: {
    minProtocolVersion: 'TLSv1.3',
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
    ],
  },
};
```

### 2. Authentication Security

#### IAM Authentication Best Practices

```typescript
// Secure IAM authentication implementation
class SecureRDSProxyAuth {
  private readonly region: string;
  private readonly proxyEndpoint: string;

  constructor(region: string, proxyEndpoint: string) {
    this.region = region;
    this.proxyEndpoint = proxyEndpoint;
  }

  async generateAuthToken(dbUser: string): Promise<string> {
    const signer = new aws.RDS.Signer({
      region: this.region,
      hostname: this.proxyEndpoint,
      port: 5432,
      username: dbUser,
    });

    try {
      const token = await signer.getAuthToken();

      // Validate token format and expiration
      this.validateToken(token);

      return token;
    } catch (error) {
      throw new Error(`Failed to generate auth token: ${error.message}`);
    }
  }

  private validateToken(token: string): void {
    // Token should be base64 encoded and contain timestamp
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }

    // Extract timestamp from token (simplified validation)
    const decoded = Buffer.from(token.split('.')[1], 'base64').toString();
    const timestamp = JSON.parse(decoded).exp;

    // Token should be valid for at least 10 minutes
    const expirationBuffer = 10 * 60 * 1000;
    if (Date.now() + expirationBuffer >= timestamp * 1000) {
      throw new Error('Token expires too soon');
    }
  }

  async refreshConnection(connection: any): Promise<any> {
    // Implement connection refresh with new token
    const newToken = await this.generateAuthToken(connection.user);
    connection.password = newToken;
    return connection;
  }
}
```

### 3. Secrets Management Security

#### Enhanced Secrets Manager Integration

```typescript
// Secure secrets management with rotation
class SecureSecretsManager {
  private readonly secretsManager: AWS.SecretsManager;
  private readonly rotationEnabled: boolean = true;

  constructor() {
    this.secretsManager = new AWS.SecretsManager({
      region: process.env.AWS_REGION,
    });
  }

  async getDatabaseCredentials(secretName: string): Promise<DatabaseCredentials> {
    try {
      const secret = await this.secretsManager
        .getSecretValue({
          SecretId: secretName,
        })
        .promise();

      if (!secret.SecretString) {
        throw new Error('Secret string is empty');
      }

      const credentials = JSON.parse(secret.SecretString);

      // Validate credentials structure
      this.validateCredentials(credentials);

      return credentials;
    } catch (error) {
      throw new Error(`Failed to retrieve credentials: ${error.message}`);
    }
  }

  private validateCredentials(credentials: any): void {
    const requiredFields = ['username', 'password', 'host', 'port', 'dbname'];

    for (const field of requiredFields) {
      if (!credentials[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate password strength
    if (credentials.password.length < 16) {
      console.warn('Password should be at least 16 characters');
    }
  }

  async enableAutomaticRotation(secretName: string): Promise<void> {
    if (!this.rotationEnabled) {
      return;
    }

    await this.secretsManager
      .rotateSecret({
        SecretId: secretName,
        RotationRules: {
          AutomaticallyAfterDays: 30,
          Duration: '12h',
        },
        RotationLambdaARN: process.env.ROTATION_LAMBDA_ARN,
      })
      .promise();
  }
}
```

### 4. Monitoring and Auditing

#### Security Monitoring

```typescript
// Security monitoring and alerting
class RDSProxySecurityMonitor {
  private readonly cloudWatch: AWS.CloudWatch;
  private readonly sns: AWS.SNS;

  constructor() {
    this.cloudWatch = new AWS.CloudWatch();
    this.sns = new AWS.SNS();
  }

  async setupSecurityAlarms(proxyArn: string): Promise<void> {
    const alarms = [
      {
        name: 'RDS-Proxy-High-Failed-Connections',
        metric: 'DatabaseConnectionFailed',
        threshold: 10,
        comparison: 'GreaterThanThreshold',
        evaluationPeriods: 2,
      },
      {
        name: 'RDS-Proxy-Unauthorized-Access',
        metric: 'DatabaseConnectionAuthenticationFailed',
        threshold: 5,
        comparison: 'GreaterThanThreshold',
        evaluationPeriods: 1,
      },
      {
        name: 'RDS-Proxy-TLS-Connection-Failures',
        metric: 'DatabaseConnectionTLSFailures',
        threshold: 3,
        comparison: 'GreaterThanThreshold',
        evaluationPeriods: 2,
      },
    ];

    for (const alarm of alarms) {
      await this.createSecurityAlarm(proxyArn, alarm);
    }
  }

  private async createSecurityAlarm(proxyArn: string, alarm: any): Promise<void> {
    await this.cloudWatch
      .putMetricAlarm({
        AlarmName: alarm.name,
        AlarmDescription: `Security alert: ${alarm.name}`,
        Namespace: 'AWS/RDS/Proxy',
        MetricName: alarm.metric,
        Dimensions: [
          {
            Name: 'DBProxyIdentifier',
            Value: proxyArn,
          },
        ],
        Threshold: alarm.threshold,
        ComparisonOperator: alarm.comparison,
        EvaluationPeriods: alarm.evaluationPeriods,
        Statistic: 'Sum',
        Period: 300, // 5 minutes
        AlarmActions: [process.env.SECURITY_ALERT_SNS_ARN],
        TreatMissingData: 'breaching',
      })
      .promise();
  }

  async auditConnectionAttempts(): Promise<AuditLog[]> {
    // Query CloudWatch Logs for connection attempts
    const logs = await this.cloudWatch
      .filterLogEvents({
        logGroupName: '/aws/rds/proxy',
        filterPattern: '{ $.eventType = "connection" }',
        startTime: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
      })
      .promise();

    return logs.events.map((event) => ({
      timestamp: event.timestamp,
      message: JSON.parse(event.message),
      severity: this.determineSeverity(JSON.parse(event.message)),
    }));
  }

  private determineSeverity(event: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (event.errorCode === 'AUTHENTICATION_FAILED') return 'HIGH';
    if (event.errorCode === 'TLS_HANDSHAKE_FAILED') return 'MEDIUM';
    if (event.errorCode === 'CONNECTION_LIMIT_EXCEEDED') return 'CRITICAL';
    return 'LOW';
  }
}
```

---

## Advanced Implementation Patterns

### 1. Multi-Region Proxy Architecture

```typescript
// Multi-region proxy setup for disaster recovery
class MultiRegionProxyManager {
  private readonly regions: string[];
  private readonly primaryRegion: string;

  constructor(regions: string[], primaryRegion: string) {
    this.regions = regions;
    this.primaryRegion = primaryRegion;
  }

  async setupCrossRegionReplication(): Promise<void> {
    // Setup Aurora Global Database
    const globalCluster = await this.createGlobalCluster();

    // Create proxies in each region
    for (const region of this.regions) {
      await this.createRegionalProxy(region, globalCluster);
    }

    // Configure DNS failover
    await this.setupRoute53Failover();
  }

  private async createGlobalCluster(): Promise<any> {
    const rds = new AWS.RDS({ region: this.primaryRegion });

    return await rds
      .createGlobalCluster({
        GlobalClusterIdentifier: 'app-global-cluster',
        Engine: 'aurora-postgresql',
        EngineVersion: '15.4',
      })
      .promise();
  }

  private async createRegionalProxy(region: string, globalCluster: any): Promise<void> {
    const rds = new AWS.RDS({ region });

    await rds
      .createDBProxy({
        DBProxyName: `app-proxy-${region}`,
        EngineFamily: 'PostgreSQL',
        Auth: [
          {
            AuthScheme: 'SECRETS',
            IAMAuth: 'DISABLED',
            SecretArn: globalCluster.SecretArn,
          },
        ],
        RoleArn: process.env.PROXY_ROLE_ARN,
        VpcSubnetIds: await this.getPrivateSubnets(region),
        RequireTLS: true,
        IdleClientTimeout: 1800, // 30 minutes
      })
      .promise();
  }

  private async setupRoute53Failover(): Promise<void> {
    const route53 = new AWS.Route53();

    // Create health checks for each region
    const healthChecks = await Promise.all(
      this.regions.map((region) =>
        route53
          .createHealthCheck({
            CallerReference: `rds-proxy-${region}`,
            HealthCheckConfig: {
              IPAddress: await this.getProxyEndpoint(region),
              Port: 5432,
              Type: 'TCP',
              ResourcePath: '/',
              FailureThreshold: 3,
              RequestInterval: 30,
            },
          })
          .promise()
      )
    );

    // Create failover records
    await route53
      .changeResourceRecordSets({
        HostedZoneId: process.env.HOSTED_ZONE_ID,
        ChangeBatch: {
          Changes: [
            {
              Action: 'CREATE',
              ResourceRecordSet: {
                Name: 'db.example.com',
                Type: 'A',
                SetIdentifier: 'primary',
                HealthCheckId: healthChecks[0].HealthCheck.Id,
                TTL: 60,
                ResourceRecords: [{ Value: await this.getProxyEndpoint(this.primaryRegion) }],
                Failover: 'PRIMARY',
              },
            },
            {
              Action: 'CREATE',
              ResourceRecordSet: {
                Name: 'db.example.com',
                Type: 'A',
                SetIdentifier: 'secondary',
                HealthCheckId: healthChecks[1].HealthCheck.Id,
                TTL: 60,
                ResourceRecords: [{ Value: await this.getProxyEndpoint(this.regions[1]) }],
                Failover: 'SECONDARY',
              },
            },
          ],
        },
      })
      .promise();
  }
}
```

### 2. Intelligent Connection Pooling

```typescript
// AI-driven connection pool optimization
class IntelligentConnectionPool {
  private readonly metrics: Map<string, PoolMetrics> = new Map();
  private readonly optimizer: PoolOptimizer;

  constructor() {
    this.optimizer = new PoolOptimizer();
    this.startOptimizationLoop();
  }

  async optimizePoolSize(proxyName: string): Promise<PoolConfiguration> {
    const currentMetrics = await this.collectMetrics(proxyName);
    const predictedLoad = await this.predictLoad(currentMetrics);

    const optimalConfig = this.optimizer.calculateOptimalConfig({
      currentMetrics,
      predictedLoad,
      constraints: {
        maxConnections: 1000,
        minConnections: 10,
        costBudget: 500, // USD per month
      },
    });

    await this.applyConfiguration(proxyName, optimalConfig);
    return optimalConfig;
  }

  private async collectMetrics(proxyName: string): Promise<PoolMetrics> {
    const cloudWatch = new AWS.CloudWatch();

    const metrics = await cloudWatch
      .getMetricStatistics({
        Namespace: 'AWS/RDS/Proxy',
        MetricName: 'DatabaseConnections',
        Dimensions: [{ Name: 'DBProxyIdentifier', Value: proxyName }],
        StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        EndTime: new Date(),
        Period: 300,
        Statistics: ['Average', 'Maximum', 'Minimum'],
      })
      .promise();

    return {
      averageConnections: this.calculateAverage(metrics.Datapoints),
      peakConnections: this.calculateMaximum(metrics.Datapoints),
      connectionBorrowLatency: await this.getBorrowLatency(proxyName),
      timestamp: Date.now(),
    };
  }

  private async predictLoad(metrics: PoolMetrics): Promise<LoadPrediction> {
    // Use machine learning to predict next hour load
    const historicalData = await this.getHistoricalData(7); // 7 days
    const prediction = await this.optimizer.predict({
      historical: historicalData,
      current: metrics,
      features: ['hour_of_day', 'day_of_week', 'seasonal_trends'],
    });

    return prediction;
  }

  private startOptimizationLoop(): void {
    setInterval(
      async () => {
        try {
          const proxies = await this.listProxies();

          for (const proxy of proxies) {
            await this.optimizePoolSize(proxy.DBProxyName);
          }
        } catch (error) {
          console.error('Pool optimization failed:', error);
        }
      },
      15 * 60 * 1000
    ); // Every 15 minutes
  }
}
```

---

## References

### Official AWS Documentation

- [AWS RDS Proxy User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)
- [RDS Proxy API Reference](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/Welcome.html)
- [AWS Secrets Manager User Guide](https://docs.aws.amazon.com/secretsmanager/latest/userguide/)
- [IAM Database Authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.html)

### Security and Compliance

- [AWS Security Best Practices](https://docs.aws.amazon.com/whitepapers/latest/security-best-practices/)
- [RDS Security Best Practices](https://docs.aws.amazon.com/whitepapers/latest/rds-security-best-practices/)
- [PCI DSS Compliance with RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PCI_DSS.html)
- [HIPAA Compliance with RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/HIPAA.html)

### Performance and Monitoring

- [Amazon CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/)
- [AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/)
- [AWS Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PerformanceInsights.html)

### Community and Resources

- [AWS Database Blog](https://aws.amazon.com/blogs/database/)
- [RDS Proxy Best Practices](https://aws.amazon.com/blogs/database/amazon-rds-proxy-best-practices-and-tips/)
- [Multi-AZ and Read Replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)

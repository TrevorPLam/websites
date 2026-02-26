---
title: Infrastructure & DevOps Guide
description: Complete infrastructure patterns, CI/CD pipelines, and operational excellence for SaaS platforms
last_updated: 2026-02-26
tags: [#infrastructure #devops #ci-cd #deployment #monitoring #operations]
estimated_read_time: 65 minutes
difficulty: advanced
---

# Infrastructure & DevOps Guide

## Overview

Comprehensive infrastructure and DevOps guide covering CI/CD pipelines, deployment strategies, monitoring, and operational excellence for multi-tenant SaaS platforms. This guide consolidates infrastructure patterns, automation, and best practices.

## Key Features

- **CI/CD Pipelines**: Automated testing, building, and deployment workflows
- **Infrastructure as Code**: Terraform, OpenTofu, and cloud resource management
- **Monitoring & Observability**: Comprehensive logging, metrics, and alerting
- **Deployment Strategies**: Zero-downtime deployments and rollback procedures
- **Operational Excellence**: Incident response, disaster recovery, and scaling

---

## 🚀 CI/CD Pipeline Architecture

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
    paths: ['apps/**', 'packages/**']
  pull_request:
    branches: [main]
    paths: ['apps/**', 'packages/**']

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type check
        run: pnpm type-check
        
      - name: Lint
        run: pnpm lint
        
      - name: Format check
        run: pnpm format:check
        
      - name: Test
        run: pnpm test --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    name: Build Applications
    runs-on: ubuntu-latest
    needs: quality
    
    strategy:
      matrix:
        app: [web, portal, admin]
        
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build ${{ matrix.app }}
        run: pnpm build:${{ matrix.app }}
        
      - name: Analyze bundle
        run: pnpm analyze:${{ matrix.app }}
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.app }}-build
          path: apps/${{ matrix.app }}/.next

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: web-build
          path: apps/web/.next
          
      - name: Deploy to Vercel Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ github.repository }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: web-build
          path: apps/web/.next
          
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ github.repository }}
          
      - name: Run smoke tests
        run: pnpm test:e2e:smoke --baseUrl=https://your-app.vercel.app
```

### Quality Gates

```typescript
// scripts/quality-gates.ts
interface QualityGate {
  name: string;
  check: () => Promise<boolean>;
  threshold: number;
}

export class QualityGateManager {
  private gates: QualityGate[] = [
    {
      name: 'TypeScript Coverage',
      check: async () => {
        const coverage = await getTypeScriptCoverage();
        return coverage >= 95;
      },
      threshold: 95
    },
    {
      name: 'Test Coverage',
      check: async () => {
        const coverage = await getTestCoverage();
        return coverage >= 80;
      },
      threshold: 80
    },
    {
      name: 'Bundle Size',
      check: async () => {
        const size = await getBundleSize();
        return size <= 250 * 1024; // 250KB
      },
      threshold: 250 * 1024
    },
    {
      name: 'Performance Score',
      check: async () => {
        const score = await getLighthouseScore();
        return score >= 90;
      },
      threshold: 90
    }
  ];

  async runAllGates(): Promise<{
    passed: boolean;
    results: Array<{ name: string; passed: boolean; value: number }>;
  }> {
    const results = [];
    
    for (const gate of this.gates) {
      try {
        const passed = await gate.check();
        results.push({ 
          name: gate.name, 
          passed, 
          value: gate.threshold 
        });
        
        if (!passed) {
          console.error(`❌ Quality gate failed: ${gate.name}`);
          return { passed: false, results };
        }
      } catch (error) {
        console.error(`❌ Quality gate error: ${gate.name}`, error);
        return { passed: false, results };
      }
    }
    
    console.log('✅ All quality gates passed');
    return { passed: true, results };
  }
}
```

---

## 🏗️ Infrastructure as Code

### Terraform Configuration

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }

  backend "s3" {
    bucket = "terraform-state-marketing-websites"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
}

provider "vercel" {
  api_token = var.vercel_token
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "marketing-websites-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "marketing-websites-private-${count.index}"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 2}.0/24"
  availability_zone      = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "marketing-websites-public-${count.index}"
    Environment = var.environment
  }
}

# RDS Configuration
resource "aws_db_subnet_group" "main" {
  name       = "marketing-websites-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name        = "marketing-websites-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "marketing-websites-rds-sg"
  description = "Allow RDS traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "marketing-websites-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_instance" "main" {
  identifier = "marketing-websites-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = "marketing_websites"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "marketing-websites-final-snapshot"
  
  tags = {
    Name        = "marketing-websites-db"
    Environment = var.environment
  }
}

# Vercel Project Configuration
resource "vercel_project" "main" {
  name      = "marketing-websites"
  framework = "nextjs"
  
  build_command = "pnpm build"
  
  environment_variables = {
    NODE_ENV = "production"
  }
  
  env {
    key   = "DATABASE_URL"
    value = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
  }
  
  env {
    key   = "NEXTAUTH_SECRET"
    value = random_password.nextauth_secret.result
  }
  
  env {
    key   = "NEXTAUTH_URL"
    value = "https://${vercel_project.main.domains[0].domain}"
  }
}

# Domain Configuration
resource "vercel_project_domain" "main" {
  project_id = vercel_project.main.id
  domain     = var.domain_name
}

# Random Passwords
resource "random_password" "nextauth_secret" {
  length  = 32
  special = true
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}
```

### Variables Configuration

```hcl
# terraform/variables.tf
variable "aws_region" {
  description = "AWS region for infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (staging, production)"
  type        = string
  default     = "staging"
  
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either staging or production."
  }
}

variable "domain_name" {
  description = "Primary domain for the application"
  type        = string
}

variable "vercel_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "marketing_websites"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = null
}
```

### OpenTofu Alternative

```hcl
# tofu/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "opentofu/aws"
      version = "~> 5.0"
    }
  }
}

# Same configuration as Terraform but using OpenTofu
```

---

## 📊 Monitoring & Observability

### OpenTelemetry Configuration

```typescript
// instrumentation.ts
import { trace, metrics, logs } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'marketing-websites',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    headers: {
      'x-api-key': process.env.HONEYCOMB_API_KEY,
    },
  }),
  metricExporter: new OTLPMetricExporter({
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    headers: {
      'x-api-key': process.env.HONEYCOMB_API_KEY,
    },
  }),
  logRecordProcessor: new SimpleLogRecordProcessor(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Custom metrics
const meter = metrics.getMeter('marketing-websites');
const httpRequestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});
const httpRequestDuration = meter.createHistogram('http_request_duration', {
  description: 'HTTP request duration in seconds',
});
const activeConnections = meter.createUpDownCounter('active_connections', {
  description: 'Number of active connections',
});

// Custom tracing
export function tracedOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('marketing-websites');
  const span = tracer.startSpan(name);
  
  return span.startActiveSpan(operation, async (error) => {
    if (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
    } else {
      span.setStatus({ code: SpanStatusCode.OK });
    }
    span.end();
  });
}
```

### Prometheus Metrics

```typescript
// metrics/prometheus.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

export const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of database connections',
  labelNames: ['database'],
});

export const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
  labelNames: ['cache_type'],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);
register.registerMetric(databaseConnections);
register.registerMetric(cacheHitRate);
```

### Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: marketing-websites
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }} seconds"

      - alert: DatabaseConnectionsHigh
        expr: database_connections > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Database connections high"
          description: "Database connections: {{ $value }}"

      - alert: CacheHitRateLow
        expr: cache_hit_rate < 0.8
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit rate low"
          description: "Cache hit rate: {{ $value }}"
```

---

## 🚀 Deployment Strategies

### Blue-Green Deployment

```typescript
// scripts/blue-green-deploy.ts
interface DeploymentConfig {
  bluePort: number;
  greenPort: number;
  healthCheckUrl: string;
  switchDelay: number;
}

export class BlueGreenDeployment {
  constructor(private config: DeploymentConfig) {}

  async deploy(): Promise<void> {
    console.log('🚀 Starting blue-green deployment...');
    
    // 1. Deploy to green environment
    await this.deployToGreen();
    
    // 2. Health check on green
    await this.healthCheck('green');
    
    // 3. Switch traffic to green
    await this.switchToGreen();
    
    // 4. Health check after switch
    await this.healthCheck('green');
    
    // 5. Keep blue for rollback
    console.log('✅ Deployment successful, keeping blue for rollback');
    
    // 6. Optional: Clean up blue after success
    setTimeout(() => this.cleanupBlue(), 300000); // 5 minutes
  }

  private async deployToGreen(): Promise<void> {
    console.log('📦 Deploying to green environment...');
    // Build and deploy to green port
    await this.buildApplication();
    await this.startGreenEnvironment();
  }

  private async healthCheck(environment: 'blue' | 'green'): Promise<void> {
    const port = environment === 'blue' ? this.config.bluePort : this.config.greenPort;
    const url = `http://localhost:${port}${this.config.healthCheckUrl}`;
    
    console.log(`🏥 Health checking ${environment} environment...`);
    
    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`✅ ${environment} health check passed`);
          return;
        }
      } catch (error) {
        console.log(`⏳ ${environment} health check attempt ${i + 1}/30 failed`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`❌ ${environment} health check failed`);
  }

  private async switchToGreen(): Promise<void> {
    console.log('🔄 Switching traffic to green environment...');
    
    // Update load balancer configuration
    await this.updateLoadBalancer('green');
    
    // Wait for switch to propagate
    await new Promise(resolve => setTimeout(resolve, this.config.switchDelay));
    
    console.log('✅ Traffic switched to green environment');
  }

  private async rollback(): Promise<void> {
    console.log('🔄 Rolling back to blue environment...');
    await this.updateLoadBalancer('blue');
    console.log('✅ Rollback completed');
  }

  private async cleanupBlue(): Promise<void> {
    console.log('🧹 Cleaning up blue environment...');
    await this.stopBlueEnvironment();
    console.log('✅ Blue environment cleaned up');
  }
}
```

### Canary Deployment

```typescript
// scripts/canary-deploy.ts
interface CanaryConfig {
  canaryPort: number;
  stablePort: number;
  trafficPercentage: number;
  healthCheckUrl: string;
  duration: number;
}

export class CanaryDeployment {
  constructor(private config: CanaryConfig) {}

  async deploy(): Promise<void> {
    console.log('🕊️ Starting canary deployment...');
    
    // 1. Deploy canary version
    await this.deployCanary();
    
    // 2. Gradually increase traffic
    await this.gradualTrafficIncrease();
    
    // 3. Full deployment
    await this.fullDeployment();
    
    console.log('✅ Canary deployment completed');
  }

  private async deployCanary(): Promise<void> {
    console.log('📦 Deploying canary version...');
    await this.buildCanaryApplication();
    await this.startCanaryEnvironment();
    await this.healthCheck('canary');
  }

  private async gradualTrafficIncrease(): Promise<void> {
    const increments = [5, 10, 25, 50, 75, 100];
    
    for (const percentage of increments) {
      console.log(`📈 Routing ${percentage}% traffic to canary...`);
      await this.updateTrafficSplit(percentage);
      await this.monitorDuration(this.config.duration / increments.length);
      
      const metrics = await this.getCanaryMetrics();
      if (!this.isCanaryHealthy(metrics)) {
        console.log('❌ Canary unhealthy, rolling back...');
        await this.rollback();
        return;
      }
    }
  }

  private async fullDeployment(): Promise<void> {
    console.log('🚀 Promoting canary to stable...');
    await this.promoteCanaryToStable();
    await this.cleanupCanary();
  }

  private async rollback(): Promise<void> {
    console.log('🔄 Rolling back canary deployment...');
    await this.updateTrafficSplit(0);
    await this.cleanupCanary();
    console.log('✅ Rollback completed');
  }
}
```

---

## 🔧 Operational Excellence

### Incident Response

```typescript
// incident-response.ts
interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed';
  description: string;
  impact: string;
  timeline: IncidentEvent[];
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

interface IncidentEvent {
  timestamp: Date;
  type: 'status_change' | 'action_taken' | 'metric_alert' | 'user_report';
  message: string;
  author: string;
}

export class IncidentManager {
  private incidents = new Map<string, Incident>();
  private alertingSystem: AlertingSystem;

  async createIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'timeline'>): Promise<Incident> {
    const newIncident: Incident = {
      ...incident,
      id: generateIncidentId(),
      createdAt: new Date(),
      timeline: [{
        timestamp: new Date(),
        type: 'status_change',
        message: `Incident created: ${incident.title}`,
        author: 'system'
      }]
    };

    this.incidents.set(newIncident.id, newIncident);
    
    // Send alerts
    await this.alertingSystem.sendIncidentAlert(newIncident);
    
    // Create Slack channel
    await this.createSlackChannel(newIncident);
    
    // Notify on-call engineer
    await this.notifyOnCallEngineer(newIncident);
    
    return newIncident;
  }

  async updateIncident(
    incidentId: string, 
    updates: Partial<Incident>,
    event: Omit<IncidentEvent, 'timestamp'>
  ): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const updatedIncident = {
      ...incident,
      ...updates,
      timeline: [
        ...incident.timeline,
        {
          ...event,
          timestamp: new Date()
        }
      ]
    };

    this.incidents.set(incidentId, updatedIncident);
    
    // Update Slack channel
    await this.updateSlackChannel(updatedIncident);
    
    return updatedIncident;
  }

  async resolveIncident(
    incidentId: string, 
    resolution: string,
    author: string
  ): Promise<Incident> {
    return this.updateIncident(incidentId, {
      status: 'resolved',
      resolvedAt: new Date()
    }, {
      type: 'status_change',
      message: `Incident resolved: ${resolution}`,
      author
    });
  }

  async getIncidentMetrics(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    mttr: number; // Mean Time to Resolve
  }> {
    const incidents = Array.from(this.incidents.values());
    
    const bySeverity = incidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = incidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
    const mttr = resolvedIncidents.length > 0
      ? resolvedIncidents.reduce((sum, i) => {
          const duration = i.resolvedAt!.getTime() - i.createdAt.getTime();
          return sum + duration;
        }, 0) / resolvedIncidents.length
      : 0;

    return {
      total: incidents.length,
      bySeverity,
      byStatus,
      mttr
    };
  }
}
```

### Disaster Recovery

```typescript
// disaster-recovery.ts
interface RecoveryPlan {
  name: string;
  rto: number; // Recovery Time Objective (minutes)
  rpo: number; // Recovery Point Objective (minutes)
  steps: RecoveryStep[];
}

interface RecoveryStep {
  order: number;
  description: string;
  action: () => Promise<void>;
  estimatedDuration: number;
  rollbackAction?: () => Promise<void>;
}

export class DisasterRecoveryManager {
  private recoveryPlans = new Map<string, RecoveryPlan>();

  constructor() {
    this.initializePlans();
  }

  private initializePlans(): void {
    // Database recovery plan
    this.recoveryPlans.set('database', {
      name: 'Database Recovery',
      rto: 30,
      rpo: 15,
      steps: [
        {
          order: 1,
          description: 'Switch to read-only mode',
          action: () => this.switchToReadOnlyMode(),
          estimatedDuration: 2,
          rollbackAction: () => this.enableWriteMode()
        },
        {
          order: 2,
          description: 'Promote standby database',
          action: () => this.promoteStandbyDatabase(),
          estimatedDuration: 10,
          rollbackAction: () => this.demoteStandbyDatabase()
        },
        {
          order: 3,
          description: 'Update connection strings',
          action: () => this.updateConnectionStrings(),
          estimatedDuration: 5
        },
        {
          order: 4,
          description: 'Verify data integrity',
          action: () => this.verifyDataIntegrity(),
          estimatedDuration: 10
        },
        {
          order: 5,
          description: 'Enable write mode',
          action: () => this.enableWriteMode(),
          estimatedDuration: 2
        }
      ]
    });

    // Application recovery plan
    this.recoveryPlans.set('application', {
      name: 'Application Recovery',
      rto: 15,
      rpo: 5,
      steps: [
        {
          order: 1,
          description: 'Scale up healthy instances',
          action: () => this.scaleUpInstances(),
          estimatedDuration: 5
        },
        {
          order: 2,
          description: 'Update load balancer',
          action: () => this.updateLoadBalancer(),
          estimatedDuration: 3
        },
        {
          order: 3,
          description: 'Verify health endpoints',
          action: () => this.verifyHealthEndpoints(),
          estimatedDuration: 5
        },
        {
          order: 4,
          description: 'Enable traffic',
          action: () => this.enableTraffic(),
          estimatedDuration: 2
        }
      ]
    });
  }

  async executeRecoveryPlan(planName: string): Promise<void> {
    const plan = this.recoveryPlans.get(planName);
    if (!plan) {
      throw new Error(`Recovery plan ${planName} not found`);
    }

    console.log(`🚨 Executing ${plan.name} recovery plan...`);
    
    const startTime = Date.now();
    
    try {
      for (const step of plan.steps.sort((a, b) => a.order - b.order)) {
        console.log(`📋 Step ${step.order}: ${step.description}`);
        
        const stepStartTime = Date.now();
        await step.action();
        const stepDuration = Date.now() - stepStartTime;
        
        console.log(`✅ Step ${step.order} completed in ${stepDuration}ms`);
        
        // Verify step success
        if (!(await this.verifyStepSuccess(step))) {
          throw new Error(`Step ${step.order} verification failed`);
        }
      }
      
      const totalDuration = Date.now() - startTime;
      console.log(`✅ ${plan.name} recovery completed in ${totalDuration}ms`);
      
      // Verify overall recovery
      if (!(await this.verifyRecovery(planName))) {
        throw new Error(`Recovery verification failed for ${planName}`);
      }
      
    } catch (error) {
      console.error(`❌ Recovery failed: ${error.message}`);
      await this.rollbackPlan(plan);
      throw error;
    }
  }

  private async rollbackPlan(plan: RecoveryPlan): Promise<void> {
    console.log(`🔄 Rolling back ${plan.name} plan...`);
    
    for (const step of plan.steps.sort((a, b) => b.order - a.order)) {
      if (step.rollbackAction) {
        console.log(`🔄 Rolling back step ${step.order}: ${step.description}`);
        await step.rollbackAction();
      }
    }
    
    console.log(`✅ ${plan.name} rollback completed`);
  }

  private async verifyStepSuccess(step: RecoveryStep): Promise<boolean> {
    // Implementation depends on step type
    return true; // Simplified for example
  }

  private async verifyRecovery(planName: string): Promise<boolean> {
    // Implementation depends on plan type
    return true; // Simplified for example
  }
}
```

---

## 📋 Infrastructure Checklist

### Pre-Deployment Checklist

- [ ] **Infrastructure Provisioned**: All resources created via IaC
- [ ] **Security Groups**: Proper firewall rules configured
- [ ] **SSL Certificates**: Valid certificates installed
- [ ] **Monitoring**: All monitoring systems configured
- [ ] **Alerting**: Alert rules configured and tested
- [ ] **Backups**: Automated backup systems verified
- [ ] **Disaster Recovery**: Recovery plans tested
- [ ] **Scaling**: Auto-scaling policies configured
- [ ] **Load Testing**: Performance tests completed
- [ ] **Security Scan**: Vulnerability scans passed

### Post-Deployment Checklist

- [ ] **Health Checks**: All endpoints responding correctly
- [ ] **Performance**: Metrics within acceptable ranges
- [ ] **Monitoring**: No critical alerts firing
- [ ] **Logs**: Error rates within normal thresholds
- [ ] **User Testing**: Key user workflows verified
- [ ] **Rollback Plan**: Rollback procedure verified
- [ ] **Documentation**: Updated with deployment details
- [ ] **Team Notification**: Team informed of deployment
- [ ] **Monitoring Period**: Extended monitoring active

---

## Related Resources

- [System Architecture Guide](../architecture/system-architecture-guide.md)
- [Security Implementation](../security/security-implementation-guide.md)
- [Development Stack Guide](../development/modern-development-stack.md)
- [Integrations Guide](../integrations/)

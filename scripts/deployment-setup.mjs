#!/usr/bin/env node

/**
 * Production Deployment Setup
 * 
 * Creates production-ready deployment configuration
 * for the 2026 Documentation Standards implementation
 * 
 * Part of 2026 Documentation Standards - Production Deployment
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

class ProductionDeploymentSetup {
  private deployDir: string;
  private config: any;

  constructor(deployDir: string = 'deploy') {
    this.deployDir = deployDir;
    this.config = this.loadConfig();
  }

  /**
   * Load configuration
   */
  private loadConfig() {
    return {
      environment: process.env.NODE_ENV || 'production',
      domain: process.env.DEPLOY_DOMAIN || 'docs.example.com',
      ssl: process.env.SSL_ENABLED === 'true',
      cdn: process.env.CDN_ENABLED === 'true',
      monitoring: process.env.MONITORING_ENABLED === 'true',
      backup: process.env.BACKUP_ENABLED === 'true',
      scaling: {
        minInstances: parseInt(process.env.MIN_INSTANCES) || 2,
        maxInstances: parseInt(process.env.MAX_INSTANCES) || 10,
        targetCPU: parseInt(process.env.TARGET_CPU) || 70,
        targetMemory: parseInt(process.env.TARGET_MEMORY) || 80
      },
      security: {
        rateLimiting: process.env.RATE_LIMITING_ENABLED === 'true',
        waf: process.env.WAF_ENABLED === 'true',
        ddosProtection: process.env.DDOS_PROTECTION_ENABLED === 'true'
      }
    };
  }

  /**
   * Setup production deployment
   */
  async setup() {
    console.log('🚀 Setting up production deployment...\n');

    // Create deployment directory
    await this.createDeploymentDirectory();

    // Create Docker configuration
    await this.createDockerConfig();

    // Create Kubernetes configuration
    await this.createKubernetesConfig();

    // Create CI/CD pipeline
    await this.createCICDPipeline();

    // Create monitoring configuration
    await this.createMonitoringConfig();

    // Create backup configuration
    await this.createBackupConfig();

    // Create security configuration
    await this.createSecurityConfig();

    // Create deployment scripts
    await this.createDeploymentScripts();

    console.log('✅ Production deployment setup complete');
  }

  /**
   * Create deployment directory
   */
  private async createDeploymentDirectory() {
    console.log('📁 Creating deployment directory...');

    const directories = [
      'docker',
      'k8s',
      'ci-cd',
      'monitoring',
      'backup',
      'security',
      'scripts'
    ];

    for (const dir of directories) {
      const fullPath = join(this.deployDir, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    }

    console.log('✅ Deployment directory structure created');
  }

  /**
   * Create Docker configuration
   */
  private async createDockerConfig() {
    console.log('🐳 Creating Docker configuration...');

    // Production Dockerfile
    const dockerfile = `# Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Set permissions
RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/public

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
`;

    const dockerfilePath = join(this.deployDir, 'docker', 'Dockerfile');
    writeFileSync(dockerfilePath, dockerfile);

    // Docker Compose for production
    const dockerCompose = `version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: deploy/docker/Dockerfile
    image: docs-portal:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DOMAIN=${this.config.domain}
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.docs.rule=Host(\`${this.config.domain}\`)"
      - "traefik.http.services.docs.loadbalancer.server.port=3000"
    depends_on:
      - redis
      - postgres
    deploy:
      replicas: ${this.config.scaling.minInstances}
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}
      - POSTGRES_DB=docs_portal
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - app
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M

volumes:
  redis_data:
  postgres_data:
`;

    const dockerComposePath = join(this.deployDir, 'docker', 'docker-compose.yml');
    writeFileSync(dockerComposePath, dockerCompose);

    // Docker ignore file
    const dockerignore = `# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage
.nyc_output

# Next.js
.next/
out/

# Production
build
dist

# Misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDE
.vscode
.idea
*.swp
*.swo
`;

    const dockerignorePath = join(this.deployDir, 'docker', '.dockerignore');
    writeFileSync(dockerignorePath, dockerignore);

    console.log('✅ Docker configuration created');
  }

  /**
   * Create Kubernetes configuration
   */
  private async createKubernetesConfig() {
    console.log('☸️ Creating Kubernetes configuration...');

    // Namespace
    const namespace = {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'docs-portal',
        labels: {
          app: 'docs-portal',
          environment: this.config.environment
        }
      }
    };

    const namespacePath = join(this.deployDir, 'k8s', 'namespace.yaml');
    writeFileSync(namespacePath, JSON.stringify(namespace, null, 2));

    // Deployment
    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'docs-portal',
        namespace: 'docs-portal',
        labels: {
          app: 'docs-portal'
        }
      },
      spec: {
        replicas: this.config.scaling.minInstances,
        selector: {
          matchLabels: {
            app: 'docs-portal'
          }
        },
        template: {
          metadata: {
            labels: {
              app: 'docs-portal'
            }
          },
          spec: {
            containers: [{
              name: 'docs-portal',
              image: 'docs-portal:latest',
              ports: [{
                containerPort: 3000
              }],
              env: [
                { name: 'NODE_ENV', value: 'production' },
                { name: 'PORT', value: '3000' },
                { name: 'DOMAIN', value: this.config.domain }
              ],
              resources: {
                requests: {
                  memory: '256Mi',
                  cpu: '250m'
                },
                limits: {
                  memory: '512Mi',
                  cpu: '500m'
                }
              },
              livenessProbe: {
                httpGet: {
                  path: '/api/health',
                  port: 3000
                },
                initialDelaySeconds: 30,
                periodSeconds: 10
              },
              readinessProbe: {
                httpGet: {
                  path: '/api/ready',
                  port: 3000
                },
                initialDelaySeconds: 5,
                periodSeconds: 5
              }
            }]
          }
        }
      }
    };

    const deploymentPath = join(this.deployDir, 'k8s', 'deployment.yaml');
    writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

    // Service
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: 'docs-portal-service',
        namespace: 'docs-portal',
        labels: {
          app: 'docs-portal'
        }
      },
      spec: {
        selector: {
          app: 'docs-portal'
        },
        ports: [{
          port: 80,
          targetPort: 3000,
          protocol: 'TCP'
        }],
        type: 'ClusterIP'
      }
    };

    const servicePath = join(this.deployDir, 'k8s', 'service.yaml');
    writeFileSync(servicePath, JSON.stringify(service, null, 2));

    // Ingress
    const ingress = {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {
        name: 'docs-portal-ingress',
        namespace: 'docs-portal',
        annotations: {
          'kubernetes.io/ingress.class': 'nginx',
          'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
          'nginx.ingress.kubernetes.io/rewrite-target': '/',
          'nginx.ingress.kubernetes.io/ssl-redirect': 'true'
        }
      },
      spec: {
        tls: [{
          hosts: [this.config.domain],
          secretName: 'docs-portal-tls'
        }],
        rules: [{
          host: this.config.domain,
          http: {
            paths: [{
              path: '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'docs-portal-service',
                  port: {
                    number: 80
                  }
                }
              }
            }]
          }
        }]
      }
    };

    const ingressPath = join(this.deployDir, 'k8s', 'ingress.yaml');
    writeFileSync(ingressPath, JSON.stringify(ingress, null, 2));

    // HPA (Horizontal Pod Autoscaler)
    const hpa = {
      apiVersion: 'autoscaling/v2',
      kind: 'HorizontalPodAutoscaler',
      metadata: {
        name: 'docs-portal-hpa',
        namespace: 'docs-portal'
      },
      spec: {
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'docs-portal'
        },
        minReplicas: this.config.scaling.minInstances,
        maxReplicas: this.config.scaling.maxInstances,
        metrics: [{
          type: 'Resource',
          resource: {
            name: 'cpu',
            target: {
              type: 'Utilization',
              averageUtilization: this.config.scaling.targetCPU
            }
          }
        }, {
          type: 'Resource',
          resource: {
            name: 'memory',
            target: {
              type: 'Utilization',
              averageUtilization: this.config.scaling.targetMemory
            }
          }
        }]
      }
    };

    const hpaPath = join(this.deployDir, 'k8s', 'hpa.yaml');
    writeFileSync(hpaPath, JSON.stringify(hpa, null, 2));

    console.log('✅ Kubernetes configuration created');
  }

  /**
   * Create CI/CD pipeline
   */
  private async createCICDPipeline() {
    console.log('🔄 Creating CI/CD pipeline...');

    // GitHub Actions workflow
    const workflow = `name: Deploy Documentation Portal

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: docker build -t docs-portal:\${{ github.sha }} .
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
      
      - name: Push Docker image
        run: docker push docs-portal:\${{ github.sha }}
      
      - name: Tag latest
        run: docker tag docs-portal:\${{ github.sha }} docs-portal:latest
      
      - name: Push latest tag
        run: docker push docs-portal:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.24.0'
      
      - name: Configure kubectl
        run: |
          echo "\${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
      
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f deploy/k8s/
          kubectl rollout status deployment/docs-portal
          
      - name: Verify deployment
        run: |
          kubectl get pods -l app=docs-portal
          kubectl get services docs-portal-service
`;

    const workflowPath = join(this.deployDir, 'ci-cd', 'deploy.yml');
    writeFileSync(workflowPath, workflow);

    // Deploy script
    const deployScript = `#!/bin/bash

# Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
DOMAIN=${2:-docs.example.com}
IMAGE_TAG=${3:-latest}

echo "🚀 Deploying Documentation Portal..."
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN"
echo "Image Tag: $IMAGE_TAG"

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
  echo "❌ Invalid environment: $ENVIRONMENT"
  echo "Usage: ./deploy.sh [production|staging] [domain] [image-tag]"
  exit 1
fi

# Set kubectl context
kubectl config use-context $ENVIRONMENT

# Backup current deployment
echo "📦 Backing up current deployment..."
kubectl get deployment docs-portal -o yaml > backup/deployment-\$(date +%Y%m%d-%H%M%S).yaml

# Update image tag
echo "🔄 Updating image tag..."
sed -i.bak "s|image: docs-portal:.*|image: docs-portal:$IMAGE_TAG|g" deploy/k8s/deployment.yaml

# Apply configuration
echo "⚙️ Applying Kubernetes configuration..."
kubectl apply -f deploy/k8s/

# Wait for rollout
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/docs-portal --timeout=300s

# Verify deployment
echo "✅ Verifying deployment..."
kubectl get pods -l app=docs-portal
kubectl get services docs-portal-service
kubectl get ingress docs-portal-ingress

# Health check
echo "🏥 Running health check..."
sleep 30
kubectl exec deployment/docs-portal -- curl -f http://localhost:3000/api/health

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: https://$DOMAIN"
`;

    const deployScriptPath = join(this.deployDir, 'scripts', 'deploy.sh');
    writeFileSync(deployScriptPath, deployScript);

    // Make script executable
    execSync(`chmod +x ${deployScriptPath}`);

    console.log('✅ CI/CD pipeline created');
  }

  /**
   * Create monitoring configuration
   */
  private async createMonitoringConfig() {
    console.log('📊 Creating monitoring configuration...');

    // Prometheus configuration
    const prometheusConfig = `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "prometheus_rules.yml"

scrape_configs:
  - job_name: 'docs-portal'
    static_configs:
      - targets: ['docs-portal-service:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    scrape_interval: 5s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
    scrape_interval: 5s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
`;

    const prometheusPath = join(this.deployDir, 'monitoring', 'prometheus.yml');
    writeFileSync(prometheusPath, prometheusConfig);

    // Grafana dashboard
    const grafanaDashboard = {
      dashboard: {
        id: null,
        title: 'Documentation Portal Dashboard',
        tags: ['docs', 'portal'],
        timezone: 'browser',
        panels: [
          {
            id: 1,
            title: 'Request Rate',
            type: 'graph',
            targets: [
              {
                expr: 'rate(http_requests_total[5m])',
                legendFormat: '{{method}} {{status}}'
              }
            ],
            gridPos: { h: 8, w: 12 },
            x: 0,
            y: 0
          },
          {
            id: 2,
            title: 'Response Time',
            type: 'graph',
            targets: [
              {
                expr: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
                legendFormat: '95th percentile'
              }
            ],
            gridPos: { h: 8, w: 12 },
            x: 12,
            y: 0
          },
          {
            id: 3,
            title: 'Error Rate',
            type: 'graph',
            targets: [
              {
                expr: 'rate(http_requests_total{status=~"5.."}[5m])',
                legendFormat: 'Error Rate'
              }
            ],
            gridPos: { h: 8, w: 12 },
            x: 0,
            y: 8
          }
        ],
        time: {
          from: 'now-1h',
          to: 'now'
        },
        refresh: '30s'
      }
    };

    const grafanaPath = join(this.deployDir, 'monitoring', 'grafana-dashboard.json');
    writeFileSync(grafanaPath, JSON.stringify(grafanaDashboard, null, 2));

    console.log('✅ Monitoring configuration created');
  }

  /**
   * Create backup configuration
   */
  private async createBackupConfig() {
    console.log('💾 Creating backup configuration...');

    // Backup script
    const backupScript = `#!/bin/bash

# Backup Script for Documentation Portal
# Usage: ./backup.sh [type]

set -e

BACKUP_TYPE=${1:-full}
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d-%H%M%S)
NAMESPACE="docs-portal"

echo "💾 Starting backup..."
echo "Type: $BACKUP_TYPE"
echo "Date: $DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

case $BACKUP_TYPE in
  "full")
    echo "📦 Full backup..."
    
    # Backup Kubernetes resources
    kubectl get all -n $NAMESPACE -o yaml > $BACKUP_DIR/k8s-$DATE.yaml
    
    # Backup database
    kubectl exec -n $NAMESPACE deployment/postgres -- pg_dump -U postgres docs_portal > $BACKUP_DIR/database-$DATE.sql
    
    # Backup Redis
    kubectl exec -n $NAMESPACE deployment/redis -- redis-cli BGSAVE
    kubectl cp $NAMESPACE/redis-0:/data/dump.rdb $BACKUP_DIR/redis-$DATE.rdb
    
    # Backup application data
    kubectl exec -n $NAMESPACE deployment/docs-portal -- tar -czf /tmp/uploads-$DATE.tar.gz /app/uploads
    kubectl cp $NAMESPACE/docs-portal-0:/tmp/uploads-$DATE.tar.gz $BACKUP_DIR/uploads-$DATE.tar.gz
    
    echo "✅ Full backup completed"
    ;;
    
  "database")
    echo "🗄️ Database backup..."
    kubectl exec -n $NAMESPACE deployment/postgres -- pg_dump -U postgres docs_portal > $BACKUP_DIR/database-$DATE.sql
    echo "✅ Database backup completed"
    ;;
    
  "config")
    echo "⚙️ Configuration backup..."
    kubectl get configmaps -n $NAMESPACE -o yaml > $BACKUP_DIR/configmaps-$DATE.yaml
    kubectl get secrets -n $NAMESPACE -o yaml > $BACKUP_DIR/secrets-$DATE.yaml
    echo "✅ Configuration backup completed"
    ;;
    
  *)
    echo "❌ Invalid backup type: $BACKUP_TYPE"
    echo "Usage: ./backup.sh [full|database|config]"
    exit 1
    ;;
esac

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.yaml" -mtime +7d -delete
find $BACKUP_DIR -name "*.sql" -mtime +7d -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7d -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7d -delete

echo "🧹 Cleanup completed"
echo "💾 Backup stored in: $BACKUP_DIR"
`;

    const backupScriptPath = join(this.deployDir, 'backup', 'backup.sh');
    writeFileSync(backupScriptPath, backupScript);

    // Make script executable
    execSync(`chmod +x ${backupScriptPath}`);

    // Restore script
    const restoreScript = `#!/bin/bash

# Restore Script for Documentation Portal
# Usage: ./restore.sh <backup-file>

set -e

BACKUP_FILE=$1

if [[ -z "$BACKUP_FILE" ]]; then
  echo "❌ Backup file not specified"
  echo "Usage: ./restore.sh <backup-file>"
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "🔄 Starting restore..."
echo "File: $BACKUP_FILE"

# Determine backup type by file extension
case $BACKUP_FILE in
  *.yaml)
    echo "📦 Restoring Kubernetes configuration..."
    kubectl apply -f $BACKUP_FILE
    echo "✅ Kubernetes configuration restored"
    ;;
    
  *.sql)
    echo "🗄️ Restoring database..."
    kubectl exec -i -n docs-portal deployment/postgres -- psql -U postgres -c "DROP DATABASE IF EXISTS docs_portal;"
    kubectl exec -i -n docs-portal deployment/postgres -- psql -U postgres -c "CREATE DATABASE docs_portal;"
    kubectl exec -i -n docs-portal deployment/postgres -- psql -U postgres docs_portal < $BACKUP_FILE
    echo "✅ Database restored"
    ;;
    
  *.rdb)
    echo "💾 Restoring Redis..."
    kubectl cp $BACKUP_FILE docs-portal/redis-0:/data/dump.rdb
    kubectl exec -n docs-portal deployment/redis -- redis-cli SHUTDOWN NOSAVE
    kubectl exec -n docs-portal deployment/redis -- rm /data/dump.rdb
    kubectl exec -n docs-portal deployment/redis -- redis-server /data/dump.rdb
    echo "✅ Redis restored"
    ;;
    
  *.tar.gz)
    echo "📁 Restoring application data..."
    kubectl cp $BACKUP_FILE docs-portal/docs-portal-0:/tmp/uploads-restore.tar.gz
    kubectl exec -n docs-portal deployment/docs-portal -- tar -xzf /tmp/uploads-restore.tar.gz -C /app/
    kubectl exec -n docs-portal deployment/docs-portal -- rm /tmp/uploads-restore.tar.gz
    echo "✅ Application data restored"
    ;;
    
  *)
    echo "❌ Unsupported backup file type"
    exit 1
    ;;
esac

echo "✅ Restore completed successfully!"
`;

    const restoreScriptPath = join(this.deployDir, 'backup', 'restore.sh');
    writeFileSync(restoreScriptPath, restoreScript);

    // Make script executable
    execSync(`chmod +x ${restoreScriptPath}`);

    console.log('✅ Backup configuration created');
  }

  /**
   * Create security configuration
   */
  private async createSecurityConfig() {
    console.log('🔒 Creating security configuration...');

    // Nginx security configuration
    const nginxConfig = `# Security Headers Configuration
server {
    listen 80;
    server_name ${this.config.domain};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';";

    # Rate limiting
    limit_req_zone $binary_remote_addr 10m rate=10r/s;
    limit_req_zone $api 10m rate=100r/s;
    
    location /api/ {
        limit_req zone=$api burst=200 nodelay;
        proxy_pass http://docs-portal-service:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Block common attacks
    location ~*\\.(asp|aspx|php|jsp|cgi)$ {
        deny all;
    }

    # Hide server information
    server_tokens off;

    location / {
        proxy_pass http://docs-portal-service:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name ${this.config.domain};

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Apply same security headers as HTTP
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';";

    location / {
        proxy_pass http://docs-portal-service:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`;

    const nginxConfigPath = join(this.deployDir, 'security', 'nginx.conf');
    writeFileSync(nginxConfigPath, nginxConfig);

    // WAF rules
    const wafRules = `# Web Application Firewall Rules
# ModSecurity Core Rule Set

# Basic rule set
SecRuleEngine On
SecRequestBodyAccess On
SecResponseBodyAccess On
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072
SecRequestBodyJsonLimit 131072

# Common attacks
SecRule REQUEST_HEADERS "@rx ^$" "id:1001,phase:2,deny,status:400,msg:'HTTP Header required'"
SecRule ARGS "@rx (<|>|%3C|('|)(\\w*\\w*(javascript|vbscript|onload|onerror|onclick))" "id:1002,phase:2,block,t:none,t:urlDecodeUni,t:htmlDecode,t:lowercase,msg:'XSS Attack Detected'"
SecRule ARGS "@rx ((?:\\\\b(?:on(?:dblclick|dragdrop|onmousedown|onmousewheel|submit|keydown|keypress|keyup|change|blur|focus|focusin|focusout|load|unload|resize|scroll|abort|error|select|change|reset|cut|copy|paste))\\s*?=)" "id:1003,phase:2,block,t:none,t:urlDecodeUni,t:htmlDecode,t:lowercase,msg:'XSS Event Handler Detected'"
SecRule REQUEST_BODY "@rx ((?:\\\\b(?:javascript|vbscript|onload|onerror|onclick))|<[^>]*(?:javascript|vbscript|onload|onerror|onclick))" "id:1004,phase:2,block,t:none,t:urlDecodeUni,t:htmlDecode,t:lowercase,msg:'XSS in Request Body Detected'"
SecRule REQUEST_HEADERS:User-Agent "@rx (?:httrack|libwww-perl|nmap|nikto|sqlmap|dirb|masscan|python|shell|sh|wget|curl|nc|telnet|bash|powershell|cmd|cmd.exe|script|eval|applet|macro)" "id:1005,phase:1,deny,status:403,msg:'Security Scanner Detected'"
SecRule REQUEST_HEADERS:Referer "@rx (?:http://(?:www\\.)?(?:google|bing|yahoo|baidu|duckduckgo|yandex|ask)\\.com)" "id:1006,phase:1,deny,status:403,msg:'Search Engine Bot Detected'"
SecRule REQUEST_HEADERS:User-Agent "@rx (?:googlebot|bingbot|slurp|duckduckbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slack|instagram|pinterest|snapchat)" "id:1007,phase:1,deny,status:403,msg:'Social Media Bot Detected'"
`;

    const wafRulesPath = join(this.deployDir, 'security', 'waf-rules.conf');
    writeFileSync(wafRulesPath, wafRules);

    console.log('✅ Security configuration created');
  }

  /**
   * Create deployment scripts
   */
  private async createDeploymentScripts() {
    console.log('📜 Creating deployment scripts...');

    // Main deployment script
    const mainScript = `#!/bin/bash

# Main Deployment Script
# Usage: ./deploy.sh [environment] [domain] [image-tag]

set -e

ENVIRONMENT=${1:-production}
DOMAIN=${2:-${this.config.domain}}
IMAGE_TAG=${3:-latest}

echo "🚀 Starting deployment..."
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN"
echo "Image Tag: $IMAGE_TAG"

# Validate inputs
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
  echo "❌ Invalid environment: $ENVIRONMENT"
  echo "Usage: ./deploy.sh [production|staging] [domain] [image-tag]"
  exit 1
fi

# Check prerequisites
echo "🔍 Checking prerequisites..."
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl not found"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ docker not found"; exit 1; }

# Set context
echo "⚙️ Setting kubectl context..."
kubectl config use-context $ENVIRONMENT

# Run pre-deployment checks
echo "🧪 Running pre-deployment checks..."
./scripts/pre-deploy-check.sh

# Build Docker image
echo "🏗️ Building Docker image..."
docker build -t docs-portal:$IMAGE_TAG .

# Push to registry
echo "📤 Pushing to registry..."
docker push docs-portal:$IMAGE_TAG

# Deploy
echo "🚀 Deploying to Kubernetes..."
./scripts/k8s-deploy.sh $ENVIRONMENT $DOMAIN $IMAGE_TAG

# Post-deployment verification
echo "✅ Running post-deployment verification..."
./scripts/post-deploy-check.sh

echo "🎉 Deployment completed successfully!"
echo "🌐 Application available at: https://$DOMAIN"
`;

    const mainScriptPath = join(this.deployDir, 'scripts', 'deploy.sh');
    writeFileSync(mainScriptPath, mainScript);

    // Pre-deployment check script
    const preDeployScript = `#!/bin/bash

# Pre-deployment Health Check
echo "🧪 Running pre-deployment health checks..."

# Check cluster connectivity
echo "🔍 Checking cluster connectivity..."
kubectl cluster-info >/dev/null || { echo "❌ Cannot connect to cluster"; exit 1; }

# Check namespace
echo "📋 Checking namespace..."
kubectl get namespace docs-portal >/dev/null 2>&1 || { echo "❌ Namespace docs-portal not found"; exit 1; }

# Check resource limits
echo "💾 Checking resource limits..."
kubectl describe namespace docs-portal | grep -q "ResourceQuota" || { echo "⚠️  No resource quota found"; }

# Check storage classes
echo "💾 Checking storage classes..."
kubectl get storageclass | grep -q "gp2" || { echo "⚠️  No gp2 storage class found"; }

# Check ingress controller
echo "🌐 Checking ingress controller..."
kubectl get ingressclass | grep -q "nginx" || { echo "⚠️  No nginx ingress controller found"; }

# Check cert-manager
echo "🔒 Checking cert-manager..."
kubectl get pods -n cert-manager | grep -q "cert-manager" || { echo "⚠️  cert-manager not found"; }

# Check monitoring
echo "📊 Checking monitoring stack..."
kubectl get pods -n monitoring | grep -q "prometheus" || { echo "⚠️  Prometheus not found"; }
kubectl get pods -n monitoring | grep -q "grafana" || { echo "⚠️  Grafana not found"; }

echo "✅ Pre-deployment checks completed"
`;

    const preDeployScriptPath = join(this.deployDir, 'scripts', 'pre-deploy-check.sh');
    writeFileSync(preDeployScriptPath, preDeployScript);

    // Post-deployment check script
    const postDeployScript = `#!/bin/bash

# Post-deployment Verification
echo "✅ Running post-deployment verification..."

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/docs-portal --timeout=300s

# Check pod status
echo "📋 Checking pod status..."
kubectl get pods -l app=docs-portal

# Check service status
echo "🔌 Checking service status..."
kubectl get service docs-portal-service

# Check ingress status
echo "🌐 Checking ingress status..."
kubectl get ingress docs-portal-ingress

# Health check
echo "🏥 Running health check..."
sleep 30
HEALTH_URL="https://$DOMAIN/api/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [[ $HTTP_STATUS == "200" ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed (HTTP $HTTP_STATUS)"
  exit 1
fi

# Performance check
echo "⚡ Running performance check..."
PERFORMANCE_URL="https://$DOMAIN/api/metrics"
curl -s $PERFORMANCE_URL >/dev/null || echo "⚠️  Performance metrics unavailable"

# Security check
echo "🔒 Running security check..."
SECURITY_URL="https://$DOMAIN/api/security"
curl -s $SECURITY_URL >/dev/null || echo "⚠️  Security metrics unavailable"

echo "✅ Post-deployment verification completed"
`;

    const postDeployScriptPath = join(this.deployDir, 'scripts', 'post-deploy-check.sh');
    writeFileSync(postDeployScriptPath, postDeployScript);

    // Kubernetes deployment script
    const k8sDeployScript = `#!/bin/bash

# Kubernetes Deployment Script
ENVIRONMENT=$1
DOMAIN=$2
IMAGE_TAG=$3

echo "🚀 Deploying to Kubernetes..."
echo "Environment: $ENVIRONMENT"
echo "Domain: $DOMAIN"
echo "Image Tag: $IMAGE_TAG"

# Update image tag in deployment
echo "🔄 Updating image tag..."
sed -i.bak "s|image: docs-portal:.*|image: docs-portal:$IMAGE_TAG|g" k8s/deployment.yaml

# Apply configuration
echo "⚙️ Applying Kubernetes configuration..."
kubectl apply -f k8s/

# Wait for rollout
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/docs-portal --timeout=300s

# Scale to desired replicas
echo "📈 Scaling to desired replicas..."
kubectl scale deployment docs-portal --replicas=3

# Verify deployment
echo "✅ Verifying deployment..."
kubectl get pods -l app=docs-portal
kubectl get services docs-portal-service
kubectl get ingress docs-portal-ingress

echo "✅ Kubernetes deployment completed"
`;

    const k8sDeployScriptPath = join(this.deployDir, 'scripts', 'k8s-deploy.sh');
    writeFileSync(k8sDeployScriptPath, k8sDeployScript);

    // Make all scripts executable
    execSync(`chmod +x ${mainScriptPath}`);
    execSync(`chmod +x ${preDeployScriptPath}`);
    execSync(`chmod +x ${postDeployScriptPath}`);
    execSync(`chmod +x ${k8sDeployScriptPath}`);

    console.log('✅ Deployment scripts created');
  }

  /**
   * Get deployment instructions
   */
  getDeploymentInstructions() {
    return `
🚀 Production Deployment Instructions

1. Prerequisites:
   ✅ Docker installed and running
   ✅ Kubernetes cluster configured
   ✅ kubectl configured for target environment
   ✅ NGINX Ingress Controller installed
   ✅ cert-manager installed (for SSL)
   ✅ Monitoring stack (Prometheus + Grafana)

2. Environment Setup:
   - Set kubectl context: kubectl config use-context <environment>
   - Create namespace: kubectl create namespace docs-portal
   - Configure resource quotas: kubectl apply -f deploy/k8s/namespace.yaml

3. SSL Certificate:
   - Create Let's Encrypt issuer: kubectl apply -f deploy/security/cert-manager.yaml
   - Generate certificate: kubectl apply -f deploy/k8s/ingress.yaml

4. Monitoring Setup:
   - Deploy Prometheus: kubectl apply -f deploy/monitoring/prometheus.yml
   - Deploy Grafana: kubectl apply -f deploy/monitoring/grafana-dashboard.json
   - Configure alerting: kubectl apply -f deploy/monitoring/alert-rules.yml

5. Deployment Commands:
   - Full deployment: ./deploy.sh production docs.example.com latest
   - Staging deployment: ./deploy.sh staging staging.docs.example.com latest
   - Database backup: ./backup/backup.sh database
   - Configuration backup: ./backup/backup.sh config

6. Monitoring:
   - View logs: kubectl logs -f deployment/docs-portal
   - Check metrics: https://$DOMAIN/metrics
   - Grafana dashboard: https://$DOMAIN/grafana

7. Backup & Recovery:
   - Backup: ./backup/backup.sh full
   - Restore: ./backup/restore.sh <backup-file>
   - Schedule backups: Add to crontab: 0 2 * * * /path/to/deploy/backup/backup.sh full

8. Rollback:
   - Rollback deployment: kubectl rollout undo deployment/docs-portal
   - View rollout history: kubectl rollout history deployment/docs-portal
   - Rollback to specific revision: kubectl rollout undo deployment/docs-portal --to-revision=<revision>

9. Scaling:
   - Manual scaling: kubectl scale deployment docs-portal --replicas=5
   - Auto-scaling: kubectl apply -f deploy/k8s/hpa.yaml
   - View HPA status: kubectl get hpa

10. Security:
    - View WAF logs: kubectl logs -n nginx-ingress-controller
    - Check security headers: curl -I https://$DOMAIN
    - Test rate limiting: ab -n 1000 -c 10 https://$DOMAIN/api

Environment Variables:
- NODE_ENV: production|staging
- DEPLOY_DOMAIN: Domain name for deployment
- IMAGE_TAG: Docker image tag
- POSTGRES_PASSWORD: Database password
- DOCKER_USERNAME: Docker Hub username
- DOCKER_PASSWORD: Docker Hub password
- KUBE_CONFIG: Kubernetes configuration (base64 encoded)
`;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const setup = new ProductionDeploymentSetup();

  switch (command) {
    case 'setup':
      await setup.setup();
      console.log(setup.getDeploymentInstructions());
      break;

    case 'help':
      console.log(`
Production Deployment Setup

Usage:
  node scripts/deployment-setup.mjs <command>

Commands:
  setup  - Set up production deployment configuration
  help   - Show this help message

Examples:
  node scripts/deployment-setup.mjs setup

Environment Variables:
  NODE_ENV           - Environment (production|staging)
  DEPLOY_DOMAIN       - Domain name for deployment
  SSL_ENABLED         - Enable SSL (true|false)
  CDN_ENABLED          - Enable CDN (true|false)
  MONITORING_ENABLED  - Enable monitoring (true|false)
  BACKUP_ENABLED      - Enable backups (true|false)
  MIN_INSTANCES       - Minimum pod instances
  MAX_INSTANCES       - Maximum pod instances
  TARGET_CPU          - Target CPU utilization (%)
  TARGET_MEMORY       - Target memory utilization (%)
  RATE_LIMITING_ENABLED - Enable rate limiting (true|false)
  WAF_ENABLED         - Enable WAF (true|false)
  DDOS_PROTECTION_ENABLED - Enable DDoS protection (true|false)
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Deployment setup error:', error);
    process.exit(1);
  });
}

export { ProductionDeploymentSetup };

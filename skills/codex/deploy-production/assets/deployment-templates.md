---
name: deployment-templates
description: |
  **ASSET TEMPLATE** - Deployment templates and configuration patterns for Codex agents.
  USE FOR: Standardizing deployment processes, ensuring comprehensive coverage.
  DO NOT USE FOR: Direct execution - template reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "template"
---

# Deployment Templates and Configuration Patterns

## Overview
This document provides standardized templates and configuration patterns for Codex deployment agents to ensure consistent, reliable, and secure deployments.

## Deployment Templates

### 1. Azure Deployment Template

```yaml
# azure-deployment-template.yml
name: Azure Production Deployment
description: Standard Azure deployment with blue-green strategy

parameters:
  environment:
    type: string
    allowedValues: [development, staging, production]
    default: staging
  appName:
    type: string
    default: marketing-websites
  location:
    type: string
    default: eastus
  instanceCount:
    type: integer
    default: 3
  vmSize:
    type: string
    default: Standard_D4s_v3

variables:
  resourceGroupName: '[concat(parameters.appName, "-", parameters.environment)]'
  appServicePlanName: '[concat(parameters.appName, "-plan-", parameters.environment)]'
  appServiceName: '[concat(parameters.appName, "-", parameters.environment)]'
  storageAccountName: '[concat(uniqueString(resourceGroup().id), "storage")]'
  keyVaultName: '[concat(parameters.appName, "-kv-", parameters.environment)]'

resources:
  # Resource Group
  - type: Microsoft.Resources/resourceGroups
    name: '[variables.resourceGroupName]'
    location: '[parameters.location]'

  # App Service Plan
  - type: Microsoft.Web/serverfarms
    name: '[variables.appServicePlanName]'
    location: '[parameters.location]'
    kind: linux
    properties:
      reserved: true
      sku:
        name: '[parameters.vmSize]'
        capacity: '[parameters.instanceCount]'

  # App Service
  - type: Microsoft.Web/sites
    name: '[variables.appServiceName]'
    location: '[parameters.location]'
    kind: linux
    properties:
      serverFarmId: '[variables.appServicePlanName]'
      siteConfig:
        linuxFxVersion: 'NODE|18-lts'
        alwaysOn: true
        http20Enabled: true
        minTlsVersion: '1.2'
        ftpsState: 'Disabled'
        remoteDebuggingEnabled: false
        webSocketsEnabled: true
        appSettings:
          - name: 'NODE_ENV'
            value: '[parameters.environment]'
          - name: 'APP_NAME'
            value: '[parameters.appName]'

  # Storage Account
  - type: Microsoft.Storage/storageAccounts
    name: '[variables.storageAccountName]'
    location: '[parameters.location]'
    sku:
      name: Standard_LRS
    kind: StorageV2

  # Key Vault
  - type: Microsoft.KeyVault/vaults
    name: '[variables.keyVaultName]'
    location: '[parameters.location]'
    properties:
      tenantId: '[subscription().tenantId]'
      sku:
        family: A
        name: standard
      accessPolicies: []
      enabledForTemplateDeployment: true
      enabledForDeployment: true
      enabledForDiskEncryption: false
      enabledForVolumeEncryption: false

outputs:
  appServiceUrl:
    type: string
    value: '[concat("https://", variables.appServiceName, ".azurewebsites.net")]'
  resourceGroupName:
    type: string
    value: '[variables.resourceGroupName]'
  keyVaultUri:
    type: string
    value: '[concat("https://", variables.keyVaultName, ".vault.azure.net/")]'
```

### 2. Docker Deployment Template

```dockerfile
# Dockerfile.production
# Multi-stage production Dockerfile for Next.js applications

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]
```

### 3. Kubernetes Deployment Template

```yaml
# k8s-deployment-template.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: marketing-websites
  labels:
    app: marketing-websites
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: marketing-websites
  template:
    metadata:
      labels:
        app: marketing-websites
        version: v1
    spec:
      containers:
      - name: marketing-websites
        image: marketing-websites:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: marketing-websites-service
spec:
  selector:
    app: marketing-websites
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: marketing-websites-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - marketing-websites.com
    secretName: marketing-websites-tls
  rules:
  - host: marketing-websites.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: marketing-websites-service
            port:
              number: 80
```

## Configuration Templates

### 1. Environment Configuration Template

```typescript
// environment-config.template.ts
export interface EnvironmentConfig {
  name: string;
  type: 'development' | 'staging' | 'production';
  infrastructure: InfrastructureConfig;
  application: ApplicationConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
  features: FeatureFlags;
}

export interface InfrastructureConfig {
  azure: {
    location: string;
    resourceGroup: string;
    appServicePlan: {
      sku: string;
      capacity: number;
    };
    storage: {
      accountName: string;
      sku: string;
    };
    keyVault: {
      name: string;
      sku: string;
    };
  };
  database: {
    type: 'postgresql' | 'mongodb';
    connection: {
      host: string;
      port: number;
      database: string;
      ssl: boolean;
      poolSize: number;
    };
  };
  cache: {
    type: 'redis' | 'memory';
    connection: {
      host: string;
      port: number;
      password?: string;
      db?: number;
    };
  };
}

export interface ApplicationConfig {
  framework: {
    name: string;
    version: string;
  };
  server: {
    port: number;
    host: string;
    timeout: number;
  };
  features: {
    ssr: boolean;
    ssg: boolean;
    apiRoutes: boolean;
    middleware: boolean;
  };
  performance: {
    compression: boolean;
    caching: boolean;
    bundleAnalysis: boolean;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: {
    application: boolean;
    infrastructure: boolean;
    business: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination: 'console' | 'file' | 'external';
  };
  alerting: {
    enabled: boolean;
    channels: ('email' | 'slack' | 'teams')[];
    thresholds: {
      errorRate: number;
      responseTime: number;
      cpuUsage: number;
      memoryUsage: number;
    };
  };
}

export interface SecurityConfig {
  https: {
    enabled: boolean;
    hsts: boolean;
    redirectHttp: boolean;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    credentials: boolean;
  };
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  headers: {
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    referrerPolicy: boolean;
  };
}

export interface FeatureFlags {
  newFeatureX: boolean;
  betaFeatureY: boolean;
  experimentalFeatureZ: boolean;
  maintenanceMode: boolean;
  debugMode: boolean;
}

// Environment-specific configurations
export const environmentTemplates: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    type: 'development',
    infrastructure: {
      azure: {
        location: 'eastus',
        appServicePlan: {
          sku: 'Standard_B2s',
          capacity: 1
        },
        storage: {
          sku: 'Standard_LRS'
        },
        keyVault: {
          sku: 'standard'
        }
      },
      database: {
        connection: {
          poolSize: 5
        }
      },
      cache: {
        type: 'memory'
      }
    },
    application: {
      features: {
        ssr: true,
        ssg: false,
        apiRoutes: true,
        middleware: true
      },
      performance: {
        compression: false,
        caching: false,
        bundleAnalysis: true
      }
    },
    monitoring: {
      logging: {
        level: 'debug',
        format: 'text',
        destination: 'console'
      },
      alerting: {
        enabled: false
      }
    },
    security: {
      https: {
        enabled: false,
        hsts: false,
        redirectHttp: false
      },
      cors: {
        origins: ['http://localhost:3000'],
        credentials: true
      },
      rateLimiting: {
        enabled: false
      }
    },
    features: {
      debugMode: true,
      maintenanceMode: false
    }
  },
  
  staging: {
    type: 'staging',
    infrastructure: {
      azure: {
        location: 'eastus',
        appServicePlan: {
          sku: 'Standard_D2s_v3',
          capacity: 2
        },
        storage: {
          sku: 'Standard_GRS'
        },
        keyVault: {
          sku: 'standard'
        }
      },
      database: {
        connection: {
          poolSize: 10
        }
      },
      cache: {
        type: 'redis',
        connection: {
          host: 'staging-redis.redis.cache.windows.net',
          port: 6380,
          ssl: true
        }
      }
    },
    application: {
      features: {
        ssr: true,
        ssg: true,
        apiRoutes: true,
        middleware: true
      },
      performance: {
        compression: true,
        caching: true,
        bundleAnalysis: false
      }
    },
    monitoring: {
      logging: {
        level: 'info',
        format: 'json',
        destination: 'external'
      },
      alerting: {
        enabled: true,
        channels: ['email'],
        thresholds: {
          errorRate: 5,
          responseTime: 2000,
          cpuUsage: 80,
          memoryUsage: 85
        }
      }
    },
    security: {
      https: {
        enabled: true,
        hsts: true,
        redirectHttp: true
      },
      cors: {
        origins: ['https://staging.marketing-websites.com'],
        credentials: true
      },
      rateLimiting: {
        enabled: true,
        windowMs: 900000,
        maxRequests: 1000
      }
    },
    features: {
      newFeatureX: true,
      betaFeatureY: true,
      experimentalFeatureZ: false,
      maintenanceMode: false,
      debugMode: false
    }
  },
  
  production: {
    type: 'production',
    infrastructure: {
      azure: {
        location: 'eastus',
        appServicePlan: {
          sku: 'Standard_D4s_v3',
          capacity: 3
        },
        storage: {
          sku: 'Standard_GRS'
        },
        keyVault: {
          sku: 'premium'
        }
      },
      database: {
        connection: {
          poolSize: 20
        }
      },
      cache: {
        type: 'redis',
        connection: {
          host: 'prod-redis.redis.cache.windows.net',
          port: 6380,
          ssl: true
        }
      }
    },
    application: {
      features: {
        ssr: true,
        ssg: true,
        apiRoutes: true,
        middleware: true
      },
      performance: {
        compression: true,
        caching: true,
        bundleAnalysis: false
      }
    },
    monitoring: {
      logging: {
        level: 'warn',
        format: 'json',
        destination: 'external'
      },
      alerting: {
        enabled: true,
        channels: ['email', 'slack', 'teams'],
        thresholds: {
          errorRate: 2,
          responseTime: 1000,
          cpuUsage: 70,
          memoryUsage: 80
        }
      }
    },
    security: {
      https: {
        enabled: true,
        hsts: true,
        redirectHttp: true
      },
      cors: {
        origins: ['https://marketing-websites.com'],
        credentials: false
      },
      rateLimiting: {
        enabled: true,
        windowMs: 900000,
        maxRequests: 500
      },
      headers: {
        csp: true,
        xFrameOptions: true,
        xContentTypeOptions: true,
        referrerPolicy: true
      }
    },
    features: {
      newFeatureX: false,
      betaFeatureY: false,
      experimentalFeatureZ: false,
      maintenanceMode: false,
      debugMode: false
    }
  }
};
```

### 2. Deployment Pipeline Template

```yaml
# deployment-pipeline.template.yml
name: Deployment Pipeline
description: Standard deployment pipeline with quality gates

trigger:
  branches:
    include:
    - main
    - develop
  tags:
    include:
    - v*

variables:
  - group: deployment-variables
  - name: nodeVersion
    value: '18.x'
  - name: workingDirectory
    value: '$(System.DefaultWorkingDirectory)'

stages:
- stage: Validate
  displayName: 'Validate Code Quality'
  jobs:
  - job: CodeQuality
    displayName: 'Code Quality Checks'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '$(nodeVersion)'
      displayName: 'Install Node.js'
    
    - script: |
        npm install -g pnpm
        pnpm install
      displayName: 'Install Dependencies'
    
    - script: |
        pnpm type-check
      displayName: 'Type Check'
    
    - script: |
        pnpm lint
      displayName: 'Lint Code'
    
    - script: |
        pnpm test --coverage
      displayName: 'Run Tests'
    
    - script: |
        pnpm build
      displayName: 'Build Application'
    
    - script: |
        pnpm audit --audit-level high
      displayName: 'Security Audit'

- stage: Build
  displayName: 'Build and Package'
  dependsOn: Validate
  condition: succeeded()
  jobs:
  - job: BuildImage
    displayName: 'Build Docker Image'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: 'Build Docker Image'
      inputs:
        containerRegistry: 'container-registry'
        repository: 'marketing-websites'
        command: 'build'
        Dockerfile: 'Dockerfile.production'
        tags: |
          $(Build.BuildNumber)
          latest
    
    - task: Docker@2
      displayName: 'Push Docker Image'
      inputs:
        containerRegistry: 'container-registry'
        repository: 'marketing-websites'
        command: 'push'
        tags: |
          $(Build.BuildNumber)
          latest

- stage: Deploy_Staging
  displayName: 'Deploy to Staging'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
  jobs:
  - deployment: DeployStaging
    displayName: 'Deploy to Staging'
    environment: 'staging'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            displayName: 'Deploy to Azure Web App'
            inputs:
              azureSubscription: 'azure-subscription'
              appName: 'marketing-websites-staging'
              package: '$(workingDirectory)'
              runtimeStack: 'NODE|18-lts'
          
          - script: |
              curl -f https://marketing-websites-staging.azurewebsites.net/api/health
            displayName: 'Health Check'
          
          - script: |
              curl -f https://marketing-websites-staging.azurewebsites.net/api/ready
            displayName: 'Readiness Check'

- stage: Deploy_Production
  displayName: 'Deploy to Production'
  dependsOn: Build
  condition: and(succeeded(), startsWith(variables['Build.SourceBranch'], 'refs/tags/v'))
  jobs:
  - deployment: DeployProduction
    displayName: 'Deploy to Production'
    environment: 'production'
    pool:
      vmImage: 'ubuntu-latest'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            displayName: 'Deploy to Azure Web App'
            inputs:
              azureSubscription: 'azure-subscription'
              appName: 'marketing-websites-production'
              package: '$(workingDirectory)'
              runtimeStack: 'NODE|18-lts'
          
          - script: |
              curl -f https://marketing-websites.com/api/health
            displayName: 'Health Check'
          
          - script: |
              curl -f https://marketing-websites.com/api/ready
            displayName: 'Readiness Check'
          
          - script: |
              curl -f https://marketing-websites.com/api/metrics
            displayName: 'Metrics Check'
```

## Checklists and Templates

### 1. Pre-Deployment Checklist

```markdown
# Pre-Deployment Checklist

## Code Quality
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage >= 80%
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Security audit passed (no high/critical vulnerabilities)
- [ ] Bundle size within limits (< 250KB gzipped)

## Infrastructure Readiness
- [ ] Infrastructure as code reviewed and approved
- [ ] Resource quotas verified
- [ ] Network configuration validated
- [ ] Security groups and firewall rules configured
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery procedures tested

## Configuration Management
- [ ] Environment variables configured
- [ ] Secrets stored in Key Vault
- [ ] Feature flags reviewed and set
- [ ] Database migrations tested
- [ ] API endpoints configured
- [ ] CDN configuration updated

## Performance and Security
- [ ] Performance tests completed
- [ ] Load testing results acceptable
- [ ] Security scan completed
- [ ] SSL certificates valid
- [ ] CORS configuration correct
- [ ] Rate limiting configured

## Documentation and Communication
- [ ] Deployment plan documented
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled
- [ ] Support team briefed
- [ ] User communication prepared

## Final Validation
- [ ] Smoke tests passed
- [ ] Health checks passing
- [ ] Monitoring dashboards active
- [ ] Log aggregation working
- [ ] Alert notifications tested
- [ ] Rollback procedures tested

## Approval Gates
- [ ] Technical lead approval
- [ ] Security team approval
- [ ] Operations team approval
- [ ] Product owner approval
- [ ] Change advisory board approval (if required)
```

### 2. Post-Deployment Verification Template

```markdown
# Post-Deployment Verification Report

## Deployment Information
- **Deployment ID**: [deployment-id]
- **Version**: [version-number]
- **Environment**: [target-environment]
- **Deployment Time**: [start-time] - [end-time]
- **Deployed By**: [deployer]

## Health Checks
### Application Health
- [ ] Application responding (HTTP 200)
- [ ] Health endpoint passing
- [ ] Readiness endpoint passing
- [ ] Liveness endpoint passing
- [ ] Database connectivity verified
- [ ] Cache connectivity verified

### Infrastructure Health
- [ ] All services running
- [ ] Resource utilization normal
- [ ] Network connectivity verified
- [ ] Storage accessible
- [ ] Load balancer functioning
- [ ] CDN propagation complete

## Functional Verification
### Core Functionality
- [ ] User authentication working
- [ ] Main pages loading correctly
- [ ] API endpoints responding
- [ ] Database operations working
- [ ] File uploads/downloads working
- [ ] Search functionality working

### Business Features
- [ ] Lead capture forms working
- [ ] Content management working
- [ ] Analytics tracking active
- [ ] Email notifications working
- [ ] Payment processing working (if applicable)
- [ ] Third-party integrations working

## Performance Verification
### Response Times
- [ ] Home page < 2 seconds
- [ ] API responses < 500ms
- [ ] Database queries < 100ms
- [ ] File uploads within limits
- [ ] Search results < 1 second
- [ ] Admin panels responsive

### Resource Utilization
- [ ] CPU usage < 70%
- [ ] Memory usage < 80%
- [ ] Disk space adequate
- [ ] Network bandwidth normal
- [ ] Database connections normal
- [ ] Cache hit rate > 80%

## Security Verification
### Access Control
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Rate limiting active
- [ ] HTTPS working
- [ ] Security headers present
- [ ] CORS policies enforced

### Data Protection
- [ ] Data encryption active
- [ ] Backup procedures working
- [ ] Audit logging active
- [ ] PII protection verified
- [ ] GDPR compliance checked
- [ ] Access logs reviewed

## Monitoring and Alerting
### Metrics Collection
- [ ] Application metrics collected
- [ ] Infrastructure metrics collected
- [ ] Business metrics collected
- [ ] Error tracking active
- [ ] Performance monitoring active
- [ ] User analytics active

### Alert Configuration
- [ ] Error rate alerts configured
- [ ] Performance alerts configured
- [ ] Resource alerts configured
- [ ] Security alerts configured
- [ ] Business alerts configured
- [ ] Notification channels tested

## Rollback Preparedness
### Rollback Triggers
- [ ] Error rate > 5%
- [ ] Response time > 2 seconds
- [ ] CPU usage > 80%
- [ ] Memory usage > 85%
- [ ] Database errors
- [ ] Third-party service failures

### Rollback Procedures
- [ ] Previous version available
- [ ] Rollback script tested
- [ ] Database rollback ready
- [ ] Configuration rollback ready
- [ ] DNS rollback ready
- [ ] CDN rollback ready

## Issues and Resolutions
### Issues Found
1. [Issue description]
   - **Severity**: [critical/high/medium/low]
   - **Impact**: [description]
   - **Resolution**: [steps taken]
   - **Status**: [resolved/in-progress]

2. [Issue description]
   - **Severity**: [critical/high/medium/low]
   - **Impact**: [description]
   - **Resolution**: [steps taken]
   - **Status**: [resolved/in-progress]

### Follow-up Actions
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]
- [ ] [Action item 4]

## Sign-off
### Technical Verification
- **Verified By**: [name]
- **Date**: [date]
- **Status**: [approved/rejected/needs-review]

### Business Verification
- **Verified By**: [name]
- **Date**: [date]
- **Status**: [approved/rejected/needs-review]

### Final Approval
- **Approved By**: [name]
- **Date**: [date]
- **Go-Live Status**: [approved/deferred/cancelled]
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

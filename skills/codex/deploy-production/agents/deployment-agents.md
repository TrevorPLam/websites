---
name: deployment-agents
description: |
  **AGENT CONFIGURATION** - Codex deployment agent configurations and automation patterns.
  USE FOR: Understanding deployment agent behavior, deployment strategies, and production patterns.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "agent-config"
---

# Codex Deployment Agents

## Overview
This document defines specialized Codex agents for automated deployment processes, production deployments, and infrastructure management.

## Agent Specializations

### 1. Production Deployment Agent

```typescript
interface ProductionDeploymentAgent {
  name: 'codex-production-deployer';
  expertise: [
    'zero-downtime-deployment',
    'blue-green-deployment',
    'canary-releases',
    'rollback-strategies',
    'health-checks',
    'monitoring-integration',
    'infrastructure-provisioning',
    'environment-configuration'
  ];
  
  deploymentStrategies: {
    blueGreen: {
      description: 'Blue-green deployment with instant rollback',
      steps: ['provision-green', 'deploy-to-green', 'health-check', 'switch-traffic', 'cleanup-blue'],
      rollbackTime: '< 30 seconds'
    };
    canary: {
      description: 'Canary deployment with gradual traffic increase',
      steps: ['deploy-canary', '5%-traffic', 'monitor', '25%-traffic', 'monitor', '100%-traffic'],
      rollbackTime: '< 2 minutes'
    };
    rolling: {
      description: 'Rolling deployment with instance replacement',
      steps: ['drain-instance', 'deploy-new', 'health-check', 'repeat'],
      rollbackTime: '< 5 minutes'
    };
  };
  
  monitoring: {
    healthChecks: ['/health', '/ready', '/metrics'];
    alerting: ['deployment-failure', 'high-error-rate', 'performance-degradation'];
    rollbackTriggers: ['error-rate > 5%', 'response-time > 2s', 'health-check-failure'];
  };
}
```

### 2. Infrastructure Provisioning Agent

```typescript
interface InfrastructureAgent {
  name: 'codex-infrastructure-provisioner';
  expertise: [
    'terraform-automation',
    'azure-resource-management',
    'network-configuration',
    'security-hardening',
    'scaling-policies',
    'backup-strategies',
    'cost-optimization',
    'compliance-validation'
  ];
  
  provisioningPatterns: {
    infrastructureAsCode: {
      tools: ['Terraform', 'Azure CLI', 'Bicep'];
      validation: ['plan-review', 'security-scan', 'cost-estimation'];
      execution: ['apply', 'validate', 'monitor'];
    };
    securityHardening: {
      network: ['NSG-rules', 'DDoS-protection', 'Private-Endpoints'];
      access: ['RBAC', 'Managed-Identities', 'Key-Vault'];
      monitoring: ['Security-Center', 'Sentinel', 'Audit-Logs'];
    };
  };
  
  costOptimization: {
    rightsizing: ['VM-sizes', 'Storage-tiers', 'Network-bandwidth'];
    scheduling: ['Auto-shutdown', 'Spot-instances', 'Reserved-capacity'];
    monitoring: ['Cost-alerts', 'Budget-tracking', 'Usage-analytics'];
  };
}
```

### 3. Environment Management Agent

```typescript
interface EnvironmentManagementAgent {
  name: 'codex-environment-manager';
  expertise: [
    'environment-provisioning',
    'configuration-management',
    'secret-management',
    'dependency-resolution',
    'service-mesh',
    'api-gateway',
    'load-balancing',
    'cdn-configuration'
  ];
  
  environments: {
    development: {
      purpose: 'Local development and feature testing';
      infrastructure: 'Minimal, cost-optimized';
      data: 'Sample data, frequent resets';
      monitoring: 'Basic logging and debugging';
    };
    staging: {
      purpose: 'Pre-production validation';
      infrastructure: 'Production-like, scaled down';
      data: 'Anonymized production data';
      monitoring: 'Full production monitoring';
    };
    production: {
      purpose: 'Live customer traffic';
      infrastructure: 'High-availability, auto-scaling';
      data: 'Real customer data, encrypted';
      monitoring: 'Comprehensive with alerting';
    };
  };
  
  configurationManagement: {
    sources: ['Azure-App-Configuration', 'Key-Vault', 'Environment-Variables'];
    validation: ['schema-validation', 'type-checking', 'security-scanning'];
    deployment: ['blue-green', 'canary', 'rolling'];
  };
}
```

## Deployment Workflow Orchestration

### 1. Multi-Stage Deployment Pipeline

```typescript
interface DeploymentPipeline {
  stages: DeploymentStage[];
  rollbackPolicy: RollbackPolicy;
  monitoring: MonitoringConfig;
  approvalGates: ApprovalGate[];
}

interface DeploymentStage {
  name: string;
  type: 'provision' | 'deploy' | 'test' | 'promote' | 'rollback';
  agents: string[];
  timeout: number;
  rollbackPoint: boolean;
}

class DeploymentOrchestrator {
  async executeDeployment(pipeline: DeploymentPipeline, context: DeploymentContext): Promise<DeploymentResult> {
    const deploymentId = this.generateDeploymentId();
    const deploymentState = new DeploymentState(deploymentId);
    
    try {
      for (const stage of pipeline.stages) {
        const stageResult = await this.executeStage(stage, context, deploymentState);
        
        if (!stageResult.success && stage.rollbackPoint) {
          await this.executeRollback(deploymentState);
          throw new DeploymentError(`Stage ${stage.name} failed, rollback initiated`);
        }
        
        deploymentState.completeStage(stage.name, stageResult);
      }
      
      return await this.generateSuccessReport(deploymentState);
    } catch (error) {
      return await this.generateFailureReport(deploymentState, error);
    }
  }
  
  private async executeStage(
    stage: DeploymentStage, 
    context: DeploymentContext, 
    state: DeploymentState
  ): Promise<StageResult> {
    console.log(`Executing stage: ${stage.name}`);
    
    switch (stage.type) {
      case 'provision':
        return await this.executeProvisioning(stage, context, state);
      case 'deploy':
        return await this.executeDeployment(stage, context, state);
      case 'test':
        return await this.executeTesting(stage, context, state);
      case 'promote':
        return await this.executePromotion(stage, context, state);
      default:
        throw new Error(`Unknown stage type: ${stage.type}`);
    }
  }
}
```

### 2. Rollback Management

```typescript
interface RollbackStrategy {
  type: 'immediate' | 'gradual' | 'manual';
  triggers: RollbackTrigger[];
  steps: RollbackStep[];
  maxDuration: number;
}

class RollbackManager {
  async executeRollback(
    deploymentState: DeploymentState, 
    strategy: RollbackStrategy
  ): Promise<RollbackResult> {
    console.log(`Executing rollback strategy: ${strategy.type}`);
    
    switch (strategy.type) {
      case 'immediate':
        return await this.immediateRollback(deploymentState, strategy);
      case 'gradual':
        return await this.gradualRollback(deploymentState, strategy);
      case 'manual':
        return await this.manualRollback(deploymentState, strategy);
      default:
        throw new Error(`Unknown rollback strategy: ${strategy.type}`);
    }
  }
  
  private async immediateRollback(
    state: DeploymentState, 
    strategy: RollbackStrategy
  ): Promise<RollbackResult> {
    // Immediate traffic switch to previous version
    const previousVersion = state.getPreviousVersion();
    
    await this.switchTraffic(previousVersion);
    await this.validateRollback(previousVersion);
    
    return {
      success: true,
      rollbackTime: Date.now() - state.startTime,
      version: previousVersion
    };
  }
  
  private async gradualRollback(
    state: DeploymentState, 
    strategy: RollbackStrategy
  ): Promise<RollbackResult> {
    // Gradual traffic reduction from new version
    const currentVersion = state.getCurrentVersion();
    const previousVersion = state.getPreviousVersion();
    
    for (const step of strategy.steps) {
      await this.adjustTraffic(step.newVersion, step.trafficPercentage);
      await this.monitorHealth(step.duration);
      
      if (!await this.isHealthy()) {
        // Continue rollback if still unhealthy
        continue;
      } else {
        break; // System stabilized, stop rollback
      }
    }
    
    return {
      success: true,
      rollbackTime: Date.now() - state.startTime,
      version: previousVersion
    };
  }
}
```

## Production Deployment Patterns

### 1. Blue-Green Deployment

```typescript
class BlueGreenDeployment {
  async deploy(deploymentConfig: DeploymentConfig): Promise<DeploymentResult> {
    const blueEnvironment = await this.getActiveEnvironment();
    const greenEnvironment = await this.getInactiveEnvironment();
    
    try {
      // Deploy to green environment
      await this.deployToGreen(greenEnvironment, deploymentConfig);
      
      // Health check green environment
      await this.healthCheck(greenEnvironment);
      
      // Switch traffic to green
      await this.switchTraffic(greenEnvironment);
      
      // Validate deployment
      await this.validateDeployment(greenEnvironment);
      
      // Cleanup blue environment
      await this.cleanupEnvironment(blueEnvironment);
      
      return { success: true, environment: greenEnvironment };
    } catch (error) {
      // Rollback to blue environment
      await this.switchTraffic(blueEnvironment);
      throw error;
    }
  }
  
  private async deployToGreen(
    environment: Environment, 
    config: DeploymentConfig
  ): Promise<void> {
    // Provision infrastructure
    await this.provisionInfrastructure(environment, config);
    
    // Deploy application
    await this.deployApplication(environment, config);
    
    // Configure services
    await this.configureServices(environment, config);
    
    // Run smoke tests
    await this.runSmokeTests(environment);
  }
  
  private async switchTraffic(environment: Environment): Promise<void> {
    // Update load balancer
    await this.updateLoadBalancer(environment);
    
    // Update DNS if needed
    await this.updateDNS(environment);
    
    // Update CDN configuration
    await this.updateCDN(environment);
  }
}
```

### 2. Canary Deployment

```typescript
class CanaryDeployment {
  async deploy(deploymentConfig: DeploymentConfig): Promise<DeploymentResult> {
    const canaryEnvironment = await this.createCanaryEnvironment();
    const baselineEnvironment = await this.getBaselineEnvironment();
    
    try {
      // Deploy canary version
      await this.deployCanary(canaryEnvironment, deploymentConfig);
      
      // Gradual traffic increase
      const trafficSteps = [5, 25, 50, 100];
      
      for (const trafficPercentage of trafficSteps) {
        await this.adjustTraffic(canaryEnvironment, trafficPercentage);
        
        // Monitor for specified duration
        const isHealthy = await this.monitorCanary(
          canaryEnvironment, 
          baselineEnvironment,
          deploymentConfig.monitoringDuration
        );
        
        if (!isHealthy) {
          // Rollback canary
          await this.rollbackCanary(canaryEnvironment);
          throw new Error('Canary deployment failed health checks');
        }
      }
      
      // Promote canary to production
      await this.promoteCanary(canaryEnvironment);
      
      return { success: true, environment: canaryEnvironment };
    } catch (error) {
      // Ensure canary is cleaned up
      await this.cleanupCanary(canaryEnvironment);
      throw error;
    }
  }
  
  private async monitorCanary(
    canary: Environment, 
    baseline: Environment,
    duration: number
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      const canaryMetrics = await this.getMetrics(canary);
      const baselineMetrics = await this.getMetrics(baseline);
      
      const isHealthy = this.compareMetrics(canaryMetrics, baselineMetrics);
      
      if (!isHealthy) {
        return false;
      }
      
      await this.sleep(30000); // Check every 30 seconds
    }
    
    return true;
  }
  
  private compareMetrics(canary: Metrics, baseline: Metrics): boolean {
    // Error rate should not be significantly higher
    if (canary.errorRate > baseline.errorRate * 1.5) {
      return false;
    }
    
    // Response time should not be significantly higher
    if (canary.responseTime > baseline.responseTime * 1.2) {
      return false;
    }
    
    // Throughput should be maintained
    if (canary.throughput < baseline.throughput * 0.8) {
      return false;
    }
    
    return true;
  }
}
```

## Monitoring and Observability

### 1. Deployment Monitoring

```typescript
interface DeploymentMonitoring {
  metrics: DeploymentMetrics;
  alerts: DeploymentAlert[];
  dashboards: DeploymentDashboard[];
}

interface DeploymentMetrics {
  deploymentTime: number;
  rollbackTime: number;
  successRate: number;
  errorRate: number;
  performanceImpact: PerformanceImpact;
}

class DeploymentMonitor {
  async monitorDeployment(
    deploymentId: string,
    environment: Environment
  ): Promise<MonitoringResult> {
    const monitoring = new DeploymentMonitoring(deploymentId);
    
    // Start monitoring
    await this.startMonitoring(environment);
    
    // Collect metrics
    const metrics = await this.collectMetrics(environment);
    
    // Check alerts
    const alerts = await this.checkAlerts(metrics);
    
    // Update dashboards
    await this.updateDashboards(metrics);
    
    return {
      deploymentId,
      metrics,
      alerts,
      healthy: alerts.length === 0
    };
  }
  
  private async collectMetrics(environment: Environment): Promise<DeploymentMetrics> {
    const [
      deploymentMetrics,
      applicationMetrics,
      infrastructureMetrics
    ] = await Promise.all([
      this.getDeploymentMetrics(environment),
      this.getApplicationMetrics(environment),
      this.getInfrastructureMetrics(environment)
    ]);
    
    return {
      deploymentTime: deploymentMetrics.duration,
      rollbackTime: deploymentMetrics.rollbackDuration,
      successRate: applicationMetrics.successRate,
      errorRate: applicationMetrics.errorRate,
      performanceImpact: {
        responseTime: applicationMetrics.responseTime,
        throughput: applicationMetrics.throughput,
        cpuUsage: infrastructureMetrics.cpuUsage,
        memoryUsage: infrastructureMetrics.memoryUsage
      }
    };
  }
}
```

### 2. Health Check Implementation

```typescript
class HealthChecker {
  private healthChecks: Map<string, HealthCheck> = new Map();
  
  registerHealthCheck(name: string, check: HealthCheck): void {
    this.healthChecks.set(name, check);
  }
  
  async runHealthChecks(environment: Environment): Promise<HealthReport> {
    const results = await Promise.allSettled(
      Array.from(this.healthChecks.entries()).map(async ([name, check]) => {
        const start = Date.now();
        try {
          const healthy = await check.execute(environment);
          return {
            name,
            healthy: healthy as boolean,
            duration: Date.now() - start,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          return {
            name,
            healthy: false,
            duration: Date.now() - start,
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      })
    );
    
    const checks = results.map(r => 
      r.status === 'fulfilled' ? r.value : r.reason
    );
    
    const healthyCount = checks.filter(c => c.healthy).length;
    const overall = healthyCount === this.healthChecks.size ? 'healthy' : 'unhealthy';
    
    return {
      overall,
      checks,
      timestamp: new Date().toISOString(),
      environment: environment.name
    };
  }
}

interface HealthCheck {
  name: string;
  timeout: number;
  execute(environment: Environment): Promise<boolean>;
}

class ApplicationHealthCheck implements HealthCheck {
  name = 'application';
  timeout = 30000;
  
  async execute(environment: Environment): Promise<boolean> {
    try {
      const response = await fetch(`${environment.url}/health`, {
        timeout: this.timeout
      });
      
      if (!response.ok) {
        return false;
      }
      
      const health = await response.json();
      return health.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

class DatabaseHealthCheck implements HealthCheck {
  name = 'database';
  timeout = 10000;
  
  async execute(environment: Environment): Promise<boolean> {
    try {
      // Test database connectivity
      await environment.database.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

## Configuration Management

### 1. Environment Configuration

```typescript
interface EnvironmentConfiguration {
  name: string;
  type: 'development' | 'staging' | 'production';
  infrastructure: InfrastructureConfig;
  application: ApplicationConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

class ConfigurationManager {
  async loadConfiguration(
    environmentName: string,
    deploymentConfig: DeploymentConfig
  ): Promise<EnvironmentConfiguration> {
    const baseConfig = await this.loadBaseConfiguration();
    const environmentConfig = await this.loadEnvironmentSpecificConfig(environmentName);
    const deploymentOverrides = await this.loadDeploymentOverrides(deploymentConfig);
    
    return this.mergeConfigurations(baseConfig, environmentConfig, deploymentOverrides);
  }
  
  private async loadBaseConfiguration(): Promise<Partial<EnvironmentConfiguration>> {
    // Load from Azure App Configuration or similar
    return {
      application: {
        framework: 'nextjs',
        version: '16.0.0',
        features: ['ssr', 'ssg', 'api-routes']
      },
      monitoring: {
        enabled: true,
        metrics: ['performance', 'errors', 'business'],
        alerting: ['deployment', 'performance', 'security']
      }
    };
  }
  
  private async loadEnvironmentSpecificConfig(
    environmentName: string
  ): Promise<Partial<EnvironmentConfiguration>> {
    const configs = {
      development: {
        infrastructure: {
          vmSize: 'Standard_B2s',
          instanceCount: 1,
          storageType: 'Standard_LRS'
        },
        application: {
          logLevel: 'debug',
          hotReload: true,
          sourceMaps: true
        }
      },
      staging: {
        infrastructure: {
          vmSize: 'Standard_D2s_v3',
          instanceCount: 2,
          storageType: 'Standard_GRS'
        },
        application: {
          logLevel: 'info',
          hotReload: false,
          sourceMaps: false
        }
      },
      production: {
        infrastructure: {
          vmSize: 'Standard_D4s_v3',
          instanceCount: 3,
          storageType: 'Standard_GRS',
          autoScale: {
            minInstances: 3,
            maxInstances: 10,
            targetCPU: 70
          }
        },
        application: {
          logLevel: 'warn',
          hotReload: false,
          sourceMaps: false,
          security: {
            httpsOnly: true,
            hsts: true,
            csp: true
          }
        }
      }
    };
    
    return configs[environmentName] || {};
  }
}
```

### 2. Secret Management

```typescript
class SecretManager {
  async loadSecrets(environment: Environment): Promise<Secrets> {
    const secrets: Secrets = {};
    
    // Load from Azure Key Vault
    const keyVault = await this.getKeyVault(environment);
    
    const secretNames = [
      'database-connection-string',
      'jwt-secret',
      'api-keys',
      'external-service-credentials'
    ];
    
    for (const secretName of secretNames) {
      try {
        const secret = await keyVault.getSecret(secretName);
        secrets[secretName] = secret.value;
      } catch (error) {
        console.error(`Failed to load secret ${secretName}:`, error);
        throw new Error(`Missing required secret: ${secretName}`);
      }
    }
    
    return secrets;
  }
  
  private async getKeyVault(environment: Environment): Promise<KeyVault> {
    const keyVaultName = `${environment.name}-kv`;
    return new KeyVault(keyVaultName);
  }
}

interface Secrets {
  databaseConnectionString: string;
  jwtSecret: string;
  apiKeys: Record<string, string>;
  externalServiceCredentials: Record<string, string>;
}
```

## Error Handling and Recovery

### 1. Deployment Error Classification

```typescript
enum DeploymentErrorType {
  INFRASTRUCTURE_FAILURE = 'infrastructure_failure',
  APPLICATION_FAILURE = 'application_failure',
  CONFIGURATION_ERROR = 'configuration_error',
  NETWORK_ISSUE = 'network_issue',
  TIMEOUT = 'timeout',
  HEALTH_CHECK_FAILURE = 'health_check_failure',
  ROLLBACK_FAILURE = 'rollback_failure'
}

interface DeploymentError {
  type: DeploymentErrorType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  context: ErrorContext;
  timestamp: number;
  recoverable: boolean;
  suggestedAction: string;
}

class DeploymentErrorHandler {
  async handleError(error: DeploymentError, context: DeploymentContext): Promise<ErrorResolution> {
    console.error(`Deployment error: ${error.type} - ${error.message}`);
    
    switch (error.type) {
      case DeploymentErrorType.INFRASTRUCTURE_FAILURE:
        return await this.handleInfrastructureFailure(error, context);
      case DeploymentErrorType.APPLICATION_FAILURE:
        return await this.handleApplicationFailure(error, context);
      case DeploymentErrorType.CONFIGURATION_ERROR:
        return await this.handleConfigurationError(error, context);
      case DeploymentErrorType.HEALTH_CHECK_FAILURE:
        return await this.handleHealthCheckFailure(error, context);
      default:
        return await this.handleGenericError(error, context);
    }
  }
  
  private async handleInfrastructureFailure(
    error: DeploymentError, 
    context: DeploymentContext
  ): Promise<ErrorResolution> {
    // Check if infrastructure can be recovered
    const recoverable = await this.checkInfrastructureRecoverability(error);
    
    if (recoverable) {
      // Attempt infrastructure recovery
      const recoverySuccess = await this.recoverInfrastructure(error, context);
      
      if (recoverySuccess) {
        return {
          action: 'retry_deployment',
          message: 'Infrastructure recovered, retrying deployment',
          delay: 60000 // Wait 1 minute before retry
        };
      }
    }
    
    // Infrastructure cannot be recovered, rollback
    return {
      action: 'rollback',
      message: 'Infrastructure failure cannot be recovered, initiating rollback',
      delay: 0
    };
  }
  
  private async handleApplicationFailure(
    error: DeploymentError, 
    context: DeploymentContext
  ): Promise<ErrorResolution> {
    // Check if it's a configuration issue
    if (error.context.configurationRelated) {
      return {
        action: 'fix_configuration',
        message: 'Application failure due to configuration, fix required',
        delay: 0
      };
    }
    
    // Check if it's a transient issue
    if (error.context.transient) {
      return {
        action: 'retry_deployment',
        message: 'Transient application failure, retrying deployment',
        delay: 30000 // Wait 30 seconds before retry
      };
    }
    
    // Persistent application issue, rollback
    return {
      action: 'rollback',
      message: 'Persistent application failure, initiating rollback',
      delay: 0
    };
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

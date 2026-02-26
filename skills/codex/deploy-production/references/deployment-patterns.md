---
name: deployment-patterns
description: |
  **REFERENCE GUIDE** - Comprehensive deployment patterns and best practices.
  USE FOR: Understanding deployment strategies, infrastructure patterns, and operational procedures.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# Production Deployment Patterns

## Overview
This document outlines comprehensive deployment patterns and best practices for production deployments in the marketing websites monorepo.

## Deployment Strategies

### 1. Blue-Green Deployment

#### Pattern Overview
Blue-Green deployment maintains two identical production environments:
- **Blue**: Current production version
- **Green**: New version being deployed

#### Implementation Pattern
```typescript
interface BlueGreenDeployment {
  environments: {
    blue: Environment;
    green: Environment;
  };
  trafficRouter: TrafficRouter;
  healthChecker: HealthChecker;
  rollbackManager: RollbackManager;
}

class BlueGreenDeploymentOrchestrator {
  async deploy(deploymentConfig: DeploymentConfig): Promise<DeploymentResult> {
    const blueEnvironment = await this.getActiveEnvironment();
    const greenEnvironment = await this.getInactiveEnvironment();
    
    try {
      // Phase 1: Deploy to Green
      await this.deployToGreen(greenEnvironment, deploymentConfig);
      
      // Phase 2: Health Check Green
      await this.healthCheck(greenEnvironment);
      
      // Phase 3: Switch Traffic to Green
      await this.switchTraffic(greenEnvironment);
      
      // Phase 4: Validate Deployment
      await this.validateDeployment(greenEnvironment);
      
      // Phase 5: Cleanup Blue
      await this.cleanupEnvironment(blueEnvironment);
      
      return { success: true, environment: greenEnvironment };
    } catch (error) {
      // Immediate rollback to Blue
      await this.switchTraffic(blueEnvironment);
      throw error;
    }
  }
}
```

#### Advantages
- **Zero Downtime**: Instant traffic switching
- **Instant Rollback**: Switch back to previous version immediately
- **Testing**: Full production testing before traffic switch
- **Safety**: Previous version always available

#### Considerations
- **Cost**: Double infrastructure requirements
- **Complexity**: More complex infrastructure management
- **Data**: Database migration challenges
- **State**: Session state management

### 2. Canary Deployment

#### Pattern Overview
Canary deployment gradually releases new version to a small subset of users:
- **Initial**: 5% traffic to new version
- **Gradual**: Increase traffic based on health metrics
- **Full**: 100% traffic when confident

#### Implementation Pattern
```typescript
interface CanaryDeployment {
  stages: CanaryStage[];
  metrics: CanaryMetrics;
  trafficRouter: TrafficRouter;
  monitoring: CanaryMonitoring;
}

interface CanaryStage {
  trafficPercentage: number;
  duration: number;
  healthChecks: HealthCheck[];
  rollbackTriggers: RollbackTrigger[];
}

class CanaryDeploymentOrchestrator {
  async deploy(deploymentConfig: DeploymentConfig): Promise<DeploymentResult> {
    const canaryEnvironment = await this.createCanaryEnvironment();
    const baselineEnvironment = await this.getBaselineEnvironment();
    
    try {
      // Deploy canary version
      await this.deployCanary(canaryEnvironment, deploymentConfig);
      
      // Gradual traffic increase
      const stages = [
        { traffic: 5, duration: 300000 },    // 5% for 5 minutes
        { traffic: 25, duration: 600000 },   // 25% for 10 minutes
        { traffic: 50, duration: 600000 },   // 50% for 10 minutes
        { traffic: 100, duration: 300000 }   // 100% for 5 minutes
      ];
      
      for (const stage of stages) {
        await this.adjustTraffic(canaryEnvironment, stage.traffic);
        
        const isHealthy = await this.monitorCanary(
          canaryEnvironment, 
          baselineEnvironment,
          stage.duration
        );
        
        if (!isHealthy) {
          await this.rollbackCanary(canaryEnvironment);
          throw new Error('Canary deployment failed health checks');
        }
      }
      
      // Promote canary to production
      await this.promoteCanary(canaryEnvironment);
      
      return { success: true, environment: canaryEnvironment };
    } catch (error) {
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

#### Advantages
- **Risk Mitigation**: Limited exposure to potential issues
- **Gradual Rollout**: Controlled increase in traffic
- **Real Testing**: Production environment testing
- **Quick Rollback**: Easy to rollback if issues detected

#### Considerations
- **Complexity**: More complex deployment logic
- **Monitoring**: Requires comprehensive monitoring
- **Duration**: Longer deployment process
- **User Experience**: Some users get different versions

### 3. Rolling Deployment

#### Pattern Overview
Rolling deployment gradually replaces instances with new version:
- **Instance by Instance**: Replace one instance at a time
- **Load Balancer**: Manage traffic during rollout
- **Health Checks**: Ensure new instances are healthy

#### Implementation Pattern
```typescript
interface RollingDeployment {
  instances: Instance[];
  loadBalancer: LoadBalancer;
  healthChecker: HealthChecker;
  deploymentStrategy: RollingStrategy;
}

interface RollingStrategy {
  batchSize: number;
  waitTime: number;
  healthCheckTimeout: number;
  rollbackOnFailure: boolean;
}

class RollingDeploymentOrchestrator {
  async deploy(deploymentConfig: DeploymentConfig): Promise<DeploymentResult> {
    const instances = await this.getInstances();
    const batches = this.createBatches(instances);
    
    try {
      for (const batch of batches) {
        await this.deployBatch(batch, deploymentConfig);
        await this.validateBatch(batch);
      }
      
      return { success: true, instancesDeployed: instances.length };
    } catch (error) {
      await this.rollbackDeployment(instances);
      throw error;
    }
  }
  
  private async deployBatch(
    batch: Instance[], 
    deploymentConfig: DeploymentConfig
  ): Promise<void> {
    // Drain traffic from batch instances
    await this.drainInstances(batch);
    
    // Wait for traffic to drain
    await this.sleep(30000);
    
    // Deploy new version to batch
    for (const instance of batch) {
      await this.deployInstance(instance, deploymentConfig);
    }
    
    // Wait for instances to be ready
    await this.sleep(60000);
    
    // Health check new instances
    for (const instance of batch) {
      const isHealthy = await this.healthChecker.check(instance);
      if (!isHealthy) {
        throw new Error(`Instance ${instance.id} failed health check`);
      }
    }
    
    // Return traffic to batch instances
    await this.enableInstances(batch);
  }
  
  private createBatches(instances: Instance[]): Instance[][] {
    const batchSize = 2; // Deploy 2 instances at a time
    const batches: Instance[][] = [];
    
    for (let i = 0; i < instances.length; i += batchSize) {
      batches.push(instances.slice(i, i + batchSize));
    }
    
    return batches;
  }
}
```

#### Advantages
- **Resource Efficient**: No additional infrastructure needed
- **Gradual Rollout**: Controlled deployment process
- **Always Available**: Application remains available
- **Simple**: Less complex than other strategies

#### Considerations
- **Rollback Complexity**: More complex rollback process
- **Version Mixing**: Multiple versions running simultaneously
- **State Management**: Session state challenges
- **Testing**: Limited ability to test before full rollout

## Infrastructure Patterns

### 1. Infrastructure as Code (IaC)

#### Terraform Pattern
```typescript
// terraform-patterns.ts
interface TerraformConfiguration {
  provider: {
    azurerm: {
      features: {};
    };
  };
  resources: TerraformResource[];
  variables: TerraformVariable[];
  outputs: TerraformOutput[];
}

interface TerraformResource {
  type: string;
  name: string;
  configuration: Record<string, any>;
  dependsOn?: string[];
}

class TerraformManager {
  async deployInfrastructure(config: TerraformConfiguration): Promise<void> {
    // Initialize Terraform
    await this.runCommand('terraform init');
    
    // Plan deployment
    await this.runCommand('terraform plan -out=tfplan');
    
    // Apply deployment
    await this.runCommand('terraform apply -auto-approve tfplan');
    
    // Validate deployment
    await this.validateDeployment(config);
  }
  
  async destroyInfrastructure(config: TerraformConfiguration): Promise<void> {
    // Destroy resources
    await this.runCommand('terraform destroy -auto-approve');
  }
  
  private async runCommand(command: string): Promise<void> {
    // Execute Terraform command
    // Handle output and errors
  }
}
```

#### Azure Bicep Pattern
```typescript
// bicep-patterns.ts
interface BicepConfiguration {
  targetScope: string;
  parameters: BicepParameter[];
  resources: BicepResource[];
  outputs: BicepOutput[];
}

interface BicepParameter {
  type: string;
  defaultValue?: any;
  metadata?: Record<string, any>;
}

interface BicepResource {
  type: string;
  apiVersion: string;
  name: string;
  properties: Record<string, any>;
  dependsOn?: string[];
}

class BicepManager {
  async deployInfrastructure(config: BicepConfiguration): Promise<void> {
    // Validate Bicep template
    await this.validateTemplate(config);
    
    // Deploy resources
    await this.deployTemplate(config);
    
    // Verify deployment
    await this.verifyDeployment(config);
  }
}
```

### 2. Container Orchestration

#### Kubernetes Pattern
```typescript
// kubernetes-patterns.ts
interface KubernetesConfiguration {
  apiVersion: string;
  kind: 'Deployment' | 'Service' | 'Ingress' | 'ConfigMap' | 'Secret';
  metadata: KubernetesMetadata;
  spec: KubernetesSpec;
}

interface KubernetesMetadata {
  name: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface KubernetesSpec {
  replicas?: number;
  selector?: KubernetesSelector;
  template?: KubernetesPodTemplate;
  ports?: KubernetesPort[];
  type?: string;
}

class KubernetesManager {
  async deployApplication(config: KubernetesConfiguration): Promise<void> {
    // Apply Kubernetes manifests
    await this.applyManifest(config);
    
    // Wait for rollout
    await this.waitForRollout(config.metadata.name);
    
    // Verify deployment
    await this.verifyDeployment(config.metadata.name);
  }
  
  async scaleApplication(name: string, replicas: number): Promise<void> {
    // Scale deployment
    await this.scaleDeployment(name, replicas);
    
    // Wait for scale completion
    await this.waitForScale(name, replicas);
  }
  
  async rollbackApplication(name: string, revision: number): Promise<void> {
    // Rollback to previous revision
    await this.rollbackDeployment(name, revision);
    
    // Wait for rollback completion
    await this.waitForRollback(name);
  }
}
```

### 3. Serverless Patterns

#### Azure Functions Pattern
```typescript
// serverless-patterns.ts
interface ServerlessConfiguration {
  functionApp: {
    name: string;
    location: string;
    storageAccount: string;
    appServicePlan: string;
  };
  functions: ServerlessFunction[];
  triggers: ServerlessTrigger[];
  bindings: ServerlessBinding[];
}

interface ServerlessFunction {
  name: string;
  scriptFile: string;
  entryPoint: string;
  bindings: ServerlessBinding[];
}

class ServerlessManager {
  async deployFunctions(config: ServerlessConfiguration): Promise<void> {
    // Deploy Function App
    await this.deployFunctionApp(config.functionApp);
    
    // Deploy functions
    for (const func of config.functions) {
      await this.deployFunction(func);
    }
    
    // Configure triggers and bindings
    await this.configureBindings(config.bindings);
    
    // Test deployment
    await this.testDeployment(config);
  }
}
```

## Monitoring and Observability Patterns

### 1. Health Check Patterns

#### Comprehensive Health Check
```typescript
interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
  timestamp: Date;
  duration: number;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  data?: any;
  error?: string;
}

class HealthCheckManager {
  private checks: Map<string, HealthCheckFunction> = new Map();
  
  registerHealthCheck(name: string, check: HealthCheckFunction): void {
    this.checks.set(name, check);
  }
  
  async runHealthChecks(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];
    
    for (const [name, checkFunction] of this.checks) {
      const checkStart = Date.now();
      
      try {
        const result = await checkFunction();
        checks.push({
          name,
          status: result ? 'pass' : 'fail',
          duration: Date.now() - checkStart,
          data: result
        });
      } catch (error) {
        checks.push({
          name,
          status: 'fail',
          duration: Date.now() - checkStart,
          error: error.message
        });
      }
    }
    
    const overallStatus = this.calculateOverallStatus(checks);
    
    return {
      status: overallStatus,
      checks,
      timestamp: new Date(),
      duration: Date.now() - startTime
    };
  }
  
  private calculateOverallStatus(checks: HealthCheck[]): HealthCheckResult['status'] {
    const failedChecks = checks.filter(c => c.status === 'fail');
    const warningChecks = checks.filter(c => c.status === 'warn');
    
    if (failedChecks.length > 0) {
      return 'unhealthy';
    } else if (warningChecks.length > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }
}
```

### 2. Metrics Collection Patterns

#### Application Metrics
```typescript
interface MetricsCollector {
  collectApplicationMetrics(): Promise<ApplicationMetrics>;
  collectInfrastructureMetrics(): Promise<InfrastructureMetrics>;
  collectBusinessMetrics(): Promise<BusinessMetrics>;
}

interface ApplicationMetrics {
  requestCount: number;
  errorCount: number;
  responseTime: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

class PrometheusMetricsCollector implements MetricsCollector {
  async collectApplicationMetrics(): Promise<ApplicationMetrics> {
    const metrics = await this.queryPrometheus([
      'http_requests_total',
      'http_request_duration_seconds',
      'process_resident_memory_bytes',
      'process_cpu_seconds_total'
    ]);
    
    return {
      requestCount: this.extractMetric(metrics, 'http_requests_total'),
      errorCount: this.extractMetric(metrics, 'http_requests_total', { status: '500' }),
      responseTime: this.extractMetric(metrics, 'http_request_duration_seconds'),
      throughput: this.calculateThroughput(metrics),
      memoryUsage: this.extractMetric(metrics, 'process_resident_memory_bytes'),
      cpuUsage: this.calculateCpuUsage(metrics)
    };
  }
}
```

### 3. Alerting Patterns

#### Alert Configuration
```typescript
interface AlertRule {
  name: string;
  condition: AlertCondition;
  severity: 'critical' | 'warning' | 'info';
  duration: number;
  actions: AlertAction[];
}

interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne';
  threshold: number;
  aggregation?: 'avg' | 'sum' | 'max' | 'min';
}

class AlertManager {
  private rules: AlertRule[] = [];
  
  addAlertRule(rule: AlertRule): void {
    this.rules.push(rule);
  }
  
  async evaluateAlerts(metrics: Metrics): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    for (const rule of this.rules) {
      const isTriggered = await this.evaluateRule(rule, metrics);
      
      if (isTriggered) {
        alerts.push({
          name: rule.name,
          severity: rule.severity,
          timestamp: new Date(),
          message: this.generateAlertMessage(rule, metrics)
        });
        
        // Execute alert actions
        await this.executeActions(rule.actions, alerts[alerts.length - 1]);
      }
    }
    
    return alerts;
  }
  
  private async evaluateRule(rule: AlertRule, metrics: Metrics): Promise<boolean> {
    const metricValue = this.extractMetricValue(rule.condition.metric, metrics);
    
    switch (rule.condition.operator) {
      case 'gt':
        return metricValue > rule.condition.threshold;
      case 'lt':
        return metricValue < rule.condition.threshold;
      case 'eq':
        return metricValue === rule.condition.threshold;
      case 'ne':
        return metricValue !== rule.condition.threshold;
      default:
        return false;
    }
  }
}
```

## Security Patterns

### 1. Secure Deployment Patterns

#### Zero-Trust Deployment
```typescript
interface SecureDeploymentConfig {
  authentication: {
    enabled: boolean;
    providers: string[];
    policies: SecurityPolicy[];
  };
  authorization: {
    enabled: boolean;
    roles: string[];
    permissions: Permission[];
  };
  encryption: {
    atRest: boolean;
    inTransit: boolean;
    keyManagement: string;
  };
  monitoring: {
    auditLogging: boolean;
    threatDetection: boolean;
    complianceReporting: boolean;
  };
}

class SecureDeploymentManager {
  async deployWithSecurity(config: SecureDeploymentConfig): Promise<void> {
    // Validate security configuration
    await this.validateSecurityConfig(config);
    
    // Deploy with security measures
    await this.deploySecureInfrastructure(config);
    
    // Configure security policies
    await this.configureSecurityPolicies(config);
    
    // Enable security monitoring
    await this.enableSecurityMonitoring(config);
    
    // Run security tests
    await this.runSecurityTests(config);
  }
  
  private async validateSecurityConfig(config: SecureDeploymentConfig): Promise<void> {
    // Validate authentication configuration
    if (!config.authentication.enabled) {
      throw new Error('Authentication must be enabled');
    }
    
    // Validate encryption configuration
    if (!config.encryption.atRest || !config.encryption.inTransit) {
      throw new Error('Encryption must be enabled for both at-rest and in-transit');
    }
    
    // Validate monitoring configuration
    if (!config.monitoring.auditLogging) {
      throw new Error('Audit logging must be enabled');
    }
  }
}
```

### 2. Compliance Patterns

#### GDPR Compliance
```typescript
interface GDPRComplianceConfig {
  dataProtection: {
    encryption: boolean;
    anonymization: boolean;
    retention: RetentionPolicy;
  };
  userRights: {
    access: boolean;
    rectification: boolean;
    erasure: boolean;
    portability: boolean;
  };
  consent: {
    management: boolean;
    recording: boolean;
    withdrawal: boolean;
  };
  monitoring: {
    auditLogging: boolean;
    breachNotification: boolean;
    complianceReporting: boolean;
  };
}

class GDPRComplianceManager {
  async ensureCompliance(config: GDPRComplianceConfig): Promise<void> {
    // Implement data protection measures
    await this.implementDataProtection(config.dataProtection);
    
    // Implement user rights mechanisms
    await this.implementUserRights(config.userRights);
    
    // Implement consent management
    await this.implementConsentManagement(config.consent);
    
    // Implement compliance monitoring
    await this.implementComplianceMonitoring(config.monitoring);
    
    // Run compliance tests
    await this.runComplianceTests(config);
  }
}
```

## Performance Patterns

### 1. Performance Optimization

#### Caching Strategies
```typescript
interface CachingStrategy {
  type: 'memory' | 'redis' | 'cdn' | 'database';
  configuration: CacheConfiguration;
  invalidation: InvalidationPolicy;
  monitoring: CacheMonitoring;
}

interface CacheConfiguration {
  ttl: number;
  maxSize?: number;
  evictionPolicy?: 'lru' | 'lfu' | 'ttl';
  compression?: boolean;
  encryption?: boolean;
}

class CacheManager {
  private strategies: Map<string, CachingStrategy> = new Map();
  
  addCachingStrategy(name: string, strategy: CachingStrategy): void {
    this.strategies.set(name, strategy);
  }
  
  async get<T>(key: string, strategyName: string): Promise<T | null> {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      return null;
    }
    
    switch (strategy.type) {
      case 'memory':
        return await this.getFromMemoryCache<T>(key, strategy);
      case 'redis':
        return await this.getFromRedisCache<T>(key, strategy);
      case 'cdn':
        return await this.getFromCDNCache<T>(key, strategy);
      case 'database':
        return await this.getFromDatabaseCache<T>(key, strategy);
      default:
        return null;
    }
  }
  
  async set<T>(
    key: string, 
    value: T, 
    strategyName: string, 
    ttl?: number
  ): Promise<void> {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      return;
    }
    
    const effectiveTtl = ttl || strategy.configuration.ttl;
    
    switch (strategy.type) {
      case 'memory':
        await this.setToMemoryCache(key, value, strategy, effectiveTtl);
        break;
      case 'redis':
        await this.setToRedisCache(key, value, strategy, effectiveTtl);
        break;
      case 'cdn':
        await this.setToCDNCache(key, value, strategy, effectiveTtl);
        break;
      case 'database':
        await this.setToDatabaseCache(key, value, strategy, effectiveTtl);
        break;
    }
  }
}
```

### 2. Load Balancing Patterns

#### Load Balancer Configuration
```typescript
interface LoadBalancerConfig {
  algorithm: 'round-robin' | 'least-connections' | 'ip-hash' | 'weighted';
  healthCheck: HealthCheckConfig;
  sessionAffinity: boolean;
  sslTermination: boolean;
  compression: boolean;
  rateLimiting: RateLimitConfig;
}

interface HealthCheckConfig {
  path: string;
  interval: number;
  timeout: number;
  unhealthyThreshold: number;
  healthyThreshold: number;
}

class LoadBalancerManager {
  async configureLoadBalancer(config: LoadBalancerConfig): Promise<void> {
    // Configure load balancer algorithm
    await this.configureAlgorithm(config.algorithm);
    
    // Configure health checks
    await this.configureHealthChecks(config.healthCheck);
    
    // Configure session affinity
    await this.configureSessionAffinity(config.sessionAffinity);
    
    // Configure SSL termination
    await this.configureSSLTermination(config.sslTermination);
    
    // Configure compression
    await this.configureCompression(config.compression);
    
    // Configure rate limiting
    await this.configureRateLimiting(config.rateLimiting);
  }
  
  async updateTargetGroup(
    targetGroup: string, 
    targets: Target[]
  ): Promise<void> {
    // Update target group with new targets
    await this.updateTargets(targetGroup, targets);
    
    // Wait for health checks
    await this.waitForHealthChecks(targetGroup);
    
    // Verify target group health
    await this.verifyTargetGroupHealth(targetGroup);
  }
}
```

## Error Handling and Recovery Patterns

### 1. Error Classification

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

enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface DeploymentError {
  type: DeploymentErrorType;
  severity: ErrorSeverity;
  message: string;
  context: ErrorContext;
  timestamp: Date;
  recoverable: boolean;
  suggestedAction: string;
}

class DeploymentErrorHandler {
  async handleError(error: DeploymentError): Promise<ErrorResolution> {
    console.error(`Deployment error: ${error.type} - ${error.message}`);
    
    switch (error.type) {
      case DeploymentErrorType.INFRASTRUCTURE_FAILURE:
        return await this.handleInfrastructureFailure(error);
      case DeploymentErrorType.APPLICATION_FAILURE:
        return await this.handleApplicationFailure(error);
      case DeploymentErrorType.CONFIGURATION_ERROR:
        return await this.handleConfigurationError(error);
      case DeploymentErrorType.HEALTH_CHECK_FAILURE:
        return await this.handleHealthCheckFailure(error);
      default:
        return await this.handleGenericError(error);
    }
  }
  
  private async handleInfrastructureFailure(
    error: DeploymentError
  ): Promise<ErrorResolution> {
    // Check if infrastructure can be recovered
    const recoverable = await this.checkInfrastructureRecoverability(error);
    
    if (recoverable) {
      // Attempt infrastructure recovery
      const recoverySuccess = await this.recoverInfrastructure(error);
      
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
}
```

### 2. Recovery Strategies

```typescript
interface RecoveryStrategy {
  type: 'immediate' | 'gradual' | 'manual';
  triggers: RecoveryTrigger[];
  steps: RecoveryStep[];
  maxDuration: number;
}

interface RecoveryStep {
  name: string;
  action: string;
  timeout: number;
  rollbackAction?: string;
}

class RecoveryManager {
  async executeRecovery(
    strategy: RecoveryStrategy, 
    context: RecoveryContext
  ): Promise<RecoveryResult> {
    console.log(`Executing recovery strategy: ${strategy.type}`);
    
    switch (strategy.type) {
      case 'immediate':
        return await this.immediateRecovery(strategy, context);
      case 'gradual':
        return await this.gradualRecovery(strategy, context);
      case 'manual':
        return await this.manualRecovery(strategy, context);
      default:
        throw new Error(`Unknown recovery strategy: ${strategy.type}`);
    }
  }
  
  private async immediateRecovery(
    strategy: RecoveryStrategy, 
    context: RecoveryContext
  ): Promise<RecoveryResult> {
    // Execute all recovery steps immediately
    for (const step of strategy.steps) {
      const success = await this.executeStep(step, context);
      
      if (!success) {
        throw new Error(`Recovery step ${step.name} failed`);
      }
    }
    
    return {
      success: true,
      duration: Date.now() - context.startTime,
      stepsExecuted: strategy.steps.length
    };
  }
  
  private async gradualRecovery(
    strategy: RecoveryStrategy, 
    context: RecoveryContext
  ): Promise<RecoveryResult> {
    // Execute recovery steps gradually with monitoring
    for (const step of strategy.steps) {
      const success = await this.executeStep(step, context);
      
      if (!success) {
        // Rollback previous steps
        await this.rollbackSteps(strategy.steps, context);
        throw new Error(`Recovery step ${step.name} failed, rolled back`);
      }
      
      // Monitor for specified duration
      const isHealthy = await this.monitorRecovery(step.duration);
      
      if (!isHealthy) {
        // Continue with next step or rollback
        continue;
      }
    }
    
    return {
      success: true,
      duration: Date.now() - context.startTime,
      stepsExecuted: strategy.steps.length
    };
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

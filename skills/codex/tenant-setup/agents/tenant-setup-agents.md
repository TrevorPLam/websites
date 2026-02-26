---
name: tenant-setup-agents
description: |
  **AGENT CONFIGURATION** - Codex tenant setup agent configurations and automation patterns.
  USE FOR: Understanding tenant setup behavior, onboarding workflows, and multi-tenant management.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "agent-config"
---

# Codex Tenant Setup Agents

## Overview
This document defines specialized Codex agents for tenant setup, onboarding workflows, and multi-tenant management in the marketing websites monorepo.

## Agent Specializations

### 1. Tenant Onboarding Agent

```typescript
interface TenantOnboardingAgent {
  name: 'codex-tenant-onboarder';
  expertise: [
    'tenant-provisioning',
    'domain-configuration',
    'database-setup',
    'user-management',
    'security-isolation',
    'branding-customization',
    'content-initialization',
    'integration-setup'
  ];
  
  onboardingWorkflow: {
    stages: OnboardingStage[];
    validation: ValidationRule[];
    rollback: RollbackStrategy;
    notifications: NotificationConfig;
  };
  
  provisioningCapabilities: {
    infrastructure: {
      resourceGroup: boolean;
      appService: boolean;
      database: boolean;
      storage: boolean;
      keyVault: boolean;
    };
    configuration: {
      domainSetup: boolean;
      sslCertificates: boolean;
      customBranding: boolean;
      featureFlags: boolean;
    };
    data: {
      databaseSchema: boolean;
      seedData: boolean;
      userAccounts: boolean;
      permissions: boolean;
    };
  };
  
  securityMeasures: {
    tenantIsolation: {
      databaseLevel: boolean;
      applicationLevel: boolean;
      networkLevel: boolean;
    };
    accessControl: {
      rbac: boolean;
      sso: boolean;
      mfa: boolean;
    };
    compliance: {
      gdpr: boolean;
      dataRetention: boolean;
      auditLogging: boolean;
    };
  };
}
```

### 2. Domain Management Agent

```typescript
interface DomainManagementAgent {
  name: 'codex-domain-manager';
  expertise: [
    'domain-provisioning',
    'ssl-management',
    'dns-configuration',
    'custom-domains',
    'subdomain-routing',
    'domain-validation',
    'certificate-management',
    'traffic-routing'
  ];
  
  domainTypes: {
    subdomain: {
      pattern: '{tenant}.marketing-websites.com';
      autoProvision: boolean;
      sslIncluded: boolean;
      validationRequired: false;
    };
    customDomain: {
      pattern: 'customer-specific';
      manualSetup: boolean;
      sslRequired: boolean;
      validationRequired: true;
    };
    whiteLabel: {
      pattern: 'fully-branded';
      customImplementation: boolean;
      advancedSsl: boolean;
      extensiveValidation: true;
    };
  };
  
  sslManagement: {
    providers: ['letsencrypt', 'digicert', 'custom'];
    autoRenewal: boolean;
    monitoring: boolean;
    fallback: boolean;
  };
  
  routingStrategies: {
    pathBased: {
      pattern: '/{tenant}';
      performance: 'high';
      complexity: 'low';
    };
    subdomainBased: {
      pattern: '{tenant}.domain.com';
      performance: 'medium';
      complexity: 'medium';
    };
    customDomain: {
      pattern: 'customer.domain.com';
      performance: 'high';
      complexity: 'high';
    };
  };
}
```

### 3. Database Setup Agent

```typescript
interface DatabaseSetupAgent {
  name: 'codex-database-setup';
  expertise: [
    'schema-provisioning',
    'tenant-isolation',
    'data-migration',
    'backup-strategies',
    'performance-optimization',
    'security-policies',
    'connection-pooling',
    'monitoring-setup'
  ];
  
  isolationStrategies: {
    databasePerTenant: {
      description: 'Separate database for each tenant';
      isolation: 'complete';
      scalability: 'high';
      complexity: 'high';
      cost: 'high';
    };
    schemaPerTenant: {
      description: 'Shared database, separate schemas';
      isolation: 'strong';
      scalability: 'medium';
      complexity: 'medium';
      cost: 'medium';
    };
    rowLevelSecurity: {
      description: 'Shared database, RLS policies';
      isolation: 'application-enforced';
      scalability: 'high';
      complexity: 'low';
      cost: 'low';
    };
  };
  
  provisioningSteps: {
    schemaCreation: {
      order: 1;
      dependencies: [];
      rollback: 'drop schema';
      validation: 'schema exists';
    };
    rlsPolicies: {
      order: 2;
      dependencies: ['schemaCreation'];
      rollback: 'drop policies';
      validation: 'policies active';
    };
    seedData: {
      order: 3;
      dependencies: ['schemaCreation', 'rlsPolicies'];
      rollback: 'truncate tables';
      validation: 'data present';
    };
    userAccounts: {
      order: 4;
      dependencies: ['schemaCreation'];
      rollback: 'drop users';
      validation: 'users created';
    };
  };
  
  performanceOptimization: {
    indexing: {
      strategy: 'tenant-specific indexes';
      monitoring: 'query performance';
      autoTuning: true;
    };
    connectionPooling: {
      strategy: 'per-tenant pools';
      sizing: 'dynamic';
      monitoring: 'pool utilization';
    };
    caching: {
      strategy: 'multi-level caching';
      invalidation: 'tenant-aware';
      monitoring: 'cache hit rates';
    };
  };
}
```

### 4. Security Configuration Agent

```typescript
interface SecurityConfigurationAgent {
  name: 'codex-security-configurator';
  expertise: [
    'authentication-setup',
    'authorization-policies',
    'encryption-configuration',
    'audit-logging',
    'compliance-validation',
    'threat-detection',
    'access-control',
    'security-monitoring'
  ];
  
  authenticationMethods: {
    oauth2: {
      providers: ['azure-ad', 'google', 'github'];
      flows: ['authorization-code', 'client-credentials'];
      pkce: true;
      tokenValidation: true;
    };
    saml: {
      providers: ['azure-ad', 'okta', 'onelogin'];
      sso: true;
      attributeMapping: true;
      metadataValidation: true;
    };
    apiKey: {
      types: ['tenant-specific', 'user-specific'];
      rotation: true;
      rateLimiting: true;
      monitoring: true;
    };
  };
  
  authorizationModels: {
    rbac: {
      roles: ['admin', 'editor', 'viewer', 'contributor'];
      permissions: ['read', 'write', 'delete', 'manage'];
      inheritance: true;
      dynamicAssignment: true;
    };
    abac: {
      attributes: ['tenant', 'role', 'department', 'clearance'];
      policies: 'rule-based';
      evaluation: 'real-time';
      caching: 'strategic';
    };
    hybrid: {
      combination: 'rbac + abac';
      fallback: 'rbac';
      optimization: 'policy-caching';
      monitoring: 'access-patterns';
    };
  };
  
  securityPolicies: {
    dataProtection: {
      encryptionAtRest: 'AES-256';
      encryptionInTransit: 'TLS-1.3';
      keyManagement: 'azure-key-vault';
      rotation: 'quarterly';
    };
    accessControl: {
      sessionTimeout: '30-minutes';
      mfa: 'conditional';
      deviceTrust: 'medium';
      locationValidation: 'optional';
    };
    compliance: {
      gdpr: 'full-compliance';
      ccpa: 'full-compliance';
      hipaa: 'optional';
      sox: 'optional';
    };
  };
}
```

## Tenant Setup Workflow Orchestration

### 1. Multi-Stage Onboarding Pipeline

```typescript
interface TenantSetupPipeline {
  stages: SetupStage[];
  rollbackPolicy: RollbackPolicy;
  validationRules: ValidationRule[];
  notificationChannels: NotificationChannel[];
}

interface SetupStage {
  name: string;
  type: 'provisioning' | 'configuration' | 'validation' | 'activation';
  agents: string[];
  dependencies: string[];
  timeout: number;
  retryPolicy: RetryPolicy;
  rollbackPoint: boolean;
}

class TenantSetupOrchestrator {
  async executeTenantSetup(
    tenantConfig: TenantConfiguration,
    setupOptions: SetupOptions
  ): Promise<SetupResult> {
    console.log(`🚀 Starting tenant setup for: ${tenantConfig.name}`);
    
    const setupId = this.generateSetupId();
    const setupState = new SetupState(setupId);
    
    try {
      // Stage 1: Infrastructure Provisioning
      const infraResult = await this.executeInfrastructureProvisioning(
        tenantConfig, 
        setupState
      );
      
      // Stage 2: Database Setup
      const dbResult = await this.executeDatabaseSetup(
        tenantConfig, 
        setupState
      );
      
      // Stage 3: Domain Configuration
      const domainResult = await this.executeDomainConfiguration(
        tenantConfig, 
        setupState
      );
      
      // Stage 4: Security Configuration
      const securityResult = await this.executeSecurityConfiguration(
        tenantConfig, 
        setupState
      );
      
      // Stage 5: Content Initialization
      const contentResult = await this.executeContentInitialization(
        tenantConfig, 
        setupState
      );
      
      // Stage 6: Final Validation
      const validationResult = await this.executeFinalValidation(
        tenantConfig, 
        setupState
      );
      
      // Stage 7: Activation
      const activationResult = await this.executeTenantActivation(
        tenantConfig, 
        setupState
      );
      
      return await this.generateSetupReport(setupState);
    } catch (error) {
      console.error('Tenant setup failed:', error);
      
      // Execute rollback if enabled
      if (setupOptions.rollbackOnFailure) {
        await this.executeRollback(setupState);
      }
      
      throw error;
    }
  }
  
  private async executeInfrastructureProvisioning(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('🏗️ Stage 1: Infrastructure Provisioning');
    
    const provisioningAgent = new TenantOnboardingAgent();
    
    // Provision resource group
    const resourceGroup = await provisioningAgent.provisionResourceGroup({
      name: `${config.name}-rg`,
      location: config.location,
      tags: this.generateTenantTags(config)
    });
    
    // Provision app service
    const appService = await provisioningAgent.provisionAppService({
      name: `${config.name}-app`,
      resourceGroup: resourceGroup.name,
      plan: config.appServicePlan,
      runtime: 'NODE|18-lts'
    });
    
    // Provision storage
    const storage = await provisioningAgent.provisionStorage({
      name: `${config.name}storage`,
      resourceGroup: resourceGroup.name,
      sku: 'Standard_LRS'
    });
    
    // Provision key vault
    const keyVault = await provisioningAgent.provisionKeyVault({
      name: `${config.name}-kv`,
      resourceGroup: resourceGroup.name,
      sku: 'standard'
    });
    
    const result = {
      resourceGroup,
      appService,
      storage,
      keyVault,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('infrastructure-provisioning', result);
    return result;
  }
  
  private async executeDatabaseSetup(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('🗄️ Stage 2: Database Setup');
    
    const dbAgent = new DatabaseSetupAgent();
    
    // Create tenant schema
    const schema = await dbAgent.createTenantSchema({
      tenantId: config.tenantId,
      database: config.databaseName,
      isolationStrategy: config.isolationStrategy
    });
    
    // Apply RLS policies
    const rlsPolicies = await dbAgent.applyRlsPolicies({
      tenantId: config.tenantId,
      policies: this.generateRlsPolicies(config)
    });
    
    // Seed initial data
    const seedData = await dbAgent.seedInitialData({
      tenantId: config.tenantId,
      data: config.initialData,
      preserveExisting: false
    });
    
    // Create tenant users
    const users = await dbAgent.createTenantUsers({
      tenantId: config.tenantId,
      users: config.initialUsers,
      roles: config.userRoles
    });
    
    const result = {
      schema,
      rlsPolicies,
      seedData,
      users,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('database-setup', result);
    return result;
  }
  
  private async executeDomainConfiguration(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('🌐 Stage 3: Domain Configuration');
    
    const domainAgent = new DomainManagementAgent();
    
    let domainResult;
    
    switch (config.domainType) {
      case 'subdomain':
        domainResult = await domainAgent.configureSubdomain({
          tenantId: config.tenantId,
          subdomain: config.subdomain,
          targetApp: state.getInfrastructure().appService.name
        });
        break;
        
      case 'custom':
        domainResult = await domainAgent.configureCustomDomain({
          tenantId: config.tenantId,
          domain: config.customDomain,
          targetApp: state.getInfrastructure().appService.name,
          validationRequired: true
        });
        break;
        
      case 'whitelabel':
        domainResult = await domainAgent.configureWhiteLabel({
          tenantId: config.tenantId,
          domain: config.customDomain,
          branding: config.branding,
          sslAdvanced: true
        });
        break;
        
      default:
        throw new Error(`Unknown domain type: ${config.domainType}`);
    }
    
    // Configure SSL
    const sslResult = await domainAgent.configureSSL({
      domain: domainResult.domain,
      provider: config.sslProvider,
      autoRenewal: true
    });
    
    // Setup DNS if needed
    let dnsResult;
    if (config.domainType === 'custom' || config.domainType === 'whitelabel') {
      dnsResult = await domainAgent.configureDNS({
        domain: domainResult.domain,
        records: this.generateDNSRecords(config, state)
      });
    }
    
    const result = {
      domain: domainResult,
      ssl: sslResult,
      dns: dnsResult,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('domain-configuration', result);
    return result;
  }
  
  private async executeSecurityConfiguration(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('🔒 Stage 4: Security Configuration');
    
    const securityAgent = new SecurityConfigurationAgent();
    
    // Setup authentication
    const authResult = await securityAgent.setupAuthentication({
      tenantId: config.tenantId,
      providers: config.authProviders,
      ssoConfig: config.ssoConfig,
      mfaPolicy: config.mfaPolicy
    });
    
    // Setup authorization
    const authzResult = await securityAgent.setupAuthorization({
      tenantId: config.tenantId,
      model: config.authorizationModel,
      roles: config.roles,
      policies: config.accessPolicies
    });
    
    // Configure encryption
    const encryptionResult = await securityAgent.configureEncryption({
      tenantId: config.tenantId,
      keyVault: state.getInfrastructure().keyVault.name,
      encryptionPolicy: config.encryptionPolicy
    });
    
    // Setup audit logging
    const auditResult = await securityAgent.setupAuditLogging({
      tenantId: config.tenantId,
      logLevel: config.auditLogLevel,
      destinations: config.auditDestinations,
      retention: config.auditRetention
    });
    
    const result = {
      authentication: authResult,
      authorization: authzResult,
      encryption: encryptionResult,
      audit: auditResult,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('security-configuration', result);
    return result;
  }
  
  private async executeContentInitialization(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('📝 Stage 5: Content Initialization');
    
    const contentAgent = new TenantOnboardingAgent();
    
    // Initialize branding
    const brandingResult = await contentAgent.initializeBranding({
      tenantId: config.tenantId,
      branding: config.branding,
      theme: config.theme,
      assets: config.brandingAssets
    });
    
    // Setup initial pages
    const pagesResult = await contentAgent.setupInitialPages({
      tenantId: config.tenantId,
      pages: config.initialPages,
      templates: config.pageTemplates
    });
    
    // Configure navigation
    const navigationResult = await contentAgent.configureNavigation({
      tenantId: config.tenantId,
      structure: config.navigationStructure,
      menus: config.menuConfigurations
    });
    
    // Setup integrations
    const integrationsResult = await contentAgent.setupIntegrations({
      tenantId: config.tenantId,
      integrations: config.integrations,
      credentials: config.integrationCredentials
    });
    
    const result = {
      branding: brandingResult,
      pages: pagesResult,
      navigation: navigationResult,
      integrations: integrationsResult,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('content-initialization', result);
    return result;
  }
  
  private async executeFinalValidation(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('✅ Stage 6: Final Validation');
    
    const validations = await Promise.all([
      this.validateInfrastructure(state),
      this.validateDatabase(state),
      this.validateDomain(state),
      this.validateSecurity(state),
      this.validateContent(state)
    ]);
    
    const allValidationsPassed = validations.every(v => v.success);
    
    if (!allValidationsPassed) {
      const failedValidations = validations.filter(v => !v.success);
      throw new Error(`Validation failed: ${failedValidations.map(v => v.error).join(', ')}`);
    }
    
    const result = {
      validations,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('final-validation', result);
    return result;
  }
  
  private async executeTenantActivation(
    config: TenantConfiguration, 
    state: SetupState
  ): Promise<StageResult> {
    console.log('🎯 Stage 7: Tenant Activation');
    
    // Enable tenant
    const activationResult = await this.enableTenant({
      tenantId: config.tenantId,
      status: 'active',
      activatedAt: new Date()
    });
    
    // Send notifications
    await this.sendActivationNotifications({
      tenantId: config.tenantId,
      contacts: config.notificationContacts,
      domain: state.getDomain().domain,
      features: config.enabledFeatures
    });
    
    // Setup monitoring
    const monitoringResult = await this.setupMonitoring({
      tenantId: config.tenantId,
      endpoints: this.getTenantEndpoints(state),
      alerts: config.monitoringAlerts
    });
    
    const result = {
      activation: activationResult,
      monitoring: monitoringResult,
      success: true,
      duration: Date.now() - state.startTime
    };
    
    state.completeStage('tenant-activation', result);
    return result;
  }
  
  private async executeRollback(state: SetupState): Promise<void> {
    console.log('🔄 Executing rollback...');
    
    const completedStages = state.getCompletedStages();
    
    // Rollback in reverse order
    for (let i = completedStages.length - 1; i >= 0; i--) {
      const stage = completedStages[i];
      
      if (stage.rollbackPoint) {
        console.log(`Rolling back stage: ${stage.name}`);
        await this.rollbackStage(stage);
      }
    }
  }
  
  private async rollbackStage(stage: CompletedStage): Promise<void> {
    switch (stage.name) {
      case 'infrastructure-provisioning':
        await this.rollbackInfrastructure(stage.result);
        break;
      case 'database-setup':
        await this.rollbackDatabase(stage.result);
        break;
      case 'domain-configuration':
        await this.rollbackDomain(stage.result);
        break;
      case 'security-configuration':
        await this.rollbackSecurity(stage.result);
        break;
      case 'content-initialization':
        await this.rollbackContent(stage.result);
        break;
      case 'tenant-activation':
        await this.rollbackActivation(stage.result);
        break;
    }
  }
  
  private generateSetupReport(state: SetupState): SetupResult {
    return {
      setupId: state.setupId,
      tenantId: state.tenantId,
      success: true,
      duration: Date.now() - state.startTime,
      stages: state.getCompletedStages(),
      resources: state.getResources(),
      endpoints: this.getTenantEndpoints(state),
      nextSteps: this.generateNextSteps(state)
    };
  }
}
```

### 2. Multi-Agent Coordination

```typescript
interface AgentCoordination {
  communication: AgentCommunication;
  resourceSharing: ResourceSharing;
  conflictResolution: ConflictResolution;
  loadBalancing: LoadBalancing;
}

class TenantSetupCoordinator {
  private agents: Map<string, SetupAgent> = new Map();
  private coordination: AgentCoordination;
  
  async coordinateTenantSetup(
    tenantConfig: TenantConfiguration
  ): Promise<SetupResult> {
    // Initialize agents
    await this.initializeAgents();
    
    // Create setup pipeline
    const pipeline = this.createSetupPipeline(tenantConfig);
    
    // Execute coordinated setup
    const result = await this.executePipeline(pipeline);
    
    return result;
  }
  
  private async initializeAgents(): Promise<void> {
    // Initialize specialized agents
    this.agents.set('onboarding', new TenantOnboardingAgent());
    this.agents.set('domain', new DomainManagementAgent());
    this.agents.set('database', new DatabaseSetupAgent());
    this.agents.set('security', new SecurityConfigurationAgent());
    
    // Establish communication channels
    await this.establishCommunication();
    
    // Set up resource sharing
    await this.setupResourceSharing();
  }
  
  private createSetupPipeline(config: TenantConfiguration): SetupPipeline {
    return {
      stages: [
        {
          name: 'infrastructure-provisioning',
          type: 'provisioning',
          agents: ['onboarding'],
          dependencies: [],
          timeout: 1800000, // 30 minutes
          retryPolicy: { maxAttempts: 3, backoff: 'exponential' },
          rollbackPoint: true
        },
        {
          name: 'database-setup',
          type: 'provisioning',
          agents: ['database'],
          dependencies: ['infrastructure-provisioning'],
          timeout: 900000, // 15 minutes
          retryPolicy: { maxAttempts: 3, backoff: 'exponential' },
          rollbackPoint: true
        },
        {
          name: 'domain-configuration',
          type: 'configuration',
          agents: ['domain'],
          dependencies: ['infrastructure-provisioning'],
          timeout: 1800000, // 30 minutes
          retryPolicy: { maxAttempts: 3, backoff: 'exponential' },
          rollbackPoint: true
        },
        {
          name: 'security-configuration',
          type: 'configuration',
          agents: ['security'],
          dependencies: ['infrastructure-provisioning', 'database-setup'],
          timeout: 600000, // 10 minutes
          retryPolicy: { maxAttempts: 3, backoff: 'exponential' },
          rollbackPoint: true
        },
        {
          name: 'content-initialization',
          type: 'configuration',
          agents: ['onboarding'],
          dependencies: ['infrastructure-provisioning', 'domain-configuration'],
          timeout: 600000, // 10 minutes
          retryPolicy: { maxAttempts: 2, backoff: 'linear' },
          rollbackPoint: false
        },
        {
          name: 'final-validation',
          type: 'validation',
          agents: ['onboarding', 'database', 'domain', 'security'],
          dependencies: ['infrastructure-provisioning', 'database-setup', 'domain-configuration', 'security-configuration'],
          timeout: 300000, // 5 minutes
          retryPolicy: { maxAttempts: 1, backoff: 'none' },
          rollbackPoint: false
        },
        {
          name: 'tenant-activation',
          type: 'activation',
          agents: ['onboarding'],
          dependencies: ['final-validation'],
          timeout: 300000, // 5 minutes
          retryPolicy: { maxAttempts: 1, backoff: 'none' },
          rollbackPoint: false
        }
      ],
      rollbackPolicy: {
        strategy: 'reverse-order',
        timeout: 1800000, // 30 minutes
        notifications: true
      },
      validationRules: [
        { name: 'infrastructure-health', critical: true },
        { name: 'database-connectivity', critical: true },
        { name: 'domain-accessibility', critical: true },
        { name: 'security-compliance', critical: true }
      ],
      notificationChannels: ['email', 'slack', 'teams']
    };
  }
  
  private async executePipeline(pipeline: SetupPipeline): Promise<SetupResult> {
    const results: StageResult[] = [];
    
    for (const stage of pipeline.stages) {
      const stageResult = await this.executeStage(stage, results);
      results.push(stageResult);
      
      // Check validation rules
      const validationPassed = await this.checkValidationRules(stage, pipeline.validationRules);
      
      if (!validationPassed && stage.rollbackPoint) {
        throw new Error(`Validation failed in stage: ${stage.name}`);
      }
    }
    
    return this.consolidateResults(results);
  }
  
  private async executeStage(
    stage: SetupStage, 
    previousResults: StageResult[]
  ): Promise<StageResult> {
    console.log(`Executing stage: ${stage.name}`);
    
    // Check dependencies
    for (const dependency of stage.dependencies) {
      const dependencyResult = previousResults.find(r => r.name === dependency);
      if (!dependencyResult || !dependencyResult.success) {
        throw new Error(`Dependency ${dependency} not completed successfully`);
      }
    }
    
    // Execute stage with timeout
    const result = await this.executeWithTimeout(
      () => this.executeStageLogic(stage),
      stage.timeout
    );
    
    return result;
  }
  
  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
      
      operation()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
  
  private async executeStageLogic(stage: SetupStage): Promise<StageResult> {
    // Implement stage execution logic
    return {
      name: stage.name,
      success: true,
      duration: 0,
      result: {}
    };
  }
  
  private async checkValidationRules(
    stage: SetupStage, 
    rules: ValidationRule[]
  ): Promise<boolean> {
    // Implement validation logic
    return true;
  }
  
  private consolidateResults(results: StageResult[]): SetupResult {
    return {
      setupId: this.generateSetupId(),
      success: results.every(r => r.success),
      duration: results.reduce((sum, r) => sum + r.duration, 0),
      stages: results,
      resources: {},
      endpoints: [],
      nextSteps: []
    };
  }
}
```

## Error Handling and Recovery

### 1. Error Classification

```typescript
enum TenantSetupErrorType {
  INFRASTRUCTURE_FAILURE = 'infrastructure_failure',
  DATABASE_FAILURE = 'database_failure',
  DOMAIN_FAILURE = 'domain_failure',
  SECURITY_FAILURE = 'security_failure',
  CONFIGURATION_ERROR = 'configuration_error',
  VALIDATION_ERROR = 'validation_error',
  TIMEOUT_ERROR = 'timeout_error',
  ROLLBACK_FAILURE = 'rollback_failure'
}

interface TenantSetupError {
  type: TenantSetupErrorType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  context: ErrorContext;
  timestamp: Date;
  recoverable: boolean;
  suggestedAction: string;
  rollbackStrategy?: RollbackStrategy;
}

class TenantSetupErrorHandler {
  async handleError(error: TenantSetupError, context: SetupContext): Promise<ErrorResolution> {
    console.error(`Tenant setup error: ${error.type} - ${error.message}`);
    
    switch (error.type) {
      case TenantSetupErrorType.INFRASTRUCTURE_FAILURE:
        return await this.handleInfrastructureFailure(error, context);
      case TenantSetupErrorType.DATABASE_FAILURE:
        return await this.handleDatabaseFailure(error, context);
      case TenantSetupErrorType.DOMAIN_FAILURE:
        return await this.handleDomainFailure(error, context);
      case TenantSetupErrorType.SECURITY_FAILURE:
        return await this.handleSecurityFailure(error, context);
      default:
        return await this.handleGenericError(error, context);
    }
  }
  
  private async handleInfrastructureFailure(
    error: TenantSetupError, 
    context: SetupContext
  ): Promise<ErrorResolution> {
    // Check if infrastructure can be recovered
    const recoverable = await this.checkInfrastructureRecoverability(error);
    
    if (recoverable) {
      // Attempt infrastructure recovery
      const recoverySuccess = await this.recoverInfrastructure(error, context);
      
      if (recoverySuccess) {
        return {
          action: 'retry_setup',
          message: 'Infrastructure recovered, retrying setup',
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
  
  private async handleDatabaseFailure(
    error: TenantSetupError, 
    context: SetupContext
  ): Promise<ErrorResolution> {
    // Check if database can be recovered
    const recoverable = await this.checkDatabaseRecoverability(error);
    
    if (recoverable) {
      // Attempt database recovery
      const recoverySuccess = await this.recoverDatabase(error, context);
      
      if (recoverySuccess) {
        return {
          action: 'retry_setup',
          message: 'Database recovered, retrying setup',
          delay: 30000 // Wait 30 seconds before retry
        };
      }
    }
    
    // Database cannot be recovered, rollback
    return {
      action: 'rollback',
      message: 'Database failure cannot be recovered, initiating rollback',
      delay: 0
    };
  }
  
  private async handleDomainFailure(
    error: TenantSetupError, 
    context: SetupContext
  ): Promise<ErrorResolution> {
    // Domain failures often require manual intervention
    return {
      action: 'manual_intervention',
      message: 'Domain failure requires manual intervention',
      delay: 0,
      instructions: [
        'Check DNS configuration',
        'Verify SSL certificate status',
        'Validate domain ownership',
        'Contact domain administrator'
      ]
    };
  }
  
  private async handleSecurityFailure(
    error: TenantSetupError, 
    context: SetupContext
  ): Promise<ErrorResolution> {
    // Security failures are critical and require rollback
    return {
      action: 'rollback',
      message: 'Security failure detected, immediate rollback required',
      delay: 0,
      priority: 'critical'
    };
  }
  
  private async handleGenericError(
    error: TenantSetupError, 
    context: SetupContext
  ): Promise<ErrorResolution> {
    // Generic error handling based on severity
    if (error.severity === 'critical' || error.severity === 'high') {
      return {
        action: 'rollback',
        message: 'Critical error detected, initiating rollback',
        delay: 0
      };
    } else {
      return {
        action: 'retry_setup',
        message: 'Non-critical error, retrying setup',
        delay: 30000
      };
    }
  }
}
```

### 2. Recovery Strategies

```typescript
interface RecoveryStrategy {
  type: 'immediate' | 'gradual' | 'manual' | 'rollback';
  triggers: RecoveryTrigger[];
  steps: RecoveryStep[];
  maxDuration: number;
  notifications: NotificationConfig;
}

class TenantSetupRecoveryManager {
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
      case 'rollback':
        return await this.rollbackRecovery(strategy, context);
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
        // Continue with next step or rollback
        continue;
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
  
  private async manualRecovery(
    strategy: RecoveryStrategy, 
    context: RecoveryContext
  ): Promise<RecoveryResult> {
    // Send manual intervention request
    await this.sendManualInterventionRequest(context);
    
    // Wait for manual resolution
    const resolution = await this.waitForManualResolution(strategy.maxDuration);
    
    return {
      success: resolution.success,
      duration: Date.now() - context.startTime,
      stepsExecuted: 0,
      manualIntervention: true
    };
  }
  
  private async rollbackRecovery(
    strategy: RecoveryStrategy, 
    context: RecoveryContext
  ): Promise<RecoveryResult> {
    // Execute rollback procedures
    const rollbackSteps = this.generateRollbackSteps(context);
    
    for (const step of rollbackSteps) {
      const success = await this.executeStep(step, context);
      
      if (!success) {
        throw new Error(`Rollback step ${step.name} failed`);
      }
    }
    
    return {
      success: true,
      duration: Date.now() - context.startTime,
      stepsExecuted: rollbackSteps.length,
      rollbackCompleted: true
    };
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

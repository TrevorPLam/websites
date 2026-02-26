---
name: tenant-setup-patterns
description: |
  **REFERENCE GUIDE** - Comprehensive tenant setup patterns and best practices.
  USE FOR: Understanding tenant provisioning strategies, security patterns, and operational procedures.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# Tenant Setup Patterns and Best Practices

## Overview
This document outlines comprehensive patterns and best practices for tenant setup, provisioning, and management in the marketing websites monorepo.

## Tenant Provisioning Patterns

### 1. Multi-Stage Provisioning Pattern

#### Overview
Multi-stage provisioning breaks down the tenant setup process into discrete, manageable stages with validation checkpoints and rollback capabilities.

#### Implementation Pattern
```typescript
interface MultiStageProvisioning {
  stages: ProvisioningStage[];
  validation: ValidationCheck[];
  rollback: RollbackStrategy;
  monitoring: MonitoringConfig;
}

interface ProvisioningStage {
  name: string;
  type: 'infrastructure' | 'database' | 'domain' | 'security' | 'content';
  dependencies: string[];
  timeout: number;
  retryPolicy: RetryPolicy;
  validation: ValidationRule[];
  rollbackPoint: boolean;
}

class MultiStageProvisioningOrchestrator {
  async provisionTenant(
    tenantConfig: TenantConfiguration,
    provisioningOptions: ProvisioningOptions
  ): Promise<ProvisioningResult> {
    const provisioningId = this.generateProvisioningId();
    const provisioningState = new ProvisioningState(provisioningId);
    
    try {
      // Stage 1: Infrastructure Provisioning
      const infraResult = await this.provisionInfrastructure(
        tenantConfig, 
        provisioningState
      );
      
      // Stage 2: Database Setup
      const dbResult = await this.provisionDatabase(
        tenantConfig, 
        provisioningState
      );
      
      // Stage 3: Domain Configuration
      const domainResult = await this.provisionDomain(
        tenantConfig, 
        provisioningState
      );
      
      // Stage 4: Security Configuration
      const securityResult = await this.provisionSecurity(
        tenantConfig, 
        provisioningState
      );
      
      // Stage 5: Content Setup
      const contentResult = await this.provisionContent(
        tenantConfig, 
        provisioningState
      );
      
      // Stage 6: Final Validation
      const validationResult = await this.validateProvisioning(
        tenantConfig, 
        provisioningState
      );
      
      return await this.generateProvisioningReport(provisioningState);
    } catch (error) {
      console.error('Tenant provisioning failed:', error);
      
      // Execute rollback if enabled
      if (provisioningOptions.rollbackOnFailure) {
        await this.executeRollback(provisioningState);
      }
      
      throw error;
    }
  }
  
  private async provisionInfrastructure(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('🏗️ Provisioning infrastructure...');
    
    const infrastructureAgent = new InfrastructureProvisioningAgent();
    
    // Create resource group
    const resourceGroup = await infrastructureAgent.createResourceGroup({
      name: `${config.tenantId}-rg`,
      location: config.location,
      tags: this.generateTenantTags(config)
    });
    
    // Provision app service
    const appService = await infrastructureAgent.provisionAppService({
      name: `${config.tenantId}-app`,
      resourceGroup: resourceGroup.name,
      plan: config.appServicePlan,
      runtime: 'NODE|18-lts'
    });
    
    // Provision storage
    const storage = await infrastructureAgent.provisionStorage({
      name: `${config.tenantId}storage`,
      resourceGroup: resourceGroup.name,
      sku: 'Standard_LRS'
    });
    
    // Provision key vault
    const keyVault = await infrastructureAgent.provisionKeyVault({
      name: `${config.tenantId}-kv`,
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
  
  private async provisionDatabase(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('🗄️ Provisioning database...');
    
    const databaseAgent = new DatabaseProvisioningAgent();
    
    // Create tenant schema
    const schema = await databaseAgent.createTenantSchema({
      tenantId: config.tenantId,
      database: config.databaseName,
      isolationStrategy: config.isolationStrategy
    });
    
    // Apply RLS policies
    const rlsPolicies = await databaseAgent.applyRlsPolicies({
      tenantId: config.tenantId,
      policies: this.generateRlsPolicies(config)
    });
    
    // Seed initial data
    const seedData = await databaseAgent.seedInitialData({
      tenantId: config.tenantId,
      data: config.initialData,
      preserveExisting: false
    });
    
    // Create tenant users
    const users = await databaseAgent.createTenantUsers({
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
    
    state.completeStage('database-provisioning', result);
    return result;
  }
  
  private async provisionDomain(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('🌐 Provisioning domain...');
    
    const domainAgent = new DomainProvisioningAgent();
    
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
    
    state.completeStage('domain-provisioning', result);
    return result;
  }
  
  private async provisionSecurity(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('🔒 Provisioning security...');
    
    const securityAgent = new SecurityProvisioningAgent();
    
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
    
    state.completeStage('security-provisioning', result);
    return result;
  }
  
  private async provisionContent(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('📝 Provisioning content...');
    
    const contentAgent = new ContentProvisioningAgent();
    
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
    
    state.completeStage('content-provisioning', result);
    return result;
  }
  
  private async validateProvisioning(
    config: TenantConfiguration, 
    state: ProvisioningState
  ): Promise<StageResult> {
    console.log('✅ Validating provisioning...');
    
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
    
    state.completeStage('validation', result);
    return result;
  }
  
  private async executeRollback(state: ProvisioningState): Promise<void> {
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
  
  private generateProvisioningReport(state: ProvisioningState): ProvisioningResult {
    return {
      provisioningId: state.provisioningId,
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

### 2. Template-Based Provisioning Pattern

#### Overview
Template-based provisioning uses predefined templates for different tenant types and tiers, ensuring consistency and reducing configuration errors.

#### Implementation Pattern
```typescript
interface TemplateBasedProvisioning {
  templates: Map<string, TenantTemplate>;
  templateEngine: TemplateEngine;
  validation: TemplateValidator;
  customization: TemplateCustomizer;
}

interface TenantTemplate {
  name: string;
  description: string;
  category: 'basic' | 'professional' | 'enterprise' | 'whitelabel';
  configuration: TemplateConfiguration;
  customizations: CustomizationOption[];
  validation: TemplateValidationRule[];
}

interface TemplateConfiguration {
  infrastructure: InfrastructureTemplate;
  database: DatabaseTemplate;
  domain: DomainTemplate;
  security: SecurityTemplate;
  content: ContentTemplate;
  integrations: IntegrationTemplate[];
}

class TemplateBasedProvisioningEngine {
  private templates: Map<string, TenantTemplate> = new Map();
  private templateEngine: TemplateEngine;
  private validator: TemplateValidator;
  
  constructor() {
    this.templateEngine = new TemplateEngine();
    this.validator = new TemplateValidator();
    this.loadTemplates();
  }
  
  async provisionFromTemplate(
    templateName: string,
    tenantConfig: TenantConfiguration,
    customizations: TemplateCustomization[]
  ): Promise<ProvisioningResult> {
    console.log(`📋 Provisioning from template: ${templateName}`);
    
    // Load template
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }
    
    // Validate template compatibility
    const validationResult = await this.validator.validateTemplateCompatibility(
      template,
      tenantConfig
    );
    
    if (!validationResult.valid) {
      throw new Error(`Template validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    // Apply customizations
    const customizedConfig = await this.applyCustomizations(
      template.configuration,
      tenantConfig,
      customizations
    );
    
    // Provision tenant using customized configuration
    const orchestrator = new MultiStageProvisioningOrchestrator();
    return await orchestrator.provisionTenant(
      customizedConfig,
      { rollbackOnFailure: true }
    );
  }
  
  private async applyCustomizations(
    templateConfig: TemplateConfiguration,
    tenantConfig: TenantConfiguration,
    customizations: TemplateCustomization[]
  ): Promise<TenantConfiguration> {
    let customizedConfig = { ...tenantConfig };
    
    for (const customization of customizations) {
      customizedConfig = await this.applyCustomization(
        templateConfig,
        customizedConfig,
        customization
      );
    }
    
    return customizedConfig;
  }
  
  private async applyCustomization(
    templateConfig: TemplateConfiguration,
    tenantConfig: TenantConfiguration,
    customization: TemplateCustomization
  ): Promise<TenantConfiguration> {
    switch (customization.type) {
      case 'infrastructure':
        return this.customizeInfrastructure(templateConfig.infrastructure, tenantConfig, customization);
      case 'database':
        return this.customizeDatabase(templateConfig.database, tenantConfig, customization);
      case 'domain':
        return this.customizeDomain(templateConfig.domain, tenantConfig, customization);
      case 'security':
        return this.customizeSecurity(templateConfig.security, tenantConfig, customization);
      case 'content':
        return this.customizeContent(templateConfig.content, tenantConfig, customization);
      default:
        throw new Error(`Unknown customization type: ${customization.type}`);
    }
  }
  
  private loadTemplates(): void {
    // Load basic template
    this.templates.set('basic', {
      name: 'basic',
      description: 'Basic tenant template for small businesses',
      category: 'basic',
      configuration: {
        infrastructure: {
          appServicePlan: { sku: 'Standard_B2s', capacity: 1 },
          storage: { sku: 'Standard_LRS' },
          keyVault: { sku: 'standard' }
        },
        database: {
          isolationStrategy: 'rowLevelSecurity',
          backupPolicy: { retention: 30, frequency: 'daily' }
        },
        domain: {
          type: 'subdomain',
          ssl: { provider: 'letsencrypt', autoRenewal: true }
        },
        security: {
          authentication: { providers: ['azure-ad'], mfa: 'conditional' },
          authorization: { model: 'rbac', roles: ['admin', 'editor', 'viewer'] }
        },
        content: {
          branding: { theme: 'default' },
          pages: ['home', 'about', 'contact'],
          navigation: { structure: 'horizontal' }
        },
        integrations: [
          { provider: 'google-analytics', required: false },
          { provider: 'hubspot', required: false }
        ]
      },
      customizations: [
        { type: 'infrastructure', field: 'appServicePlan.sku', options: ['Standard_B2s', 'Standard_D2s_v3'] },
        { type: 'domain', field: 'type', options: ['subdomain', 'custom'] }
      ],
      validation: [
        { field: 'tenantId', rule: 'required', pattern: '^[a-z0-9-]+$' },
        { field: 'domain.subdomain', rule: 'required', pattern: '^[a-z0-9-]+$' }
      ]
    });
    
    // Load enterprise template
    this.templates.set('enterprise', {
      name: 'enterprise',
      description: 'Enterprise tenant template for large organizations',
      category: 'enterprise',
      configuration: {
        infrastructure: {
          appServicePlan: { sku: 'Standard_D4s_v3', capacity: 3 },
          storage: { sku: 'Standard_GRS' },
          keyVault: { sku: 'premium' },
          cdn: { provider: 'azure-cdn' }
        },
        database: {
          isolationStrategy: 'schemaPerTenant',
          backupPolicy: { retention: 90, frequency: 'daily', geoRedundant: true },
          performance: { connectionPool: 20, readReplicas: 2 }
        },
        domain: {
          type: 'custom',
          ssl: { provider: 'digicert', autoRenewal: true, wildcard: true }
        },
        security: {
          authentication: { providers: ['azure-ad', 'saml'], mfa: 'required' },
          authorization: { model: 'hybrid', roles: ['super-admin', 'admin', 'manager', 'editor', 'viewer'] },
          encryption: { atRest: 'AES-256', inTransit: 'TLS-1.3', keyRotation: 'monthly' }
        },
        content: {
          branding: { theme: 'enterprise' },
          pages: ['home', 'about', 'services', 'solutions', 'resources', 'blog', 'contact'],
          navigation: { structure: 'mega-menu' }
        },
        integrations: [
          { provider: 'google-analytics-4', required: true },
          { provider: 'salesforce', required: true },
          { provider: 'marketo', required: false },
          { provider: 'zendesk', required: false }
        ]
      },
      customizations: [
        { type: 'infrastructure', field: 'appServicePlan.sku', options: ['Standard_D4s_v3', 'Standard_D8s_v3'] },
        { type: 'database', field: 'isolationStrategy', options: ['schemaPerTenant', 'databasePerTenant'] },
        { type: 'security', field: 'authentication.providers', options: [['azure-ad', 'saml'], ['azure-ad', 'okta']] }
      ],
      validation: [
        { field: 'tenantId', rule: 'required', pattern: '^[a-z0-9-]+$' },
        { field: 'domain.customDomain', rule: 'required', pattern: '^[a-z0-9.-]+$' },
        { field: 'security.saml.entityId', rule: 'required', pattern: '^[a-z0-9-]+$' }
      ]
    });
    
    // Load whitelabel template
    this.templates.set('whitelabel', {
      name: 'whitelabel',
      description: 'White-label tenant template for agencies and resellers',
      category: 'whitelabel',
      configuration: {
        infrastructure: {
          appServicePlan: { sku: 'Standard_D3s_v3', capacity: 2 },
          storage: { sku: 'Standard_LRS' },
          keyVault: { sku: 'premium' },
          cdn: { provider: 'azure-cdn' }
        },
        database: {
          isolationStrategy: 'databasePerTenant',
          backupPolicy: { retention: 60, frequency: 'daily', geoRedundant: true }
        },
        domain: {
          type: 'whitelabel',
          ssl: { provider: 'digicert', autoRenewal: true, wildcard: true }
        },
        security: {
          authentication: { providers: ['azure-ad', 'saml'], mfa: 'conditional' },
          authorization: { model: 'rbac', roles: ['super-admin', 'admin', 'manager', 'editor', 'viewer'] }
        },
        content: {
          branding: { theme: 'custom', customCSS: true, customJS: true },
          pages: ['home', 'about', 'services', 'portfolio', 'team', 'blog', 'contact'],
          navigation: { structure: 'custom' }
        },
        integrations: [
          { provider: 'google-analytics-4', required: true },
          { provider: 'hubspot', required: true },
          { provider: 'sendgrid', required: true }
        ]
      },
      customizations: [
        { type: 'content', field: 'branding.theme', options: ['custom', 'agency', 'corporate'] },
        { type: 'domain', field: 'type', options: ['whitelabel', 'custom'] },
        { type: 'security', field: 'authorization.roles', options: [['super-admin', 'admin', 'manager'], ['admin', 'editor', 'viewer']] }
      ],
      validation: [
        { field: 'tenantId', rule: 'required', pattern: '^[a-z0-9-]+$' },
        { field: 'domain.customDomain', rule: 'required', pattern: '^[a-z0-9.-]+$' },
        { field: 'whiteLabel.agency.name', rule: 'required', pattern: '^[a-zA-Z0-9 ]+$' }
      ]
    });
  }
}
```

## Security Patterns

### 1. Multi-Tenant Security Isolation Pattern

#### Overview
Multi-tenant security isolation ensures that each tenant's data and resources are completely isolated from other tenants, preventing data leakage and unauthorized access.

#### Implementation Pattern
```typescript
interface MultiTenantSecurityIsolation {
  databaseLevel: DatabaseIsolation;
  applicationLevel: ApplicationIsolation;
  networkLevel: NetworkIsolation;
  authentication: AuthenticationIsolation;
  authorization: AuthorizationIsolation;
}

interface DatabaseIsolation {
  strategy: 'rowLevelSecurity' | 'schemaPerTenant' | 'databasePerTenant';
  rlsPolicies: RLSPolicy[];
  tenantContext: TenantContext;
  auditLogging: AuditLogging;
}

interface ApplicationIsolation {
  tenantMiddleware: TenantMiddleware;
  contextPropagation: ContextPropagation;
  dataValidation: DataValidation;
  errorHandling: ErrorHandling;
}

class MultiTenantSecurityIsolationEngine {
  private isolationConfig: MultiTenantSecurityIsolation;
  
  constructor(config: MultiTenantSecurityIsolation) {
    this.isolationConfig = config;
  }
  
  async enforceIsolation(request: TenantRequest): Promise<IsolationResult> {
    // Extract tenant context
    const tenantContext = await this.extractTenantContext(request);
    
    // Validate tenant access
    const accessValidation = await this.validateTenantAccess(tenantContext);
    
    if (!accessValidation.valid) {
      throw new UnauthorizedError('Tenant access denied');
    }
    
    // Apply database isolation
    const databaseIsolation = await this.applyDatabaseIsolation(tenantContext);
    
    // Apply application isolation
    const applicationIsolation = await this.applyApplicationIsolation(tenantContext);
    
    // Apply network isolation
    const networkIsolation = await this.applyNetworkIsolation(tenantContext);
    
    return {
      tenantId: tenantContext.tenantId,
      databaseIsolation,
      applicationIsolation,
      networkIsolation,
      success: true
    };
  }
  
  private async extractTenantContext(request: TenantRequest): Promise<TenantContext> {
    const tenantId = this.extractTenantId(request);
    const userId = this.extractUserId(request);
    const sessionId = this.extractSessionId(request);
    
    return {
      tenantId,
      userId,
      sessionId,
      requestTime: new Date(),
      requestPath: request.path,
      requestMethod: request.method
    };
  }
  
  private extractTenantId(request: TenantRequest): string {
    // Extract tenant ID from various sources
    const sources = [
      request.headers['x-tenant-id'],
      request.query.tenant,
      request.params.tenant,
      this.extractFromSubdomain(request.hostname),
      this.extractFromPath(request.path)
    ];
    
    const tenantId = sources.find(id => id && id !== '');
    
    if (!tenantId) {
      throw new Error('Tenant ID not found in request');
    }
    
    return tenantId;
  }
  
  private extractFromSubdomain(hostname: string): string {
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[1] === 'marketing-websites') {
      return parts[0];
    }
    return '';
  }
  
  private extractFromPath(path: string): string {
    const match = path.match(/^\/([a-z0-9-]+)/);
    return match ? match[1] : '';
  }
  
  private async validateTenantAccess(context: TenantContext): Promise<AccessValidation> {
    // Validate tenant exists
    const tenantExists = await this.checkTenantExists(context.tenantId);
    if (!tenantExists) {
      return { valid: false, reason: 'Tenant does not exist' };
    }
    
    // Validate tenant status
    const tenantStatus = await this.getTenantStatus(context.tenantId);
    if (tenantStatus !== 'active') {
      return { valid: false, reason: `Tenant status: ${tenantStatus}` };
    }
    
    // Validate user access to tenant
    const userAccess = await this.validateUserTenantAccess(context.userId, context.tenantId);
    if (!userAccess.valid) {
      return { valid: false, reason: 'User does not have access to tenant' };
    }
    
    return { valid: true };
  }
  
  private async applyDatabaseIsolation(context: TenantContext): Promise<DatabaseIsolationResult> {
    switch (this.isolationConfig.databaseLevel.strategy) {
      case 'rowLevelSecurity':
        return await this.applyRowLevelSecurity(context);
      case 'schemaPerTenant':
        return await this.applySchemaPerTenant(context);
      case 'databasePerTenant':
        return await this.applyDatabasePerTenant(context);
      default:
        throw new Error(`Unknown database isolation strategy: ${this.isolationConfig.databaseLevel.strategy}`);
    }
  }
  
  private async applyRowLevelSecurity(context: TenantContext): Promise<DatabaseIsolationResult> {
    // Set tenant context for RLS
    await this.setTenantContext(context);
    
    // Apply RLS policies
    const policies = this.isolationConfig.databaseLevel.rlsPolicies;
    for (const policy of policies) {
      await this.applyRLSPolicy(policy, context);
    }
    
    return {
      strategy: 'rowLevelSecurity',
      tenantContext: context.tenantId,
      policiesApplied: policies.length,
      success: true
    };
  }
  
  private async applySchemaPerTenant(context: TenantContext): Promise<DatabaseIsolationResult> {
    // Switch to tenant-specific schema
    await this.switchToTenantSchema(context.tenantId);
    
    return {
      strategy: 'schemaPerTenant',
      tenantSchema: context.tenantId,
      success: true
    };
  }
  
  private async applyDatabasePerTenant(context: TenantContext): Promise<DatabaseIsolationResult> {
    // Connect to tenant-specific database
    const database = await this.getTenantDatabase(context.tenantId);
    
    return {
      strategy: 'databasePerTenant',
      tenantDatabase: database.name,
      success: true
    };
  }
  
  private async applyApplicationIsolation(context: TenantContext): Promise<ApplicationIsolationResult> {
    // Set tenant context in application
    await this.setApplicationTenantContext(context);
    
    // Validate data access
    const dataValidation = await this.validateDataAccess(context);
    
    // Setup error handling
    const errorHandling = await this.setupErrorHandling(context);
    
    return {
      tenantContext: context.tenantId,
      dataValidation,
      errorHandling,
      success: true
    };
  }
  
  private async applyNetworkIsolation(context: TenantContext): Promise<NetworkIsolationResult> {
    // Apply network-level isolation
    const networkRules = await this.getTenantNetworkRules(context.tenantId);
    
    // Configure firewall rules
    const firewallConfig = await this.configureFirewall(networkRules);
    
    return {
      networkRules,
      firewallConfig,
      success: true
    };
  }
}
```

### 2. Zero-Trust Security Pattern

#### Overview
Zero-trust security assumes no implicit trust and continuously validates every request, regardless of source or destination.

#### Implementation Pattern
```typescript
interface ZeroTrustSecurity {
  authentication: ZeroTrustAuth;
  authorization: ZeroTrustAuthz;
  encryption: ZeroTrustEncryption;
  monitoring: ZeroTrustMonitoring;
  compliance: ZeroTrustCompliance;
}

interface ZeroTrustAuth {
  multiFactor: boolean;
  deviceTrust: DeviceTrust;
  locationValidation: LocationValidation;
  sessionManagement: SessionManagement;
  tokenValidation: TokenValidation;
}

class ZeroTrustSecurityEngine {
  private config: ZeroTrustSecurity;
  
  constructor(config: ZeroTrustSecurity) {
    this.config = config;
  }
  
  async enforceZeroTrust(request: SecurityRequest): Promise<ZeroTrustResult> {
    // Step 1: Verify identity
    const identityVerification = await this.verifyIdentity(request);
    
    if (!identityVerification.verified) {
      throw new UnauthorizedError('Identity verification failed');
    }
    
    // Step 2: Validate device trust
    const deviceValidation = await this.validateDeviceTrust(request);
    
    if (!deviceValidation.trusted) {
      throw new UnauthorizedError('Device not trusted');
    }
    
    // Step 3: Validate location
    const locationValidation = await this.validateLocation(request);
    
    if (!locationValidation.valid) {
      throw new UnauthorizedError('Location not allowed');
    }
    
    // Step 4: Validate session
    const sessionValidation = await this.validateSession(request);
    
    if (!sessionValidation.valid) {
      throw new UnauthorizedError('Session invalid');
    }
    
    // Step 5: Validate token
    const tokenValidation = await this.validateToken(request);
    
    if (!tokenValidation.valid) {
      throw new UnauthorizedError('Token invalid');
    }
    
    // Step 6: Apply authorization
    const authorizationResult = await this.applyAuthorization(request);
    
    // Step 7: Apply encryption
    const encryptionResult = await this.applyEncryption(request);
    
    return {
      identity: identityVerification,
      device: deviceValidation,
      location: locationValidation,
      session: sessionValidation,
      token: tokenValidation,
      authorization: authorizationResult,
      encryption: encryptionResult,
      success: true
    };
  }
  
  private async verifyIdentity(request: SecurityRequest): Promise<IdentityVerification> {
    const authHeader = request.headers['authorization'];
    const token = this.extractToken(authHeader);
    
    if (!token) {
      return { verified: false, reason: 'No token provided' };
    }
    
    // Verify token signature
    const signatureValid = await this.verifyTokenSignature(token);
    if (!signatureValid) {
      return { verified: false, reason: 'Invalid token signature' };
    }
    
    // Verify token claims
    const claimsValid = await this.verifyTokenClaims(token);
    if (!claimsValid) {
      return { verified: false, reason: 'Invalid token claims' };
    }
    
    // Verify token expiration
    const notExpired = await this.verifyTokenExpiration(token);
    if (!notExpired) {
      return { verified: false, reason: 'Token expired' };
    }
    
    return { verified: true, userId: claimsValid.userId, tenantId: claimsValid.tenantId };
  }
  
  private async validateDeviceTrust(request: SecurityRequest): Promise<DeviceValidation> {
    const deviceId = request.headers['x-device-id'];
    const userAgent = request.headers['user-agent'];
    
    if (!deviceId) {
      return { trusted: false, reason: 'No device ID provided' };
    }
    
    // Check device registration
    const deviceRegistered = await this.checkDeviceRegistration(deviceId);
    if (!deviceRegistered) {
      return { trusted: false, reason: 'Device not registered' };
    }
    
    // Check device compliance
    const deviceCompliance = await this.checkDeviceCompliance(deviceId);
    if (!deviceCompliance.compliant) {
      return { trusted: false, reason: 'Device not compliant' };
    }
    
    // Check device reputation
    const deviceReputation = await this.checkDeviceReputation(deviceId);
    if (deviceReputation.risk > 0.7) {
      return { trusted: false, reason: 'High device risk' };
    }
    
    return { trusted: true, deviceId, compliance: deviceCompliance };
  }
  
  private async validateLocation(request: SecurityRequest): Promise<LocationValidation> {
    const clientIP = request.ip;
    const location = await this.getLocationFromIP(clientIP);
    
    // Check allowed locations
    const allowedLocations = await this.getAllowedLocations(request.userId);
    const locationAllowed = allowedLocations.includes(location.country);
    
    if (!locationAllowed) {
      return { valid: false, reason: 'Location not allowed', location };
    }
    
    // Check for anomalous location
    const locationAnomaly = await this.checkLocationAnomaly(request.userId, location);
    if (locationAnomaly.anomalous) {
      return { valid: false, reason: 'Anomalous location', location };
    }
    
    return { valid: true, location };
  }
  
  private async validateSession(request: SecurityRequest): Promise<SessionValidation> {
    const sessionId = request.headers['x-session-id'];
    
    if (!sessionId) {
      return { valid: false, reason: 'No session ID provided' };
    }
    
    // Check session exists
    const sessionExists = await this.checkSessionExists(sessionId);
    if (!sessionExists) {
      return { valid: false, reason: 'Session does not exist' };
    }
    
    // Check session expiration
    const sessionNotExpired = await this.checkSessionExpiration(sessionId);
    if (!sessionNotExpired) {
      return { valid: false, reason: 'Session expired' };
    }
    
    // Check session activity
    const sessionActive = await this.checkSessionActivity(sessionId);
    if (!sessionActive) {
      return { valid: false, reason: 'Session inactive' };
    }
    
    return { valid: true, sessionId };
  }
  
  private async validateToken(request: SecurityRequest): Promise<TokenValidation> {
    const token = this.extractToken(request.headers['authorization']);
    
    // Validate token format
    const formatValid = await this.validateTokenFormat(token);
    if (!formatValid) {
      return { valid: false, reason: 'Invalid token format' };
    }
    
    // Validate token scope
    const scopeValid = await this.validateTokenScope(token, request.path);
    if (!scopeValid) {
      return { valid: false, reason: 'Insufficient token scope' };
    }
    
    // Validate token audience
    const audienceValid = await this.validateTokenAudience(token);
    if (!audienceValid) {
      return { valid: false, reason: 'Invalid token audience' };
    }
    
    return { valid: true, token };
  }
  
  private async applyAuthorization(request: SecurityRequest): Promise<AuthorizationResult> {
    const userId = request.userId;
    const tenantId = request.tenantId;
    const resource = request.path;
    const action = request.method;
    
    // Check user permissions
    const hasPermission = await this.checkUserPermission(userId, tenantId, resource, action);
    
    if (!hasPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }
    
    // Check rate limits
    const rateLimitValid = await this.checkRateLimits(userId, tenantId);
    if (!rateLimitValid) {
      throw new TooManyRequestsError('Rate limit exceeded');
    }
    
    return {
      authorized: true,
      permissions: hasPermission.permissions,
      rateLimit: rateLimitValid
    };
  }
  
  private async applyEncryption(request: SecurityRequest): Promise<EncryptionResult> {
    // Encrypt sensitive data
    const encryptedData = await this.encryptSensitiveData(request.body);
    
    // Validate encryption
    const encryptionValid = await this.validateEncryption(encryptedData);
    
    return {
      encrypted: true,
      data: encryptedData,
      valid: encryptionValid
    };
  }
}
```

## Performance Patterns

### 1. Scalable Tenant Provisioning Pattern

#### Overview
Scalable tenant provisioning ensures that the system can handle multiple concurrent tenant setups without performance degradation.

#### Implementation Pattern
```typescript
interface ScalableProvisioning {
  concurrency: ConcurrencyControl;
  resourceManagement: ResourceManagement;
  loadBalancing: LoadBalancing;
  caching: ProvisioningCache;
  monitoring: ProvisioningMonitoring;
}

interface ConcurrencyControl {
  maxConcurrentProvisions: number;
  queueManagement: QueueManagement;
  resourceLocking: ResourceLocking;
  deadlockPrevention: DeadlockPrevention;
}

class ScalableProvisioningEngine {
  private config: ScalableProvisioning;
  private provisionQueue: ProvisionQueue;
  private resourceLocks: Map<string, ResourceLock> = new Map();
  
  constructor(config: ScalableProvisioning) {
    this.config = config;
    this.provisionQueue = new ProvisionQueue();
  }
  
  async provisionTenant(
    tenantConfig: TenantConfiguration
  ): Promise<ProvisioningResult> {
    // Add to provision queue
    const provisionId = await this.provisionQueue.enqueue(tenantConfig);
    
    try {
      // Wait for turn
      await this.waitForTurn(provisionId);
      
      // Acquire resource locks
      const locks = await this.acquireResourceLocks(tenantConfig);
      
      try {
        // Execute provisioning
        const result = await this.executeProvisioning(tenantConfig);
        
        return result;
      } finally {
        // Release resource locks
        await this.releaseResourceLocks(locks);
      }
    } finally {
      // Remove from queue
      await this.provisionQueue.dequeue(provisionId);
    }
  }
  
  private async waitForTurn(provisionId: string): Promise<void> {
    while (!this.provisionQueue.isNext(provisionId)) {
      // Wait for turn
      await this.sleep(1000);
    }
  }
  
  private async acquireResourceLocks(config: TenantConfiguration): Promise<ResourceLock[]> {
    const locks: ResourceLock[] = [];
    
    // Lock infrastructure resources
    const infraLock = await this.acquireLock('infrastructure', config.tenantId);
    locks.push(infraLock);
    
    // Lock database resources
    const dbLock = await this.acquireLock('database', config.tenantId);
    locks.push(dbLock);
    
    // Lock domain resources
    const domainLock = await this.acquireLock('domain', config.domain);
    locks.push(domainLock);
    
    return locks;
  }
  
  private async acquireLock(resourceType: string, resourceId: string): Promise<ResourceLock> {
    const lockKey = `${resourceType}:${resourceId}`;
    
    // Check if lock already exists
    if (this.resourceLocks.has(lockKey)) {
      throw new Error(`Resource already locked: ${lockKey}`);
    }
    
    // Create lock
    const lock: ResourceLock = {
      key: lockKey,
      acquiredAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      acquiredBy: 'provisioning-engine'
    };
    
    this.resourceLocks.set(lockKey, lock);
    
    return lock;
  }
  
  private async releaseResourceLocks(locks: ResourceLock[]): Promise<void> {
    for (const lock of locks) {
      this.resourceLocks.delete(lock.key);
    }
  }
  
  private async executeProvisioning(
    config: TenantConfiguration
  ): Promise<ProvisioningResult> {
    const startTime = Date.now();
    
    // Execute provisioning with caching
    const cachedResult = await this.checkProvisioningCache(config);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Execute actual provisioning
    const orchestrator = new MultiStageProvisioningOrchestrator();
    const result = await orchestrator.provisionTenant(config, {
      rollbackOnFailure: true
    });
    
    // Cache result
    await this.cacheProvisioningResult(config, result);
    
    return result;
  }
  
  private async checkProvisioningCache(config: TenantConfiguration): Promise<ProvisioningResult | null> {
    const cacheKey = this.generateCacheKey(config);
    const cached = await this.config.caching.get(cacheKey);
    
    if (cached && !this.isCacheExpired(cached)) {
      return cached.result;
    }
    
    return null;
  }
  
  private async cacheProvisioningResult(
    config: TenantConfiguration,
    result: ProvisioningResult
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(config);
    const cacheEntry = {
      result,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    };
    
    await this.config.caching.set(cacheKey, cacheEntry);
  }
  
  private generateCacheKey(config: TenantConfiguration): string {
    return `provisioning:${config.tenantId}:${config.domain}:${config.tier}`;
  }
  
  private isCacheExpired(cacheEntry: CacheEntry): boolean {
    return new Date() > cacheEntry.expiresAt;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Performance Monitoring Pattern

#### Overview
Performance monitoring provides real-time insights into tenant provisioning performance and identifies bottlenecks.

#### Implementation Pattern
```typescript
interface PerformanceMonitoring {
  metrics: PerformanceMetrics;
  alerts: PerformanceAlerts;
  dashboards: PerformanceDashboards;
  analytics: PerformanceAnalytics;
}

interface PerformanceMetrics {
  provisioningTime: ProvisioningTimeMetric;
  resourceUtilization: ResourceUtilizationMetric;
  errorRate: ErrorRateMetric;
  throughput: ThroughputMetric;
}

class PerformanceMonitoringEngine {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private alerts: PerformanceAlertManager;
  private dashboards: PerformanceDashboardManager;
  
  constructor() {
    this.alerts = new PerformanceAlertManager();
    this.dashboards = new PerformanceDashboardManager();
  }
  
  async startMonitoring(provisioningId: string): Promise<void> {
    // Start monitoring provisioning
    const monitoringSession = new MonitoringSession(provisioningId);
    this.metrics.set(provisioningId, monitoringSession);
    
    // Start metrics collection
    await this.startMetricsCollection(provisioningId);
    
    // Start alert monitoring
    await this.startAlertMonitoring(provisioningId);
  }
  
  async recordMetric(
    provisioningId: string,
    metricType: string,
    value: number,
    metadata?: any
  ): Promise<void> {
    const session = this.metrics.get(provisioningId);
    if (!session) {
      return;
    }
    
    const metric: PerformanceMetric = {
      type: metricType,
      value,
      timestamp: new Date(),
      metadata
    };
    
    session.addMetric(metric);
    
    // Check for alerts
    await this.alerts.checkAlerts(provisioningId, metric);
    
    // Update dashboards
    await this.dashboards.updateDashboard(provisioningId, metric);
  }
  
  async stopMonitoring(provisioningId: string): Promise<PerformanceReport> {
    const session = this.metrics.get(provisioningId);
    if (!session) {
      throw new Error(`No monitoring session found for ${provisioningId}`);
    }
    
    // Generate performance report
    const report = await this.generatePerformanceReport(session);
    
    // Clean up monitoring session
    this.metrics.delete(provisioningId);
    
    return report;
  }
  
  private async startMetricsCollection(provisioningId: string): Promise<void> {
    // Start collecting provisioning time metrics
    setInterval(async () => {
      await this.recordMetric(provisioningId, 'provisioning_time', Date.now());
    }, 1000);
    
    // Start collecting resource utilization metrics
    setInterval(async () => {
      const utilization = await this.getResourceUtilization();
      await this.recordMetric(provisioningId, 'resource_utilization', utilization);
    }, 5000);
    
    // Start collecting error rate metrics
    setInterval(async () => {
      const errorRate = await this.getErrorRate(provisioningId);
      await this.recordMetric(provisioningId, 'error_rate', errorRate);
    }, 10000);
  }
  
  private async startAlertMonitoring(provisioningId: string): Promise<void> {
    // Set up alert rules
    this.alerts.addRule(provisioningId, {
      metric: 'provisioning_time',
      threshold: 300000, // 5 minutes
      operator: '>',
      severity: 'warning',
      action: 'notify'
    });
    
    this.alerts.addRule(provisioningId, {
      metric: 'error_rate',
      threshold: 0.05, // 5%
      operator: '>',
      severity: 'critical',
      action: 'alert'
    });
    
    this.alerts.addRule(provisioningId, {
      metric: 'resource_utilization',
      threshold: 0.8, // 80%
      operator: '>',
      severity: 'warning',
      action: 'notify'
    });
  }
  
  private async generatePerformanceReport(session: MonitoringSession): Promise<PerformanceReport> {
    const metrics = session.getMetrics();
    
    const report: PerformanceReport = {
      provisioningId: session.provisioningId,
      startTime: session.startTime,
      endTime: new Date(),
      duration: Date.now() - session.startTime.getTime(),
      metrics: {
        provisioningTime: this.calculateProvisioningTimeMetrics(metrics),
        resourceUtilization: this.calculateResourceUtilizationMetrics(metrics),
        errorRate: this.calculateErrorRateMetrics(metrics),
        throughput: this.calculateThroughputMetrics(metrics)
      },
      alerts: session.getAlerts(),
      recommendations: this.generateRecommendations(metrics)
    };
    
    return report;
  }
  
  private calculateProvisioningTimeMetrics(metrics: PerformanceMetric[]): ProvisioningTimeMetrics {
    const provisioningTimeMetrics = metrics.filter(m => m.type === 'provisioning_time');
    
    if (provisioningTimeMetrics.length === 0) {
      return { average: 0, min: 0, max: 0, p95: 0 };
    }
    
    const values = provisioningTimeMetrics.map(m => m.value);
    const sorted = values.sort((a, b) => a - b);
    
    return {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }
  
  private calculateResourceUtilizationMetrics(metrics: PerformanceMetric[]): ResourceUtilizationMetrics {
    const utilizationMetrics = metrics.filter(m => m.type === 'resource_utilization');
    
    if (utilizationMetrics.length === 0) {
      return { average: 0, peak: 0, current: 0 };
    }
    
    const values = utilizationMetrics.map(m => m.value);
    
    return {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      peak: Math.max(...values),
      current: values[values.length - 1]
    };
  }
  
  private calculateErrorRateMetrics(metrics: PerformanceMetric[]): ErrorRateMetrics {
    const errorRateMetrics = metrics.filter(m => m.type === 'error_rate');
    
    if (errorRateMetrics.length === 0) {
      return { average: 0, peak: 0, current: 0 };
    }
    
    const values = errorRateMetrics.map(m => m.value);
    
    return {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      peak: Math.max(...values),
      current: values[values.length - 1]
    };
  }
  
  private calculateThroughputMetrics(metrics: PerformanceMetric[]): ThroughputMetrics {
    // Calculate throughput based on completed provisions
    const completedMetrics = metrics.filter(m => m.type === 'provisioning_completed');
    
    if (completedMetrics.length === 0) {
      return { rate: 0, total: 0 };
    }
    
    const timeSpan = Date.now() - completedMetrics[0].timestamp.getTime();
    const rate = completedMetrics.length / (timeSpan / 1000 / 60); // per minute
    
    return {
      rate,
      total: completedMetrics.length
    };
  }
  
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze provisioning time
    const provisioningTimeMetrics = this.calculateProvisioningTimeMetrics(metrics);
    if (provisioningTimeMetrics.average > 300000) { // 5 minutes
      recommendations.push('Consider optimizing provisioning workflow to reduce average time');
    }
    
    // Analyze resource utilization
    const utilizationMetrics = this.calculateResourceUtilizationMetrics(metrics);
    if (utilizationMetrics.peak > 0.9) {
      recommendations.push('Consider scaling up resources to handle peak utilization');
    }
    
    // Analyze error rate
    const errorRateMetrics = this.calculateErrorRateMetrics(metrics);
    if (errorRateMetrics.peak > 0.1) { // 10%
      recommendations.push('Investigate and address high error rate during provisioning');
    }
    
    return recommendations;
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

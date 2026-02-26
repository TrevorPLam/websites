---
name: tenant-setup-automation
description: |
  **SCRIPTING SKILL** - Automated tenant setup scripts for Codex agents.
  USE FOR: Tenant provisioning, domain configuration, security setup, and content initialization.
  DO NOT USE FOR: Manual tenant setup processes - use automation patterns.
  INVOKES: [azure-mcp, filesystem, observability].
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Tenant Setup Automation Scripts

## Overview
This skill provides Codex-optimized automation scripts for comprehensive tenant setup processes in the marketing websites monorepo.

## Available Scripts

### 1. Tenant Provisioning Script

#### Basic Usage
```bash
# Provision basic tenant
pnpm run tenant:provision --config=tenant-config.yml --template=basic

# Provision enterprise tenant
pnpm run tenant:provision --config=enterprise-config.yml --template=enterprise

# Provision whitelabel tenant
pnpm run tenant:provision --config=whitelabel-config.yml --template=whitelabel

# Provision with custom options
pnpm run tenant:provision --config=custom-config.yml --skip-validation --rollback-on-failure
```

#### Script Implementation
```typescript
#!/usr/bin/env tsx
/**
 * Tenant Provisioning Script
 * 
 * Automates complete tenant provisioning including infrastructure,
 * database, domain, security, and content setup.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface ProvisioningConfig {
  config: string;
  template: string;
  skipValidation: boolean;
  rollbackOnFailure: boolean;
  dryRun: boolean;
  verbose: boolean;
  output: string;
}

interface TenantConfiguration {
  tenant: TenantInfo;
  infrastructure: InfrastructureConfig;
  database: DatabaseConfig;
  domain: DomainConfig;
  security: SecurityConfig;
  content: ContentConfig;
  integrations: IntegrationConfig[];
  monitoring: MonitoringConfig;
  features: FeatureFlags;
}

interface ProvisioningResult {
  success: boolean;
  tenantId: string;
  duration: number;
  stages: StageResult[];
  resources: ResourceInfo[];
  endpoints: EndpointInfo[];
  errors: ProvisioningError[];
  warnings: ProvisioningWarning[];
  nextSteps: string[];
}

class TenantProvisioningEngine {
  private config: ProvisioningConfig;
  private tenantConfig: TenantConfiguration;
  private startTime: Date;
  
  constructor(config: ProvisioningConfig) {
    this.config = config;
    this.startTime = new Date();
  }
  
  async provision(): Promise<ProvisioningResult> {
    console.log('🚀 Starting tenant provisioning...');
    
    try {
      // Load tenant configuration
      await this.loadTenantConfiguration();
      
      // Validate configuration
      if (!this.config.skipValidation) {
        await this.validateConfiguration();
      }
      
      // Execute provisioning stages
      const stages = await this.executeProvisioningStages();
      
      // Generate provisioning report
      const result = await this.generateProvisioningReport(stages);
      
      // Save report
      await this.saveProvisioningReport(result);
      
      console.log(`✅ Tenant provisioning completed for: ${this.tenantConfig.tenant.tenantId}`);
      
      return result;
    } catch (error) {
      console.error('❌ Tenant provisioning failed:', error);
      
      // Execute rollback if enabled
      if (this.config.rollbackOnFailure) {
        await this.executeRollback();
      }
      
      throw error;
    }
  }
  
  private async loadTenantConfiguration(): Promise<void> {
    console.log('📋 Loading tenant configuration...');
    
    try {
      const configData = readFileSync(this.config.config, 'utf-8');
      this.tenantConfig = JSON.parse(configData);
      
      // Apply template if specified
      if (this.config.template) {
        await this.applyTemplate();
      }
      
      console.log(`✅ Configuration loaded for tenant: ${this.tenantConfig.tenant.tenantId}`);
    } catch (error) {
      throw new Error(`Failed to load tenant configuration: ${error.message}`);
    }
  }
  
  private async applyTemplate(): Promise<void> {
    console.log(`📋 Applying template: ${this.config.template}`);
    
    const templatePath = join(__dirname, 'templates', `${this.config.template}.json`);
    
    try {
      const templateData = readFileSync(templatePath, 'utf-8');
      const template = JSON.parse(templateData);
      
      // Merge template with configuration
      this.tenantConfig = this.mergeTemplate(template, this.tenantConfig);
      
      console.log(`✅ Template applied: ${this.config.template}`);
    } catch (error) {
      throw new Error(`Failed to apply template: ${error.message}`);
    }
  }
  
  private mergeTemplate(template: any, config: TenantConfiguration): TenantConfiguration {
    // Deep merge template with configuration
    const merged = { ...template };
    
    // Merge each section
    if (template.infrastructure && config.infrastructure) {
      merged.infrastructure = { ...template.infrastructure, ...config.infrastructure };
    }
    
    if (template.database && config.database) {
      merged.database = { ...template.database, ...config.database };
    }
    
    if (template.domain && config.domain) {
      merged.domain = { ...template.domain, ...config.domain };
    }
    
    if (template.security && config.security) {
      merged.security = { ...template.security, ...config.security };
    }
    
    if (template.content && config.content) {
      merged.content = { ...template.content, ...config.content };
    }
    
    if (template.integrations && config.integrations) {
      merged.integrations = [...template.integrations, ...config.integrations];
    }
    
    if (template.monitoring && config.monitoring) {
      merged.monitoring = { ...template.monitoring, ...config.monitoring };
    }
    
    if (template.features && config.features) {
      merged.features = { ...template.features, ...config.features };
    }
    
    // Override tenant info
    merged.tenant = { ...template.tenant, ...config.tenant };
    
    return merged as TenantConfiguration;
  }
  
  private async validateConfiguration(): Promise<void> {
    console.log('🔍 Validating tenant configuration...');
    
    const validationErrors: string[] = [];
    
    // Validate tenant information
    if (!this.tenantConfig.tenant.tenantId) {
      validationErrors.push('Tenant ID is required');
    }
    
    if (!this.tenantConfig.tenant.name) {
      validationErrors.push('Tenant name is required');
    }
    
    if (!this.tenantConfig.tenant.domain) {
      validationErrors.push('Tenant domain is required');
    }
    
    // Validate infrastructure configuration
    if (!this.tenantConfig.infrastructure.location) {
      validationErrors.push('Infrastructure location is required');
    }
    
    if (!this.tenantConfig.infrastructure.appServicePlan) {
      validationErrors.push('App service plan configuration is required');
    }
    
    // Validate database configuration
    if (!this.tenantConfig.database.name) {
      validationErrors.push('Database name is required');
    }
    
    if (!this.tenantConfig.database.isolationStrategy) {
      validationErrors.push('Database isolation strategy is required');
    }
    
    // Validate domain configuration
    if (!this.tenantConfig.domain.type) {
      validationErrors.push('Domain type is required');
    }
    
    if (this.tenantConfig.domain.type === 'custom' && !this.tenantConfig.domain.customDomain) {
      validationErrors.push('Custom domain is required for custom domain type');
    }
    
    // Validate security configuration
    if (!this.tenantConfig.security.authentication) {
      validationErrors.push('Authentication configuration is required');
    }
    
    if (!this.tenantConfig.security.authorization) {
      validationErrors.push('Authorization configuration is required');
    }
    
    if (validationErrors.length > 0) {
      throw new Error(`Configuration validation failed:\n${validationErrors.join('\n')}`);
    }
    
    console.log('✅ Configuration validation passed');
  }
  
  private async executeProvisioningStages(): Promise<StageResult[]> {
    const stages: StageResult[] = [];
    
    // Stage 1: Infrastructure Provisioning
    const infraStage = await this.provisionInfrastructure();
    stages.push(infraStage);
    
    // Stage 2: Database Setup
    const dbStage = await this.provisionDatabase();
    stages.push(dbStage);
    
    // Stage 3: Domain Configuration
    const domainStage = await this.provisionDomain();
    stages.push(domainStage);
    
    // Stage 4: Security Configuration
    const securityStage = await this.provisionSecurity();
    stages.push(securityStage);
    
    // Stage 5: Content Setup
    const contentStage = await this.provisionContent();
    stages.push(contentStage);
    
    // Stage 6: Integration Setup
    const integrationStage = await this.provisionIntegrations();
    stages.push(integrationStage);
    
    // Stage 7: Monitoring Setup
    const monitoringStage = await this.provisionMonitoring();
    stages.push(monitoringStage);
    
    // Stage 8: Final Validation
    const validationStage = await this.validateProvisioning();
    stages.push(validationStage);
    
    return stages;
  }
  
  private async provisionInfrastructure(): Promise<StageResult> {
    console.log('🏗️ Provisioning infrastructure...');
    
    const stageStart = Date.now();
    
    try {
      const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
      const appServiceName = `${this.tenantConfig.tenant.tenantId}-app`;
      const storageName = `${this.tenantConfig.tenant.tenantId}storage`;
      const keyVaultName = `${this.tenantConfig.tenant.tenantId}-kv`;
      
      // Create resource group
      console.log(`  Creating resource group: ${resourceGroupName}`);
      const resourceGroupCmd = `az group create --name ${resourceGroupName} --location ${this.tenantConfig.infrastructure.location}`;
      
      if (!this.config.dryRun) {
        execSync(resourceGroupCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Create app service plan
      console.log(`  Creating app service plan`);
      const appServicePlanCmd = `az appservice plan create --name ${this.tenantConfig.infrastructure.appServicePlan.name} --resource-group ${resourceGroupName} --sku ${this.tenantConfig.infrastructure.appServicePlan.sku} --is-linux`;
      
      if (!this.config.dryRun) {
        execSync(appServicePlanCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Create app service
      console.log(`  Creating app service: ${appServiceName}`);
      const appServiceCmd = `az webapp create --name ${appServiceName} --resource-group ${resourceGroupName} --plan ${this.tenantConfig.infrastructure.appServicePlan.name} --runtime "NODE|18-lts"`;
      
      if (!this.config.dryRun) {
        execSync(appServiceCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Create storage account
      console.log(`  Creating storage account: ${storageName}`);
      const storageCmd = `az storage account create --name ${storageName} --resource-group ${resourceGroupName} --sku ${this.tenantConfig.infrastructure.storage.sku}`;
      
      if (!this.config.dryRun) {
        execSync(storageCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Create key vault
      console.log(`  Creating key vault: ${keyVaultName}`);
      const keyVaultCmd = `az keyvault create --name ${keyVaultName} --resource-group ${resourceGroupName} --sku ${this.tenantConfig.infrastructure.keyVault.sku}`;
      
      if (!this.config.dryRun) {
        execSync(keyVaultCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      const result: StageResult = {
        name: 'infrastructure-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'resource-group', name: resourceGroupName },
          { type: 'app-service', name: appServiceName },
          { type: 'storage', name: storageName },
          { type: 'key-vault', name: keyVaultName }
        ]
      };
      
      console.log('✅ Infrastructure provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'infrastructure-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Infrastructure provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionDatabase(): Promise<StageResult> {
    console.log('🗄️ Provisioning database...');
    
    const stageStart = Date.now();
    
    try {
      const databaseName = this.tenantConfig.database.name;
      const tenantId = this.tenantConfig.tenant.tenantId;
      
      // Create tenant schema
      console.log(`  Creating tenant schema: ${tenantId}`);
      const schemaCmd = `psql -d ${databaseName} -c "CREATE SCHEMA IF NOT EXISTS ${tenantId};"`;
      
      if (!this.config.dryRun) {
        execSync(schemaCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Apply RLS policies
      console.log(`  Applying RLS policies`);
      const rlsCmd = `psql -d ${databaseName} -c "ALTER DATABASE ${databaseName} SET row_security = on;"`;
      
      if (!this.config.dryRun) {
        execSync(rlsCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Create RLS policy
      const rlsPolicyCmd = `psql -d ${databaseName} -c "
        CREATE POLICY tenant_isolation_policy ON ALL TABLES
        USING (tenant_id = current_setting('app.current_tenant_id'))
        WITH CHECK (tenant_id = current_setting('app.current_tenant_id'));
      "`;
      
      if (!this.config.dryRun) {
        execSync(rlsPolicyCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      // Seed initial data
      if (this.tenantConfig.database.seedData) {
        console.log(`  Seeding initial data`);
        const seedCmd = `psql -d ${databaseName} -c "INSERT INTO ${tenantId}.users (id, email, created_at) VALUES (gen_random_uuid(), 'admin@${tenantId}.com', NOW());"`;
        
        if (!this.config.dryRun) {
          execSync(seedCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
        }
      }
      
      const result: StageResult = {
        name: 'database-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'database-schema', name: tenantId },
          { type: 'rls-policy', name: 'tenant_isolation_policy' }
        ]
      };
      
      console.log('✅ Database provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'database-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Database provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionDomain(): Promise<StageResult> {
    console.log('🌐 Provisioning domain...');
    
    const stageStart = Date.now();
    
    try {
      const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
      const appServiceName = `${this.tenantConfig.tenant.tenantId}-app`;
      
      let domainResult: any;
      
      switch (this.tenantConfig.domain.type) {
        case 'subdomain':
          console.log(`  Configuring subdomain: ${this.tenantConfig.domain.subdomain}`);
          const subdomainCmd = `az webapp config hostname add --hostname ${this.tenantConfig.domain.subdomain}.marketing-websites.com --webapp ${appServiceName} --resource-group ${resourceGroupName}`;
          
          if (!this.config.dryRun) {
            execSync(subdomainCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
          
          domainResult = { type: 'subdomain', domain: `${this.tenantConfig.domain.subdomain}.marketing-websites.com` };
          break;
          
        case 'custom':
          console.log(`  Configuring custom domain: ${this.tenantConfig.domain.customDomain}`);
          const customDomainCmd = `az webapp config hostname add --hostname ${this.tenantConfig.domain.customDomain} --webapp ${appServiceName} --resource-group ${resourceGroupName}`;
          
          if (!this.config.dryRun) {
            execSync(customDomainCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
          
          domainResult = { type: 'custom', domain: this.tenantConfig.domain.customDomain };
          break;
          
        case 'whitelabel':
          console.log(`  Configuring whitelabel domain: ${this.tenantConfig.domain.customDomain}`);
          const whitelabelCmd = `az webapp config hostname add --hostname ${this.tenantConfig.domain.customDomain} --webapp ${appServiceName} --resource-group ${resourceGroupName}`;
          
          if (!this.config.dryRun) {
            execSync(whitelabelCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
          
          domainResult = { type: 'whitelabel', domain: this.tenantConfig.domain.customDomain };
          break;
          
        default:
          throw new Error(`Unknown domain type: ${this.tenantConfig.domain.type}`);
      }
      
      // Configure SSL
      if (this.tenantConfig.domain.ssl) {
        console.log(`  Configuring SSL certificate`);
        const sslCmd = `az webapp config ssl bind --certificate-thumbprint ${this.tenantConfig.domain.ssl.thumbprint} --ssl-type SNI --webapp ${appServiceName} --resource-group ${resourceGroupName}`;
        
        if (!this.config.dryRun && this.tenantConfig.domain.ssl.thumbprint) {
          execSync(sslCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
        }
      }
      
      const result: StageResult = {
        name: 'domain-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'domain', name: domainResult.domain },
          { type: 'ssl', name: 'ssl-certificate' }
        ]
      };
      
      console.log('✅ Domain provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'domain-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Domain provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionSecurity(): Promise<StageResult> {
    console.log('🔒 Provisioning security...');
    
    const stageStart = Date.now();
    
    try {
      const tenantId = this.tenantConfig.tenant.tenantId;
      const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
      const keyVaultName = `${this.tenantConfig.tenant.tenantId}-kv`;
      
      // Setup authentication providers
      if (this.tenantConfig.security.authentication.providers) {
        console.log(`  Setting up authentication providers`);
        
        for (const provider of this.tenantConfig.security.authentication.providers) {
          const providerCmd = `az webapp auth ${provider} update --webapp ${this.tenantConfig.tenant.tenantId}-app --resource-group ${resourceGroupName}`;
          
          if (!this.config.dryRun) {
            execSync(providerCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
        }
      }
      
      // Store secrets in key vault
      if (this.tenantConfig.security.secrets) {
        console.log(`  Storing secrets in key vault`);
        
        for (const [key, value] of Object.entries(this.tenantConfig.security.secrets)) {
          const secretCmd = `az keyvault secret set --vault-name ${keyVaultName} --name ${key} --value "${value}"`;
          
          if (!this.config.dryRun) {
            execSync(secretCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
        }
      }
      
      // Setup RBAC roles
      if (this.tenantConfig.security.authorization.roles) {
        console.log(`  Setting up RBAC roles`);
        
        for (const role of this.tenantConfig.security.authorization.roles) {
          const roleCmd = `az role assignment create --role ${role} --assignee ${tenantId} --scope /subscriptions/{subscription-id}/resourceGroups/${resourceGroupName}`;
          
          if (!this.config.dryRun) {
            execSync(roleCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
        }
      }
      
      const result: StageResult = {
        name: 'security-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'authentication', name: 'auth-providers' },
          { type: 'secrets', name: 'key-vault-secrets' },
          { type: 'authorization', name: 'rbac-roles' }
        ]
      };
      
      console.log('✅ Security provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'security-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Security provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionContent(): Promise<StageResult> {
    console.log('📝 Provisioning content...');
    
    const stageStart = Date.now();
    
    try {
      const tenantId = this.tenantConfig.tenant.tenantId;
      
      // Setup branding
      if (this.tenantConfig.content.branding) {
        console.log(`  Setting up branding`);
        
        // Create branding configuration
        const brandingConfig = {
          theme: this.tenantConfig.content.branding.theme,
          logo: this.tenantConfig.content.branding.logo,
          colors: this.tenantConfig.content.branding.colors
        };
        
        const brandingCmd = `echo '${JSON.stringify(brandingConfig)}' > /tmp/${tenantId}-branding.json`;
        execSync(brandingCmd, { stdio: 'pipe' });
      }
      
      // Setup initial pages
      if (this.tenantConfig.content.pages) {
        console.log(`  Setting up initial pages`);
        
        for (const page of this.tenantConfig.content.pages) {
          const pageCmd = `echo '<!DOCTYPE html><html><head><title>${page}</title></head><body><h1>${page}</h1></body></html>' > /tmp/${tenantId}-${page}.html`;
          execSync(pageCmd, { stdio: 'pipe' });
        }
      }
      
      // Setup navigation
      if (this.tenantConfig.content.navigation) {
        console.log(`  Setting up navigation`);
        
        const navigationConfig = {
          structure: this.tenantConfig.content.navigation.structure,
          menus: this.tenantConfig.content.navigation.menus
        };
        
        const navigationCmd = `echo '${JSON.stringify(navigationConfig)}' > /tmp/${tenantId}-navigation.json`;
        execSync(navigationCmd, { stdio: 'pipe' });
      }
      
      const result: StageResult = {
        name: 'content-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'branding', name: 'branding-config' },
          { type: 'pages', name: 'initial-pages' },
          { type: 'navigation', name: 'navigation-config' }
        ]
      };
      
      console.log('✅ Content provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'content-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Content provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionIntegrations(): Promise<StageResult> {
    console.log('🔗 Provisioning integrations...');
    
    const stageStart = Date.now();
    
    try {
      const tenantId = this.tenantConfig.tenant.tenantId;
      const keyVaultName = `${this.tenantConfig.tenant.tenantId}-kv`;
      
      // Setup integrations
      if (this.tenantConfig.integrations) {
        console.log(`  Setting up integrations`);
        
        for (const integration of this.tenantConfig.integrations) {
          console.log(`    Setting up ${integration.provider} integration`);
          
          // Store integration credentials in key vault
          if (integration.credentials) {
            for (const [key, value] of Object.entries(integration.credentials)) {
              const secretCmd = `az keyvault secret set --vault-name ${keyVaultName} --name ${integration.provider}-${key} --value "${value}"`;
              
              if (!this.config.dryRun) {
                execSync(secretCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
              }
            }
          }
          
          // Configure integration
          const integrationConfig = {
            provider: integration.provider,
            enabled: true,
            configured: true
          };
          
          const integrationCmd = `echo '${JSON.stringify(integrationConfig)}' > /tmp/${tenantId}-${integration.provider}-integration.json`;
          execSync(integrationCmd, { stdio: 'pipe' });
        }
      }
      
      const result: StageResult = {
        name: 'integration-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: this.tenantConfig.integrations.map(i => ({
          type: 'integration',
          name: i.provider
        }))
      };
      
      console.log('✅ Integration provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'integration-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Integration provisioning failed:', error.message);
      return result;
    }
  }
  
  private async provisionMonitoring(): Promise<StageResult> {
    console.log('📊 Provisioning monitoring...');
    
    const stageStart = Date.now();
    
    try {
      const tenantId = this.tenantConfig.tenant.tenantId;
      const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
      
      // Setup Application Insights
      if (this.tenantConfig.monitoring.applicationInsights) {
        console.log(`  Setting up Application Insights`);
        
        const appInsightsName = `${tenantId}-appinsights`;
        const appInsightsCmd = `az monitor app-insights component create --app ${appInsightsName} --location ${this.tenantConfig.infrastructure.location} --resource-group ${resourceGroupName}`;
        
        if (!this.config.dryRun) {
          execSync(appInsightsCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
        }
      }
      
      // Setup Log Analytics
      if (this.tenantConfig.monitoring.logAnalytics) {
        console.log(`  Setting up Log Analytics`);
        
        const logAnalyticsName = `${tenantId}-logs`;
        const logAnalyticsCmd = `az monitor log-analytics workspace create --workspace-name ${logAnalyticsName} --resource-group ${resourceGroupName}`;
        
        if (!this.config.dryRun) {
          execSync(logAnalyticsCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
        }
      }
      
      // Setup alerts
      if (this.tenantConfig.monitoring.alerts) {
        console.log(`  Setting up alerts`);
        
        for (const alert of this.tenantConfig.monitoring.alerts) {
          const alertCmd = `az monitor metrics alert create --name ${alert.name} --resource ${this.tenantConfig.tenant.tenantId}-app --resource-group ${resourceGroupName} --condition "${alert.condition}" --action "${alert.action}"`;
          
          if (!this.config.dryRun) {
            execSync(alertCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
          }
        }
      }
      
      const result: StageResult = {
        name: 'monitoring-provisioning',
        success: true,
        duration: Date.now() - stageStart,
        resources: [
          { type: 'application-insights', name: `${tenantId}-appinsights` },
          { type: 'log-analytics', name: `${tenantId}-logs` }
        ]
      };
      
      console.log('✅ Monitoring provisioning completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'monitoring-provisioning',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Monitoring provisioning failed:', error.message);
      return result;
    }
  }
  
  private async validateProvisioning(): Promise<StageResult> {
    console.log('✅ Validating provisioning...');
    
    const stageStart = Date.now();
    
    try {
      const validations: ValidationCheck[] = [];
      
      // Validate infrastructure
      console.log(`  Validating infrastructure`);
      const infraValidation = await this.validateInfrastructure();
      validations.push(infraValidation);
      
      // Validate database
      console.log(`  Validating database`);
      const dbValidation = await this.validateDatabase();
      validations.push(dbValidation);
      
      // Validate domain
      console.log(`  Validating domain`);
      const domainValidation = await this.validateDomain();
      validations.push(domainValidation);
      
      // Validate security
      console.log(`  Validating security`);
      const securityValidation = await this.validateSecurity();
      validations.push(securityValidation);
      
      // Validate content
      console.log(`  Validating content`);
      const contentValidation = await this.validateContent();
      validations.push(contentValidation);
      
      const allValidationsPassed = validations.every(v => v.success);
      
      if (!allValidationsPassed) {
        const failedValidations = validations.filter(v => !v.success);
        throw new Error(`Validation failed: ${failedValidations.map(v => v.error).join(', ')}`);
      }
      
      const result: StageResult = {
        name: 'validation',
        success: true,
        duration: Date.now() - stageStart,
        validations
      };
      
      console.log('✅ Provisioning validation completed');
      return result;
    } catch (error) {
      const result: StageResult = {
        name: 'validation',
        success: false,
        duration: Date.now() - stageStart,
        error: error.message
      };
      
      console.error('❌ Provisioning validation failed:', error.message);
      return result;
    }
  }
  
  private async validateInfrastructure(): Promise<ValidationCheck> {
    const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
    
    try {
      const checkCmd = `az group show --name ${resourceGroupName}`;
      execSync(checkCmd, { stdio: 'pipe' });
      
      return { success: true, type: 'infrastructure' };
    } catch (error) {
      return { success: false, type: 'infrastructure', error: error.message };
    }
  }
  
  private async validateDatabase(): Promise<ValidationCheck> {
    const databaseName = this.tenantConfig.database.name;
    const tenantId = this.tenantConfig.tenant.tenantId;
    
    try {
      const checkCmd = `psql -d ${databaseName} -c "SELECT 1 FROM information_schema.schemata WHERE schema_name = '${tenantId}';"`;
      execSync(checkCmd, { stdio: 'pipe' });
      
      return { success: true, type: 'database' };
    } catch (error) {
      return { success: false, type: 'database', error: error.message };
    }
  }
  
  private async validateDomain(): Promise<ValidationCheck> {
    const domain = this.getTenantDomain();
    
    try {
      const checkCmd = `curl -I https://${domain}`;
      execSync(checkCmd, { stdio: 'pipe', timeout: 10000 });
      
      return { success: true, type: 'domain' };
    } catch (error) {
      return { success: false, type: 'domain', error: error.message };
    }
  }
  
  private async validateSecurity(): Promise<ValidationCheck> {
    const keyVaultName = `${this.tenantConfig.tenant.tenantId}-kv`;
    
    try {
      const checkCmd = `az keyvault show --name ${keyVaultName}`;
      execSync(checkCmd, { stdio: 'pipe' });
      
      return { success: true, type: 'security' };
    } catch (error) {
      return { success: false, type: 'security', error: error.message };
    }
  }
  
  private async validateContent(): Promise<ValidationCheck> {
    const tenantId = this.tenantConfig.tenant.tenantId;
    
    try {
      const checkCmd = `test -f /tmp/${tenantId}-branding.json && test -f /tmp/${tenantId}-navigation.json`;
      execSync(checkCmd, { stdio: 'pipe' });
      
      return { success: true, type: 'content' };
    } catch (error) {
      return { success: false, type: 'content', error: error.message };
    }
  }
  
  private getTenantDomain(): string {
    switch (this.tenantConfig.domain.type) {
      case 'subdomain':
        return `${this.tenantConfig.domain.subdomain}.marketing-websites.com`;
      case 'custom':
      case 'whitelabel':
        return this.tenantConfig.domain.customDomain;
      default:
        return '';
    }
  }
  
  private async executeRollback(): Promise<void> {
    console.log('🔄 Executing rollback...');
    
    const resourceGroupName = `${this.tenantConfig.tenant.tenantId}-rg`;
    
    try {
      // Delete resource group (this will delete all resources)
      console.log(`  Deleting resource group: ${resourceGroupName}`);
      const deleteCmd = `az group delete --name ${resourceGroupName} --yes --no-wait`;
      
      if (!this.config.dryRun) {
        execSync(deleteCmd, { stdio: this.config.verbose ? 'inherit' : 'pipe' });
      }
      
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      throw error;
    }
  }
  
  private async generateProvisioningReport(stages: StageResult[]): Promise<ProvisioningResult> {
    const success = stages.every(stage => stage.success);
    const duration = Date.now() - this.startTime.getTime();
    
    const errors = stages
      .filter(stage => !stage.success)
      .map(stage => stage.error || 'Unknown error');
    
    const warnings = stages
      .filter(stage => stage.warnings)
      .flatMap(stage => stage.warnings);
    
    const resources = stages
      .filter(stage => stage.resources)
      .flatMap(stage => stage.resources || []);
    
    const endpoints = [
      {
        type: 'web',
        url: `https://${this.getTenantDomain()}`,
        description: 'Main website'
      },
      {
        type: 'api',
        url: `https://${this.getTenantDomain()}/api`,
        description: 'API endpoints'
      },
      {
        type: 'admin',
        url: `https://${this.getTenantDomain()}/admin`,
        description: 'Admin panel'
      }
    ];
    
    const nextSteps = [
      'Configure DNS records for custom domain',
      'Set up email forwarding',
      'Configure analytics tracking',
      'Create user accounts',
      'Customize branding and content',
      'Set up integrations',
      'Configure monitoring alerts'
    ];
    
    return {
      success,
      tenantId: this.tenantConfig.tenant.tenantId,
      duration,
      stages,
      resources,
      endpoints,
      errors,
      warnings,
      nextSteps
    };
  }
  
  private async saveProvisioningReport(result: ProvisioningResult): Promise<void> {
    const reportData = JSON.stringify(result, null, 2);
    writeFileSync(this.config.output, reportData, 'utf-8');
    
    console.log(`📄 Provisioning report saved to: ${this.config.output}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const engine = new TenantProvisioningEngine(config);
  await engine.provision();
}

function parseArgs(args: string[]): ProvisioningConfig {
  const config: ProvisioningConfig = {
    config: 'tenant-config.json',
    template: 'basic',
    skipValidation: false,
    rollbackOnFailure: true,
    dryRun: false,
    verbose: false,
    output: 'provisioning-report.json'
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--config':
        config.config = args[++i] || 'tenant-config.json';
        break;
      case '--template':
        config.template = args[++i] || 'basic';
        break;
      case '--skip-validation':
        config.skipValidation = true;
        break;
      case '--no-rollback':
        config.rollbackOnFailure = false;
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--output':
        config.output = args[++i] || 'provisioning-report.json';
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

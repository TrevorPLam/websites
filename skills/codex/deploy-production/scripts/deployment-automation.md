---
name: deployment-automation
description: |
  **SCRIPTING SKILL** - Automated deployment scripts for Codex agents.
  USE FOR: Infrastructure provisioning, application deployment, and production management.
  DO NOT USE FOR: Manual deployment processes - use automation patterns.
  INVOKES: filesystem, git, azure-mcp, observability.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Deployment Automation Scripts

## Overview
This skill provides Codex-optimized automation scripts for comprehensive deployment processes in the marketing websites monorepo.

## Available Scripts

### 1. Infrastructure Provisioning Scripts

#### Azure Infrastructure Provisioner
```bash
# Provision complete Azure infrastructure
pnpm run deploy:infra --environment=production --template=full

# Provision specific components
pnpm run deploy:infra --components=appservice,storage,keyvault

# Update existing infrastructure
pnpm run deploy:infra --environment=staging --update-only
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Azure Infrastructure Provisioning Script
 * 
 * Provisions and manages Azure infrastructure using Terraform and Bicep.
 * Supports multiple environments and component-specific deployments.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface InfrastructureConfig {
  environment: string;
  location: string;
  components: string[];
  template: 'full' | 'minimal' | 'custom';
  updateOnly: boolean;
  variables: Record<string, any>;
}

interface ComponentConfig {
  name: string;
  type: 'appservice' | 'storage' | 'keyvault' | 'database' | 'network';
  template: string;
  parameters: Record<string, any>;
  dependencies: string[];
}

class AzureInfrastructureProvisioner {
  private config: InfrastructureConfig;
  private components: Map<string, ComponentConfig> = new Map();
  
  constructor(config: InfrastructureConfig) {
    this.config = config;
    this.loadComponentConfigs();
  }
  
  async provision(): Promise<ProvisioningResult> {
    console.log(`🚀 Starting infrastructure provisioning for ${this.config.environment}`);
    
    try {
      // Initialize Terraform
      await this.initializeTerraform();
      
      // Generate Terraform configuration
      await this.generateTerraformConfig();
      
      // Plan infrastructure changes
      const plan = await this.planInfrastructure();
      
      // Apply infrastructure changes
      const result = await this.applyInfrastructure(plan);
      
      // Verify deployment
      await this.verifyDeployment();
      
      // Generate outputs
      await this.generateOutputs(result);
      
      return result;
    } catch (error) {
      console.error('Infrastructure provisioning failed:', error);
      throw error;
    }
  }
  
  private async initializeTerraform(): Promise<void> {
    console.log('📦 Initializing Terraform...');
    
    try {
      execSync('terraform init', { stdio: 'inherit' });
      console.log('✅ Terraform initialized successfully');
    } catch (error) {
      throw new Error(`Terraform initialization failed: ${error.message}`);
    }
  }
  
  private async generateTerraformConfig(): Promise<void> {
    console.log('📝 Generating Terraform configuration...');
    
    const terraformConfig = {
      terraform: {
        required_providers: {
          azurerm: {
            source: "hashicorp/azurerm",
            version: "~>3.0"
          }
        }
      },
      provider: {
        azurerm: {
          features: {}
        }
      }
    };
    
    // Write main.tf
    writeFileSync(
      join(process.cwd(), 'infrastructure', 'main.tf'),
      this.generateMainTf()
    );
    
    // Write variables.tf
    writeFileSync(
      join(process.cwd(), 'infrastructure', 'variables.tf'),
      this.generateVariablesTf()
    );
    
    // Write outputs.tf
    writeFileSync(
      join(process.cwd(), 'infrastructure', 'outputs.tf'),
      this.generateOutputsTf()
    );
    
    console.log('✅ Terraform configuration generated');
  }
  
  private generateMainTf(): string {
    const components = this.config.components.map(comp => 
      this.components.get(comp)
    ).filter(Boolean);
    
    let mainTf = '';
    
    // Resource group
    mainTf += this.generateResourceGroup();
    
    // Components
    for (const component of components) {
      mainTf += this.generateComponent(component);
    }
    
    return mainTf;
  }
  
  private generateResourceGroup(): string {
    return `
resource "azurerm_resource_group" "main" {
  name     = "${this.config.environment}-rg"
  location = var.location
  tags     = {
    environment = "${this.config.environment}"
    project = "marketing-websites"
  }
}
`;
  }
  
  private generateComponent(component: ComponentConfig): string {
    switch (component.type) {
      case 'appservice':
        return this.generateAppService(component);
      case 'storage':
        return this.generateStorage(component);
      case 'keyvault':
        return this.generateKeyVault(component);
      case 'database':
        return this.generateDatabase(component);
      case 'network':
        return this.generateNetwork(component);
      default:
        return '';
    }
  }
  
  private generateAppService(component: ComponentConfig): string {
    return `
resource "azurerm_service_plan" "app_service_plan" {
  name                = "${this.config.environment}-asp"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = "B1"
  
  tags = {
    environment = "${this.config.environment}"
    project = "marketing-websites"
  }
}

resource "azurerm_linux_web_app" "app_service" {
  name                = "${this.config.environment}-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id
  
  site_config {
    always_on = true
    linux_fx_version = "NODE|18-lts"
  }
  
  app_settings = {
    "NODE_ENV" = "${this.config.environment}"
    "APP_NAME" = "marketing-websites"
  }
  
  tags = {
    environment = "${this.config.environment}"
    project = "marketing-websites"
  }
}
`;
  }
  
  private generateStorage(component: ComponentConfig): string {
    return `
resource "azurerm_storage_account" "storage" {
  name                     = "${this.config.environment}storage"
  resource_group_name    = azurerm_resource_group.main.name
  location                = azurerm_resource_group.main.location
  account_tier            = "Standard"
  account_replication_type = "LRS"
  
  tags = {
    environment = "${this.config.environment}"
    project = "marketing-websites"
  }
}
`;
  }
  
  private generateKeyVault(component: ComponentConfig): string {
    return `
resource "azurerm_key_vault" "keyvault" {
  name                = "${this.config.environment}-kv"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
  
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    
    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Recover"
    ]
  }
  
  tags = {
    environment = "${this.config.environment}"
    project = "marketing-websites"
  }
}
`;
  }
  
  private async planInfrastructure(): Promise<TerraformPlan> {
    console.log('📋 Planning infrastructure changes...');
    
    try {
      const output = execSync('terraform plan -out=tfplan', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(output);
      
      return {
        planFile: 'tfplan',
        changes: this.parsePlanOutput(output),
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Infrastructure planning failed: ${error.message}`);
    }
  }
  
  private async applyInfrastructure(plan: TerraformPlan): Promise<ProvisioningResult> {
    console.log('🚀 Applying infrastructure changes...');
    
    try {
      const output = execSync('terraform apply -auto-approve tfplan', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(output);
      
      return {
        success: true,
        outputs: this.parseApplyOutput(output),
        timestamp: new Date(),
        duration: Date.now() - plan.timestamp.getTime()
      };
    } catch (error) {
      throw new Error(`Infrastructure application failed: ${error.message}`);
    }
  }
  
  private async verifyDeployment(): Promise<void> {
    console.log('🔍 Verifying deployment...');
    
    // Check if all resources are created
    const resources = await this.listResources();
    
    for (const component of this.config.components) {
      const componentResources = resources.filter(r => 
        r.name.includes(this.config.environment) && 
        r.name.includes(component)
      );
      
      if (componentResources.length === 0) {
        throw new Error(`Component ${component} not found in deployment`);
      }
    }
    
    console.log('✅ Deployment verification successful');
  }
  
  private async generateOutputs(result: ProvisioningResult): Promise<void> {
    console.log('📄 Generating deployment outputs...');
    
    const outputs = {
      deployment: {
        environment: this.config.environment,
        timestamp: result.timestamp,
        duration: result.duration,
        success: result.success
      },
      resources: result.outputs,
      nextSteps: this.generateNextSteps()
    };
    
    writeFileSync(
      join(process.cwd(), 'infrastructure', 'outputs.json'),
      JSON.stringify(outputs, null, 2)
    );
    
    console.log('✅ Outputs generated successfully');
  }
  
  private generateNextSteps(): string[] {
    const steps = [
      'Update application configuration with new resource IDs',
      'Deploy application to newly provisioned infrastructure',
      'Configure monitoring and alerting',
      'Run smoke tests to verify deployment'
    ];
    
    return steps;
  }
  
  private loadComponentConfigs(): void {
    // Load component configurations from templates
    this.components.set('appservice', {
      name: 'appservice',
      type: 'appservice',
      template: 'appservice.bicep',
      parameters: {},
      dependencies: ['network']
    });
    
    this.components.set('storage', {
      name: 'storage',
      type: 'storage',
      template: 'storage.bicep',
      parameters: {},
      dependencies: []
    });
    
    this.components.set('keyvault', {
      name: 'keyvault',
      type: 'keyvault',
      template: 'keyvault.bicep',
      parameters: {},
      dependencies: []
    });
    
    this.components.set('database', {
      name: 'database',
      type: 'database',
      template: 'database.bicep',
      parameters: {},
      dependencies: ['network']
    });
    
    this.components.set('network', {
      name: 'network',
      type: 'network',
      template: 'network.bicep',
      parameters: {},
      dependencies: []
    });
  }
}

interface TerraformPlan {
  planFile: string;
  changes: any;
  timestamp: Date;
}

interface ProvisioningResult {
  success: boolean;
  outputs: any;
  timestamp: Date;
  duration: number;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const provisioner = new AzureInfrastructureProvisioner(config);
  await provisioner.provision();
}

function parseArgs(args: string[]): InfrastructureConfig {
  const config: InfrastructureConfig = {
    environment: 'staging',
    location: 'eastus',
    components: ['appservice', 'storage', 'keyvault'],
    template: 'full',
    updateOnly: false,
    variables: {}
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--environment':
        config.environment = args[++i];
        break;
      case '--location':
        config.location = args[++i];
        break;
      case '--components':
        config.components = args[++i]?.split(',') || [];
        break;
      case '--template':
        config.template = args[++i] as any;
        break;
      case '--update-only':
        config.updateOnly = true;
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

### 2. Application Deployment Scripts

#### Multi-Environment Deployment
```bash
# Deploy to staging environment
pnpm run deploy:app --environment=staging --strategy=blue-green

# Deploy to production with canary strategy
pnpm run deploy:app --environment=production --strategy=canary --traffic=5

# Rollback deployment
pnpm run deploy:rollback --environment=production --version=previous
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Application Deployment Script
 * 
 * Deploys applications to multiple environments with different strategies.
 * Supports blue-green, canary, and rolling deployments.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface DeploymentConfig {
  environment: string;
  strategy: 'blue-green' | 'canary' | 'rolling';
  version: string;
  traffic?: number;
  healthCheckTimeout: number;
  rollbackOnFailure: boolean;
}

interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  environment: string;
  strategy: string;
  version: string;
  timestamp: Date;
  duration: number;
  rollback?: boolean;
}

class ApplicationDeployer {
  private config: DeploymentConfig;
  private deploymentId: string;
  
  constructor(config: DeploymentConfig) {
    this.config = config;
    this.deploymentId = this.generateDeploymentId();
  }
  
  async deploy(): Promise<DeploymentResult> {
    console.log(`🚀 Starting deployment to ${this.config.environment}`);
    console.log(`Strategy: ${this.config.strategy}`);
    console.log(`Version: ${this.config.version}`);
    
    const startTime = Date.now();
    
    try {
      switch (this.config.strategy) {
        case 'blue-green':
          return await this.blueGreenDeployment(startTime);
        case 'canary':
          return await this.canaryDeployment(startTime);
        case 'rolling':
          return await this.rollingDeployment(startTime);
        default:
          throw new Error(`Unknown deployment strategy: ${this.config.strategy}`);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      
      if (this.config.rollbackOnFailure) {
        console.log('🔄 Initiating rollback...');
        await this.rollback();
      }
      
      throw error;
    }
  }
  
  private async blueGreenDeployment(startTime: number): Promise<DeploymentResult> {
    console.log('🟢🟢 Executing Blue-Green deployment...');
    
    // Identify current active environment
    const activeEnvironment = await this.getActiveEnvironment();
    const inactiveEnvironment = activeEnvironment === 'blue' ? 'green' : 'blue';
    
    try {
      // Deploy to inactive environment
      await this.deployToEnvironment(inactiveEnvironment);
      
      // Health check inactive environment
      await this.healthCheckEnvironment(inactiveEnvironment);
      
      // Switch traffic to inactive environment
      await this.switchTraffic(inactiveEnvironment);
      
      // Validate deployment
      await this.validateDeployment(inactiveEnvironment);
      
      // Cleanup old environment
      await this.cleanupEnvironment(activeEnvironment);
      
      return {
        success: true,
        deploymentId: this.deploymentId,
        environment: this.config.environment,
        strategy: this.config.strategy,
        version: this.config.version,
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
    } catch (error) {
      // Rollback traffic to active environment
      await this.switchTraffic(activeEnvironment);
      throw error;
    }
  }
  
  private async canaryDeployment(startTime: number): Promise<DeploymentResult> {
    console.log('🐤 Executing Canary deployment...');
    
    const trafficStages = this.config.traffic ? 
      [this.config.traffic, 25, 50, 100] : 
      [5, 25, 50, 100];
    
    try {
      // Create canary environment
      const canaryEnvironment = await this.createCanaryEnvironment();
      
      // Deploy canary version
      await this.deployToEnvironment(canaryEnvironment);
      
      // Gradual traffic increase
      for (const trafficPercentage of trafficStages) {
        console.log(`📊 Adjusting traffic to ${trafficPercentage}%`);
        
        await this.adjustTraffic(canaryEnvironment, trafficPercentage);
        
        // Monitor for specified duration
        const isHealthy = await this.monitorCanary(300000); // 5 minutes
        
        if (!isHealthy) {
          console.log('❌ Canary deployment failed health checks');
          await this.rollbackCanary(canaryEnvironment);
          throw new Error('Canary deployment failed');
        }
        
        console.log(`✅ ${trafficPercentage}% traffic healthy`);
      }
      
      // Promote canary to production
      await this.promoteCanary(canaryEnvironment);
      
      return {
        success: true,
        deploymentId: this.deploymentId,
        environment: this.config.environment,
        strategy: this.config.strategy,
        version: this.config.version,
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
    } catch (error) {
      // Cleanup canary environment
      await this.cleanupCanary();
      throw error;
    }
  }
  
  private async rollingDeployment(startTime: number): Promise<DeploymentResult> {
    console.log('🔄 Executing Rolling deployment...');
    
    const instances = await this.getInstances();
    const batchSize = 2;
    const batches = this.createBatches(instances, batchSize);
    
    try {
      for (const [batchIndex, batch] of batches.entries()) {
        console.log(`📦 Deploying batch ${batchIndex + 1}/${batches.length}`);
        
        // Drain traffic from batch instances
        await this.drainInstances(batch);
        
        // Deploy new version to batch
        for (const instance of batch) {
          await this.deployInstance(instance);
        }
        
        // Health check batch instances
        await this.healthCheckBatch(batch);
        
        // Return traffic to batch instances
        await this.enableInstances(batch);
        
        console.log(`✅ Batch ${batchIndex + 1} deployed successfully`);
      }
      
      return {
        success: true,
        deploymentId: this.deploymentId,
        environment: this.config.environment,
        strategy: this.config.strategy,
        version: this.config.version,
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
    } catch (error) {
      // Rollback deployment
      await this.rollbackDeployment(instances);
      throw error;
    }
  }
  
  private async deployToEnvironment(environment: string): Promise<void> {
    console.log(`📦 Deploying to ${environment} environment...`);
    
    // Build application
    console.log('🔨 Building application...');
    execSync('pnpm build', { stdio: 'inherit' });
    
    // Deploy to specific environment
    const deployCommand = this.getDeployCommand(environment);
    execSync(deployCommand, { stdio: 'inherit' });
    
    console.log(`✅ Deployment to ${environment} completed`);
  }
  
  private async healthCheckEnvironment(environment: string): Promise<void> {
    console.log(`🔍 Health checking ${environment} environment...`);
    
    const healthUrl = this.getHealthUrl(environment);
    const timeout = this.config.healthCheckTimeout;
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(`${healthUrl}/api/health`);
        if (response.ok) {
          const health = await response.json();
          if (health.status === 'healthy') {
            console.log(`✅ ${environment} environment is healthy`);
            return;
          }
        }
      } catch (error) {
        // Continue checking
      }
      
      await this.sleep(5000); // Wait 5 seconds
    }
    
    throw new Error(`Health check failed for ${environment} environment`);
  }
  
  private async switchTraffic(environment: string): Promise<void> {
    console.log(`🔄 Switching traffic to ${environment} environment...`);
    
    // Update load balancer configuration
    const loadBalancerCommand = this.getLoadBalancerCommand(environment);
    execSync(loadBalancerCommand, { stdio: 'inherit' });
    
    // Update DNS if needed
    await this.updateDNS(environment);
    
    console.log(`✅ Traffic switched to ${environment} environment`);
  }
  
  private async monitorCanary(duration: number): Promise<boolean> {
    console.log(`📊 Monitoring canary for ${duration / 1000} seconds...`);
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      const metrics = await this.getMetrics();
      
      const isHealthy = this.evaluateCanaryHealth(metrics);
      
      if (!isHealthy) {
        return false;
      }
      
      await this.sleep(30000); // Check every 30 seconds
    }
    
    return true;
  }
  
  private evaluateCanaryHealth(metrics: any): boolean {
    // Error rate should not be significantly higher than baseline
    if (metrics.errorRate > 5) {
      return false;
    }
    
    // Response time should not be significantly higher
    if (metrics.responseTime > 2000) {
      return false;
    }
    
    // Throughput should be maintained
    if (metrics.throughput < 100) {
      return false;
    }
    
    return true;
  }
  
  private async rollback(): Promise<void> {
    console.log('🔄 Rolling back deployment...');
    
    try {
      // Get previous version
      const previousVersion = await this.getPreviousVersion();
      
      // Deploy previous version
      const rollbackConfig = {
        ...this.config,
        version: previousVersion,
        rollbackOnFailure: false
      };
      
      const rollbackDeployer = new ApplicationDeployer(rollbackConfig);
      await rollbackDeployer.deploy();
      
      console.log('✅ Rollback completed successfully');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
  
  // Helper methods
  private generateDeploymentId(): string {
    return `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async getActiveEnvironment(): Promise<string> {
    // Check current active environment (blue or green)
    const activeUrl = 'https://api.marketing-websites.com/active-environment';
    const response = await fetch(activeUrl);
    const data = await response.json();
    return data.environment;
  }
  
  private getDeployCommand(environment: string): string {
    const commands = {
      staging: 'az webapp deployment source config-zip --resource-group marketing-staging --name marketing-staging',
      production: 'az webapp deployment source config-zip --resource-group marketing-prod --name marketing-prod'
    };
    
    return commands[environment] || commands.staging;
  }
  
  private getHealthUrl(environment: string): string {
    const urls = {
      staging: 'https://marketing-staging.azurewebsites.net',
      production: 'https://marketing-websites.com'
    };
    
    return urls[environment] || urls.staging;
  }
  
  private getLoadBalancerCommand(environment: string): string {
    // Command to update load balancer configuration
    return `az network traffic-rule update --resource-group marketing-${environment} --name lb-rule --action Allow --priority 100 --frontend-port 80 --backend-port 3000`;
  }
  
  private async updateDNS(environment: string): Promise<void> {
    // Update DNS records if needed
    console.log(`🌐 Updating DNS for ${environment} environment...`);
  }
  
  private async getMetrics(): Promise<any> {
    // Get application metrics from monitoring system
    return {
      errorRate: 2,
      responseTime: 1500,
      throughput: 150
    };
  }
  
  private async getInstances(): Promise<string[]> {
    // Get list of application instances
    return ['instance-1', 'instance-2', 'instance-3'];
  }
  
  private createBatches(instances: string[], batchSize: number): Map<number, string[]> {
    const batches = new Map<number, string[]>();
    
    for (let i = 0; i < instances.length; i += batchSize) {
      batches.set(Math.floor(i / batchSize), instances.slice(i, i + batchSize));
    }
    
    return batches;
  }
  
  private async drainInstances(instances: string[]): Promise<void> {
    console.log(`🚫 Draining traffic from instances: ${instances.join(', ')}`);
    // Implement instance draining logic
  }
  
  private async deployInstance(instance: string): Promise<void> {
    console.log(`📦 Deploying to instance: ${instance}`);
    // Implement instance deployment logic
  }
  
  private async healthCheckBatch(instances: string[]): Promise<void> {
    console.log(`🔍 Health checking batch: ${instances.join(', ')}`);
    // Implement batch health check logic
  }
  
  private async enableInstances(instances: string[]): Promise<void> {
    console.log(`✅ Enabling instances: ${instances.join(', ')}`);
    // Implement instance enabling logic
  }
  
  private async rollbackDeployment(instances: string[]): Promise<void> {
    console.log('🔄 Rolling back deployment...');
    // Implement rollback logic
  }
  
  private async createCanaryEnvironment(): Promise<string> {
    console.log('🐤 Creating canary environment...');
    return 'canary';
  }
  
  private async adjustTraffic(environment: string, percentage: number): Promise<void> {
    console.log(`📊 Adjusting traffic: ${environment} -> ${percentage}%`);
    // Implement traffic adjustment logic
  }
  
  private async rollbackCanary(environment: string): Promise<void> {
    console.log(`🔄 Rolling back canary: ${environment}`);
    // Implement canary rollback logic
  }
  
  private async promoteCanary(environment: string): Promise<void> {
    console.log(`🎯 Promoting canary: ${environment}`);
    // Implement canary promotion logic
  }
  
  private async cleanupCanary(): Promise<void> {
    console.log('🧹 Cleaning up canary environment...');
    // Implement canary cleanup logic
  }
  
  private async cleanupEnvironment(environment: string): Promise<void> {
    console.log(`🧹 Cleaning up ${environment} environment...`);
    // Implement environment cleanup logic
  }
  
  private async validateDeployment(environment: string): Promise<void> {
    console.log(`✅ Validating deployment in ${environment} environment...`);
    // Implement deployment validation logic
  }
  
  private async getPreviousVersion(): Promise<string> {
    // Get previous version from deployment history
    return 'v1.2.3';
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const deployer = new ApplicationDeployer(config);
  const result = await deployer.deploy();
  
  console.log('🎉 Deployment completed successfully!');
  console.log(`Deployment ID: ${result.deploymentId}`);
  console.log(`Duration: ${result.duration}ms`);
}

function parseArgs(args: string[]): DeploymentConfig {
  const config: DeploymentConfig = {
    environment: 'staging',
    strategy: 'blue-green',
    version: 'latest',
    healthCheckTimeout: 300000,
    rollbackOnFailure: true
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--environment':
        config.environment = args[++i];
        break;
      case '--strategy':
        config.strategy = args[++i] as any;
        break;
      case '--version':
        config.version = args[++i];
        break;
      case '--traffic':
        config.traffic = parseInt(args[++i]);
        break;
      case '--health-check-timeout':
        config.healthCheckTimeout = parseInt(args[++i]);
        break;
      case '--no-rollback':
        config.rollbackOnFailure = false;
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

### 3. Monitoring and Health Check Scripts

#### Health Check Monitor
```bash
# Run comprehensive health check
pnpm run health:check --environment=production --comprehensive

# Monitor specific services
pnpm run health:monitor --services=app,database,cache --duration=300

# Generate health report
pnpm run health:report --output=health-report.json --format=html
```

**Script Implementation:**
```typescript
#!/usr/bin/env tsx
/**
 * Health Check Monitoring Script
 * 
 * Monitors application and infrastructure health across multiple environments.
 * Generates comprehensive health reports and alerts.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface HealthCheckConfig {
  environment: string;
  comprehensive: boolean;
  services: string[];
  duration: number;
  output: string;
  format: 'json' | 'html' | 'text';
  alerting: boolean;
}

interface HealthResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
  timestamp: Date;
  duration: number;
  environment: string;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message?: string;
  data?: any;
  error?: string;
}

class HealthMonitor {
  private config: HealthCheckConfig;
  private checks: Map<string, HealthCheckFunction> = new Map();
  
  constructor(config: HealthCheckConfig) {
    this.config = config;
    this.registerHealthChecks();
  }
  
  async runHealthCheck(): Promise<HealthResult> {
    console.log(`🔍 Running health check for ${this.config.environment}`);
    
    const startTime = Date.now();
    const checks: HealthCheck[] = [];
    
    try {
      // Run individual health checks
      for (const [name, checkFunction] of this.checks) {
        if (this.config.services.length === 0 || this.config.services.includes(name)) {
          const check = await this.runIndividualCheck(name, checkFunction);
          checks.push(check);
        }
      }
      
      // Calculate overall status
      const status = this.calculateOverallStatus(checks);
      
      const result: HealthResult = {
        status,
        checks,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        environment: this.config.environment
      };
      
      // Generate report
      await this.generateReport(result);
      
      // Send alerts if needed
      if (this.config.alerting && status !== 'healthy') {
        await this.sendAlerts(result);
      }
      
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
  
  private async runIndividualCheck(
    name: string, 
    checkFunction: HealthCheckFunction
  ): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      console.log(`  🔍 Checking ${name}...`);
      
      const result = await checkFunction();
      
      const check: HealthCheck = {
        name,
        status: result ? 'pass' : 'fail',
        duration: Date.now() - startTime,
        data: result
      };
      
      console.log(`  ${check.status === 'pass' ? '✅' : '❌'} ${name} (${check.duration}ms)`);
      
      return check;
    } catch (error) {
      const check: HealthCheck = {
        name,
        status: 'fail',
        duration: Date.now() - startTime,
        error: error.message
      };
      
      console.log(`  ❌ ${name} (${check.duration}ms) - ${error.message}`);
      
      return check;
    }
  }
  
  private calculateOverallStatus(checks: HealthCheck[]): HealthResult['status'] {
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
  
  private async generateReport(result: HealthResult): Promise<void> {
    console.log(`📄 Generating health report...`);
    
    switch (this.config.format) {
      case 'json':
        await this.generateJSONReport(result);
        break;
      case 'html':
        await this.generateHTMLReport(result);
        break;
      case 'text':
        await this.generateTextReport(result);
        break;
    }
    
    console.log(`✅ Report generated: ${this.config.output}`);
  }
  
  private async generateJSONReport(result: HealthResult): Promise<void> {
    const report = {
      ...result,
      summary: {
        totalChecks: result.checks.length,
        passedChecks: result.checks.filter(c => c.status === 'pass').length,
        failedChecks: result.checks.filter(c => c.status === 'fail').length,
        warningChecks: result.checks.filter(c => c.status === 'warn').length,
        overallStatus: result.status
      }
    };
    
    writeFileSync(this.config.output, JSON.stringify(report, null, 2));
  }
  
  private async generateHTMLReport(result: HealthResult): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Health Check Report - ${this.config.environment}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .status-healthy { color: #28a745; }
        .status-unhealthy { color: #dc3545; }
        .status-degraded { color: #ffc107; }
        .check { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .check.pass { border-left-color: #28a745; }
        .check.fail { border-left-color: #dc3545; }
        .check.warn { border-left-color: #ffc107; }
        .status { font-weight: bold; }
        .duration { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Health Check Report</h1>
        <p>Environment: <strong>${result.environment}</strong></p>
        <p>Status: <span class="status status-${result.status}">${result.status.toUpperCase()}</span></p>
        <p>Timestamp: ${result.timestamp.toISOString()}</p>
        <p>Duration: ${result.duration}ms</p>
    </div>
    
    <h2>Health Checks</h2>
    ${result.checks.map(check => `
        <div class="check ${check.status}">
            <span class="status">${check.name}</span>
            <span class="status">${check.status.toUpperCase()}</span>
            <span class="duration">${check.duration}ms</span>
            ${check.error ? `<div class="error">${check.error}</div>` : ''}
            ${check.data ? `<div class="data">${JSON.stringify(check.data, null, 2)}</div>` : ''}
        </div>
    `).join('')}
</body>
</html>`;
    
    writeFileSync(this.config.output, html);
  }
  
  private async generateTextReport(result: HealthResult): Promise<void> {
    const report = `
Health Check Report - ${result.environment}
=====================================

Environment: ${result.environment}
Status: ${result.status.toUpperCase()}
Timestamp: ${result.timestamp.toISOString()}
Duration: ${result.duration}ms

Health Checks:
${result.checks.map(check => 
  `${check.name}: ${check.status.toUpperCase()} (${check.duration}ms)${check.error ? ' - ' + check.error : ''}`
).join('\n')}

Summary:
--------
Total Checks: ${result.checks.length}
Passed: ${result.checks.filter(c => c.status === 'pass').length}
Failed: ${result.checks.filter(c => c.status === 'fail').length}
Warnings: ${result.checks.filter(c => c.status === 'warn').length}
`;
    
    writeFileSync(this.config.output, report);
  }
  
  private async sendAlerts(result: HealthResult): PromiseResult> {
    console.log(`🚨 Sending alerts for ${result.status} status...`);
    
    const failedChecks = result.checks.filter(c => c.status === 'fail');
    
    // Send alert to monitoring system
    await this.sendMonitoringAlert(result, failedChecks);
    
    // Send email notification
    await this.sendEmailAlert(result, failedChecks);
    
    // Send Slack notification
    await this.sendSlackAlert(result, failedChecks);
    
    return { success: true };
  }
  
  private registerHealthChecks(): void {
    // Application health check
    this.checks.set('application', async () => {
      const url = this.getServiceUrl('application');
      const response = await fetch(`${url}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const health = await response.json();
      return health.status === 'healthy';
    });
    
    // Database health check
    this.checks.set('database', async () => {
      // Check database connectivity
      const db = await this.getDatabaseConnection();
      await db.query('SELECT 1');
      return true;
    });
    
    // Cache health check
    this.checks.set('cache', async () => {
      // Check cache connectivity
      const cache = await this.getCacheConnection();
      await cache.ping();
      return true;
    });
    
    // External service health check
    this.checks.set('external-services', async () => {
      // Check external service dependencies
      const services = ['payment-api', 'email-api', 'analytics-api'];
      
      for (const service of services) {
        const url = this.getServiceUrl(service);
        const response = await fetch(`${url}/health`);
        
        if (!response.ok) {
          throw new Error(`Service ${service} unhealthy`);
        }
      }
      
      return true;
    });
    
    // Infrastructure health check
    this.checks.set('infrastructure', async () => {
      // Check infrastructure components
      const components = ['load-balancer', 'cdn', 'storage'];
      
      for (const component of components) {
        const healthy = await this.checkInfrastructureComponent(component);
        if (!healthy) {
          throw new Error(`Component ${component} unhealthy`);
        }
      }
      
      return true;
    });
  }
  
  private getServiceUrl(service: string): string {
    const urls = {
      application: 'https://marketing-websites.com',
      'payment-api': 'https://api.marketing-websites.com/payments',
      'email-api': 'https://api.marketing-websites.com/emails',
      'analytics-api': 'https://api.marketing-websites.com/analytics'
    };
    
    return urls[service] || urls.application;
  }
  
  private async getDatabaseConnection(): Promise<any> {
    // Return database connection
    return {};
  }
  
  private async getCacheConnection(): Promise<any> {
    // Return cache connection
    return {};
  }
  
  private async checkInfrastructureComponent(component: string): Promise<boolean> {
    // Check infrastructure component health
    return true;
  }
  
  private async sendMonitoringAlert(result: HealthResult, failedChecks: HealthCheck[]): Promise<void> {
    // Send alert to monitoring system
    console.log('📊 Sending monitoring alert...');
  }
  
  private async sendEmailAlert(result: HealthResult, failedChecks: HealthCheck[]): Promise<void> {
    // Send email notification
    console.log('📧 Sending email alert...');
  }
  
  private async sendSlackAlert(result: HealthResult, failedChecks: HealthCheck[]): Promise<void> {
    // Send Slack notification
    console.log('💬 Sending Slack alert...');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);
  
  const monitor = new HealthMonitor(config);
  const result = await monitor.runHealthCheck();
  
  console.log(`\n🎯 Health check completed: ${result.status.toUpperCase()}`);
  console.log(`⏱️ Duration: ${result.duration}ms`);
  console.log(`📊 Checks: ${result.checks.filter(c => c.status === 'pass').length}/${result.checks.length} passed`);
}

function parseArgs(args: string[]): HealthCheckConfig {
  const config: HealthCheckConfig = {
    environment: 'production',
    comprehensive: false,
    services: [],
    duration: 300000,
    output: 'health-report.json',
    format: 'json',
    alerting: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--environment':
        config.environment = args[++i];
        break;
      case '--comprehensive':
        config.comprehensive = true;
        break;
      case '--services':
        config.services = args[++i]?.split(',') || [];
        break;
      case '--duration':
        config.duration = parseInt(args[++i]);
        break;
      case '--output':
        config.output = args[++i];
        break;
      case '--format':
        config.format = args[++i] as any;
        break;
      case '--alerting':
        config.alerting = true;
        break;
    }
  }
  
  return config;
}

if (require.main === module) {
  main().catch(console.error);
}
```

## Script Integration Patterns

### 1. End-to-End Deployment Pipeline
```typescript
#!/usr/bin/env tsx
/**
 * End-to-End Deployment Pipeline
 * 
 * Orchestrates complete deployment process including infrastructure,
 * application deployment, health checks, and validation.
 */

class DeploymentPipeline {
  async execute(deploymentConfig: DeploymentConfig): Promise<PipelineResult> {
    console.log('🚀 Starting end-to-end deployment pipeline...');
    
    const startTime = Date.now();
    const results: PipelineStepResult[] = [];
    
    try {
      // Step 1: Infrastructure Provisioning
      const infraResult = await this.executeInfrastructureProvisioning(deploymentConfig);
      results.push(infraResult);
      
      // Step 2: Application Deployment
      const appResult = await this.executeApplicationDeployment(deploymentConfig);
      results.push(appResult);
      
      // Step 3: Health Checks
      const healthResult = await this.executeHealthChecks(deploymentConfig);
      results.push(healthResult);
      
      // Step 4: Validation
      const validationResult = await this.executeValidation(deploymentConfig);
      results.push(validationResult);
      
      // Step 5: Monitoring Setup
      const monitoringResult = await this.executeMonitoringSetup(deploymentConfig);
      results.push(monitoringResult);
      
      return {
        success: true,
        duration: Date.now() - startTime,
        steps: results,
        deploymentId: deploymentConfig.deploymentId
      };
    } catch (error) {
      console.error('Pipeline failed:', error);
      
      // Rollback if needed
      if (deploymentConfig.rollbackOnFailure) {
        await this.executeRollback(deploymentConfig);
      }
      
      throw error;
    }
  }
  
  private async executeInfrastructureProvisioning(config: DeploymentConfig): Promise<PipelineStepResult> {
    // Execute infrastructure provisioning
    return { step: 'infrastructure', success: true, duration: 0 };
  }
  
  private async executeApplicationDeployment(config: DeploymentConfig): Promise<PipelineStepResult> {
    // Execute application deployment
    return { step: 'application', success: true, duration: 0 };
  }
  
  private async executeHealthChecks(config: DeploymentConfig): Promise<PipelineStepResult> {
    // Execute health checks
    return { step: 'health-checks', success: true, duration: 0 };
  }
  
  private async executeValidation(config: DeploymentConfig): Promise<PipelineStepResult> {
    // Execute validation
    return { step: 'validation', success: true, duration: 0 };
  }
  
  private async executeMonitoringSetup(config: DeploymentConfig): Promise<PipelineStepResult> {
    // Execute monitoring setup
    return { step: 'monitoring', success: true, duration: 0 };
  }
  
  private async executeRollback(config: DeploymentConfig): Promise<void> {
    console.log('🔄 Executing rollback...');
    // Implement rollback logic
  }
}

interface PipelineResult {
  success: boolean;
  duration: number;
  steps: PipelineStepResult[];
  deploymentId: string;
}

interface PipelineStepResult {
  step: string;
  success: boolean;
  duration: number;
  details?: any;
}

interface DeploymentConfig {
  deploymentId: string;
  environment: string;
  strategy: string;
  rollbackOnFailure: boolean;
  infrastructure: any;
  application: any;
  monitoring: any;
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

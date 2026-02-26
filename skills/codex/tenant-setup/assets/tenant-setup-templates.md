---
name: tenant-setup-templates
description: |
  **ASSET TEMPLATE** - Tenant setup templates and configuration patterns for Codex agents.
  USE FOR: Standardizing tenant setup processes, ensuring comprehensive coverage.
  DO NOT USE FOR: Direct execution - template reference only.
  INVOKES: none.
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'template'
---

# Tenant Setup Templates and Configuration Patterns

## Overview

This document provides standardized templates and configuration patterns for Codex tenant setup agents to ensure consistent, comprehensive, and secure tenant provisioning.

## Tenant Configuration Templates

### 1. Basic Tenant Configuration Template

```yaml
# tenant-config.template.yml
name: basic-tenant
description: |
  **BASIC TENANT TEMPLATE** - Standard tenant configuration for small to medium businesses.
  USE FOR: Standard tenant onboarding with essential features.
  DO NOT USE FOR: Enterprise or custom domain requirements.
  INVOKES: [azure-mcp, filesystem, observability].
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'tenant-config'

# Tenant Information
tenant:
  name: 'Acme Corporation'
  tenantId: 'acme-corp'
  domain: 'acme.marketing-websites.com'
  type: 'standard'
  tier: 'professional'

# Infrastructure Configuration
infrastructure:
  location: 'eastus'
  resourceGroup: 'acme-corp-rg'
  appServicePlan:
    name: 'acme-corp-asp'
    sku: 'Standard_D2s_v3'
    capacity: 2
  storage:
    name: 'acmecorpstorage'
    sku: 'Standard_LRS'
  keyVault:
    name: 'acme-corp-kv'
    sku: 'standard'

# Database Configuration
database:
  name: 'marketing_websites'
  isolationStrategy: 'rowLevelSecurity'
  schema: 'acme_corp'
  seedData: true
  backupPolicy:
    retention: 30
    frequency: 'daily'

# Domain Configuration
domain:
  type: 'subdomain'
  subdomain: 'acme'
  ssl:
    provider: 'letsencrypt'
    autoRenewal: true
  dns:
    managed: true
    records: []

# Security Configuration
security:
  authentication:
    providers: ['azure-ad', 'google']
    sso: true
    mfa: 'conditional'
  authorization:
    model: 'rbac'
    roles: ['admin', 'editor', 'viewer']
  encryption:
    atRest: true
    inTransit: true
    keyRotation: 'quarterly'

# Content Configuration
content:
  branding:
    theme: 'default'
    logo: '/assets/logo.png'
    colors:
      primary: '#007bff'
      secondary: '#6c757d'
  pages:
    - 'home'
    - 'about'
    - 'contact'
    - 'services'
  navigation:
    structure: 'horizontal'
    menus:
      - name: 'main'
        items: ['home', 'about', 'services', 'contact']

# Integration Configuration
integrations:
  analytics:
    provider: 'google-analytics'
    trackingId: 'GA-XXXXXXXXX'
  crm:
    provider: 'hubspot'
    apiKey: 'REDACTED'
  email:
    provider: 'sendgrid'
    apiKey: 'REDACTED'
  support:
    provider: 'zendesk'
    apiKey: 'REDACTED'

# Monitoring Configuration
monitoring:
  alerts:
    enabled: true
    channels: ['email', 'slack']
  metrics:
    performance: true
    availability: true
    security: true
  logging:
    level: 'info'
    destinations: ['application-insights']

# Feature Flags
features:
  analytics: true
  contactForm: true
  blog: false
  ecommerce: false
  customDomain: false
  sso: true
  apiAccess: false
```

### 2. Enterprise Tenant Configuration Template

```yaml
# enterprise-tenant.template.yml
name: enterprise-tenant
description: |
  **ENTERPRISE TENANT TEMPLATE** - Comprehensive tenant configuration for large enterprises.
  USE FOR: Enterprise clients with advanced security, custom domains, and extensive integrations.
  DO NOT USE FOR: Small business or basic requirements.
  INVOKES: [azure-mcp, filesystem, observability, github].
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'tenant-config'

# Tenant Information
tenant:
  name: 'Global Enterprise Corp'
  tenantId: 'global-enterprise'
  domain: 'marketing.globalenterprise.com'
  type: 'enterprise'
  tier: 'enterprise'

# Infrastructure Configuration
infrastructure:
  location: 'eastus'
  resourceGroup: 'global-enterprise-rg'
  appServicePlan:
    name: 'global-enterprise-asp'
    sku: 'Standard_D4s_v3'
    capacity: 3
    autoScale:
      minInstances: 3
      maxInstances: 10
      targetCPU: 70
  storage:
    name: 'globalenterprisestorage'
    sku: 'Standard_GRS'
  keyVault:
    name: 'global-enterprise-kv'
    sku: 'premium'
  cdn:
    provider: 'azure-cdn'
    profile: 'global-enterprise-cdn'

# Database Configuration
database:
  name: 'marketing_websites_enterprise'
  isolationStrategy: 'schemaPerTenant'
  schema: 'global_enterprise'
  seedData: true
  backupPolicy:
    retention: 90
    frequency: 'daily'
    geoRedundant: true
  performance:
    connectionPool: 20
    readReplicas: 2
    caching: 'redis'

# Domain Configuration
domain:
  type: 'custom'
  customDomain: 'marketing.globalenterprise.com'
  ssl:
    provider: 'digicert'
    autoRenewal: true
    wildcard: true
  dns:
    managed: false
    records:
      - type: 'A'
        name: '@'
        value: '192.168.1.1'
      - type: 'CNAME'
        name: 'www'
        value: 'marketing.globalenterprise.com'
      - type: 'MX'
        name: '@'
        value: 'mail.globalenterprise.com'

# Security Configuration
security:
  authentication:
    providers: ['azure-ad', 'saml', 'okta']
    sso: true
    mfa: 'required'
    saml:
      entityId: 'global-enterprise'
      ssoUrl: 'https://login.globalenterprise.com'
      certificate: '{{SAML_CERTIFICATE}}'
  authorization:
    model: 'hybrid'
    roles: ['super-admin', 'admin', 'manager', 'editor', 'viewer', 'contributor']
    policies:
      - name: 'data-access'
        effect: 'allow'
        actions: ['read', 'write']
        resources: ['tenant-data']
      - name: 'admin-access'
        effect: 'allow'
        actions: ['*']
        resources: ['*']
  encryption:
    atRest: 'AES-256'
    inTransit: 'TLS-1.3'
    keyManagement: 'azure-key-vault'
    keyRotation: 'monthly'
    hsm: true
  compliance:
    gdpr: true
    ccpa: true
    hipaa: true
    sox: true
    auditLogging: true
    dataRetention: 2555

# Content Configuration
content:
  branding:
    theme: 'enterprise'
    logo: '/assets/enterprise-logo.png'
    favicon: '/assets/favicon.ico'
    colors:
      primary: '#1a73e8'
      secondary: '#5f6368'
      accent: '#ea4335'
    fonts:
      primary: 'Roboto'
      secondary: 'Open Sans'
  pages:
    - 'home'
    - 'about'
    - 'services'
    - 'solutions'
    - 'resources'
    - 'blog'
    - 'contact'
    - 'careers'
    - 'investors'
  navigation:
    structure: 'mega-menu'
    menus:
      - name: 'main'
        items: ['home', 'about', 'services', 'solutions', 'resources']
      - name: 'company'
        items: ['about', 'careers', 'investors', 'blog']
      - name: 'resources'
        items: ['blog', 'whitepapers', 'case-studies', 'webinars']
  customComponents:
    - 'hero-banner'
    - 'feature-grid'
    - 'testimonials'
    - 'case-studies'
    - 'contact-form'

# Integration Configuration
integrations:
  analytics:
    provider: 'google-analytics-4'
    trackingId: 'GA-XXXXXXXXX'
    enhancedEcommerce: true
    customDimensions:
      - name: 'user_segment'
        value: 'enterprise'
      - name: 'account_tier'
        value: 'premium'
  crm:
    provider: 'salesforce'
    apiKey: 'REDACTED'
    objects: ['leads', 'accounts', 'opportunities']
  marketing:
    provider: 'marketo'
    apiKey: 'REDACTED'
    campaigns: true
    leadScoring: true
  email:
    provider: 'sendgrid'
    apiKey: 'REDACTED'
    templates: true
    analytics: true
  collaboration:
    provider: 'microsoft-teams'
    webhook: 'REDACTED'
  support:
    provider: 'zendesk'
    apiKey: 'REDACTED'
    chat: true
    knowledgeBase: true

# Monitoring Configuration
monitoring:
  alerts:
    enabled: true
    channels: ['email', 'slack', 'teams', 'pagerduty']
    escalation:
      level1: ['email', 'slack']
      level2: ['teams', 'pagerduty']
      level3: ['phone', 'sms']
  metrics:
    performance: true
    availability: true
    security: true
    business: true
    custom:
      - name: 'lead_conversion_rate'
        threshold: 0.05
      - name: 'page_load_time'
        threshold: 2000
  logging:
    level: 'warn'
    destinations: ['application-insights', 'log-analytics']
    retention: 90
  dashboards:
    - name: 'executive-overview'
      widgets: ['leads', 'conversions', 'revenue']
    - name: 'technical-performance'
      widgets: ['response-time', 'error-rate', 'uptime']
    - name: 'business-analytics'
      widgets: ['campaign-performance', 'user-engagement', 'content-performance']

# Feature Flags
features:
  analytics: true
  contactForm: true
  blog: true
  ecommerce: true
  customDomain: true
  sso: true
  apiAccess: true
  whiteLabel: true
  advancedAnalytics: true
  customIntegrations: true
  multiLanguage: true
  a11yCompliance: true
  gdprCompliance: true
  advancedSecurity: true
  customBranding: true
  contentManagement: true
  leadScoring: true
  marketingAutomation: true
```

### 3. White-Label Tenant Configuration Template

```yaml
# whitelabel-tenant.template.yml
name: whitelabel-tenant
description: |
  **WHITE-LABEL TENANT TEMPLATE** - Complete white-label configuration for agencies and resellers.
  USE FOR: White-label deployments with full branding control.
  DO NOT USE FOR: Standard or enterprise deployments.
  INVOKES: [azure-mcp, filesystem, observability].
meta:
  version: '1.0.0'
  author: 'cascade-ai'
  category: 'tenant-config'

# Tenant Information
tenant:
  name: 'Agency Client'
  tenantId: 'agency-client'
  domain: 'client.agency.com'
  type: 'whitelabel'
  tier: 'partner'

# Infrastructure Configuration
infrastructure:
  location: 'eastus'
  resourceGroup: 'agency-client-rg'
  appServicePlan:
    name: 'agency-client-asp'
    sku: 'Standard_D3s_v3'
    capacity: 2
  storage:
    name: 'agencyclientstorage'
    sku: 'Standard_LRS'
  keyVault:
    name: 'agency-client-kv'
    sku: 'premium'
  cdn:
    provider: 'azure-cdn'
    profile: 'agency-client-cdn'

# Database Configuration
database:
  name: 'marketing_websites_whitelabel'
  isolationStrategy: 'databasePerTenant'
  schema: 'agency_client'
  seedData: true
  backupPolicy:
    retention: 60
    frequency: 'daily'
    geoRedundant: true

# Domain Configuration
domain:
  type: 'whitelabel'
  customDomain: 'client.agency.com'
  ssl:
    provider: 'digicert'
    autoRenewal: true
    wildcard: true
  dns:
    managed: false
    records:
      - type: 'A'
        name: '@'
        value: '192.168.1.1'
      - type: 'CNAME'
        name: 'www'
        value: 'client.agency.com'
      - type: 'MX'
        name: '@'
        value: 'mail.client.agency.com'

# White-Label Configuration
whiteLabel:
  branding:
    removeReferences: true
    customFooter: true
    customEmail: true
    customSupport: true
    customDomain: true
  agency:
    name: 'Digital Agency'
    domain: 'agency.com'
    supportEmail: 'support@agency.com'
    phone: '+1-555-0123'
    logo: '/assets/agency-logo.png'
  client:
    name: 'Agency Client'
    domain: 'client.agency.com'
    supportEmail: 'support@client.agency.com'
    phone: '+1-555-0456'
    logo: '/assets/client-logo.png'

# Security Configuration
security:
  authentication:
    providers: ['azure-ad', 'saml']
    sso: true
    mfa: 'conditional'
    saml:
      entityId: 'agency-client'
      ssoUrl: 'https://login.client.agency.com'
      certificate: '{{SAML_CERTIFICATE}}'
  authorization:
    model: 'rbac'
    roles: ['super-admin', 'admin', 'manager', 'editor', 'viewer']
    agencyRoles: ['agency-admin', 'agency-manager']
  encryption:
    atRest: 'AES-256'
    inTransit: 'TLS-1.3'
    keyManagement: 'azure-key-vault'
    keyRotation: 'quarterly'
  compliance:
    gdpr: true
    ccpa: true
    auditLogging: true
    dataRetention: 1095

# Content Configuration
content:
  branding:
    theme: 'custom'
    logo: '/assets/client-logo.png'
    favicon: '/assets/favicon.ico'
    colors:
      primary: '#2c3e50'
      secondary: '#95a5a6'
      accent: '#e74c3c'
    fonts:
      primary: 'Montserrat'
      secondary: 'Lato'
    customCSS: '/assets/custom.css'
    customJS: '/assets/custom.js'
  pages:
    - 'home'
    - 'about'
    - 'services'
    - 'portfolio'
    - 'team'
    - 'blog'
    - 'contact'
  navigation:
    structure: 'custom'
    customTemplate: '/templates/navigation.html'
    menus:
      - name: 'main'
        items: ['home', 'about', 'services', 'portfolio', 'team', 'blog', 'contact']
  customComponents:
    - 'custom-hero'
    - 'portfolio-grid'
    - 'team-section'
    - 'testimonials'
    - 'contact-form'
  templates:
    header: '/templates/header.html'
    footer: '/templates/footer.html'
    layout: '/templates/layout.html'

# Integration Configuration
integrations:
  analytics:
    provider: 'google-analytics-4'
    trackingId: 'GA-XXXXXXXXX'
    customDimensions:
      - name: 'agency_client'
        value: 'agency-client'
      - name: 'whitelabel_brand'
        value: 'client'
  crm:
    provider: 'hubspot'
    apiKey: 'REDACTED'
    agencyApiKey: 'REDACTED'
  email:
    provider: 'sendgrid'
    apiKey: 'REDACTED'
    fromEmail: 'noreply@client.agency.com'
    replyTo: 'support@client.agency.com'
  support:
    provider: 'zendesk'
    apiKey: 'REDACTED'
    agencyApiKey: 'REDACTED'
    branding: 'client'

# Agency Configuration
agency:
  management:
    dashboard: true
    clientAccess: true
    billing: true
    reporting: true
  features:
    clientManagement: true
    whiteLabeling: true
    customBranding: true
    multiTenant: true
    analytics: true
    support: true
  billing:
    model: 'per-client'
    currency: 'USD'
    invoicing: 'monthly'
    paymentMethod: 'stripe'

# Monitoring Configuration
monitoring:
  alerts:
    enabled: true
    channels: ['email', 'slack']
    agencyChannels: ['agency-email', 'agency-slack']
  metrics:
    performance: true
    availability: true
    security: true
    business: true
    agencyMetrics: true
  logging:
    level: 'info'
    destinations: ['application-insights']
    agencyDestinations: ['agency-log-analytics']
  dashboards:
    - name: 'client-overview'
      widgets: ['visitors', 'leads', 'conversions']
    - name: 'agency-overview'
      widgets: ['client-performance', 'revenue', 'support-tickets']

# Feature Flags
features:
  analytics: true
  contactForm: true
  blog: true
  ecommerce: false
  customDomain: true
  sso: true
  apiAccess: true
  whiteLabel: true
  agencyManagement: true
  clientBranding: true
  customTemplates: true
  agencyAnalytics: true
  multiLanguage: false
  advancedSecurity: true
  customIntegrations: true
```

## Onboarding Workflow Templates

### 1. Standard Onboarding Workflow

```markdown
# Standard Tenant Onboarding Workflow

## Phase 1: Initial Setup (Days 1-2)

### 1.1 Tenant Registration

- [ ] Collect tenant information
- [ ] Generate tenant ID
- [ ] Create tenant record
- [ ] Send welcome email

### 1.2 Infrastructure Provisioning

- [ ] Create resource group
- [ ] Provision app service
- [ ] Setup storage account
- [ ] Configure key vault
- [ ] Validate infrastructure

### 1.3 Database Setup

- [ ] Create tenant schema
- [ ] Apply RLS policies
- [ ] Seed initial data
- [ ] Create user accounts
- [ ] Test database connectivity

## Phase 2: Configuration (Days 3-4)

### 2.1 Domain Configuration

- [ ] Configure subdomain
- [ ] Setup SSL certificate
- [ ] Configure DNS records
- [ ] Validate domain access

### 2.2 Security Setup

- [ ] Configure authentication
- [ ] Setup authorization policies
- [ ] Configure encryption
- [ ] Enable audit logging

### 2.3 Content Initialization

- [ ] Apply branding theme
- [ ] Setup initial pages
- [ ] Configure navigation
- [ ] Upload assets

## Phase 3: Integration (Days 5-6)

### 3.1 Third-Party Integrations

- [ ] Setup analytics
- [ ] Configure CRM
- [ ] Setup email service
- [ ] Test integrations

### 3.2 Monitoring Setup

- [ ] Configure monitoring
- [ ] Setup alerts
- [ ] Create dashboards
- [ ] Test notifications

## Phase 4: Validation (Day 7)

### 4.1 Functional Testing

- [ ] Test all pages
- [ ] Test user authentication
- [ ] Test data access
- [ ] Test integrations

### 4.2 Performance Testing

- [ ] Load testing
- [ ] Performance benchmarks
- [ ] Security testing
- [ ] Accessibility testing

## Phase 5: Activation (Day 8)

### 5.1 Final Activation

- [ ] Enable tenant
- [ ] Send activation email
- [ ] Schedule follow-up
- [ ] Archive setup data

### 5.2 Handover

- [ ] Provide documentation
- [ ] Conduct training session
- [ ] Setup support channel
- [ ] Schedule review meeting
```

### 2. Enterprise Onboarding Workflow

```markdown
# Enterprise Tenant Onboarding Workflow

## Phase 1: Discovery (Days 1-3)

### 1.1 Requirements Gathering

- [ ] Conduct discovery workshop
- [ ] Document technical requirements
- [ ] Identify integration needs
- [ ] Assess security requirements
- [ ] Define success criteria

### 1.2 Solution Design

- [ ] Create architecture diagram
- [ ] Design integration patterns
- [ ] Define security policies
- [ ] Plan migration strategy
- [ ] Estimate timeline and costs

### 1.3 Contract Finalization

- [ ] Review SLA requirements
- [ ] Define support levels
- [ ] Establish billing terms
- [ ] Sign contracts
- [ ] Assign project team

## Phase 2: Foundation (Days 4-10)

### 2.1 Infrastructure Setup

- [ ] Provision enterprise infrastructure
- [ ] Configure high availability
- [ ] Setup disaster recovery
- [ ] Implement security hardening
- [ ] Configure monitoring

### 2.2 Database Architecture

- [ ] Design database schema
- [ ] Implement isolation strategy
- [ ] Setup replication
- [ ] Configure backup strategy
- [ ] Optimize performance

### 2.3 Security Implementation

- [ ] Configure SSO/SAML
- [ ] Setup MFA policies
- [ ] Implement RBAC
- [ ] Configure encryption
- [ ] Setup compliance monitoring

## Phase 3: Integration (Days 11-20)

### 3.1 Core Integrations

- [ ] Setup CRM integration
- [ ] Configure marketing automation
- [ ] Implement analytics tracking
- [ ] Setup email services
- [ ] Configure collaboration tools

### 3.2 Custom Development

- [ ] Implement custom components
- [ ] Develop custom workflows
- [ ] Create custom reports
- [ ] Build custom integrations
- [ ] Test custom functionality

### 3.3 Data Migration

- [ ] Plan data migration
- [ ] Extract existing data
- [ ] Transform data format
- [ ] Load data to new system
- [ ] Validate data integrity

## Phase 4: Testing (Days 21-25)

### 4.1 Comprehensive Testing

- [ ] Functional testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Integration testing
- [ ] User acceptance testing

### 4.2 Load Testing

- [ ] Simulate peak load
- [ ] Test scalability
- [ ] Validate performance
- [ ] Monitor resources
- [ ] Optimize bottlenecks

### 4.3 Security Validation

- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Compliance validation
- [ ] Security audit
- [ ] Remediation planning

## Phase 5: Deployment (Days 26-30)

### 5.1 Production Deployment

- [ ] Deploy to production
- [ ] Configure production settings
- [ ] Setup production monitoring
- [ ] Enable production alerts
- [ ] Validate production system

### 5.2 Training and Documentation

- [ ] Create user documentation
- [ ] Conduct admin training
- [ ] Provide user training
- [ ] Create support documentation
- [ ] Setup knowledge base

### 5.3 Go-Live Support

- [ ] Provide go-live support
- [ ] Monitor system performance
- [ ] Address immediate issues
- [ ] Collect user feedback
- [ ] Optimize system

## Phase 6: Optimization (Days 31-45)

### 6.1 Performance Optimization

- [ ] Monitor performance metrics
- [ ] Identify optimization opportunities
- [ ] Implement performance improvements
- [ ] Validate improvements
- [ ] Document optimizations

### 6.2 User Adoption

- [ ] Monitor user adoption
- [ ] Provide additional training
- [ ] Address user concerns
- [ ] Optimize user experience
- [ ] Gather feedback

### 6.3 Continuous Improvement

- [ ] Review system performance
- [ ] Identify improvement opportunities
- [ ] Plan enhancements
- [ ] Implement improvements
- [ ] Measure impact
```

## Validation Checklists

### 1. Infrastructure Validation Checklist

```markdown
# Infrastructure Validation Checklist

## Resource Group Validation

- [ ] Resource group exists
- [ ] Resource group has correct tags
- [ ] Resource group in correct location
- [ ] Resource group access permissions correct

## App Service Validation

- [ ] App service provisioned successfully
- [ ] App service plan correct SKU
- [ ] App service scaling configured
- [ ] App service settings correct
- [ ] App service deployment slots configured
- [ ] App service backup configured

## Storage Validation

- [ ] Storage account created
- [ ] Storage account SKU correct
- [ ] Storage account replication configured
- [ ] Storage account access configured
- [ ] Storage account monitoring enabled

## Key Vault Validation

- [ ] Key vault created
- [ ] Key vault access policies configured
- [ ] Secrets stored in key vault
- [ ] Key vault logging enabled
- [ ] Key vault backup configured

## Network Validation

- [ ] Network configuration correct
- [ ] Firewall rules configured
- [ ] Load balancer configured
- [ ] CDN configured
- [ ] DNS records configured

## Monitoring Validation

- [ ] Application Insights configured
- [ ] Log Analytics workspace created
- [ ] Alert rules configured
- [ ] Dashboards created
- [ ] Notification channels configured
```

### 2. Security Validation Checklist

```markdown
# Security Validation Checklist

## Authentication Validation

- [ ] Authentication providers configured
- [ ] SSO/SAML configuration correct
- [ ] MFA policies applied
- [ ] Token validation working
- [ ] Session management configured

## Authorization Validation

- [ ] RBAC policies configured
- [ ] Role assignments correct
- [ ] Permission checks working
- [ ] Access control validated
- [ ] Privilege escalation prevented

## Encryption Validation

- [ ] Data at rest encrypted
- [ ] Data in transit encrypted
- [ ] Key management configured
- [ ] Key rotation working
- [ ] Certificate management configured

## Compliance Validation

- [ ] GDPR compliance validated
- [ ] CCPA compliance validated
- [ ] Audit logging enabled
- [ ] Data retention policies applied
- [ ] Privacy controls implemented

## Security Monitoring

- [ ] Security alerts configured
- [ ] Threat detection enabled
- [ ] Vulnerability scanning configured
- [ ] Security dashboards active
- [ ] Incident response procedures defined
```

### 3. Content Validation Checklist

```markdown
# Content Validation Checklist

## Branding Validation

- [ ] Logo uploaded and displayed
- [ ] Color scheme applied correctly
- [ ] Typography configured
- [ ] Custom CSS loaded
- [ ] Responsive design working

## Page Validation

- [ ] All pages accessible
- [ ] Page content correct
- [ ] Page metadata configured
- [ ] Page SEO optimized
- [ ] Page performance acceptable

## Navigation Validation

- [ ] Navigation structure correct
- [ ] Menu items working
- [ ] Breadcrumbs working
- [ ] Search functionality working
- [ ] Footer links working

## Form Validation

- [ ] Contact forms working
- [ ] Form validation working
- [ ] Form submission working
- [ ] Email notifications sent
- [ ] Form data stored correctly

## Asset Validation

- [ ] Images loading correctly
- [ ] Videos playing correctly
- [ ] Documents accessible
- [ ] Asset optimization working
- [ ] Asset CDN configured
```

## Error Handling Templates

### 1. Common Error Scenarios

```typescript
// Error handling templates for tenant setup
interface TenantSetupError {
  type: 'infrastructure' | 'database' | 'domain' | 'security' | 'content';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  resolution: string;
  prevention: string;
}

const errorTemplates: Record<string, TenantSetupError> = {
  'infrastructure-provisioning-failed': {
    type: 'infrastructure',
    severity: 'critical',
    message: 'Failed to provision infrastructure resources',
    resolution: 'Check Azure subscription limits and permissions',
    prevention: 'Validate subscription capacity before provisioning',
  },

  'database-connection-failed': {
    type: 'database',
    severity: 'critical',
    message: 'Failed to connect to tenant database',
    resolution: 'Verify database credentials and network connectivity',
    prevention: 'Test database connection before schema creation',
  },

  'domain-validation-failed': {
    type: 'domain',
    severity: 'high',
    message: 'Domain validation failed',
    resolution: 'Check DNS configuration and SSL certificate',
    prevention: 'Verify domain ownership before configuration',
  },

  'authentication-configuration-failed': {
    type: 'security',
    severity: 'high',
    message: 'Failed to configure authentication providers',
    resolution: 'Verify provider credentials and configuration',
    prevention: 'Test provider configuration before applying',
  },

  'content-upload-failed': {
    type: 'content',
    severity: 'medium',
    message: 'Failed to upload content assets',
    resolution: 'Check file formats and storage permissions',
    prevention: 'Validate file formats and sizes before upload',
  },
};
```

### 2. Recovery Procedures

```typescript
// Recovery procedure templates
interface RecoveryProcedure {
  name: string;
  triggers: string[];
  steps: RecoveryStep[];
  rollback: RollbackStep[];
  verification: VerificationStep[];
}

const recoveryProcedures: RecoveryProcedure[] = [
  {
    name: 'infrastructure-failure-recovery',
    triggers: ['resource-creation-failed', 'quota-exceeded', 'permission-denied'],
    steps: [
      { name: 'diagnose-issue', action: 'check-azure-portal', timeout: 300000 },
      { name: 'resolve-quota', action: 'request-quota-increase', timeout: 1800000 },
      { name: 'retry-provisioning', action: 're-run-provisioning', timeout: 600000 },
    ],
    rollback: [{ name: 'cleanup-resources', action: 'delete-partial-resources', timeout: 300000 }],
    verification: [
      { name: 'validate-resources', action: 'check-resource-existence', timeout: 60000 },
    ],
  },

  {
    name: 'database-failure-recovery',
    triggers: ['connection-failed', 'schema-creation-failed', 'rls-policy-failed'],
    steps: [
      { name: 'check-connectivity', action: 'test-database-connection', timeout: 300000 },
      { name: 'repair-schema', action: 'repair-database-schema', timeout: 600000 },
      { name: 'reapply-policies', action: 'reapply-rls-policies', timeout: 300000 },
    ],
    rollback: [{ name: 'cleanup-schema', action: 'drop-partial-schema', timeout: 300000 }],
    verification: [
      { name: 'test-database-operations', action: 'run-database-tests', timeout: 300000 },
    ],
  },
];
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

# internal-developer-portal-patterns.md

# Internal Developer Portal Patterns and Best Practices

## Overview

Internal Developer Portals (IDPs) have become the cornerstone of modern platform engineering, providing developers with self-service access to tools, resources, and golden paths. In 2026, IDPs are evolving from simple service catalogs to comprehensive developer experience platforms that combine automation, guardrails, and production insights.

## Platform Engineering Evolution in 2026

### Cultural Foundation

**Culture eats tools for breakfast** - Tools solve nothing without shared language, product mindset, and adoption focus. Platform engineering teams fail when they treat tool installation as the goal instead of designing experiences around day-to-day outcomes and golden paths.

Key cultural principles:

- **Customer-centricity**: Keep developers at the forefront of all platform decisions
- **Product thinking**: Design internal products that developers love and actually use
- **Golden paths focus**: Streamline workflows rather than accumulate disconnected tools
- **Shared language**: Establish common terminology that resonates with platform users

### Three-Tier Platform Architecture

#### Backend Orchestration: The Unifying API

The backend layer wires infrastructure, workloads, and workflows together under a single set of endpoints.

**Implementation Options:**

- **Self-built APIs**: Custom orchestration layers
- **Platform orchestrators**: Humanitec, Kratix
- **PaaS solutions**: Heroku, Laravel Cloud

**Key Insight**: This layer provides the glue that ties your entire software development lifecycle together. Without it, you're just accumulating disconnected tools.

#### Frontend Interfaces and Delivery Automation

The frontend determines how developers consume platform capabilities.

**Interface Types:**

- **Developer portals**: Backstage, custom portals
- **CLI interfaces**: Command-line tools
- **Code-based interactions**: Repository-triggered workflows
- **GitOps workflows**: Single source of truth in repositories

**Delivery Layer**: Translates interface actions into backend outcomes through GitOps workflows and CI/CD pipelines.

#### Non-Negotiable Foundation: Table Stakes for 2026

##### Kubernetes and Infrastructure as Code (IaC)

- **Kubernetes**: Lingua franca of cloud-native workload and container orchestration
- **Terraform/OpenTofu**: Infrastructure as code foundation supporting "everything as code" philosophy

These are table stakes. Every platform engineer should know some level of Kubernetes and Terraform.

## IDP Core Components

### 1. Service Catalog

#### Self-Service Resource Provisioning

```yaml
# service-catalog.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: database-service
  description: 'Managed PostgreSQL database'
spec:
  type: service
  lifecycle: experimental
  owner: platform-team
  provides:
    - type: database
      target: postgresql
  parameters:
    - name: instance_size
      type: enum
      enum: [small, medium, large]
      default: medium
    - name: backup_retention
      type: number
      default: 30
      unit: days
```

#### Template-Based Provisioning

```javascript
// templates/database-template.js
const databaseTemplate = {
  name: 'postgresql-database',
  description: 'Managed PostgreSQL database with automated backups',

  parameters: {
    instance_size: {
      type: 'choice',
      choices: ['small', 'medium', 'large'],
      default: 'medium',
      description: 'Database instance size',
    },
    backup_retention: {
      type: 'number',
      default: 30,
      min: 7,
      max: 90,
      description: 'Backup retention period in days',
    },
  },

  resources: [
    {
      type: 'aws_rds_instance',
      properties: {
        instance_class:
          '${instance_size === "small" ? "db.t3.micro" : instance_size === "medium" ? "db.t3.medium" : "db.t3.large"}',
        backup_retention_period: '${backup_retention}',
        storage_encrypted: true,
        deletion_protection: false,
      },
    },
  ],

  post_provision: ['create-database-user', 'configure-backup', 'setup-monitoring'],
};
```

### 2. Golden Paths Integration

#### Developer Self-Service

```typescript
// golden-paths/next-app-service.ts
export class NextAppService {
  constructor(private platformClient: PlatformClient) {}

  async createNextApp(options: NextAppOptions): Promise<NextAppResult> {
    // 1. Validate input
    this.validateOptions(options);

    // 2. Provision infrastructure
    const infra = await this.provisionInfrastructure(options);

    // 3. Setup CI/CD pipeline
    const pipeline = await this.setupPipeline(infra, options);

    // 4. Configure monitoring
    await this.setupMonitoring(infra);

    // 5. Generate access credentials
    const credentials = await this.generateCredentials(infra);

    return {
      infra,
      pipeline,
      monitoring: infra.monitoringUrl,
      credentials,
    };
  }

  private validateOptions(options: NextAppOptions) {
    if (!options.name || !this.isValidName(options.name)) {
      throw new Error('Invalid application name');
    }

    if (options.environment && !['dev', 'staging', 'prod'].includes(options.environment)) {
      throw new Error('Invalid environment');
    }
  }

  private async provisionInfrastructure(options: NextAppOptions) {
    return await this.platformClient.provision({
      template: 'nextjs-app',
      parameters: {
        appName: options.name,
        environment: options.environment || 'dev',
        domain: options.domain,
        useTypeScript: options.useTypeScript ?? true,
        useTailwind: options.useTailwind ?? false,
      },
    });
  }
}
```

#### Automated Compliance and Guardrails

```yaml
# compliance/policies.yaml
policies:
  - name: 'security-scan-required'
    description: 'All applications must pass security scanning'
    applies_to: ['nextjs-app', 'api-service']
    checks:
      - type: 'security-sanner'
        provider: 'snyk'
        threshold: 'no-high-vulnerabilities'
    actions:
      - block_deployment: true
      - notify_security_team: true

  - name: 'performance-budget'
    description: 'Applications must meet performance requirements'
    applies_to: ['web-app']
    checks:
      - type: 'lighthouse'
        threshold:
          performance: '> 90'
          accessibility: '> 95'
          best_practices: '> 90'
    actions:
      - warn_deployment: true
      - suggest_optimizations: true
```

### 3. Developer Experience (DX) Features

#### Interactive Documentation

```typescript
// docs/interactive-docs.tsx
export const InteractiveDocs = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <div className="docs-container">
      <TemplateSelector
        onSelection={setSelectedTemplate}
        templates={getAvailableTemplates()}
      />

      {selectedTemplate && (
        <InteractiveGuide
          template={selectedTemplate}
          steps={getTemplateSteps(selectedTemplate)}
        />
      )}

      <CodeExamples
        template={selectedTemplate}
        language="typescript"
      />
    </div>
  );
};
```

#### Real-Time Status and Monitoring

```typescript
// monitoring/portal-dashboard.tsx
export const PortalDashboard = () => {
  const { data: services, loading } = useQuery('services', () =>
    platformClient.getServices()
  );

  const { data: metrics } = useQuery('metrics', () =>
    platformClient.getMetrics()
  );

  return (
    <Dashboard>
      <ServiceStatusGrid services={services} />
      <PerformanceMetrics metrics={metrics} />
      <AlertPanel />
      <UsageAnalytics />
    </Dashboard>
  );
};
```

## Implementation Patterns

### 1. Plugin Architecture

#### Extensible Plugin System

```typescript
// plugins/plugin-interface.ts
export interface PortalPlugin {
  name: string;
  version: string;
  description: string;

  initialize(context: PortalContext): Promise<void>;
  destroy(): Promise<void>;

  getRoutes(): Route[];
  getComponents(): Component[];
  getServices(): Service[];
}

// plugins/backstage-plugin.ts
export class BackstagePlugin implements PortalPlugin {
  name = 'backstage-integration';
  version = '1.0.0';
  description = 'Integrate with Backstage portal framework';

  async initialize(context: PortalContext) {
    // Connect to Backstage API
    this.backstageClient = new BackstageClient(context.config.backstage);

    // Register services
    context.services.register(this.backstageClient);

    // Setup event handlers
    context.events.on('service.created', this.handleServiceCreated);
  }

  getRoutes(): Route[] {
    return [
      {
        path: '/backstage',
        component: BackstageView,
        children: [
          { path: '/catalog', component: CatalogView },
          { path: '/docs', component: DocsView },
        ],
      },
    ];
  }

  getServices(): Service[] {
    return [this.backstageClient.catalogService, this.backstageClient.docsService];
  }
}
```

### 2. API Gateway Pattern

#### Unified API Surface

```typescript
// api/gateway.ts
export class PortalGateway {
  private plugins = new Map<string, PortalPlugin>();
  private middleware: Middleware[] = [];

  constructor() {
    this.setupDefaultMiddleware();
  }

  registerPlugin(plugin: PortalPlugin) {
    this.plugins.set(plugin.name, plugin);
  }

  async initialize() {
    const context = this.createContext();

    // Initialize all plugins
    for (const plugin of this.plugins.values()) {
      await plugin.initialize(context);
    }
  }

  async handleRequest(request: Request): Promise<Response> {
    // Apply middleware
    for (const middleware of this.middleware) {
      request = await middleware(request);
    }

    // Route to appropriate plugin
    const route = this.matchRoute(request.url);
    const plugin = this.getPluginForRoute(route);

    if (plugin) {
      return plugin.handleRequest(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  private setupDefaultMiddleware() {
    this.middleware.push(
      new AuthenticationMiddleware(),
      new AuthorizationMiddleware(),
      new RateLimitingMiddleware(),
      new LoggingMiddleware()
    );
  }
}
```

### 3. Configuration Management

#### Centralized Configuration

```typescript
// config/portal-config.ts
export interface PortalConfig {
  auth: {
    provider: 'oauth' | 'saml' | 'ldap';
    issuer: string;
    clientId: string;
    scopes: string[];
  };

  plugins: PluginConfig[];

  features: {
    selfService: boolean;
    goldenPaths: boolean;
    monitoring: boolean;
    analytics: boolean;
  };

  integrations: {
    backstage?: BackstageConfig;
    jenkins?: JenkinsConfig;
    kubernetes?: KubernetesConfig;
    monitoring?: MonitoringConfig;
  };
}

// config/config-loader.ts
export class ConfigLoader {
  static async load(): Promise<PortalConfig> {
    const configSources = [
      'config/default.yaml',
      'config/production.yaml',
      'config/local.yaml',
      process.env.PORTAL_CONFIG,
    ];

    let config = {};

    for (const source of configSources) {
      const partialConfig = await this.loadConfigSource(source);
      config = this.mergeConfigs(config, partialConfig);
    }

    return this.validateConfig(config);
  }

  private static async loadConfigSource(source: string): Promise<any> {
    if (source.startsWith('config/')) {
      return await this.loadFileConfig(source);
    } else if (source.startsWith('process.env.')) {
      return this.loadEnvConfig(source);
    }
    return {};
  }
}
```

## Best Practices

### 1. Developer-Centric Design

#### User Experience First

```typescript
// ux/developer-journey.ts
export class DeveloperJourney {
  static mapJourney(task: string): JourneyStep[] {
    const journeys = {
      'create-app': [
        { step: 'choose-template', title: 'Choose template', duration: 30 },
        { step: 'configure-options', title: 'Configure options', duration: 120 },
        { step: 'provision-resources', title: 'Provision resources', duration: 300 },
        { step: 'setup-ci-cd', title: 'Setup CI/CD', duration: 180 },
        { step: 'access-resources', title: 'Get access credentials', duration: 30 },
      ],
      'deploy-app': [
        { step: 'select-environment', title: 'Select environment', duration: 15 },
        { step: 'run-tests', title: 'Run automated tests', duration: 120 },
        { step: 'deploy', title: 'Deploy application', duration: 60 },
        { step: 'verify-deployment', title: 'Verify deployment', duration: 45 },
      ],
    };

    return journeys[task] || [];
  }

  static optimizeJourney(journey: JourneyStep[]): OptimizedJourney {
    // Identify bottlenecks
    const bottlenecks = journey.filter((step) => step.duration > 180);

    // Suggest optimizations
    const optimizations = bottlenecks.map((step) => ({
      step: step.step,
      currentDuration: step.duration,
      suggestions: this.getOptimizationSuggestions(step),
    }));

    return {
      originalJourney: journey,
      bottlenecks,
      optimizations,
      estimatedSavings: this.calculateSavings(optimizations),
    };
  }
}
```

#### Progressive Disclosure

```typescript
// ux/progressive-disclosure.tsx
export const ProgressiveDisclosure = ({
  children,
  complexity = 'basic'
}: ProgressiveDisclosureProps) => {
  const [revealedSections, setRevealedSections] = useState(new Set());

  const sections = {
    basic: ['overview', 'quick-start'],
    intermediate: ['configuration', 'advanced-options'],
    expert: ['customization', 'troubleshooting']
  };

  const toggleSection = (section: string) => {
    const newRevealed = new Set(revealedSections);
    if (newRevealed.has(section)) {
      newRevealed.delete(section);
    } else {
      newRevealed.add(section);
    }
    setRevealedSections(newRevealed);
  };

  return (
    <div className="progressive-disclosure">
      {sections[complexity].map(section => (
        <DisclosureSection
          key={section}
          section={section}
          isRevealed={revealedSections.has(section)}
          onToggle={toggleSection}
        >
          {children[section]}
        </DisclosureSection>
      ))}
    </div>
  );
};
```

### 2. Automation and Self-Service

#### Intelligent Resource Management

```typescript
// automation/resource-manager.ts
export class ResourceManager {
  private resourcePool: ResourcePool;
  private costOptimizer: CostOptimizer;
  private complianceChecker: ComplianceChecker;

  async provisionResource(request: ResourceRequest): Promise<Resource> {
    // 1. Validate request
    await this.validateRequest(request);

    // 2. Check compliance
    await this.complianceChecker.validate(request);

    // 3. Optimize for cost
    const optimizedRequest = await this.costOptimizer.optimize(request);

    // 4. Provision from pool
    const resource = await this.resourcePool.allocate(optimizedRequest);

    // 5. Setup monitoring
    await this.setupMonitoring(resource);

    return resource;
  }

  async autoScaleResources() {
    const metrics = await this.getUsageMetrics();
    const recommendations = await this.generateScalingRecommendations(metrics);

    for (const recommendation of recommendations) {
      if (recommendation.confidence > 0.8) {
        await this.applyScaling(recommendation);
      }
    }
  }

  private async generateScalingRecommendations(
    metrics: UsageMetrics
  ): Promise<ScalingRecommendation[]> {
    return [
      ...this.analyzeCPUUsage(metrics),
      ...this.analyzeMemoryUsage(metrics),
      ...this.analyzeNetworkUsage(metrics),
      ...this.analyzeDatabaseConnections(metrics),
    ];
  }
}
```

### 3. Observability and Analytics

#### Comprehensive Monitoring

```typescript
// monitoring/portal-monitoring.ts
export class PortalMonitoring {
  private metrics: MetricsCollector;
  private alerts: AlertManager;
  private analytics: AnalyticsEngine;

  constructor() {
    this.setupMetrics();
    this.setupAlerts();
    this.setupAnalytics();
  }

  private setupMetrics() {
    // Portal usage metrics
    this.metrics.registerCounter('portal_requests_total', 'Total portal requests');
    this.metrics.registerHistogram('portal_request_duration', 'Portal request duration');
    this.metrics.registerGauge('active_users', 'Number of active users');

    // Service provisioning metrics
    this.metrics.registerCounter('services_provisioned_total', 'Total services provisioned');
    this.metrics.registerHistogram(
      'service_provisioning_duration',
      'Service provisioning duration'
    );
    this.metrics.registerCounter(
      'service_provisioning_errors_total',
      'Service provisioning errors'
    );

    // Developer experience metrics
    this.metrics.registerHistogram(
      'developer_journey_duration',
      'Developer journey completion time'
    );
    this.metrics.registerCounter('golden_path_adoption_total', 'Golden path adoption count');
  }

  trackDeveloperJourney(journey: DeveloperJourney) {
    this.metrics.histogram('developer_journey_duration', journey.duration, {
      task: journey.task,
      success: journey.success.toString(),
      user_id: journey.userId,
    });

    if (journey.success) {
      this.analytics.track('journey_completed', {
        task: journey.task,
        duration: journey.duration,
        steps: journey.steps.length,
      });
    }
  }

  async generateInsights(): Promise<PortalInsights> {
    const usage = await this.getUsageMetrics();
    const performance = await this.getPerformanceMetrics();
    const satisfaction = await this.getSatisfactionMetrics();

    return {
      usage: this.analyzeUsage(usage),
      performance: this.analyzePerformance(performance),
      satisfaction: this.analyzeSatisfaction(satisfaction),
      recommendations: this.generateRecommendations({ usage, performance, satisfaction }),
    };
  }
}
```

## Security and Compliance

### 1. Access Control

#### Role-Based Access Control (RBAC)

```typescript
// auth/rbac.ts
export class RBACManager {
  private roles = new Map<string, Role>();
  private permissions = new Map<string, Permission>();

  constructor() {
    this.setupDefaultRoles();
    this.setupDefaultPermissions();
  }

  hasPermission(user: User, permission: string, resource?: string): boolean {
    const userRoles = user.roles || [];

    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (role && role.permissions.includes(permission)) {
        // Check resource-specific permissions
        if (resource) {
          return this.checkResourcePermission(role, permission, resource);
        }
        return true;
      }
    }

    return false;
  }

  private setupDefaultRoles() {
    this.roles.set('admin', {
      name: 'admin',
      permissions: ['*'],
      description: 'Full administrative access',
    });

    this.roles.set('developer', {
      name: 'developer',
      permissions: [
        'service.create',
        'service.read',
        'service.update',
        'service.delete',
        'template.read',
        'catalog.read',
      ],
      description: 'Developer access to services and templates',
    });

    this.roles.set('viewer', {
      name: 'viewer',
      permissions: ['service.read', 'template.read', 'catalog.read'],
      description: 'Read-only access to services and templates',
    });
  }
}
```

### 2. Audit and Compliance

#### Audit Trail

```typescript
// audit/audit-logger.ts
export class AuditLogger {
  private auditLog: AuditLog;

  constructor() {
    this.auditLog = new DatabaseAuditLog();
  }

  async logAction(action: AuditAction): Promise<void> {
    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      user: action.user,
      action: action.type,
      resource: action.resource,
      details: action.details,
      ip: action.ip,
      userAgent: action.userAgent,
      sessionId: action.sessionId,
      result: action.result,
    };

    await this.auditLog.write(auditEntry);

    // Check for compliance violations
    await this.checkCompliance(auditEntry);
  }

  private async checkCompliance(entry: AuditEntry): Promise<void> {
    const violations = await this.complianceChecker.check(entry);

    if (violations.length > 0) {
      await this.alertManager.sendAlert({
        type: 'compliance_violation',
        violations,
        entry,
      });
    }
  }

  async generateComplianceReport(period: TimePeriod): Promise<ComplianceReport> {
    const entries = await this.auditLog.getEntries(period);

    return {
      period,
      totalActions: entries.length,
      actionsByType: this.groupActionsByType(entries),
      actionsByUser: this.groupActionsByUser(entries),
      violations: await this.identifyViolations(entries),
      recommendations: this.generateRecommendations(entries),
    };
  }
}
```

## Performance Optimization

### 1. Caching Strategy

#### Multi-Level Caching

```typescript
// cache/cache-manager.ts
export class CacheManager {
  private l1Cache: MemoryCache; // Application memory
  private l2Cache: RedisCache; // Distributed cache
  private l3Cache: DatabaseCache; // Persistent cache

  async get<T>(key: string): Promise<T | null> {
    // Try L1 cache first
    let value = await this.l1Cache.get<T>(key);
    if (value !== null) {
      return value;
    }

    // Try L2 cache
    value = await this.l2Cache.get<T>(key);
    if (value !== null) {
      // Promote to L1
      await this.l1Cache.set(key, value, this.getL1TTL(key));
      return value;
    }

    // Try L3 cache
    value = await this.l3Cache.get<T>(key);
    if (value !== null) {
      // Promote to L2 and L1
      await this.l2Cache.set(key, value, this.getL2TTL(key));
      await this.l1Cache.set(key, value, this.getL1TTL(key));
      return value;
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const l1TTL = ttl || this.getL1TTL(key);
    const l2TTL = ttl || this.getL2TTL(key);

    // Set in all cache levels
    await Promise.all([
      this.l1Cache.set(key, value, l1TTL),
      this.l2Cache.set(key, value, l2TTL),
      this.l3Cache.set(key, value, ttl),
    ]);
  }

  private getL1TTL(key: string): number {
    // Short TTL for frequently changing data
    if (key.startsWith('user:')) return 300; // 5 minutes
    if (key.startsWith('service:')) return 600; // 10 minutes
    return 1800; // 30 minutes default
  }

  private getL2TTL(key: string): number {
    // Longer TTL for distributed cache
    return this.getL1TTL(key) * 4;
  }
}
```

### 2. Performance Monitoring

#### Real-Time Performance Metrics

```typescript
// performance/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: MetricsCollector;
  private profiler: Profiler;

  constructor() {
    this.setupMetrics();
    this.setupProfiler();
  }

  async measurePageLoad(page: string): Promise<PageMetrics> {
    const startTime = performance.now();

    // Measure Core Web Vitals
    const vitals = await this.measureCoreWebVitals();

    // Measure custom metrics
    const customMetrics = await this.measureCustomMetrics(page);

    const endTime = performance.now();

    return {
      page,
      loadTime: endTime - startTime,
      vitals,
      customMetrics,
      timestamp: new Date().toISOString(),
    };
  }

  private async measureCoreWebVitals(): Promise<CoreWebVitals> {
    return {
      lcp: await this.measureLCP(),
      inp: await this.measureINP(),
      cls: await this.measureCLS(),
      fcp: await this.measureFCP(),
      ttfb: await this.measureTTFB(),
    };
  }

  private async measureLCP(): Promise<number> {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries.find((entry) => entry.name === 'largest-contentful-paint');
        if (lcpEntry) {
          resolve(lcpEntry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  }
}
```

## Integration Patterns

### 1. External Tool Integration

#### Backstage Integration

```typescript
// integrations/backstage.ts
export class BackstageIntegration {
  private client: BackstageClient;

  constructor(config: BackstageConfig) {
    this.client = new BackstageClient(config);
  }

  async syncCatalog(): Promise<void> {
    const entities = await this.client.getCatalogEntities();

    for (const entity of entities) {
      await this.syncEntity(entity);
    }
  }

  async syncEntity(entity: CatalogEntity): Promise<void> {
    // Map to internal format
    const internalEntity = this.mapToInternalFormat(entity);

    // Update local catalog
    await this.catalogService.update(internalEntity);

    // Trigger events
    await this.eventBus.emit('entity.updated', internalEntity);
  }

  private mapToInternalFormat(entity: CatalogEntity): InternalEntity {
    return {
      id: entity.metadata.name,
      type: entity.kind,
      name: entity.spec?.name || entity.metadata.name,
      description: entity.spec?.description,
      owner: entity.spec?.owner,
      tags: entity.metadata?.tags || [],
      links:
        entity.relations?.map((relation) => ({
          type: relation.type,
          target: relation.target,
        })) || [],
    };
  }
}
```

### 2. Multi-Cloud Support

#### Cloud Abstraction Layer

```typescript
// cloud/cloud-provider.ts
export interface CloudProvider {
  name: string;

  provisionInfrastructure(request: InfrastructureRequest): Promise<Infrastructure>;

  deleteInfrastructure(id: string): Promise<void>;

  getInfrastructureStatus(id: string): Promise<InfrastructureStatus>;

  getCosts(id: string): Promise<CostBreakdown>;
}

export class AWSProvider implements CloudProvider {
  name = 'aws';

  async provisionInfrastructure(request: InfrastructureRequest): Promise<Infrastructure> {
    const infra = await this.provisionAWSResources(request);

    return {
      id: infra.id,
      provider: this.name,
      type: request.type,
      status: 'provisioning',
      resources: infra.resources,
      endpoints: infra.endpoints,
      credentials: infra.credentials,
    };
  }

  private async provisionAWSResources(request: InfrastructureRequest): Promise<AWSInfrastructure> {
    const resources = [];

    // Provision VPC
    const vpc = await this.provisionVPC(request.vpcConfig);
    resources.push(vpc);

    // Provision subnets
    for (const subnetConfig of request.subnetConfigs) {
      const subnet = await this.provisionSubnet(vpc.id, subnetConfig);
      resources.push(subnet);
    }

    // Provision security groups
    const sg = await this.provisionSecurityGroup(vpc.id, request.securityConfig);
    resources.push(sg);

    // Provision compute resources
    if (request.compute) {
      const compute = await this.provisionCompute(vpc.id, sg.id, request.compute);
      resources.push(compute);
    }

    return {
      id: this.generateId(),
      resources,
    };
  }
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Platform Engineering Resources

- [Platform Engineering Community](https://platformengineering.org/)
- [Platform Engineering Tools 2026](https://platformengineering.org/blog/platform-engineering-tools-2026)
- [Golden Paths Guide](https://platformengineering.org/blog/what-are-golden-paths-a-guide-to-streamlining-developer-workflows)
- [Backstage Documentation](https://backstage.io/docs/)

### Developer Experience

- [Developer Experience Metrics](https://dx.dev/)
- [Internal Developer Portal Patterns](https://www.growin.com/blog/platform-engineering-2026/)
- [Platform Engineering Fundamentals](https://technori.com/2026/02/24320-platform-engineering-fundamentals-developer-self-service/gabriel/)

### Technical Documentation

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [OpenTofu Documentation](https://opentofu.org/docs/)
- [Humanitec Platform](https://humanitec.com/docs/)

### Security and Compliance

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/)
- [SOC 2 Compliance Guide](https://www.aicpa.org/soc2)
- [GDPR Compliance](https://gdpr.eu/)

### Performance and Monitoring

- [Core Web Vitals](https://web.dev/vitals/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)

## Testing

[Add content here]

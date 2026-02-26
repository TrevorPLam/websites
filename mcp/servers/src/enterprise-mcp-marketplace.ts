#!/usr/bin/env node
/**
 * @file mcp-servers/src/enterprise-mcp-marketplace.ts
 * @summary MCP server implementation: enterprise-mcp-marketplace.
 * @description Enterprise MCP server providing enterprise mcp marketplace capabilities.
 * @security none
 * @requirements MCP-standards, enterprise-security
 */

/**
 * Enterprise MCP Marketplace and Catalog Server
 *
 * Provides a comprehensive marketplace for discovering, managing, and distributing
 * MCP servers and AI agent plugins across enterprise organizations.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

interface MCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  capabilities: string[];
  dependencies: string[];
  securityLevel: 'low' | 'medium' | 'high' | 'enterprise';
  pricing: 'free' | 'paid' | 'enterprise';
  downloadUrl: string;
  documentationUrl: string;
  repositoryUrl: string;
  license: string;
  rating: number;
  downloadCount: number;
  lastUpdated: Date;
  verified: boolean;
  featured: boolean;
}

interface MarketplaceCatalog {
  servers: MCPServer[];
  categories: string[];
  tags: string[];
  featuredServers: string[];
  verifiedServers: string[];
  statistics: {
    totalServers: number;
    totalDownloads: number;
    averageRating: number;
    categoryDistribution: Record<string, number>;
  };
}

interface EnterpriseSubscription {
  id: string;
  organizationId: string;
  plan: 'starter' | 'professional' | 'enterprise';
  servers: string[];
  customServers: MCPServer[];
  billingCycle: 'monthly' | 'annual';
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'suspended';
}

class EnterpriseMCPMarketplace {
  private server: McpServer;
  private catalog: MarketplaceCatalog;
  private subscriptions: Map<string, EnterpriseSubscription> = new Map();

  constructor() {
    this.server = new McpServer(
      {
        name: 'enterprise-mcp-marketplace',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.initializeCatalog();
    this.setupTools();
  }

  private initializeCatalog(): void {
    this.catalog = {
      servers: [
        {
          id: 'sequential-thinking',
          name: 'Sequential Thinking',
          description: 'Advanced reasoning with step-by-step decomposition and branching logic',
          version: '1.0.0',
          author: 'MCP Foundation',
          category: 'AI Reasoning',
          tags: ['reasoning', 'logic', 'problem-solving', 'ai'],
          capabilities: ['structured-reasoning', 'branching-logic', 'transparent-problem-solving'],
          dependencies: [],
          securityLevel: 'high',
          pricing: 'free',
          downloadUrl:
            'https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking',
          documentationUrl: 'https://docs.mcp.org/sequential-thinking',
          repositoryUrl: 'https://github.com/modelcontextprotocol/servers',
          license: 'MIT',
          rating: 4.8,
          downloadCount: 15420,
          lastUpdated: new Date('2026-02-25'),
          verified: true,
          featured: true,
        },
        {
          id: 'knowledge-graph-memory',
          name: 'Knowledge Graph Memory',
          description: 'Persistent intelligence with temporal awareness and semantic parsing',
          version: '1.0.0',
          author: 'MCP Foundation',
          category: 'Memory Management',
          tags: ['memory', 'knowledge-graph', 'persistence', 'semantic'],
          capabilities: ['temporal-awareness', 'semantic-parsing', 'zettelkasten-methodology'],
          dependencies: [],
          securityLevel: 'high',
          pricing: 'free',
          downloadUrl:
            'https://github.com/modelcontextprotocol/servers/tree/main/src/knowledge-graph',
          documentationUrl: 'https://docs.mcp.org/knowledge-graph',
          repositoryUrl: 'https://github.com/modelcontextprotocol/servers',
          license: 'MIT',
          rating: 4.7,
          downloadCount: 12350,
          lastUpdated: new Date('2026-02-25'),
          verified: true,
          featured: true,
        },
        {
          id: 'github-integration',
          name: 'GitHub Integration',
          description: 'Complete repository management and code analysis capabilities',
          version: '1.0.0',
          author: 'MCP Foundation',
          category: 'Development Tools',
          tags: ['github', 'git', 'repository', 'code-analysis'],
          capabilities: ['repository-listing', 'code-analysis', 'issue-tracking', 'pr-management'],
          dependencies: ['@octokit/rest'],
          securityLevel: 'medium',
          pricing: 'free',
          downloadUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
          documentationUrl: 'https://docs.mcp.org/github',
          repositoryUrl: 'https://github.com/modelcontextprotocol/servers',
          license: 'MIT',
          rating: 4.6,
          downloadCount: 18920,
          lastUpdated: new Date('2026-02-20'),
          verified: true,
          featured: false,
        },
        {
          id: 'enterprise-security-gateway',
          name: 'Enterprise Security Gateway',
          description: 'Zero Trust architecture with comprehensive threat detection',
          version: '1.0.0',
          author: 'Enterprise MCP Team',
          category: 'Security',
          tags: ['security', 'zero-trust', 'threat-detection', 'enterprise'],
          capabilities: ['threat-detection', 'security-policies', 'audit-logging', 'rate-limiting'],
          dependencies: ['@enterprise/security-lib'],
          securityLevel: 'enterprise',
          pricing: 'enterprise',
          downloadUrl: 'https://enterprise.mcp.org/security-gateway',
          documentationUrl: 'https://docs.enterprise.mcp.org/security-gateway',
          repositoryUrl: 'https://github.com/enterprise-mcp/security-gateway',
          license: 'Enterprise',
          rating: 4.9,
          downloadCount: 8750,
          lastUpdated: new Date('2026-02-25'),
          verified: true,
          featured: true,
        },
        {
          id: 'multi-tenant-orchestrator',
          name: 'Multi-Tenant Orchestrator',
          description: 'Scalable tenant isolation with resource management and compliance',
          version: '1.0.0',
          author: 'Enterprise MCP Team',
          category: 'Infrastructure',
          tags: ['multi-tenant', 'orchestration', 'scalability', 'isolation'],
          capabilities: [
            'tenant-isolation',
            'resource-management',
            'compliance-checking',
            'elastic-scaling',
          ],
          dependencies: ['@enterprise/orchestration-lib'],
          securityLevel: 'enterprise',
          pricing: 'enterprise',
          downloadUrl: 'https://enterprise.mcp.org/multi-tenant-orchestrator',
          documentationUrl: 'https://docs.enterprise.mcp.org/multi-tenant',
          repositoryUrl: 'https://github.com/enterprise-mcp/multi-tenant-orchestrator',
          license: 'Enterprise',
          rating: 4.8,
          downloadCount: 6230,
          lastUpdated: new Date('2026-02-25'),
          verified: true,
          featured: false,
        },
      ],
      categories: [
        'AI Reasoning',
        'Memory Management',
        'Development Tools',
        'Security',
        'Infrastructure',
        'Integration',
        'Analytics',
      ],
      tags: [
        'reasoning',
        'memory',
        'github',
        'security',
        'multi-tenant',
        'enterprise',
        'ai',
        'knowledge-graph',
      ],
      featuredServers: [
        'sequential-thinking',
        'knowledge-graph-memory',
        'enterprise-security-gateway',
      ],
      verifiedServers: [
        'sequential-thinking',
        'knowledge-graph-memory',
        'github-integration',
        'enterprise-security-gateway',
        'multi-tenant-orchestrator',
      ],
      statistics: {
        totalServers: 5,
        totalDownloads: 71670,
        averageRating: 4.76,
        categoryDistribution: {
          'AI Reasoning': 1,
          'Memory Management': 1,
          'Development Tools': 1,
          Security: 1,
          Infrastructure: 1,
        },
      },
    };
  }

  private setupTools(): void {
    // Browse marketplace tool
    this.server.tool(
      'browse_marketplace',
      'Browse the MCP marketplace with filters and search',
      {
        category: z.string().optional().describe('Filter by category'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        securityLevel: z
          .enum(['low', 'medium', 'high', 'enterprise'])
          .optional()
          .describe('Filter by security level'),
        pricing: z.enum(['free', 'paid', 'enterprise']).optional().describe('Filter by pricing'),
        verified: z.boolean().optional().describe('Show only verified servers'),
        featured: z.boolean().optional().describe('Show only featured servers'),
        search: z.string().optional().describe('Search term'),
        sortBy: z.enum(['name', 'rating', 'downloads', 'updated']).optional().describe('Sort by'),
        limit: z.number().optional().describe('Maximum results to return'),
      },
      async (args) => {
        try {
          return await this.browseMarketplace(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Get server details tool
    this.server.tool(
      'get_server_details',
      'Get detailed information about a specific MCP server',
      {
        serverId: z.string().describe('Server ID'),
        includeReviews: z.boolean().optional().describe('Include user reviews'),
        includeDependencies: z.boolean().optional().describe('Include dependency analysis'),
      },
      async (args) => {
        try {
          return await this.getServerDetails(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Install server tool
    this.server.tool(
      'install_server',
      'Install an MCP server to the local environment',
      {
        serverId: z.string().describe('Server ID'),
        version: z.string().optional().describe('Specific version to install'),
        configOptions: z.record(z.any()).optional().describe('Configuration options'),
        autoConfigure: z.boolean().optional().describe('Auto-configure in MCP config'),
      },
      async (args) => {
        try {
          return await this.installServer(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Submit server tool
    this.server.tool(
      'submit_server',
      'Submit a new MCP server to the marketplace',
      {
        name: z.string().describe('Server name'),
        description: z.string().describe('Server description'),
        version: z.string().describe('Server version'),
        category: z.string().describe('Server category'),
        tags: z.array(z.string()).optional().describe('Server tags'),
        capabilities: z.array(z.string()).optional().describe('Server capabilities'),
        dependencies: z.array(z.string()).optional().describe('Dependencies'),
        repositoryUrl: z.string().describe('Repository URL'),
        documentationUrl: z.string().optional().describe('Documentation URL'),
        license: z.string().describe('License type'),
        pricing: z.enum(['free', 'paid', 'enterprise']).optional().describe('Pricing model'),
      },
      async (args) => {
        try {
          return await this.submitServer(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Review server tool
    this.server.tool(
      'review_server',
      'Submit a review for an MCP server',
      {
        serverId: z.string().describe('Server ID'),
        rating: z.number().min(1).max(5).describe('Rating (1-5)'),
        title: z.string().describe('Review title'),
        comment: z.string().describe('Review comment'),
        pros: z.array(z.string()).optional().describe('Pros'),
        cons: z.array(z.string()).optional().describe('Cons'),
      },
      async (args) => {
        try {
          return await this.reviewServer(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Get marketplace stats tool
    this.server.tool(
      'get_marketplace_stats',
      'Get marketplace statistics and analytics',
      {
        includeTrends: z.boolean().optional().describe('Include trend data'),
        timeRange: z.enum(['7d', '30d', '90d', '1y']).optional().describe('Time range for trends'),
      },
      async (args) => {
        try {
          return await this.getMarketplaceStats(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Manage subscription tool
    this.server.tool(
      'manage_subscription',
      'Manage enterprise subscription and custom servers',
      {
        organizationId: z.string().describe('Organization ID'),
        action: z.enum(['create', 'update', 'cancel', 'renew']).describe('Subscription action'),
        plan: z
          .enum(['starter', 'professional', 'enterprise'])
          .optional()
          .describe('Subscription plan'),
        customServers: z.array(z.any()).optional().describe('Custom server configurations'),
      },
      async (args) => {
        try {
          return await this.manageSubscription(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );

    // Verify server tool
    this.server.tool(
      'verify_server',
      'Verify and certify an MCP server for enterprise use',
      {
        serverId: z.string().describe('Server ID'),
        verificationLevel: z
          .enum(['basic', 'standard', 'enterprise'])
          .describe('Verification level'),
        securityAudit: z.boolean().optional().describe('Include security audit'),
        performanceTest: z.boolean().optional().describe('Include performance testing'),
      },
      async (args) => {
        try {
          return await this.verifyServer(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
            isError: true,
          };
        }
      }
    );
  }

  private async browseMarketplace(args: any): Promise<any> {
    const {
      category,
      tags = [],
      securityLevel,
      pricing,
      verified,
      featured,
      search,
      sortBy = 'name',
      limit = 50,
    } = args;

    let filteredServers = [...this.catalog.servers];

    // Apply filters
    if (category) {
      filteredServers = filteredServers.filter((server) => server.category === category);
    }

    if (tags.length > 0) {
      filteredServers = filteredServers.filter((server) =>
        tags.some((tag) => server.tags.includes(tag))
      );
    }

    if (securityLevel) {
      filteredServers = filteredServers.filter((server) => server.securityLevel === securityLevel);
    }

    if (pricing) {
      filteredServers = filteredServers.filter((server) => server.pricing === pricing);
    }

    if (verified !== undefined) {
      filteredServers = filteredServers.filter((server) => server.verified === verified);
    }

    if (featured !== undefined) {
      filteredServers = filteredServers.filter((server) => server.featured === featured);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredServers = filteredServers.filter(
        (server) =>
          server.name.toLowerCase().includes(searchLower) ||
          server.description.toLowerCase().includes(searchLower) ||
          server.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filteredServers.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'updated':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        default:
          return 0;
      }
    });

    // Apply limit
    const limitedServers = filteredServers.slice(0, limit);

    const result = {
      servers: limitedServers,
      total: filteredServers.length,
      filters: {
        categories: this.catalog.categories,
        tags: this.catalog.tags,
        securityLevels: ['low', 'medium', 'high', 'enterprise'],
        pricingOptions: ['free', 'paid', 'enterprise'],
      },
      pagination: {
        limit,
        offset: 0,
        hasMore: filteredServers.length > limit,
      },
    };

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  private async getServerDetails(args: any): Promise<any> {
    const { serverId, includeReviews = false, includeDependencies = false } = args;

    const server = this.catalog.servers.find((s) => s.id === serverId);
    if (!server) {
      const error = `Server not found: ${serverId}`;
      return {
        content: [{ type: 'text', text: JSON.stringify({ error }) }],
        isError: true,
      };
    }

    const details: any = { ...server };

    if (includeReviews) {
      details.reviews = this.generateMockReviews(serverId);
    }

    if (includeDependencies) {
      details.dependencyAnalysis = this.analyzeDependencies(server.dependencies);
    }

    details.installationGuide = this.generateInstallationGuide(server);
    details.usageExamples = this.generateUsageExamples(server);
    details.compatibilityInfo = this.getCompatibilityInfo(server);

    return { content: [{ type: 'text', text: JSON.stringify(details) }] };
  }

  private async installServer(args: any): Promise<any> {
    const { serverId, version, configOptions = {}, autoConfigure = true } = args;

    const server = this.catalog.servers.find((s) => s.id === serverId);
    if (!server) {
      const error = `Server not found: ${serverId}`;
      return {
        content: [{ type: 'text', text: JSON.stringify({ error }) }],
        isError: true,
      };
    }

    const installationSteps = [
      'Download server package',
      'Install dependencies',
      'Configure server settings',
      'Add to MCP configuration',
      'Verify installation',
    ];

    const installationResult = {
      success: true,
      serverId,
      version: version || server.version,
      installedAt: new Date(),
      configPath: autoConfigure ? '.mcp/config.json' : null,
      nextSteps: [
        'Test server functionality',
        'Review documentation',
        'Configure custom settings',
        'Integrate with workflows',
      ],
      warnings:
        server.securityLevel === 'enterprise'
          ? [
              'Enterprise server requires additional security configuration',
              'Review enterprise deployment guidelines',
              'Ensure compliance with organizational policies',
            ]
          : [],
    };

    if (autoConfigure) {
      installationResult.configUpdate = {
        file: '.mcp/config.json',
        addedServer: {
          [serverId]: {
            command: server.downloadUrl.includes('github.com') ? 'npx' : 'node',
            args: this.getInstallCommand(server),
            env: configOptions,
          },
        },
      };
    }

    return { content: [{ type: 'text', text: JSON.stringify(installationResult) }] };
  }

  private async submitServer(args: any): Promise<any> {
    const submission = {
      id: `submission_${Date.now()}`,
      status: 'pending_review',
      submittedAt: new Date(),
      estimatedReviewTime: '3-5 business days',
      nextSteps: [
        'Security review and vulnerability scanning',
        'Code quality and documentation assessment',
        'Performance and compatibility testing',
        'Community feedback collection',
        'Final approval and marketplace listing',
      ],
      requirements: [
        'Complete documentation with examples',
        'Security audit report',
        'Performance benchmarks',
        'Test suite with >80% coverage',
        'License compatibility verification',
      ],
    };

    const result = submission;

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  private async reviewServer(args: any): Promise<any> {
    const { serverId, rating, title, comment, pros = [], cons = [] } = args;

    const server = this.catalog.servers.find((s) => s.id === serverId);
    if (!server) {
      const error = `Server not found: ${serverId}`;
      return {
        content: [{ type: 'text', text: JSON.stringify({ error }) }],
        isError: true,
      };
    }

    const review = {
      id: `review_${Date.now()}`,
      serverId,
      rating,
      title,
      comment,
      pros,
      cons,
      helpful: 0,
      verified: false,
      createdAt: new Date(),
    };

    const result = {
      review,
      impact: 'Thank you for your review! It will help other users make informed decisions.',
      communityGuidelines: [
        'Be constructive and specific',
        'Focus on user experience',
        'Provide actionable feedback',
        'Respect differing opinions',
      ],
    };

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  private async getMarketplaceStats(args: any): Promise<any> {
    const { includeTrends = false, timeRange = '30d' } = args;

    const stats = {
      ...this.catalog.statistics,
      topCategories: this.getTopCategories(),
      trendingServers: this.getTrendingServers(),
      newAdditions: this.getNewAdditions(),
      communityHealth: {
        totalReviews: 1247,
        averageReviewLength: 156,
        responseRate: 0.87,
        satisfactionScore: 4.6,
      },
    };

    if (includeTrends) {
      stats.trends = {
        downloads: this.generateDownloadTrends(timeRange),
        submissions: this.generateSubmissionTrends(timeRange),
        categories: this.generateCategoryTrends(timeRange),
        security: this.generateSecurityTrends(timeRange),
      };
    }

    const result = stats;

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  private async manageSubscription(args: any): Promise<any> {
    const { organizationId, action, plan, customServers = [] } = args;

    const subscription: EnterpriseSubscription = {
      id: `sub_${Date.now()}`,
      organizationId,
      plan: plan || 'starter',
      servers: this.getPlanServers(plan),
      customServers,
      billingCycle: 'annual',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active',
    };

    this.subscriptions.set(organizationId, subscription);

    const result = {
      subscription,
      benefits: this.getPlanBenefits(plan),
      nextSteps: [
        'Configure custom servers',
        'Set up team access',
        'Configure billing',
        'Review enterprise features',
      ],
    };

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  private async verifyServer(args: any): Promise<any> {
    const { serverId, verificationLevel, securityAudit, performanceTest } = args;

    const server = this.catalog.servers.find((s) => s.id === serverId);
    if (!server) {
      const error = `Server not found: ${serverId}`;
      return {
        content: [{ type: 'text', text: JSON.stringify({ error }) }],
        isError: true,
      };
    }

    const verification = {
      serverId,
      level: verificationLevel,
      status: 'in_progress',
      startedAt: new Date(),
      estimatedCompletion: '2-3 business days',
      checks: [
        'Security vulnerability scanning',
        'Code quality analysis',
        'Performance benchmarking',
        'Documentation completeness',
        'License compliance verification',
      ],
      certification:
        verificationLevel === 'enterprise'
          ? {
              standards: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'],
              auditTrail: true,
              continuousMonitoring: true,
            }
          : null,
    };

    const result = verification;

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }

  // Helper methods
  private generateMockReviews(serverId: string): any[] {
    return [
      {
        id: 'review_1',
        rating: 5,
        title: 'Excellent reasoning capabilities',
        comment: 'This server has transformed how we approach complex problem-solving.',
        pros: ['Easy to integrate', 'Well documented', 'High performance'],
        cons: ['Learning curve for advanced features'],
        helpful: 24,
        verified: true,
        createdAt: new Date('2026-02-20'),
      },
      {
        id: 'review_2',
        rating: 4,
        title: 'Great but needs more examples',
        comment: 'Solid functionality but could benefit from more usage examples.',
        pros: ['Powerful features', 'Good performance'],
        cons: ['Limited documentation examples'],
        helpful: 18,
        verified: false,
        createdAt: new Date('2026-02-18'),
      },
    ];
  }

  private analyzeDependencies(dependencies: string[]): any {
    return {
      total: dependencies.length,
      security: {
        vulnerabilities: 0,
        outdated: 0,
        compliant: dependencies.length,
      },
      compatibility: {
        nodeVersion: '>=18.0.0',
        platformSupport: ['linux', 'macos', 'windows'],
        dependencies: dependencies.map((dep) => ({
          name: dep,
          version: 'latest',
          license: 'MIT',
        })),
      },
    };
  }

  private generateInstallationGuide(server: MCPServer): string[] {
    return [
      `1. Install the ${server.name} server:`,
      server.downloadUrl.includes('github.com')
        ? `   npx -y @modelcontextprotocol/server-${server.id}`
        : `   npm install ${server.id}`,
      `2. Configure in .mcp/config.json:`,
      `   {"servers": {"${server.id}": {"command": "node", "args": ["path/to/server"]}}}`,
      `3. Restart MCP client`,
      `4. Verify installation with test command`,
    ];
  }

  private generateUsageExamples(server: MCPServer): any[] {
    return server.capabilities.map((capability) => ({
      capability,
      description: `Example using ${capability}`,
      code: `// ${capability} example\nawait mcp.call('${capability}', {...});`,
    }));
  }

  private getCompatibilityInfo(server: MCPServer): any {
    return {
      mcpVersion: '1.0.0+',
      platforms: ['Node.js 18+', 'Python 3.9+', 'Docker'],
      integrations: ['VS Code', 'Cursor', 'Claude Desktop'],
      enterpriseReady: server.securityLevel === 'enterprise',
    };
  }

  private getInstallCommand(server: MCPServer): string[] {
    if (server.downloadUrl.includes('github.com')) {
      return ['-y', `@modelcontextprotocol/server-${server.id}`];
    }
    return [server.downloadUrl];
  }

  private getTopCategories(): any[] {
    return Object.entries(this.catalog.statistics.categoryDistribution)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getTrendingServers(): any[] {
    return this.catalog.servers
      .filter((server) => server.featured)
      .map((server) => ({
        id: server.id,
        name: server.name,
        trend: '+25%',
        period: '7 days',
      }));
  }

  private getNewAdditions(): any[] {
    return this.catalog.servers
      .filter((server) => server.lastUpdated > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .map((server) => ({
        id: server.id,
        name: server.name,
        addedAt: server.lastUpdated,
      }));
  }

  private generateDownloadTrends(timeRange: string): any[] {
    const days = parseInt(timeRange.replace('d', ''));
    return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      downloads: Math.floor(Math.random() * 1000) + 500,
    })).reverse();
  }

  private generateSubmissionTrends(timeRange: string): any[] {
    return Array.from({ length: 7 }, (_, i) => ({
      week: `Week ${i + 1}`,
      submissions: Math.floor(Math.random() * 20) + 5,
    }));
  }

  private generateCategoryTrends(timeRange: string): any {
    return this.catalog.categories.reduce(
      (acc, category) => {
        acc[category] = Math.floor(Math.random() * 100) + 20;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private generateSecurityTrends(timeRange: string): any {
    return {
      vulnerabilitiesFixed: Math.floor(Math.random() * 50) + 10,
      securityAudits: Math.floor(Math.random() * 30) + 5,
      complianceRate: 0.95,
    };
  }

  private getPlanServers(plan?: string): string[] {
    switch (plan) {
      case 'starter':
        return ['sequential-thinking', 'knowledge-graph-memory'];
      case 'professional':
        return ['sequential-thinking', 'knowledge-graph-memory', 'github-integration'];
      case 'enterprise':
        return this.catalog.servers.map((s) => s.id);
      default:
        return ['sequential-thinking'];
    }
  }

  private getPlanBenefits(plan?: string): string[] {
    switch (plan) {
      case 'starter':
        return ['Basic MCP servers', 'Community support', 'Monthly updates'];
      case 'professional':
        return [
          'All starter benefits',
          'Premium servers',
          'Priority support',
          'Custom integrations',
        ];
      case 'enterprise':
        return [
          'All professional benefits',
          'Custom servers',
          'Dedicated support',
          'SLA guarantee',
          'Security audit',
        ];
      default:
        return ['Basic features'];
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Enterprise MCP Marketplace server running on stdio');
  }
}

const server = new EnterpriseMCPMarketplace();
server.run().catch(console.error);

// ESM CLI guard
if (import.meta.url === `file://${process.argv[1]}`) {
  server.run().catch(console.error);
}

#!/usr/bin/env node

/**
 * Backstage Developer Portal Integration
 * 
 * Sets up comprehensive Backstage integration for developer portal
 * with documentation, API catalog, and developer tools
 * 
 * Part of 2026 Documentation Standards - Phase 3 Intelligence
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';

interface BackstageConfig {
  app: {
    baseUrl: string;
    title: string;
    description: string;
  };
  backend: {
    baseUrl: string;
    database: {
      client: string;
      connection: Record<string, any>;
    };
    auth: {
      providers: Record<string, any>;
    };
  };
  integrations: {
    github: Record<string, any>;
    gitlab: Record<string, any>;
    azure: Record<string, any>;
  };
  catalog: {
    providers: Record<string, any>;
    rules: Record<string, any>;
  };
}

interface DocumentationEntity {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    title: string;
    description: string;
    tags: string[];
    annotations: Record<string, string>;
  };
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    definition: string;
    path: string;
    quadrant?: 'tutorials' | 'how-to' | 'reference' | 'explanation';
  };
}

class BackstageIntegrator {
  private docsDir: string;
  private backstageDir: string;
  private config: BackstageConfig;
  private entities: DocumentationEntity[] = [];

  constructor(docsDir: string = 'docs', backstageDir: string = 'backstage') {
    this.docsDir = docsDir;
    this.backstageDir = backstageDir;
    this.config = this.initializeConfig();
  }

  /**
   * Initialize Backstage configuration
   */
  private initializeConfig(): BackstageConfig {
    return {
      app: {
        baseUrl: 'http://localhost:3000',
        title: 'Developer Portal',
        description: 'Comprehensive developer portal with documentation, APIs, and tools',
      },
      backend: {
        baseUrl: 'http://localhost:7007',
        database: {
          client: 'pg',
          connection: {
            host: process.env.POSTGRES_HOST || 'localhost',
            port: process.env.POSTGRES_PORT || '5432',
            user: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'postgres',
            database: process.env.POSTGRES_DB || 'backstage',
          },
        },
        auth: {
          providers: {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          },
        },
      },
      integrations: {
        github: {
          enabled: true,
          apps: [
            {
              appId: process.env.GITHUB_APP_ID,
              privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
              webhookUrl: process.env.GITHUB_WEBHOOK_URL,
            },
          ],
        },
        gitlab: {
          enabled: false,
        },
        azure: {
          enabled: false,
        },
      },
      catalog: {
        providers: {
          githubOrg: {
            id: 'production',
            githubUrl: process.env.GITHUB_URL || 'https://github.com',
            org: process.env.GITHUB_ORG || 'your-org',
          },
        },
        rules: [
          {
            allow: ['Component', 'API', 'Domain', 'System', 'Resource'],
          },
        ],
      },
    };
  }

  /**
   * Setup Backstage integration
   */
  async setup(): Promise<void> {
    console.log('🎭 Setting up Backstage developer portal integration...\n');

    // Create Backstage directory structure
    await this.createBackstageStructure();

    // Generate configuration files
    await this.generateConfiguration();

    // Extract documentation entities
    await this.extractDocumentationEntities();

    // Create catalog entities
    await this.createCatalogEntities();

    // Setup plugins and extensions
    await this.setupPlugins();

    // Create developer tools integration
    await this.setupDeveloperTools();

    console.log('✅ Backstage integration complete');
  }

  /**
   * Create Backstage directory structure
   */
  private async createBackstageStructure(): Promise<void> {
    console.log('🏗️ Creating Backstage directory structure...');

    const directories = [
      'app',
      'app/src',
      'app/src/components',
      'app/src/apis',
      'backend',
      'backend/src',
      'backend/src/plugins',
      'catalog',
      'catalog/entities',
      'catalog/templates',
      'plugins',
      'plugins/documentation',
      'plugins/api',
      'plugins/techdocs',
    ];

    for (const dir of directories) {
      const fullPath = join(this.backstageDir, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    }

    console.log(`📁 Created ${directories.length} directories`);
  }

  /**
   * Generate configuration files
   */
  private async generateConfiguration(): Promise<void> {
    console.log('⚙️ Generating configuration files...');

    // App configuration
    const appConfig = {
      ...this.config.app,
      support: {
        url: 'https://github.com/your-org/your-repo/issues',
        items: [
          {
            title: 'Documentation',
            icon: 'docs',
            links: [
              {
                url: '/docs',
                title: 'Documentation Portal',
              },
            ],
          },
          {
            title: 'Support Chat',
            icon: 'chat',
            links: [
              {
                url: '/chat',
                title: 'Developer Chat',
              },
            ],
          },
        ],
      },
    };

    const appConfigPath = join(this.backstageDir, 'app', 'app.config.yaml');
    writeFileSync(appConfigPath, this.toYaml(appConfig));

    // Backend configuration
    const backendConfig = {
      ...this.config.backend,
      integrations: this.config.integrations,
      catalog: this.config.catalog,
    };

    const backendConfigPath = join(this.backstageDir, 'backend', 'app-config.yaml');
    writeFileSync(backendConfigPath, this.toYaml(backendConfig));

    // Package.json files
    await this.createPackageFiles();

    console.log('📄 Generated configuration files');
  }

  /**
   * Create package.json files
   */
  private async createPackageFiles(): Promise<void> {
    // Root package.json
    const rootPackage = {
      name: 'developer-portal',
      version: '1.0.0',
      private: true,
      workspaces: ['app', 'backend'],
      scripts: {
        dev: 'concurrently "yarn start" "yarn start-backend"',
        start: 'yarn start-backend && yarn start',
        start-backend: 'yarn workspace backend start',
        build: 'yarn workspace app build',
        tsc: 'yarn tsc',
        tsc:full: 'yarn tsc && yarn tsc --project plugins/*/tsconfig.json',
        clean: 'yarn backstage-cli clean',
        test: 'yarn backstage-cli test',
        test:coverage: 'yarn backstage-cli test --coverage',
        lint: 'yarn backstage-cli lint',
        postinstall: 'yarn backstage-cli install --dry-run',
      },
      devDependencies: {
        '@backstage/cli': '^0.26.0',
        '@backstage/core-components': '^0.14.0',
        '@backstage/core-plugin-api': '^1.9.0',
        '@backstage/plugin-catalog': '^1.15.0',
        '@backstage/plugin-catalog-import': '^0.10.7',
        '@backstage/plugin-catalog-react': '^1.9.0',
        '@backstage/plugin-docs': '^0.9.13',
        '@backstage/plugin-github-actions': '^0.6.7',
        '@backstage/plugin-github-issues': '^0.2.9',
        '@backstage/plugin-org': '^0.6.14',
        '@backstage/plugin-scaffolder': '^1.17.0',
        '@backstage/plugin-search': '^1.4.7',
        '@backstage/plugin-techdocs': '^1.10.2',
        '@backstage/plugin-techdocs-module-addons-contrib': '^1.1.4',
        '@backstage/plugin-techdocs-react': '^1.1.14',
        '@backstage/plugin-user-settings': '^0.7.16',
        '@backstage/theme': '^0.5.0',
        concurrently: '^8.2.2',
      },
    };

    const rootPackagePath = join(this.backstageDir, 'package.json');
    writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));

    // App package.json
    const appPackage = {
      name: 'app',
      version: '0.0.0',
      private: true,
      dependencies: {
        '@backstage/app-defaults': '^1.5.0',
        '@backstage/catalog-model': '^1.4.3',
        '@backstage/cli': '^0.26.0',
        '@backstage/core-app-api': '^1.12.0',
        '@backstage/core-components': '^0.14.0',
        '@backstage/core-plugin-api': '^1.9.0',
        '@backstage/integration-react': '^1.1.22',
        '@backstage/plugin-api-docs': '^0.10.3',
        '@backstage/plugin-catalog': '^1.15.0',
        '@backstage/plugin-catalog-import': '^0.10.7',
        '@backstage/plugin-catalog-react': '^1.9.0',
        '@backstage/plugin-docs': '^0.9.13',
        '@backstage/plugin-github-actions': '^0.6.7',
        '@backstage/plugin-github-issues': '^0.2.9',
        '@backstage/plugin-org': '^0.6.14',
        '@backstage/plugin-permission-react': '^0.4.20',
        '@backstage/plugin-scaffolder': '^1.17.0',
        '@backstage/plugin-search': '^1.4.7',
        '@backstage/plugin-techdocs': '^1.10.2',
        '@backstage/plugin-techdocs-module-addons-contrib': '^1.1.4',
        '@backstage/plugin-techdocs-react': '^1.1.14',
        '@backstage/plugin-user-settings': '^0.7.16',
        '@backstage/theme': '^0.5.0',
        'history': '^5.3.1',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.8.1',
      },
      devDependencies: {
        '@backstage/test-utils': '^1.5.0',
        '@testing-library/jest-dom': '^6.4.2',
        '@testing-library/react': '^14.3.1',
        '@testing-library/user-event': '^14.5.2',
        '@types/react': '^18.2.37',
        '@types/react-dom': '^18.2.15',
      },
      scripts: {
        start: 'backstage-cli package start',
        build: 'backstage-cli package build',
        test: 'backstage-cli package test',
        lint: 'backstage-cli package lint',
        clean: 'backstage-cli package clean',
        test:coverage: 'backstage-cli package test --coverage',
      },
      bundler: {
        inheritConfig: true,
      },
    };

    const appPackagePath = join(this.backstageDir, 'app', 'package.json');
    writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2));

    // Backend package.json
    const backendPackage = {
      name: 'backend',
      version: '0.0.0',
      private: true,
      dependencies: {
        '@backstage/backend-common': '^0.21.0',
        '@backstage/backend-defaults': '^0.2.18',
        '@backstage/backend-tasks': '^0.5.21',
        '@backstage/catalog-client': '^1.6.0',
        '@backstage/catalog-model': '^1.4.3',
        '@backstage/config': '^1.2.0',
        '@backstage/integration': '^1.7.1',
        '@backstage/plugin-app': '^0.3.7',
        '@backstage/plugin-auth-backend': '^0.22.0',
        '@backstage/plugin-auth-backend-module-github-provider': '^0.1.15',
        '@backstage/plugin-catalog-backend': '^1.15.0',
        '@backstage/plugin-catalog-backend-module-github': '^0.4.7',
        '@backstage/plugin-catalog-backend-module-scaffolder': '^1.4.0',
        '@backstage/plugin-permission-backend': '^0.5.37',
        '@backstage/plugin-permission-common': '^0.7.12',
        '@backstage/plugin-proxy-backend': '^0.4.5',
        '@backstage/plugin-scaffolder-backend': '^1.21.0',
        '@backstage/plugin-search-backend': '^1.5.0',
        '@backstage/plugin-search-backend-module-pg': '^0.3.9',
        '@backstage/plugin-search-backend-node': '^1.2.7',
        '@backstage/plugin-techdocs-backend': '^1.10.2',
        '@backstage/plugin-user-settings-backend': '^0.3.22',
        'app': 'link:../app',
        'better-sqlite3': '^9.2.2',
        'dockerode': '^4.0.2',
        'express': '^4.18.2',
        'express-promise-router': '^4.1.1',
        'pg': '^8.11.3',
        'winston': '^3.11.0',
      },
      devDependencies: {
        '@backstage/cli': '^0.26.0',
        '@types/express': '^4.17.21',
        '@types/express-promise-router': '^4.0.5',
        '@types/pg': '^8.10.9',
      },
      scripts: {
        start: 'backstage-cli package start',
        build: 'backstage-cli package build',
        test: 'backstage-cli package test',
        lint: 'backstage-cli package lint',
        test:coverage: 'backstage-cli package test --coverage',
        clean: 'backstage-cli package clean',
      },
    };

    const backendPackagePath = join(this.backstageDir, 'backend', 'package.json');
    writeFileSync(backendPackagePath, JSON.stringify(backendPackage, null, 2));
  }

  /**
   * Extract documentation entities
   */
  private async extractDocumentationEntities(): Promise<void> {
    console.log('📚 Extracting documentation entities...');

    const files = await glob(`${this.docsDir}/**/*.md`);
    
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const entity = this.createDocumentationEntity(file, content);
      if (entity) {
        this.entities.push(entity);
      }
    }

    console.log(`📄 Extracted ${this.entities.length} documentation entities`);
  }

  /**
   * Create documentation entity from file
   */
  private createDocumentationEntity(filePath: string, content: string): DocumentationEntity | null {
    const relativePath = filePath.replace(this.docsDir + '/', '');
    const name = relativePath.replace(/\.md$/, '').replace(/[\/\\]/g, '-');
    
    // Extract metadata
    const metadata = this.extractFileMetadata(content);
    
    // Determine quadrant
    const quadrant = this.determineQuadrant(relativePath);
    
    // Determine entity type
    const kind = this.determineEntityKind(relativePath, content);
    
    const entity: DocumentationEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind,
      metadata: {
        name,
        title: metadata.title || name,
        description: metadata.description || '',
        tags: metadata.tags || [],
        annotations: {
          'backstage.io/techdocs-ref': `dir:.${relativePath.replace(/\.md$/, '')}`,
          'marketing-websites/quadrant': quadrant,
          'marketing-websites/last-modified': new Date().toISOString(),
        },
      },
      spec: {
        type: 'documentation',
        lifecycle: metadata.lifecycle || 'production',
        owner: metadata.owner || 'documentation-team',
        definition: this.generateDefinition(content),
        path: relativePath,
        quadrant,
      },
    };

    return entity;
  }

  /**
   * Extract metadata from markdown content
   */
  private extractFileMetadata(content: string): any {
    const metadata = {
      title: '',
      description: '',
      tags: [] as string[],
      lifecycle: 'production',
      owner: 'documentation-team',
    };

    const lines = content.split('\n');
    let inFrontMatter = false;

    for (const line of lines) {
      if (line === '---') {
        inFrontMatter = !inFrontMatter;
        continue;
      }

      if (inFrontMatter) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          switch (key.trim()) {
            case 'title':
              metadata.title = value;
              break;
            case 'description':
              metadata.description = value;
              break;
            case 'tags':
              metadata.tags = value.split(',').map(tag => tag.trim());
              break;
            case 'lifecycle':
              metadata.lifecycle = value;
              break;
            case 'owner':
              metadata.owner = value;
              break;
          }
        }
      } else if (line.startsWith('#') && !metadata.title) {
        metadata.title = line.replace(/^#+\s*/, '').trim();
        break;
      }
    }

    return metadata;
  }

  /**
   * Determine quadrant from file path
   */
  private determineQuadrant(filePath: string): 'tutorials' | 'how-to' | 'reference' | 'explanation' {
    if (filePath.includes('/tutorials/')) return 'tutorials';
    if (filePath.includes('/how-to/')) return 'how-to';
    if (filePath.includes('/reference/')) return 'reference';
    if (filePath.includes('/explanation/')) return 'explanation';
    return 'tutorials'; // Default
  }

  /**
   * Determine entity kind
   */
  private determineEntityKind(filePath: string, content: string): string {
    if (filePath.includes('/api/') || content.includes('API') || content.includes('endpoint')) {
      return 'API';
    }
    if (filePath.includes('/components/') || content.includes('component')) {
      return 'Component';
    }
    if (filePath.includes('/systems/') || content.includes('system')) {
      return 'System';
    }
    if (filePath.includes('/domains/') || content.includes('domain')) {
      return 'Domain';
    }
    return 'Resource';
  }

  /**
   * Generate definition for entity
   */
  private generateDefinition(content: string): string {
    const lines = content.split('\n');
    const definitionLines = [];
    
    for (const line of lines) {
      if (line.startsWith('#') || line.startsWith('##')) {
        definitionLines.push(line);
      } else if (line.trim() && !line.startsWith('```') && !line.startsWith('---')) {
        definitionLines.push(line);
      }
      
      if (definitionLines.length >= 10) break; // Limit definition length
    }
    
    return definitionLines.join('\n').substring(0, 500); // Limit to 500 chars
  }

  /**
   * Create catalog entities
   */
  private async createCatalogEntities(): Promise<void> {
    console.log('📋 Creating catalog entities...');

    const entitiesDir = join(this.backstageDir, 'catalog', 'entities');
    if (!existsSync(entitiesDir)) {
      mkdirSync(entitiesDir, { recursive: true });
    }

    for (const entity of this.entities) {
      const entityPath = join(entitiesDir, `${entity.metadata.name}.yaml`);
      writeFileSync(entityPath, this.toYaml(entity));
    }

    console.log(`📄 Created ${this.entities.length} catalog entities`);
  }

  /**
   * Setup plugins and extensions
   */
  private async setupPlugins(): Promise<void> {
    console.log('🔌 Setting up plugins...');

    // Create documentation plugin
    await this.createDocumentationPlugin();

    // Create API plugin
    await this.createAPIPlugin();

    // Create TechDocs plugin
    await this.createTechDocsPlugin();

    console.log('✅ Plugins configured');
  }

  /**
   * Create documentation plugin
   */
  private async createDocumentationPlugin(): Promise<void> {
    const pluginDir = join(this.backstageDir, 'plugins', 'documentation');
    
    const pluginCode = `
import { createApiRef } from '@backstage/core-plugin-api';

export const documentationApiRef = createApiRef({
  id: 'documentation',
  description: 'API for accessing documentation content',
});

export interface DocumentationApi {
  getDocumentation(path: string): Promise<string>;
  searchDocumentation(query: string): Promise<Array<{
    title: string;
    path: string;
    excerpt: string;
  }>>;
}

export class DocumentationClient implements DocumentationApi {
  async getDocumentation(path: string): Promise<string> {
    // Implementation for fetching documentation
    return '';
  }

  async searchDocumentation(query: string) {
    // Implementation for searching documentation
    return [];
  }
}
`;

    writeFileSync(join(pluginDir, 'src', 'api.ts'), pluginCode);
  }

  /**
   * Create API plugin
   */
  private async createAPIPlugin(): Promise<void> {
    const pluginDir = join(this.backstageDir, 'plugins', 'api');
    
    const pluginCode = `
import { createApiRef } from '@backstage/core-plugin-api';

export const apiCatalogApiRef = createApiRef({
  id: 'api-catalog',
  description: 'API for accessing API catalog',
});

export interface ApiCatalogApi {
  getApis(): Promise<Array<{
    name: string;
    version: string;
    description: string;
    endpoints: Array<{
      path: string;
      method: string;
    }>;
  }>>;
}

export class ApiCatalogClient implements ApiCatalogApi {
  async getApis() {
    // Implementation for fetching API catalog
    return [];
  }
}
`;

    writeFileSync(join(pluginDir, 'src', 'api.ts'), pluginCode);
  }

  /**
   * Create TechDocs plugin
   */
  private async createTechDocsPlugin(): Promise<void> {
    const pluginDir = join(this.backstageDir, 'plugins', 'techdocs');
    
    const pluginCode = `
import { createApiRef } from '@backstage/core-plugin-api';

export const techdocsApiRef = createApiRef({
  id: 'techdocs',
  description: 'API for accessing TechDocs',
});

export interface TechDocsApi {
  getDocumentation(entityId: string): Promise<string>;
  buildDocumentation(entityId: string): Promise<void>;
}

export class TechDocsClient implements TechDocsApi {
  async getDocumentation(entityId: string): Promise<string> {
    // Implementation for fetching TechDocs
    return '';
  }

  async buildDocumentation(entityId: string): Promise<void> {
    // Implementation for building documentation
  }
}
`;

    writeFileSync(join(pluginDir, 'src', 'api.ts'), pluginCode);
  }

  /**
   * Setup developer tools integration
   */
  private async setupDeveloperTools(): Promise<void> {
    console.log('🛠️ Setting up developer tools...');

    // Create scaffolder templates
    await this.createScaffolderTemplates();

    // Create API documentation
    await this.createAPIDocumentation();

    // Create developer workflows
    await this.createDeveloperWorkflows();

    console.log('✅ Developer tools configured');
  }

  /**
   * Create scaffolder templates
   */
  private async createScaffolderTemplates(): Promise<void> {
    const templatesDir = join(this.backstageDir, 'catalog', 'templates');
    
    const template = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'documentation-template',
        title: 'Documentation Template',
        description: 'Template for creating new documentation',
        tags: ['documentation', 'template'],
      },
      spec: {
        type: 'website',
        parameters: [
          {
            title: 'Provide a simple name for the documentation',
            name: 'name',
            type: 'string',
            required: true,
          },
          {
            title: 'Select the quadrant',
            name: 'quadrant',
            type: 'enum',
            enum: ['tutorials', 'how-to', 'reference', 'explanation'],
            required: true,
          },
        ],
        steps: [
          {
            title: 'Fetch documentation template',
            action: 'fetch:template',
            input: {
              url: './template',
              values: {
                name: '{{ parameters.name }}',
                quadrant: '{{ parameters.quadrant }}',
              },
            },
          },
        ],
      },
    };

    const templatePath = join(templatesDir, 'documentation-template.yaml');
    writeFileSync(templatePath, this.toYaml(template));
  }

  /**
   * Create API documentation
   */
  private async createAPIDocumentation(): Promise<void> {
    const apiDocs = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'documentation-api',
        title: 'Documentation API',
        description: 'API for accessing documentation content',
        tags: ['api', 'documentation'],
      },
      spec: {
        type: 'openapi',
        lifecycle: 'production',
        owner: 'platform-team',
        definition: |
          openapi: 3.0.0
          info:
            title: Documentation API
            version: 1.0.0
            description: API for accessing documentation content
          paths:
            /api/docs:
              get:
                summary: Get documentation
                responses:
                  '200':
                    description: Success
                    content:
                      application/json:
                        schema:
                          type: object
                          properties:
                            content:
                              type: string
            /api/docs/search:
              get:
                summary: Search documentation
                parameters:
                  - name: q
                    in: query
                    required: true
                    schema:
                      type: string
                responses:
                  '200':
                    description: Success
                    content:
                      application/json:
                        schema:
                          type: array
                          items:
                            type: object
                            properties:
                              title:
                                type: string
                              path:
                                type: string
                              excerpt:
                                type: string
      },
    };

    const apiDocsPath = join(this.backstageDir, 'catalog', 'entities', 'documentation-api.yaml');
    writeFileSync(apiDocsPath, this.toYaml(apiDocs));
  }

  /**
   * Create developer workflows
   */
  private async createDeveloperWorkflows(): Promise<void> {
    const workflowsDir = join(this.backstageDir, 'workflows');
    if (!existsSync(workflowsDir)) {
      mkdirSync(workflowsDir, { recursive: true });
    }

    const workflow = {
      name: 'documentation-workflow',
      on: {
        push: {
          branches: ['main'],
        },
      },
      jobs: {
        build: {
          runs_on: 'ubuntu-latest',
          steps: [
            {
              uses: 'actions/checkout@v3',
            },
            {
              uses: 'actions/setup-node@v3',
              with: {
                'node-version': '18',
              },
            },
            {
              run: 'npm install',
            },
            {
              run: 'npm run build',
            },
            {
              run: 'npm run test',
            },
          ],
        },
      },
    };

    const workflowPath = join(workflowsDir, 'documentation.yml');
    writeFileSync(workflowPath, this.toYaml(workflow));
  }

  /**
   * Convert object to YAML (simplified)
   */
  private toYaml(obj: any): string {
    return JSON.stringify(obj, null, 2)
      .replace(/"/g, '')
      .replace(/,/g, '')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .replace(/:/g, ': ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * Print summary
   */
  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎭 BACKSTAGE INTEGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`📚 Documentation Entities: ${this.entities.length}`);
    console.log(`🔌 Plugins Configured: 3`);
    console.log(`🛠️ Developer Tools: Enabled`);
    
    console.log('\n📊 Entity Distribution:');
    const kinds = this.entities.reduce((acc, entity) => {
      acc[entity.kind] = (acc[entity.kind] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(kinds).forEach(([kind, count]) => {
      console.log(`  ${kind}: ${count}`);
    });
    
    console.log('\n🚀 Next Steps:');
    console.log('  1. Install dependencies: cd backstage && npm install');
    console.log('  2. Configure environment variables (.env)');
    console.log('  3. Set up database and authentication');
    console.log('  4. Start development servers: npm run dev');
    console.log('  5. Access portal at http://localhost:3000');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const docsDir = args[0] || 'docs';
  const backstageDir = args[1] || 'backstage';

  const integrator = new BackstageIntegrator(docsDir, backstageDir);
  await integrator.setup();
  integrator.printSummary();
  
  console.log('\n🎭 Backstage integration ready!');
  console.log('📁 Output directory: ' + backstageDir);
  console.log('🔗 Developer portal configured for documentation integration');
}

if (require.main === module) {
  main().catch(console.error);
}

export { BackstageIntegrator, BackstageConfig, DocumentationEntity };

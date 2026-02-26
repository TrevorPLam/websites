#!/usr/bin/env node

/**
 * Backstage Environment Setup
 * 
 * Sets up production environment for Backstage developer portal
 * with PostgreSQL, authentication, and proper configuration
 * 
 * Part of 2026 Documentation Standards - Phase 3 Intelligence Enhancement
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

class BackstageEnvironmentSetup {
  private backstageDir: string;
  private config: any;

  constructor(backstageDir: string = 'backstage') {
    this.backstageDir = backstageDir;
    this.config = this.loadConfig();
  }

  /**
   * Load configuration
   */
  private loadConfig() {
    return {
      database: {
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: process.env.POSTGRES_PORT || '5432',
          user: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_DB || 'backstage',
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
      },
      auth: {
        providers: {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
          },
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
          },
          microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID || '',
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET || ''
          }
        }
      },
      app: {
        baseUrl: process.env.BACKSTAGE_BASE_URL || 'http://localhost:3000',
        title: process.env.BACKSTAGE_TITLE || 'Developer Portal',
        description: process.env.BACKSTAGE_DESCRIPTION || 'Comprehensive developer portal'
      },
      integrations: {
        github: {
          enabled: true,
          apps: [{
            appId: process.env.GITHUB_APP_ID || '',
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY || '',
            webhookUrl: process.env.GITHUB_WEBHOOK_URL || ''
          }]
        }
      }
    };
  }

  /**
   * Setup Backstage environment
   */
  async setup() {
    console.log('🎭 Setting up Backstage environment...\n');

    // Create environment file
    await this.createEnvironmentFile();

    // Setup database
    await this.setupDatabase();

    // Setup authentication
    await this.setupAuthentication();

    // Create Docker configuration
    await this.createDockerConfig();

    // Create deployment configuration
    await this.createDeploymentConfig();

    console.log('✅ Backstage environment setup complete');
  }

  /**
   * Create environment file
   */
  private async createEnvironmentFile() {
    console.log('📝 Creating environment file...');

    const envContent = `# Backstage Environment Configuration
# Generated on ${new Date().toISOString()}

# Database Configuration
POSTGRES_HOST=${this.config.database.connection.host}
POSTGRES_PORT=${this.config.database.connection.port}
POSTGRES_USER=${this.config.database.connection.user}
POSTGRES_PASSWORD=${this.config.database.connection.password}
POSTGRES_DB=${this.config.database.connection.database}

# Application Configuration
BACKSTAGE_BASE_URL=${this.config.app.baseUrl}
BACKSTAGE_TITLE="${this.config.app.title}"
BACKSTAGE_DESCRIPTION="${this.config.app.description}"

# Authentication - GitHub
GITHUB_CLIENT_ID=${this.config.auth.providers.github.clientId}
GITHUB_CLIENT_SECRET=${this.config.auth.providers.github.clientSecret}

# Authentication - Google (Optional)
GOOGLE_CLIENT_ID=${this.config.auth.providers.google.clientId}
GOOGLE_CLIENT_SECRET=${this.config.auth.providers.google.clientSecret}

# Authentication - Microsoft (Optional)
MICROSOFT_CLIENT_ID=${this.config.auth.providers.microsoft.clientId}
MICROSOFT_CLIENT_SECRET=${this.config.auth.providers.microsoft.clientSecret}

# GitHub Integration
GITHUB_APP_ID=${this.config.integrations.github.apps[0].appId}
GITHUB_APP_PRIVATE_KEY="${this.config.integrations.github.apps[0].privateKey}"
GITHUB_WEBHOOK_URL=${this.config.integrations.github.apps[0].webhookUrl}

# Environment
NODE_ENV=development
LOG_LEVEL=info
PORT=7007

# Secret Keys (Generate new ones for production)
BACKSTAGE_SECRET_KEY=${this.generateSecretKey()}
SESSION_SECRET=${this.generateSecretKey()}

# CORS Configuration
CORS_ORIGIN=${this.config.app.baseUrl}
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_CREDENTIALS=true

# File Upload Configuration
FILE_UPLOAD_MAX_SIZE=10485760
FILE_UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Search Configuration
SEARCH_ENGINE=lunr
SEARCH_INDEX_PATH=backstage-search-index

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_SIZE=1000

# Monitoring and Observability
METRICS_ENABLED=true
HEALTH_CHECK_ENABLED=true
`;

    const envPath = join(this.backstageDir, '.env');
    writeFileSync(envPath, envContent);
    console.log(`✅ Environment file created: ${envPath}`);
  }

  /**
   * Setup database configuration
   */
  private async setupDatabase() {
    console.log('🗄️ Setting up database configuration...');

    const dbConfig = {
      client: this.config.database.client,
      connection: this.config.database.connection,
      migrations: {
        directory: join(this.backstageDir, 'migrations')
      },
      seeds: {
        directory: join(this.backstageDir, 'seeds')
      }
    };

    const dbConfigPath = join(this.backstageDir, 'database.json');
    writeFileSync(dbConfigPath, JSON.stringify(dbConfig, null, 2));
    console.log(`✅ Database configuration created: ${dbConfigPath}`);

    // Create migration directory
    const migrationsDir = join(this.backstageDir, 'migrations');
    if (!existsSync(migrationsDir)) {
      mkdirSync(migrationsDir, { recursive: true });
    }

    // Create seed directory
    const seedsDir = join(this.backstageDir, 'seeds');
    if (!existsSync(seedsDir)) {
      mkdirSync(seedsDir, { recursive: true });
    }

    // Create initial migration
    const migrationContent = `-- Initial Backstage Database Schema
-- Generated on ${new Date().toISOString()}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create entities table
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  namespace VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  kind VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  spec JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(namespace, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_entities_namespace ON entities(namespace);
CREATE INDEX IF NOT EXISTS idx_entities_kind ON entities(kind);
CREATE INDEX IF NOT EXISTS idx_entities_spec_gin ON entities USING GIN(spec);
CREATE INDEX IF NOT EXISTS idx_entities_metadata_gin ON entities USING GIN(metadata);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

    const migrationPath = join(migrationsDir, '001_initial_schema.sql');
    writeFileSync(migrationPath, migrationContent);
    console.log(`✅ Initial migration created: ${migrationPath}`);
  }

  /**
   * Setup authentication configuration
   */
  private async setupAuthentication() {
    console.log('🔐 Setting up authentication configuration...');

    const authConfig = {
      providers: {
        github: {
          clientId: this.config.auth.providers.github.clientId,
          clientSecret: this.config.auth.providers.github.clientSecret,
          signIn: {
            resolvers: [{ resolver: 'resolver', username: 'username' }]
          }
        },
        google: {
          clientId: this.config.auth.providers.google.clientId,
          clientSecret: this.config.auth.providers.google.clientSecret,
          signIn: {
            resolvers: [{ resolver: 'resolver', username: 'email' }]
          }
        },
        microsoft: {
          clientId: this.config.auth.providers.microsoft.clientId,
          clientSecret: this.config.auth.providers.microsoft.clientSecret,
          signIn: {
            resolvers: [{ resolver: 'resolver', username: 'email' }]
          }
        }
      },
      session: {
        secret: this.generateSecretKey(),
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400000 // 24 hours
        }
      }
    };

    const authConfigPath = join(this.backstageDir, 'auth-config.json');
    writeFileSync(authConfigPath, JSON.stringify(authConfig, null, 2));
    console.log(`✅ Authentication configuration created: ${authConfigPath}`);
  }

  /**
   * Create Docker configuration
   */
  private async createDockerConfig() {
    console.log('🐳 Creating Docker configuration...');

    const dockerfileContent = `# Backstage Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 7007

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:7007/healthcheck || exit 1

# Start the application
CMD ["npm", "start"]
`;

    const dockerfilePath = join(this.backstageDir, 'Dockerfile');
    writeFileSync(dockerfilePath, dockerfileContent);

    const dockerComposeContent = `version: '3.8'

services:
  backstage:
    build: .
    ports:
      - "7007:7007"
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=backstage
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=backstage
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backstage
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;

    const dockerComposePath = join(this.backstageDir, 'docker-compose.yml');
    writeFileSync(dockerComposePath, dockerComposeContent);

    const nginxContent = `events {
    worker_connections 1024;
}

http {
    upstream backstage {
        server backstage:7007;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://backstage;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /healthcheck {
            proxy_pass http://backstage/healthcheck;
            access_log off;
        }
    }

    # HTTPS configuration (uncomment and configure for production)
    # server {
    #     listen 443 ssl http2;
    #     server_name localhost;
    #     
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #     
    #     location / {
    #         proxy_pass http://backstage;
    #         proxy_set_header Host $host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #     }
    # }
}
`;

    const nginxPath = join(this.backstageDir, 'nginx.conf');
    writeFileSync(nginxPath, nginxContent);

    console.log(`✅ Docker configuration created`);
  }

  /**
   * Create deployment configuration
   */
  private async createDeploymentConfig() {
    console.log('🚀 Creating deployment configuration...');

    const k8sConfig = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'backstage',
        namespace: 'backstage'
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: {
            app: 'backstage'
          }
        },
        template: {
          metadata: {
            labels: {
              app: 'backstage'
            }
          },
          spec: {
            containers: [{
              name: 'backstage',
              image: 'backstage:latest',
              ports: [{
                containerPort: 7007
              }],
              env: [
                { name: 'NODE_ENV', value: 'production' },
                { name: 'POSTGRES_HOST', value: 'postgres-service' },
                { name: 'POSTGRES_USER', valueFrom: { secretKeyRef: { name: 'postgres-secret', key: 'username' } } },
                { name: 'POSTGRES_PASSWORD', valueFrom: { secretKeyRef: { name: 'postgres-secret', key: 'password' } },
                { name: 'POSTGRES_DB', value: 'backstage' }
              ],
              resources: {
                requests: {
                  memory: '256Mi',
                  cpu: '250m'
                },
                limits: {
                  memory: '512Mi',
                  cpu: '500m'
                }
              },
              livenessProbe: {
                httpGet: {
                  path: '/healthcheck',
                  port: 7007
                },
                initialDelaySeconds: 30,
                periodSeconds: 10
              },
              readinessProbe: {
                httpGet: {
                  path: '/healthcheck',
                  port: 7007
                },
                initialDelaySeconds: 5,
                periodSeconds: 5
              }
            }]
          }
        }
      }
    };

    const k8sPath = join(this.backstageDir, 'k8s-deployment.yaml');
    writeFileSync(k8sPath, JSON.stringify(k8sConfig, null, 2));

    console.log(`✅ Deployment configuration created: ${k8sPath}`);
  }

  /**
   * Generate secret key
   */
  private generateSecretKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Test environment setup
   */
  async testSetup() {
    console.log('🧪 Testing Backstage environment setup...');

    // Test environment file
    const envPath = join(this.backstageDir, '.env');
    if (!existsSync(envPath)) {
      throw new Error('Environment file not found');
    }

    // Test database configuration
    const dbConfigPath = join(this.backstageDir, 'database.json');
    if (!existsSync(dbConfigPath)) {
      throw new Error('Database configuration not found');
    }

    // Test authentication configuration
    const authConfigPath = join(this.backstageDir, 'auth-config.json');
    if (!existsSync(authConfigPath)) {
      throw new Error('Authentication configuration not found');
    }

    console.log('✅ Environment setup test passed');
    return true;
  }

  /**
   * Get setup instructions
   */
  getSetupInstructions() {
    return `
🎭 Backstage Setup Instructions

1. Environment Setup:
   ✅ Environment file created: ${join(this.backstageDir, '.env')}
   ✅ Database configuration: ${join(this.backstageDir, 'database.json')}
   ✅ Authentication configuration: ${join(this.backstageDir, 'auth-config.json')}

2. Database Setup:
   - Install PostgreSQL: brew install postgresql (macOS) or apt-get install postgresql (Ubuntu)
   - Start PostgreSQL: brew services start postgresql
   - Create database: createdb backstage
   - Run migrations: cd ${this.backstageDir} && npm run migrate

3. Authentication Setup:
   - GitHub OAuth: https://github.com/settings/applications/new
   - Google OAuth: https://console.developers.google.com/apis/credentials
   - Microsoft OAuth: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps

4. Development Setup:
   - Install dependencies: cd ${this.backstageDir} && npm install
   - Start development: npm run dev
   - Access at: http://localhost:3000

5. Production Setup:
   - Docker: docker-compose up -d
   - Kubernetes: kubectl apply -f k8s-deployment.yaml
   - Environment variables: Update .env with production values

6. Monitoring:
   - Health check: http://localhost:7007/healthcheck
   - Metrics: http://localhost:7007/metrics
   - Logs: docker-compose logs -f backstage

Next Steps:
1. Configure OAuth providers
2. Set up database
3. Install dependencies
4. Start development server
5. Test authentication
6. Deploy to production
`;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const setup = new BackstageEnvironmentSetup();

  switch (command) {
    case 'setup':
      await setup.setup();
      console.log(setup.getSetupInstructions());
      break;

    case 'test':
      try {
        await setup.testSetup();
        console.log('✅ Backstage environment setup is ready');
      } catch (error) {
        console.error('❌ Backstage environment setup test failed:', error.message);
        process.exit(1);
      }
      break;

    case 'help':
      console.log(`
Backstage Environment Setup

Usage:
  node scripts/backstage-setup.mjs <command>

Commands:
  setup  - Set up Backstage environment with all configurations
  test   - Test the environment setup
  help   - Show this help message

Examples:
  node scripts/backstage-setup.mjs setup
  node scripts/backstage-setup.mjs test

Environment Variables:
  POSTGRES_HOST     - PostgreSQL host (default: localhost)
  POSTGRES_PORT     - PostgreSQL port (default: 5432)
  POSTGRES_USER     - PostgreSQL user (default: postgres)
  POSTGRES_PASSWORD - PostgreSQL password (default: postgres)
  POSTGRES_DB       - PostgreSQL database (default: backstage)
  GITHUB_CLIENT_ID  - GitHub OAuth client ID
  GITHUB_CLIENT_SECRET - GitHub OAuth client secret
  BACKSTAGE_BASE_URL - Backstage base URL (default: http://localhost:3000)
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Backstage setup error:', error);
    process.exit(1);
  });
}

export { BackstageEnvironmentSetup };

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorials: [
    'tutorials',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'tutorials/monorepo-setup',
        'tutorials/first-feature',
        'tutorials/deployment-basics',
      ],
    },
    {
      type: 'category',
      label: 'Learning Paths',
      items: [
        {
          type: 'category',
          label: 'Frontend Developer Path',
          items: [
            'tutorials/paths/frontend',
            'tutorials/paths/react-basics',
            'tutorials/paths/nextjs-advanced',
          ],
        },
        {
          type: 'category',
          label: 'Backend Developer Path',
          items: [
            'tutorials/paths/backend',
            'tutorials/paths/database-design',
            'tutorials/paths/api-development',
          ],
        },
        {
          type: 'category',
          label: 'Full Stack Developer Path',
          items: [
            'tutorials/paths/fullstack',
            'tutorials/paths/integration-patterns',
            'tutorials/paths/deployment-strategies',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Platform Onboarding',
      items: [
        'tutorials/client-setup',
        'tutorials/multi-tenant-basics',
        'tutorials/security-basics',
      ],
    },
    {
      type: 'category',
      label: 'Quick Starts',
      items: [
        'tutorials/quickstarts/marketing-site',
        'tutorials/quickstarts/saas-app',
        'tutorials/quickstarts/api-integration',
      ],
    },
  ],

  howTo: [
    'how-to',
    {
      type: 'category',
      label: 'Development Workflows',
      items: [
        {
          type: 'category',
          label: 'Feature Development',
          items: [
            'how-to/development/feature-implementation',
            'how-to/development/ui-components',
            'how-to/development/api-endpoints',
            'how-to/development/database-migrations',
          ],
        },
        {
          type: 'category',
          label: 'Testing & Quality',
          items: [
            'how-to/testing/unit-tests',
            'how-to/testing/e2e-tests',
            'how-to/testing/performance-tests',
            'how-to/testing/accessibility-tests',
          ],
        },
        {
          type: 'category',
          label: 'Deployment & Operations',
          items: [
            'how-to/deployment/production-deployment',
            'how-to/deployment/ci-cd-pipeline',
            'how-to/deployment/environment-config',
            'how-to/deployment/monitoring-setup',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Integration Guides',
      items: [
        {
          type: 'category',
          label: 'Third-Party Services',
          items: [
            'how-to/integrations/stripe-payments',
            'how-to/integrations/google-analytics',
            'how-to/integrations/email-service',
            'how-to/integrations/calendar-scheduling',
          ],
        },
        {
          type: 'category',
          label: 'Internal Systems',
          items: [
            'how-to/systems/multi-tenant-setup',
            'how-to/systems/authentication',
            'how-to/systems/rbac',
            'how-to/systems/audit-logging',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Maintenance & Troubleshooting',
      items: [
        {
          type: 'category',
          label: 'Common Issues',
          items: [
            'how-to/troubleshooting/build-failures',
            'how-to/troubleshooting/performance-issues',
            'how-to/troubleshooting/database-issues',
            'how-to/troubleshooting/security-incidents',
          ],
        },
        {
          type: 'category',
          label: 'Maintenance Tasks',
          items: [
            'how-to/maintenance/dependency-updates',
            'how-to/maintenance/database-maintenance',
            'how-to/maintenance/security-hardening',
            'how-to/maintenance/documentation-updates',
          ],
        },
      ],
    },
  ],

  reference: [
    'reference',
    {
      type: 'category',
      label: 'API Documentation',
      items: [
        {
          type: 'category',
          label: 'Core APIs',
          items: [
            'reference/api/auth',
            'reference/api/users',
            'reference/api/tenants',
            'reference/api/content',
          ],
        },
        {
          type: 'category',
          label: 'Integration APIs',
          items: [
            'reference/api/stripe',
            'reference/api/google-maps',
            'reference/api/email',
            'reference/api/calendar',
          ],
        },
        {
          type: 'category',
          label: 'Webhooks',
          items: [
            'reference/webhooks/stripe',
            'reference/webhooks/cal',
            'reference/webhooks/custom',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Configuration Reference',
      items: [
        {
          type: 'category',
          label: 'Application Configuration',
          items: [
            'reference/config/environment',
            'reference/config/database',
            'reference/config/security',
            'reference/config/performance',
          ],
        },
        {
          type: 'category',
          label: 'Package Configuration',
          items: [
            'reference/config/nextjs',
            'reference/config/typescript',
            'reference/config/eslint',
            'reference/config/testing',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      items: [
        'reference/cli/pnpm',
        'reference/cli/turbo',
        'reference/cli/dev-scripts',
        'reference/cli/build',
        'reference/cli/deploy',
        'reference/cli/migrations',
      ],
    },
    {
      type: 'category',
      label: 'Database Schema',
      items: [
        {
          type: 'category',
          label: 'Core Tables',
          items: [
            'reference/schema/users',
            'reference/schema/tenants',
            'reference/schema/content',
            'reference/schema/audit-logs',
          ],
        },
        {
          type: 'category',
          label: 'Integration Tables',
          items: [
            'reference/schema/stripe',
            'reference/schema/google-reviews',
            'reference/schema/calendar',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Error Codes',
      items: [
        {
          type: 'category',
          label: 'Application Errors',
          items: [
            'reference/errors/auth',
            'reference/errors/validation',
            'reference/errors/business',
            'reference/errors/system',
          ],
        },
        {
          type: 'category',
          label: 'Integration Errors',
          items: [
            'reference/errors/stripe',
            'reference/errors/google',
            'reference/errors/email',
          ],
        },
      ],
    },
  ],

  explanation: [
    'explanation',
    {
      type: 'category',
      label: 'Architecture Decisions',
      items: [
        {
          type: 'category',
          label: 'Architecture Decision Records (ADRs)',
          items: [
            'explanation/adr/001-nextjs-16',
            'explanation/adr/002-multi-tenant',
            'explanation/adr/003-fsd-architecture',
            'explanation/adr/004-supabase',
            'explanation/adr/005-oauth-21',
          ],
        },
        {
          type: 'category',
          label: 'System Architecture',
          items: [
            'explanation/architecture/multi-tenant-saas',
            'explanation/architecture/fsd-implementation',
            'explanation/architecture/database',
            'explanation/architecture/security',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Design Principles',
      items: [
        {
          type: 'category',
          label: 'Core Principles',
          items: [
            'explanation/principles/docs-first',
            'explanation/principles/security-first',
            'explanation/principles/performance-first',
            'explanation/principles/a11y-first',
          ],
        },
        {
          type: 'category',
          label: 'Development Philosophy',
          items: [
            'explanation/philosophy/fsd',
            'explanation/philosophy/agent-orchestration',
            'explanation/philosophy/zero-trust',
            'explanation/philosophy/progressive-enhancement',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Technical Context',
      items: [
        {
          type: 'category',
          label: 'Technology Stack',
          items: [
            'explanation/technology/nextjs-16',
            'explanation/technology/react-19-server',
            'explanation/technology/typescript-strict',
            'explanation/technology/turborepo',
          ],
        },
        {
          type: 'category',
          label: 'Integration Patterns',
          items: [
            'explanation/patterns/oauth-21',
            'explanation/patterns/tenant-isolation',
            'explanation/patterns/api-gateway',
            'explanation/patterns/event-driven',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Business Context',
      items: [
        {
          type: 'category',
          label: 'Business Model',
          items: [
            'explanation/business/multi-tenant-saas',
            'explanation/business/agency-client',
            'explanation/business/paas',
            'explanation/business/revenue',
          ],
        },
        {
          type: 'category',
          label: 'Compliance & Governance',
          items: [
            'explanation/compliance/gdpr',
            'explanation/compliance/soc2',
            'explanation/compliance/hipaa',
            'explanation/compliance/wcag-22',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Operational Context',
      items: [
        {
          type: 'category',
          label: 'Development Operations',
          items: [
            'explanation/operations/ci-cd',
            'explanation/operations/testing',
            'explanation/operations/monitoring',
            'explanation/operations/incident-response',
          ],
        },
        {
          type: 'category',
          label: 'Performance & Scalability',
          items: [
            'explanation/performance/optimization',
            'explanation/performance/scalability',
            'explanation/performance/core-web-vitals',
            'explanation/performance/bundle-size',
          ],
        },
      ],
    },
  ],
};

export default sidebars;

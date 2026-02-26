import { themes } from 'prism-react-renderer';
/**
 * @file docusaurus.config.ts
 * @summary Docusaurus configuration for comprehensive documentation site.
 * @description Configures documentation structure, plugins, and theming for 2026 standards compliance.
 * @security none
 * @adr none
 * @requirements docs/documentation-alignment-strategy.md
 */

import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Marketing Websites Monorepo',
  tagline: 'Enterprise-grade multi-tenant SaaS platform for marketing websites',
  favicon: 'img/favicon.ico',
  url: 'https://docs.marketing-websites.com',
  baseUrl: '/',
  organizationName: 'marketing-websites',
  projectName: 'monorepo',
  deploymentBranch: 'main',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/TrevorPLam/websites/tree/main/docs/',
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          docItemComponent: '@theme/DocItem',
          docLayoutComponent: '@theme/DocPage',
          docRootComponent: '@theme/DocsRoot',
          docsRootComponent: '@theme/DocsRoot',
          versions: {
            current: {
              label: '2026',
              path: '2026',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Marketing Websites',
      logo: {
        alt: 'Marketing Websites Logo',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorials',
          position: 'left',
          label: 'Tutorials',
        },
        {
          type: 'docSidebar',
          sidebarId: 'howTo',
          position: 'left',
          label: 'How-To Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'reference',
          position: 'left',
          label: 'Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'explanation',
          position: 'left',
          label: 'Explanations',
        },
        {
          to: '/docs/guides',
          label: 'Legacy Guides',
          position: 'right',
        },
        {
          href: 'https://github.com/TrevorPLam/websites',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/tutorials',
            },
            {
              label: 'API Reference',
              to: '/docs/reference/api',
            },
            {
              label: 'Architecture',
              to: '/docs/explanation/adr',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/TrevorPLam/websites',
            },
            {
              label: 'Issues',
              href: 'https://github.com/TrevorPLam/websites/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/TrevorPLam/websites/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Main Repository',
              href: 'https://github.com/TrevorPLam/websites',
            },
            {
              label: 'License',
              href: 'https://github.com/TrevorPLam/websites/blob/main/LICENSE',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marketing Websites Monorepo. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: [
        'typescript',
        'javascript',
        'jsx',
        'tsx',
        'json',
        'bash',
        'sql',
        'yaml',
        'toml',
        'dockerfile',
        'diff',
        'mermaid',
      ],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'marketing-websites',
      contextualSearch: true,
      searchParameters: {
        facetFilters: ['version:2026'],
      },
    },
    announcementBar: {
      id: '2026-standards',
      content:
        '🚀 <strong>2026 Documentation Standards</strong> - Now featuring Diátaxis framework, AI optimization, and WCAG 2.2 AA compliance',
      backgroundColor: '#25c2a0',
      textColor: '#000',
      isCloseable: true,
    },
  } as const,

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'tutorials',
        routeBasePath: 'docs/tutorials',
        sidebarPath: './sidebars.ts',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'howTo',
        path: 'how-to',
        routeBasePath: 'docs/how-to',
        sidebarPath: './sidebars.ts',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'reference',
        path: 'reference',
        routeBasePath: 'docs/reference',
        sidebarPath: './sidebars.ts',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'explanation',
        path: 'explanation',
        routeBasePath: 'docs/explanation',
        sidebarPath: './sidebars.ts',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
      },
    ],
    '@docusaurus/plugin-ideal-image',
    '@docusaurus/plugin-debug',
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineMode: true,
        registerServiceWorker: true,
        strategies: ['generateSW'],
      },
    ],
  ],

  markdown: {
    mermaid: true,
    format: 'mdx',
  },

  customFields: {
    diátaxisFramework: {
      tutorials: {
        description: 'Learning-oriented, hands-on guides for beginners',
        icon: '📚',
      },
      howTo: {
        description: 'Task-oriented, goal-focused problem-solving steps',
        icon: '🔧',
      },
      reference: {
        description: 'Information-oriented technical descriptions and specifications',
        icon: '📖',
      },
      explanation: {
        description: 'Understanding-oriented conceptual background and architecture decisions',
        icon: '💡',
      },
    },
    standards: {
      year: '2026',
      wcag: '2.2 AA',
      coreWebVitals: {
        lcp: '<2.5s',
        inp: '<200ms',
        cls: '<0.1',
      },
      bundleSize: '<250KB gzipped',
    },
  },
};

export default config;

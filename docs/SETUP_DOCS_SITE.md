<!--
/**
 * @file docs/SETUP_DOCS_SITE.md
 * @role docs
 * @summary Guide for setting up an interactive documentation site with Docusaurus.
 *
 * @entrypoints
 * - Referenced from documentation plan
 * - Setup instructions
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/README.md (documentation structure)
 *
 * @used_by
 * - Documentation maintainers setting up site
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: setup instructions
 * - outputs: configured documentation site
 *
 * @invariants
 * - Site must use existing markdown files
 * - Navigation must match documentation structure
 *
 * @gotchas
 * - Requires Node.js and npm/pnpm
 * - GitHub Pages deployment needs configuration
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add search integration
 * - Add versioning support
 *
 * @verification
 * - ✅ Steps verified against Docusaurus documentation
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Setting Up Documentation Site with Docusaurus

**Last Updated:** 2026-02-18  
**Status:** Setup Guide  
**Related:** [Documentation Hub](README.md)

---

This guide walks through setting up an interactive documentation site using Docusaurus, which provides enhanced navigation, search, and a modern web interface for the documentation.

## Why Docusaurus?

- **React-based**: Aligns with project technology stack
- **Feature-rich**: Search, versioning, i18n support
- **Markdown-first**: Works with existing `.md` files
- **Customizable**: Can be styled to match project branding
- **Active community**: Well-maintained and documented

## Prerequisites

- Node.js >=18.0.0
- pnpm 10.29.2 (or npm)
- Git repository access
- GitHub Pages (for deployment) or similar hosting

## Step 1: Install Docusaurus

```bash
# Create docs-site directory (optional, or use existing docs/)
cd docs
npx create-docusaurus@latest website classic --typescript

# Or install in separate directory
mkdir docs-site
cd docs-site
npx create-docusaurus@latest . classic --typescript
```

## Step 2: Configure Docusaurus

Edit `docusaurus.config.ts`:

```typescript
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Marketing Websites Platform',
  tagline: 'Multi-industry marketing website template system',
  favicon: 'img/favicon.ico',

  url: 'https://your-org.github.io',
  baseUrl: '/marketing-websites/',

  organizationName: 'your-org',
  projectName: 'marketing-websites',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-org/marketing-websites/tree/main/docs/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Marketing Websites',
      logo: {
        alt: 'Marketing Websites Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/your-org/marketing-websites',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/onboarding',
            },
            {
              label: 'Architecture',
              to: '/architecture/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-org/marketing-websites',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/your-org/marketing-websites/blob/main/CONTRIBUTING.md',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marketing Websites Platform.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

## Step 3: Configure Sidebar

Edit `sidebars.ts`:

```typescript
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'README',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/onboarding',
        'getting-started/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/README',
        'architecture/module-boundaries',
        'architecture/visual-guide',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/build-first-client',
        'tutorials/create-component',
        'tutorials/setup-integrations',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/glossary',
        'resources/faq',
        'resources/learning-paths',
      ],
    },
  ],
};

export default sidebars;
```

## Step 4: Add Search (Optional)

### Algolia DocSearch (Free for Open Source)

1. Apply at https://docsearch.algolia.com/apply/
2. Add to `docusaurus.config.ts`:

```typescript
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'your-index-name',
  },
}
```

### Client-Side Search Alternative

Use `@easyops-cn/docusaurus-search-local`:

```bash
pnpm add @easyops-cn/docusaurus-search-local
```

Configure in `docusaurus.config.ts`.

## Step 5: Deploy to GitHub Pages

### GitHub Actions Workflow

Create `.github/workflows/docs-deploy.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v3
        with:
          version: 10.29.2
      - run: pnpm install --frozen-lockfile
      - run: cd website && pnpm install && pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website/build
```

## Step 6: Customize Styling

Edit `src/css/custom.css` to match project branding.

## Next Steps

- Add versioning for releases
- Configure internationalization
- Add custom pages
- Integrate with existing CI/CD

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus Configuration](https://docusaurus.io/docs/api/docusaurus-config)
- [Deployment Guide](https://docusaurus.io/docs/deployment)

---

**Note:** This is a setup guide. Actual implementation requires running these commands and configuring for your specific repository.

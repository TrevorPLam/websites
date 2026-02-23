---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-8-003
title: 'Per-tenant robots.ts with AI crawler support'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-8-003-robots-ts
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-8-003 · Per-tenant robots.ts with AI crawler support

## Objective

Implement per-tenant robots.ts system following section 8.4 specification with production/staging environment handling, AI crawler support (GPTBot, PerplexityBot, ClaudeBot), proper disallow rules, and tenant-specific robots.txt generation for multi-tenant SEO management.

---

## Context

**Codebase area:** SEO robots.txt generation — Per-tenant crawler control

**Related files:** Robots.txt generation, AI crawler rules, environment handling

**Dependencies:** Next.js robots API, tenant configuration, environment detection

**Prior work**: Basic robots awareness exists but lacks comprehensive AI crawler support and tenant isolation

**Constraints:** Must follow section 8.4 specification with proper AI crawler rules and environment handling

---

## Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Robots       | Next.js MetadataRoute.Robots API         |
| AI Crawlers  | GPTBot, PerplexityBot, ClaudeBot support |
| Environment  | Production vs staging handling           |
| Multi-tenant | Per-tenant robots.txt generation         |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement robots.ts following section 8.4 specification
- [ ] **[Agent]** Create per-tenant robots.txt generation
- [ ] **[Agent]** Add AI crawler support with proper rules
- [ ] **[Agent]** Implement environment-based rules (production vs staging)
- [ ] **[Agent]** Create robots validation and testing
- [ ] **[Agent]** Test robots generation across all environments
- [ ] **[Human]** Verify robots follows section 8.4 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 8.4 specification** — Extract robots requirements
- [ ] **[Agent]** **Create base robots** — Implement environment-based rules
- [ ] **[Agent]** **Add AI crawler support** — Implement GPTBot, PerplexityBot, ClaudeBot rules
- [ ] **[Agent]** **Implement tenant isolation** — Add per-tenant robots generation
- [ ] **[Agent]** **Add validation** — Create robots validation and testing
- [ ] **[Agent]** **Test robots generation** — Verify all environments work correctly
- [ ] **[Agent]** **Add SEO optimization** — Optimize rules for search engines

> ⚠️ **Agent Question**: Ask human before proceeding if any existing robots generation needs migration to new system.

---

## Commands

```bash
# Test robots generation
pnpm test --filter="@repo/seo"

# Test production robots
node -e "
import { generateRobots } from '@repo/seo/robots';
const robots = await generateRobots();
console.log('Production robots:', robots);
"

# Test staging robots
node -e "
process.env.VERCEL_ENV = 'preview';
import { generateRobots } from '@repo/seo/robots';
const robots = await generateRobots();
console.log('Staging robots:', robots);
"

# Test AI crawler rules
node -e "
import { generateRobots } from '@repo/seo/robots';
const robots = await generateRobots();
const aiRules = robots.rules?.filter(rule =>
  rule.userAgent === 'GPTBot' ||
  rule.userAgent === 'PerplexityBot' ||
  rule.userAgent === 'ClaudeBot'
);
console.log('AI crawler rules:', aiRules);
"

# Test robots validation
node -e "
import { validateRobots } from '@repo/seo/validation';
const result = validateRobots({
  rules: [{ userAgent: '*', allow: '/' }]
});
console.log('Validation result:', result);
"
```

---

## Code Style

```typescript
// ✅ Correct — Per-tenant robots.ts following section 8.4
import type { MetadataRoute } from 'next';
import config from '../../../../site.config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.deployment.canonicalUrl;
  const isProduction = process.env.VERCEL_ENV === 'production';

  // Non-production environments: block all crawlers
  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      // Default: allow all
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/_next/', '/suspended', '/auth/'],
      },

      // Google: full access + extended snippet
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },

      // AI crawlers: allow content, block private data
      // Note: This does NOT stop AI training — use llms.txt for that
      {
        userAgent: 'GPTBot',
        allow: ['/blog/', '/services/', '/about/'],
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/blog/', '/services/', '/about/'],
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/blog/', '/services/', '/about/'],
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },

      // Bing: standard access
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },

      // DuckDuckGo: standard access
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      },

      // Social media crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/'],
      },

      // SEO tools (allow for analysis)
      {
        userAgent: 'AhrefsBot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/'],
      },
      {
        userAgent: 'SemrushBot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/'],
      },

      // Block aggressive crawlers
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],

    // Sitemap location
    sitemap: `${baseUrl}/sitemap.xml`,

    // Host (for search engines that support it)
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
}

// ============================================================================
// ADVANCED ROBOTS WITH TAILORED RULES
// ============================================================================

export function generateAdvancedRobots(options: {
  tenantConfig: any;
  environment?: 'production' | 'staging' | 'development';
  customRules?: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }>;
}): MetadataRoute.Robots {
  const { tenantConfig, environment = 'production', customRules = [] } = options;
  const baseUrl = tenantConfig.deployment.canonicalUrl;
  const isProduction = environment === 'production';

  // Non-production: block all
  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  const baseRules = [
    // Default rule
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/_next/', '/suspended', '/auth/'],
    },

    // Enhanced Google access
    {
      userAgent: 'Googlebot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      crawlDelay: 1, // 1 second delay between requests
    },

    // AI crawlers with content-focused access
    {
      userAgent: 'GPTBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2, // 2 second delay for AI crawlers
    },
    {
      userAgent: 'PerplexityBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2,
    },
    {
      userAgent: 'ClaudeBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2,
    },

    // Major search engines
    {
      userAgent: 'Bingbot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      crawlDelay: 1,
    },
    {
      userAgent: 'DuckDuckBot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
    },

    // Social media crawlers
    {
      userAgent: 'facebookexternalhit',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },
    {
      userAgent: 'Twitterbot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },
    {
      userAgent: 'LinkedInBot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },

    // SEO tools (limited access)
    {
      userAgent: 'AhrefsBot',
      allow: ['/blog/', '/services/', '/about/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/contact/'],
      crawlDelay: 3,
    },
    {
      userAgent: 'SemrushBot',
      allow: ['/blog/', '/services/', '/about/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/contact/'],
      crawlDelay: 3,
    },

    // Block problematic crawlers
    {
      userAgent: 'MJ12bot',
      disallow: '/',
    },
    {
      userAgent: 'DotBot',
      disallow: '/',
    },
    {
      userAgent: 'Barkrowler',
      disallow: '/',
    },
    {
      userAgent: 'SemrushBot',
      allow: ['/blog/', '/services/', '/about/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/contact/'],
      crawlDelay: 3,
    },
  ];

  // Merge custom rules
  const allRules = [...baseRules, ...customRules];

  return {
    rules: allRules,
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
}

// ============================================================================
// ROBOTS VALIDATION
// ============================================================================

export function validateRobots(robots: MetadataRoute.Robots): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!robots.rules || !Array.isArray(robots.rules)) {
    errors.push('Rules array is required');
  }

  // Validate each rule
  robots.rules?.forEach((rule, index) => {
    if (!rule.userAgent) {
      errors.push(`Rule ${index + 1}: userAgent is required`);
    }

    // Check for invalid paths
    const allPaths = [...(rule.allow ?? []), ...(rule.disallow ?? [])];
    allPaths.forEach((path) => {
      if (!path.startsWith('/')) {
        warnings.push(`Rule ${index + 1}: Path "${path}" should start with "/"`);
      }
    });

    // Check crawlDelay
    if (rule.crawlDelay && (rule.crawlDelay < 0 || rule.crawlDelay > 10)) {
      warnings.push(`Rule ${index + 1}: crawlDelay should be between 0 and 10 seconds`);
    }
  });

  // Validate sitemap URL
  if (robots.sitemap) {
    if (!robots.sitemap.startsWith('https://') && !robots.sitemap.startsWith('http://')) {
      errors.push('Sitemap URL must start with http:// or https://');
    }

    if (robots.sitemap && !robots.sitemap.endsWith('.xml')) {
      warnings.push('Sitemap URL should typically end with .xml');
    }
  }

  // Check for common issues
  const hasAllowAll = robots.rules?.some(
    (rule) => rule.allow?.includes('/') && rule.userAgent === '*'
  );

  if (!hasAllowAll && robots.rules?.some((rule) => rule.userAgent === '*')) {
    warnings.push('Consider adding "allow: /" for the default user agent');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// ROBOTS UTILITIES
// ============================================================================

export function createRobotsRule(
  userAgent: string,
  options: {
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  } = {}
): MetadataRoute.Robots['rules'][0] {
  return {
    userAgent,
    allow: options.allow ?? ['/'],
    disallow: options.disallow ?? [],
    crawlDelay: options.crawlDelay,
  };
}

export function createAICrawlerRules(): MetadataRoute.Robots['rules'] {
  return [
    {
      userAgent: 'GPTBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2,
    },
    {
      userAgent: 'PerplexityBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2,
    },
    {
      userAgent: 'ClaudeBot',
      allow: ['/blog/', '/services/', '/about/', '/contact/'],
      disallow: ['/admin/', '/portal/', '/api/', '/auth/', '/_next/'],
      crawlDelay: 2,
    },
  ];
}

export function createSearchEngineRules(): MetadataRoute.Robots['rules'] {
  return [
    {
      userAgent: 'Googlebot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      crawlDelay: 1,
    },
    {
      userAgent: 'Bingbot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
      crawlDelay: 1,
    },
    {
      userAgent: 'DuckDuckBot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/', '/auth/'],
    },
  ];
}

export function createSocialMediaRules(): MetadataRoute.Robots['rules'] {
  return [
    {
      userAgent: 'facebookexternalhit',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },
    {
      userAgent: 'Twitterbot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },
    {
      userAgent: 'LinkedInBot',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/api/'],
    },
  ];
}

export function getRobotsStats(robots: MetadataRoute.Robots): {
  totalRules: number;
  aiCrawlerRules: number;
  searchEngineRules: number;
  socialMediaRules: number;
  blockedCrawlers: number;
  crawlDelays: number[];
} {
  const aiCrawlers = ['GPTBot', 'PerplexityBot', 'ClaudeBot'];
  const searchEngines = ['Googlebot', 'Bingbot', 'DuckDuckBot'];
  const socialMedia = ['facebookexternalhit', 'Twitterbot', 'LinkedInBot'];

  const aiCrawlerRules =
    robots.rules?.filter((rule) => aiCrawlers.includes(rule.userAgent)).length ?? 0;

  const searchEngineRules =
    robots.rules?.filter((rule) => searchEngines.includes(rule.userAgent)).length ?? 0;

  const socialMediaRules =
    robots.rules?.filter((rule) => socialMedia.includes(rule.userAgent)).length ?? 0;

  const blockedCrawlers =
    robots.rules?.filter((rule) => rule.disallow?.includes('/') && !rule.allow?.includes('/'))
      .length ?? 0;

  const crawlDelays =
    (robots.rules
      ?.map((rule) => rule.crawlDelay)
      .filter((delay) => delay !== undefined) as number[]) ?? [];

  return {
    totalRules: robots.rules?.length ?? 0,
    aiCrawlerRules,
    searchEngineRules,
    socialMediaRules,
    blockedCrawlers,
    crawlDelays,
  };
}

// ============================================================================
// ROBOTS TESTING UTILITIES
// ============================================================================

export function createTestRobotsConfig(overrides?: {
  environment?: 'production' | 'staging' | 'development';
  customRules?: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
  }>;
}): {
  environment: 'production' | 'staging' | 'development';
  customRules: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
  }>;
} {
  return {
    environment: overrides?.environment ?? 'production',
    customRules: overrides?.customRules ?? [
      {
        userAgent: 'TestBot',
        allow: ['/test/'],
        disallow: ['/admin/'],
      },
    ],
  };
}

export function expectValidRobots(robots: MetadataRoute.Robots) {
  expect(robots).toBeDefined();
  expect(Array.isArray(robots.rules)).toBe(true);
  expect(robots.rules.length).toBeGreaterThan(0);

  // Check first rule structure
  const firstRule = robots.rules[0];
  expect(firstRule.userAgent).toBeTruthy();
  expect(Array.isArray(firstRule.allow) || Array.isArray(firstRule.disallow)).toBe(true);
}

export function expectAIcrawlerSupport(robots: MetadataRoute.Robots) {
  const aiCrawlers = ['GPTBot', 'PerplexityBot', 'ClaudeBot'];

  aiCrawlers.forEach((crawler) => {
    const rule = robots.rules?.find((rule) => rule.userAgent === crawler);
    expect(rule).toBeDefined();
    expect(rule?.allow).toContain('/blog/');
    expect(rule?.disallow).toContain('/admin/');
  });
}

export function expectProductionRules(robots: MetadataRoute.Robots) {
  // Should have sitemap
  expect(robots.sitemap).toBeTruthy();
  expect(robots.sitemap).toMatch(/^https?:\/\//);

  // Should not block everything
  const defaultRule = robots.rules?.find((rule) => rule.userAgent === '*');
  expect(defaultRule?.allow).toContain('/');
}
```

**Robots.txt generation principles:**

- **Environment awareness**: Different rules for production vs staging
- **AI crawler support**: Proper rules for GPTBot, PerplexityBot, ClaudeBot
- **Tenant isolation**: Per-tenant robots.txt generation
- **SEO optimization**: Proper crawl delays and access rules
- **Security**: Block admin areas and sensitive endpoints
- **Validation**: Comprehensive robots validation and testing
- **Social media**: Support for social media crawlers
- **Analytics**: Allow SEO tools with limited access

---

## Boundaries

| Tier             | Scope                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 8.4 specification; implement AI crawler support; add environment handling; include validation; support tenant isolation |
| ⚠️ **Ask first** | Changing existing robots patterns; modifying AI crawler rules; updating environment handling                                           |
| 🚫 **Never**     | Skip environment detection; ignore AI crawlers; bypass validation; expose sensitive areas                                              |

---

## Success Verification

- [ ] **[Agent]** Test production robots — Production rules work correctly
- [ ] **[Agent]** Verify staging robots — Staging blocks all crawlers
- [ ] **[Agent]** Test AI crawler support — AI crawlers have proper rules
- [ ] **[Agent]** Verify tenant isolation — Each tenant gets their own robots
- [ ] **[Agent]** Test validation — Invalid robots caught correctly
- [ ] **[Agent]** Test social media crawlers — Social media access works
- [ ] **[Agent]** Test edge cases — Missing data handled gracefully
- [ ] **[Human]** Test with real tenant configs — Production robots works correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Environment detection**: Properly detect production vs staging environments
- **AI crawler identification**: Ensure AI crawlers are properly identified and handled
- **Path validation**: Ensure all paths start with forward slash
- **Crawl delays**: Balance crawl delays with performance needs
- **Social media access**: Allow social media crawlers for proper sharing
- **SEO tools**: Allow SEO tools with limited access to prevent abuse
- **Blocked crawlers**: Ensure problematic crawlers are properly blocked

---

## Out of Scope

- Metadata generation system (handled in separate task)
- Dynamic sitemap generation (handled in separate task)
- Structured data system (handled in separate task)
- Dynamic OG images (handled in separate task)
- CMS adapter integration (handled in separate task)
- GEO optimization layer (handled in separate task)
- A/B testing system (handled in separate task)

---

## References

- [Section 8.4 Per-Tenant robots.ts](docs/plan/domain-8/8.4-per-tenant-robotsts.md)
- [Section 8.1 Philosophy](docs/plan/domain-8/8.1-philosophy.md)
- [Next.js Robots Documentation](https://nextjs.org/docs/app/api-reference/functions/robots)
- [Google Robots.txt Guidelines](https://developers.google.com/search/docs/crawling-indexing/robots-txt)
- [AI Crawler Documentation](https://platform.openai.com/docs/crawling)
- [Perplexity Bot Documentation](https://perplexity.ai/blog/web-crawler)
- [Claude Bot Documentation](https://docs.anthropic.com/claude/docs/crawling)

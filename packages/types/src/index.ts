/**
 * @file packages/types/src/index.ts
 * [TRACE:FILE=packages.types.index]
 *
 * Purpose: Barrel export for shared site configuration types, Zod schemas, and industry
 *          definitions. Single entry point for templates and packages that need SiteConfig
 *          or industry-specific defaults.
 *
 * Relationship: Consumed by @repo/features, @repo/ui (ThemeInjector), @repo/page-templates,
 *               and every template's site.config.ts. Depends only on zod (in site-config).
 *
 * System role: Foundation layer — no internal @repo dependencies. Defines the contract
 *              (SiteConfig, conversionFlow, theme, integrations) that templates implement.
 *
 * Assumptions: site.config.ts in each template satisfies SiteConfig; industry configs
 *              are used for schema.org and optional defaults, not runtime validation.
 */

// Re-export all site config types and the Zod schema for validation
export type {
  SiteConfig,
  ConversionFlowConfig,
  ConversionFlowType,
  BookingFlowConfig,
  ContactFlowConfig,
  QuoteFlowConfig,
  DispatchFlowConfig,
  NavLink,
  SocialLink,
  FooterColumn,
  FooterConfig,
  BusinessHours,
  ContactInfo,
  SeoDefaults,
  ThemeColors,
  ThemeFonts,
} from './site-config';

export { siteConfigSchema } from './site-config';

// Re-export industry type and config lookup
export type { Industry, IndustryConfig } from './industry';
export { industryConfigs, getIndustryConfig } from './industry-configs';

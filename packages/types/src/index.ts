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

export type { Industry, IndustryConfig } from './industry';
export { industryConfigs, getIndustryConfig } from './industry-configs';

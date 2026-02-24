// Multi-Tenant Package
// Provides infrastructure for tenant resolution, billing, rate limiting, domains, and SSO

// ============================================================================
// Tenant Resolution (DOMAIN-7-001)
// ============================================================================

export {
  // Main functions
  resolveTenant,
  extractTenantIdentifier,
  createTenantMiddleware,

  // Cache management
  invalidateTenantCache,
  invalidateTenantCacheById,
  invalidateTenantServiceAreas,

  // Validation
  validateTenantConfig,
  isReservedSubdomain,
  validateSubdomainFormat,

  // Utilities
  getTenantFromHeaders,
  getTenantConfigFromHeaders,
  buildTenantUrl,
} from './resolve-tenant';

export type {
  TenantIdentifier,
  TenantResolution,
  TenantResolutionSuccess,
  TenantResolutionFailure,
} from './resolve-tenant';

// ============================================================================
// Billing Status (DOMAIN-7-002)
// ============================================================================

export {
  // Main functions
  checkBillingStatus,
  updateBillingStatus,
  createBillingMiddleware,

  // Validation
  isValidBillingStatus,
  canAccessSite,
  isBillingActive,
  isInTrial,

  // Event tracking
  trackBillingEvent,
  getBillingEvents,

  // Health & stats
  getBillingHealthStats,

  // Tier management
  getTenantTier,
  updateTenantTier,

  // Utilities
  getBillingStatusFromHeaders,
  getBillingStatusHeader,
  notifyBillingStatusChange,
} from './check-billing';

export type { BillingStatus, BillingEvent, BillingHealthStats } from './check-billing';

// ============================================================================
// Suspended Page (DOMAIN-7-002)
// ============================================================================

export { default as SuspendedPage, CancelledPage, TrialExpiredPage } from './suspended-page';
export { generateMetadata as suspendedPageMetadata } from './suspended-page';

// ============================================================================
// Rate Limiting (DOMAIN-7-003)
// ============================================================================

export {
  // Rate limiters
  rateLimiters,

  // Main functions
  createRateLimitMiddleware,
  checkEndpointRateLimit,
  createEndpointRateLimitMiddleware,

  // Dynamic limits
  getDynamicRateLimit,
  setDynamicRateLimit,
  removeDynamicRateLimit,

  // Tier management
  getTenantTier as getTenantTierForRateLimit,
  clearTenantTierCache,

  // Utilities
  getClientIP,
  getRateLimitKey,
  isRateLimited,

  // Health & analytics
  getRateLimitHealth,
  getRateLimitAnalytics,

  // Configuration
  updateRateLimitConfig,
  checkAllRateLimits,
} from './rate-limit';

export type {
  RateLimitTier,
  EndpointLimiter,
  RateLimitResult,
  RateLimitConfig,
  RateLimitHealth,
  RateLimitAnalytics,
} from './rate-limit';

// ============================================================================
// Vercel Domains (DOMAIN-7-004)
// ============================================================================

export {
  // Domain lifecycle
  addTenantDomain,
  checkDomainStatus,
  pollDomainVerification,
  removeTenantDomain,

  // DNS & utilities
  getDomainDNSRecords,
  validateDomainFormat,
  extractRootDomain,

  // Events
  getDomainEvents,

  // Analytics & health
  getDomainAnalytics,
  getDomainHealth,
} from './vercel-domains';

export type {
  DomainVerificationRecord,
  DomainStatus,
  DomainConfig,
  DomainEvent,
  DomainAnalytics,
  DomainHealth,
} from './vercel-domains';

// ============================================================================
// Enterprise SSO (DOMAIN-7-005)
// ============================================================================

export {
  // Provider management
  registerSAMLProvider,
  getTenantSSOProviders,
  updateSSOProvider,
  removeSSOProvider,

  // Authentication
  getSSOLoginUrl,
  authenticateWithSSO,
  findSSOProviderForEmail,
  mapSSOAttributesToUser,

  // Session management
  createSSOSession,
  validateSSOSession,

  // Validation
  validateSAMLProviderConfig,

  // Utilities
  getSSODomainsForTenant,
  hasSSOForTenant,
  isEmailManagedBySSO,

  // RLS helpers
  getSSOProviderIdForUser,
  buildRLSWithSSO,

  // Health
  getSSOProviderHealth,
} from './enterprise-sso';

export type {
  SSOProviderType,
  SAMLAttributeMappings,
  SSOProvider,
  SSOSession,
  SSOUser,
  SSOProviderHealth,
  SAMLValidationResult,
} from './enterprise-sso';

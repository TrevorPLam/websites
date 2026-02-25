import 'server-only';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Redis instance for caching
const redis = Redis.fromEnv();

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Supabase client for SSO operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ============================================================================
// TYPES
// ============================================================================

export type SSOProviderType = 'saml';

export type SAMLAttributeMappings = {
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
};

export type SSOProvider = {
  providerId: string;
  providerType: SSOProviderType;
  domains: string[];
  attributeMappings: SAMLAttributeMappings;
  createdAt: string;
  updatedAt?: string;
};

export type SSOSession = {
  userId: string;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
};

export type SSOUser = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  tenantId: string;
};

export type SSOProviderHealth = {
  totalProviders: number;
  activeProviders: number;
  providersByType: Record<string, number>;
  recentActivity: Array<{
    providerId: string;
    tenantId: string;
    action: string;
    timestamp: string;
  }>;
};

export type SAMLValidationResult = {
  valid: boolean;
  errors: string[];
};

// ============================================================================
// DATABASE INTERFACE
// ============================================================================

async function storeSSOProvider(
  tenantId: string,
  providerId: string,
  config: {
    domains: string[];
    attributeMappings?: SAMLAttributeMappings;
  }
): Promise<void> {
  await supabase.from('tenant_sso_providers').upsert({
    tenant_id: tenantId,
    provider_id: providerId,
    provider_type: 'saml',
    domains: config.domains,
    attribute_mappings: config.attributeMappings,
    created_at: new Date().toISOString(),
  });
  console.log(`Stored SSO provider ${providerId} for tenant ${tenantId}`);
}

async function getSSOProviderFromDB(providerId: string): Promise<SSOProvider | null> {
  const { data } = await supabase
    .from('tenant_sso_providers')
    .select('*')
    .eq('provider_id', providerId)
    .single();

  if (!data) return null;

  return {
    providerId: data.provider_id,
    providerType: data.provider_type,
    domains: data.domains,
    attributeMappings: data.attribute_mappings || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

async function updateSSOProviderInDB(
  tenantId: string,
  providerId: string,
  updates: Partial<SSOProvider>
): Promise<void> {
  await supabase
    .from('tenant_sso_providers')
    .update({
      domains: updates.domains,
      attribute_mappings: updates.attributeMappings,
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('provider_id', providerId);
  console.log(`Updated SSO provider ${providerId} for tenant ${tenantId}`);
}

async function removeSSOProviderFromDB(tenantId: string, providerId: string): Promise<void> {
  await supabase
    .from('tenant_sso_providers')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('provider_id', providerId);
  console.log(`Removed SSO provider ${providerId} for tenant ${tenantId}`);
}

async function getTenantSSOProvidersFromDB(tenantId: string): Promise<SSOProvider[]> {
  const { data } = await supabase
    .from('tenant_sso_providers')
    .select('*')
    .eq('tenant_id', tenantId);

  return (data || []).map(provider => ({
    providerId: provider.provider_id,
    providerType: provider.provider_type,
    domains: provider.domains,
    attributeMappings: provider.attribute_mappings || {},
    createdAt: provider.created_at,
    updatedAt: provider.updated_at,
  }));
}

async function findSSOProviderByDomain(domain: string): Promise<SSOProvider | null> {
  const { data } = await supabase
    .from('tenant_sso_providers')
    .select('*')
    .like('domains', `%${domain}%`)
    .single();

  if (!data) return null;

  return {
    providerId: data.provider_id,
    providerType: data.provider_type,
    domains: data.domains,
    attributeMappings: data.attribute_mappings || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

async function getTenantIdForUser(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('email', email)
    .single();

  return data?.tenant_id ?? null;
}

async function createOrUpdateUser(user: SSOUser): Promise<string> {
  // Create or update user in database
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', user.email)
    .eq('tenant_id', user.tenantId)
    .single();

  if (existingUser) {
    await supabase
      .from('users')
      .update({
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id);
    return existingUser.id;
  } else {
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        id: user.userId,
        tenant_id: user.tenantId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    return newUser?.id ?? user.userId;
  }
}

// ============================================================================
// SAML 2.0 SSO REGISTRATION
// Called when enterprise tenant sets up SSO in the client portal
// ============================================================================

export async function registerSAMLProvider(
  tenantId: string,
  options: {
    metadataUrl: string; // IdP metadata URL (Azure AD / Okta format)
    domains: string[]; // Email domains (e.g., ['acmecorp.com'])
    attributeMappings?: SAMLAttributeMappings;
  }
): Promise<{ providerId: string }> {
  // Validate inputs
  const validation = validateSAMLProviderConfig({
    metadataUrl: options.metadataUrl,
    domains: options.domains,
    attributeMappings: options.attributeMappings,
  });

  if (!validation.valid) {
    throw new Error(`Invalid SAML configuration: ${validation.errors.join(', ')}`);
  }

  // Uses Supabase Management API (service role required)
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/sso/providers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      type: 'saml',
      metadata_url: options.metadataUrl,
      domains: options.domains,
      attribute_mapping: {
        keys: {
          first_name: { name: options.attributeMappings?.firstName ?? 'firstName' },
          last_name: { name: options.attributeMappings?.lastName ?? 'lastName' },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SAML registration failed: ${JSON.stringify(error)}`);
  }

  const { id: providerId } = await response.json();

  // Store the provider association for this tenant
  await storeSSOProvider(tenantId, providerId, {
    domains: options.domains,
    attributeMappings: options.attributeMappings,
  });

  return { providerId };
}

// ============================================================================
// SSO LOGIN URL GENERATION
// Redirect enterprise users to their IdP for authentication
// ============================================================================

export async function getSSOLoginUrl(
  email: string,
  redirectTo: string,
  supabase: SupabaseClient
): Promise<string | null> {
  const domain = email.split('@')[1];

  const { data, error } = await supabase.auth.signInWithSSO({
    domain,
    options: { redirectTo },
  });

  if (error || !data?.url) return null;
  return data.url;
}

// ============================================================================
// TENANT SSO MANAGEMENT
// ============================================================================

export async function getTenantSSOProviders(tenantId: string): Promise<SSOProvider[]> {
  return await getTenantSSOProvidersFromDB(tenantId);
}

export async function updateSSOProvider(
  tenantId: string,
  providerId: string,
  updates: {
    domains?: string[];
    attributeMappings?: SAMLAttributeMappings;
  }
): Promise<void> {
  await updateSSOProviderInDB(tenantId, providerId, updates);

  // Clear any cached data
  await redis.del(`sso:provider:${providerId}`);
}

export async function removeSSOProvider(tenantId: string, providerId: string): Promise<void> {
  // Remove from database
  await removeSSOProviderFromDB(tenantId, providerId);

  // Remove from Supabase Auth
  await fetch(`${SUPABASE_URL}/auth/v1/admin/sso/providers/${providerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
    },
  });

  // Clear cache
  await redis.del(`sso:provider:${providerId}`);
}

// ============================================================================
// SSO USER LOOKUP AND MAPPING
// ============================================================================

export async function findSSOProviderForEmail(email: string): Promise<string | null> {
  const domain = email.split('@')[1];

  const provider = await findSSOProviderByDomain(domain);
  return provider?.providerId ?? null;
}

export async function mapSSOAttributesToUser(
  providerId: string,
  samlAttributes: Record<string, any>,
  tenantId: string
): Promise<SSOUser> {
  // Get provider configuration
  const provider = await getSSOProviderFromDB(providerId);
  const mappings = provider?.attributeMappings ?? {};

  // Map SAML attributes to user fields
  const email = samlAttributes.email || samlAttributes.emailaddress || samlAttributes.Email;
  const user: SSOUser = {
    userId: crypto.randomUUID(),
    email,
    firstName: samlAttributes[mappings.firstName ?? 'givenname'] || samlAttributes.givenName,
    lastName: samlAttributes[mappings.lastName ?? 'sn'] || samlAttributes.surname,
    role: samlAttributes[mappings.role ?? 'department'] || samlAttributes.department,
    tenantId,
  };

  // Create or update user in database
  const userId = await createOrUpdateUser(user);

  return { ...user, userId };
}

// ============================================================================
// SSO AUTHENTICATION FLOW
// ============================================================================

export async function authenticateWithSSO(
  email: string,
  redirectTo: string,
  supabase: SupabaseClient
): Promise<{ success: boolean; userId?: string; loginUrl?: string; error?: string }> {
  try {
    // Find SSO provider for this email domain
    const providerId = await findSSOProviderForEmail(email);
    if (!providerId) {
      return { success: false, error: 'No SSO provider found for this domain' };
    }

    // Generate SSO login URL
    const loginUrl = await getSSOLoginUrl(email, redirectTo, supabase);
    if (!loginUrl) {
      return { success: false, error: 'Failed to generate SSO login URL' };
    }

    // Return login URL for redirect
    return { success: true, loginUrl };
  } catch (error: any) {
    console.error('SSO authentication error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// SSO SESSION MANAGEMENT
// ============================================================================

export async function createSSOSession(
  userId: string,
  providerId: string,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  // Store SSO session in database
  // await supabase.from('sso_sessions').insert({
  //   user_id: userId,
  //   provider_id: providerId,
  //   access_token: accessToken,
  //   refresh_token: refreshToken,
  //   expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
  //   created_at: new Date().toISOString(),
  // });

  // Also cache in Redis for quick lookup
  await redis.set(
    `sso:session:${userId}:${providerId}`,
    {
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
    { ex: 3600 }
  );
}

export async function validateSSOSession(
  userId: string,
  providerId: string,
  accessToken: string
): Promise<boolean> {
  // Check cache first
  const cached = await redis.get<{
    accessToken: string;
    expiresAt: string;
  }>(`sso:session:${userId}:${providerId}`);

  if (cached) {
    return cached.accessToken === accessToken && new Date(cached.expiresAt) > new Date();
  }

  // Fallback to database
  // const { data: session } = await supabase
  //   .from('sso_sessions')
  //   .select('expires_at')
  //   .eq('user_id', userId)
  //   .eq('provider_id', providerId)
  //   .eq('access_token', accessToken)
  //   .single();
  //
  // if (!session) return false;
  // return new Date(session.expires_at) > new Date();

  return false;
}

// ============================================================================
// SSO PROVIDER HEALTH CHECK
// ============================================================================

export async function getSSOProviderHealth(): Promise<SSOProviderHealth> {
  const providers = await getAllSSOProviders();

  const typeCounts = providers.reduce(
    (acc, provider) => {
      acc[provider.providerType] = (acc[provider.providerType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalProviders: providers.length,
    activeProviders: providers.length, // All providers are considered active
    providersByType: typeCounts,
    recentActivity: providers.slice(0, 10).map((p) => ({
      providerId: p.providerId,
      tenantId: 'unknown', // Would need to include tenant_id in query
      action: 'provider_created',
      timestamp: p.createdAt,
    })),
  };
}

async function getAllSSOProviders(): Promise<SSOProvider[]> {
  // const { data } = await supabase.from('tenant_sso_providers').select('*');
  // return data ?? [];
  return [];
}

// ============================================================================
// SSO PROVIDER VALIDATION
// ============================================================================

export function validateSAMLProviderConfig(config: {
  metadataUrl: string;
  domains: string[];
  attributeMappings?: SAMLAttributeMappings;
}): SAMLValidationResult {
  const errors: string[] = [];

  // Validate metadata URL
  try {
    const url = new URL(config.metadataUrl);
    // SAML metadata must be served over HTTPS
    if (url.protocol !== 'https:') {
      errors.push('Metadata URL must use HTTPS');
    }
  } catch {
    errors.push('Invalid metadata URL format');
  }

  // Validate domains
  if (!config.domains || config.domains.length === 0) {
    errors.push('At least one domain is required');
  }

  config.domains.forEach((domain) => {
    // Domain should not include @ symbol
    if (domain.includes('@')) {
      errors.push(`Invalid domain format (should not include @): ${domain}`);
    }
    // Basic domain validation
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
      errors.push(`Invalid domain format: ${domain}`);
    }
  });

  // Validate attribute mappings
  if (config.attributeMappings) {
    const validMappings = ['firstName', 'lastName', 'role', 'email'];
    Object.keys(config.attributeMappings).forEach((key) => {
      if (!validMappings.includes(key)) {
        errors.push(`Invalid attribute mapping: ${key}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// SSO USER INTERFACE HELPERS
// ============================================================================

export async function getSSODomainsForTenant(tenantId: string): Promise<string[]> {
  const providers = await getTenantSSOProviders(tenantId);
  return providers.flatMap((p) => p.domains || []);
}

export async function hasSSOForTenant(tenantId: string): Promise<boolean> {
  const domains = await getSSODomainsForTenant(tenantId);
  return domains.length > 0;
}

export async function isEmailManagedBySSO(email: string, tenantId: string): Promise<boolean> {
  const domains = await getSSODomainsForTenant(tenantId);
  const domain = email.split('@')[1];
  return domains.includes(domain);
}

// ============================================================================
// RLS POLICY HELPERS
// These functions help integrate SSO with Row Level Security policies
// ============================================================================

export async function getSSOProviderIdForUser(userId: string): Promise<string | null> {
  // Get the SSO provider ID associated with this user
  // const { data } = await supabase
  //   .from('sso_sessions')
  //   .select('provider_id')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(1)
  //   .single();
  // return data?.provider_id ?? null;
  return null;
}

export function buildRLSWithSSO(baseRLS: string, ssoProviderId?: string): string {
  // Modify an RLS policy to include SSO provider checks
  if (!ssoProviderId) {
    return baseRLS;
  }

  // Validate provider ID is a UUID to prevent SQL injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(ssoProviderId)) {
    throw new Error('Invalid SSO provider ID format');
  }

  return `(${baseRLS}) OR (sso_provider_id = '${ssoProviderId}')`;
}

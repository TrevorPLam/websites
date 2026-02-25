import { db } from '@repo/db';

// ============================================================================
// SAML 2.0 SSO REGISTRATION
// Called when enterprise tenant sets up SSO in the client portal
// ============================================================================

// URL validation pattern to prevent SSRF attacks
const ALLOWED_IDP_PATTERNS = [
  /^https:\/\/(www\.)?azure\.net\//, // Azure AD
  /^https:\/\/(www\.)?okta\.com\//, // Okta
  /^https:\/\/(www\.)?google\.com\//, // Google Workspace
  /^https:\/\/(.*\.)?mycompany\.com\//, // Example enterprise domain
];

function validateMetadataURL(url: string): void {
  try {
    const parsedUrl = new URL(url);

    // Must be HTTPS
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Metadata URL must use HTTPS');
    }

    // Must match allowed patterns
    const isAllowed = ALLOWED_IDP_PATTERNS.some(pattern => pattern.test(url));
    if (!isAllowed) {
      throw new Error('Metadata URL not from allowed identity provider');
    }

    // Prevent internal IP addresses
    const hostname = parsedUrl.hostname;
    if (hostname.startsWith('127.') || hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') || hostname.startsWith('169.254.') ||
        hostname === 'localhost' || hostname === 'metadata') {
      throw new Error('Metadata URL cannot point to internal addresses');
    }
  } catch (error) {
    throw new Error(`Invalid metadata URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function registerSAMLProvider(
  tenantId: string,
  options: {
    metadataUrl: string; // IdP metadata URL (Azure AD / Okta format)
    domains: string[]; // Email domains (e.g., ['acmecorp.com'])
    attributeMappings?: {
      // Map IdP attributes to Supabase user fields
      firstName?: string;
      lastName?: string;
      role?: string;
    };
  }
): Promise<{ providerId: string }> {
  // Validate metadata URL to prevent SSRF
  validateMetadataURL(options.metadataUrl);

  // Check for domain uniqueness across all providers
  const existingDomains = await db
    .from('tenant_sso_providers')
    .select('domains')
    .neq('tenant_id', tenantId);

  const existingDomainSet = new Set(
    existingDomains.data?.flatMap(provider => provider.domains || []) || []
  );

  const conflictingDomains = options.domains.filter(domain => existingDomainSet.has(domain));
  if (conflictingDomains.length > 0) {
    throw new Error(`Domains already registered by another provider: ${conflictingDomains.join(', ')}`);
  }

  let providerId: string;

  try {
    // Uses Supabase Management API (service role required)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/sso/providers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SAML registration failed: ${JSON.stringify(error)}`);
    }

    const { id: responseId } = await response.json();
    providerId = responseId;
  } catch (error) {
    // If Supabase registration fails, don't proceed with DB write
    throw error;
  }

  try {
    // Store the provider association for this tenant
    await db.from('tenant_sso_providers').upsert({
      tenant_id: tenantId,
      provider_id: providerId,
      provider_type: 'saml',
      domains: options.domains,
      created_at: new Date().toISOString(),
    });
  } catch (dbError) {
    // If DB write fails, rollback Supabase provider registration
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/sso/providers/${providerId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          },
        }
      );
    } catch (rollbackError) {
      console.error('Failed to rollback SAML provider:', rollbackError);
    }
    throw new Error(`Database write failed, SAML provider rolled back: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
  }

  return { providerId };
}

// ============================================================================
// SSO LOGIN URL GENERATION
// Redirect enterprise users to their IdP for authentication
// ============================================================================

// Singleton Supabase client for SSO operations
let supabaseSSOClient: ReturnType<typeof import('@supabase/supabase-js').createClient> | null = null;

async function getSupabaseSSOClient() {
  if (!supabaseSSOClient) {
    // Use service role key for server-side operations (more secure than anon key)
    supabaseSSOClient = (await import('@supabase/supabase-js'))
      .createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
      );
  }
  return supabaseSSOClient;
}

export async function getSSOLoginUrl(email: string, redirectTo: string): Promise<string | null> {
  const domain = email.split('@')[1];

  const { data, error } = await (await getSupabaseSSOClient())
    .auth.signInWithSSO({
      domain,
      options: { redirectTo },
    });

  if (error || !data?.url) return null;
  return data.url;
}

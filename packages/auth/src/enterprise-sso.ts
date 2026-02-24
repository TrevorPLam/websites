import { db } from '@repo/db';

// ============================================================================
// SAML 2.0 SSO REGISTRATION
// Called when enterprise tenant sets up SSO in the client portal
// ============================================================================

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

  const { id: providerId } = await response.json();

  // Store the provider association for this tenant
  await db.from('tenant_sso_providers').upsert({
    tenant_id: tenantId,
    provider_id: providerId,
    provider_type: 'saml',
    domains: options.domains,
    created_at: new Date().toISOString(),
  });

  return { providerId };
}

// ============================================================================
// SSO LOGIN URL GENERATION
// Redirect enterprise users to their IdP for authentication
// ============================================================================

export async function getSSOLoginUrl(email: string, redirectTo: string): Promise<string | null> {
  const domain = email.split('@')[1];

  const { data, error } = await (await import('@supabase/supabase-js'))
    .createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    .auth.signInWithSSO({
      domain,
      options: { redirectTo },
    });

  if (error || !data?.url) return null;
  return data.url;
}

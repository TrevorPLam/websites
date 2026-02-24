#!/usr/bin/env tsx

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed script is blocked in production mode.');
}

type Tenant = {
  id: string;
  subdomain: string;
  status: string;
  plan: string;
  config: Record<string, unknown>;
};

function buildFixtures(): { tenants: Tenant[]; leads: Record<string, unknown>[] } {
  const tenants: Tenant[] = [
    {
      id: crypto.randomUUID(),
      subdomain: 'demo-hvac',
      status: 'active',
      plan: 'pro',
      config: { identity: { siteName: 'Arctic Air HVAC', industry: 'hvac' } },
    },
    {
      id: crypto.randomUUID(),
      subdomain: 'demo-plumbing',
      status: 'active',
      plan: 'starter',
      config: { identity: { siteName: "Mike\'s Plumbing", industry: 'plumbing' } },
    },
    {
      id: crypto.randomUUID(),
      subdomain: 'demo-dental',
      status: 'active',
      plan: 'enterprise',
      config: { identity: { siteName: 'Bright Smile Dental', industry: 'dental' } },
    },
  ];

  const leads = tenants.flatMap((tenant) =>
    Array.from({ length: 12 }).map((_, index) => ({
      id: crypto.randomUUID(),
      tenant_id: tenant.id,
      name: `Demo Lead ${index + 1}`,
      email: `lead${index + 1}@example.com`,
      message: 'Interested in a free estimate for services.',
      source: 'contact_form',
      status: 'new',
      score: Math.floor(Math.random() * 100),
    }))
  );

  return { tenants, leads };
}

async function upsertTable(
  baseUrl: string,
  serviceRoleKey: string,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string
): Promise<void> {
  const response = await fetch(`${baseUrl}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Failed to upsert ${table}: ${response.status} ${await response.text()}`);
  }
}

async function seed(): Promise<void> {
  const { tenants, leads } = buildFixtures();

  if (process.env.SEED_DRY_RUN === '1') {
    console.log(`✅ Dry run: prepared ${tenants.length} tenants and ${leads.length} leads.`);
    return;
  }

  const baseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  await upsertTable(baseUrl, serviceRoleKey, 'tenants', tenants, 'subdomain');
  await upsertTable(baseUrl, serviceRoleKey, 'leads', leads, 'id');

  console.log(`✅ Seeded ${tenants.length} tenants and ${leads.length} leads.`);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});

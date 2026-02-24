import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata, buildLocalBusinessSchema, JsonLd } from '@repo/seo';
import siteConfig from '../../../site.config';
import { ServiceAreaHero } from '../../../components/service-area/ServiceAreaHero';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return (siteConfig.serviceAreas ?? [])
    .slice(0, 10)
    .map((area: string) => ({ slug: slugifyArea(area) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = findServiceAreaBySlug(slug);

  if (!area) {
    return {};
  }

  const { city, state } = parseArea(area);

  return buildMetadata({
    config: siteConfig,
    path: `/service-area/${slug}`,
    pageTitle: `${siteConfig.industry} services in ${city}${state ? `, ${state}` : ''}`,
    pageDescription: `${siteConfig.name} offers trusted ${siteConfig.industry} services in ${city}${state ? `, ${state}` : ''}.`,
  });
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = findServiceAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  const { city, state } = parseArea(area);
  const services = siteConfig.services ?? [];

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      <JsonLd schema={buildLocalBusinessSchema(siteConfig)} />
      <ServiceAreaHero
        city={city}
        state={state}
        businessName={siteConfig.name}
        industry={siteConfig.industry}
        tagline={siteConfig.tagline}
        phone={siteConfig.contact.phone}
      />

      <section>
        <h2 className="text-2xl font-semibold">Popular services in {city}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((service: { name: string; description: string; slug?: string }) => (
            <li
              key={service.slug ?? service.name}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Other service areas</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {(siteConfig.serviceAreas ?? [])
            .filter((serviceArea: string) => slugifyArea(serviceArea) !== slug)
            .slice(0, 8)
            .map((serviceArea: string) => (
              <li key={serviceArea}>
                <a
                  href={`/service-area/${slugifyArea(serviceArea)}`}
                  className="inline-flex rounded-full border border-border px-3 py-1 text-sm"
                >
                  {serviceArea}
                </a>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}

function findServiceAreaBySlug(slug: string): string | undefined {
  return (siteConfig.serviceAreas ?? []).find((area: string) => slugifyArea(area) === slug);
}

function parseArea(area: string): { city: string; state?: string } {
  const [city, state] = area.split(',').map((segment) => segment.trim());
  return { city: city || area, state };
}

function slugifyArea(area: string): string {
  return area
    .toLowerCase()
    .replace(/,\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

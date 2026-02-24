import type { SiteConfig } from '@repo/types';

export type LocalBusinessSchema = {
  '@context': 'https://schema.org';
  '@type': string | string[];
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: Array<{
      '@type': 'Offer';
      itemOffered: { '@type': 'Service'; name: string };
    }>;
  };
  sameAs?: string[];
};

export type FAQSchema = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

export function buildLocalBusinessSchema(config: SiteConfig): LocalBusinessSchema {
  const address = config.contact.address;

  return {
    '@context': 'https://schema.org',
    '@type': config.seo.schemaType ?? 'LocalBusiness',
    name: config.name,
    description: config.description,
    url: config.url,
    telephone: config.contact.phone,
    email: config.contact.email,
    address: address
      ? {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          addressLocality: address.city,
          addressRegion: address.state,
          postalCode: address.zip,
          addressCountry: address.country || 'US',
        }
      : undefined,
    openingHoursSpecification: config.contact.hours?.flatMap((entry) => {
      const [opens, closes] = entry.hours.split('-').map((item) => item.trim());
      if (!opens || !closes) return [];
      return [
        {
          '@type': 'OpeningHoursSpecification' as const,
          dayOfWeek: entry.label,
          opens,
          closes,
        },
      ];
    }),
    sameAs: config.socialLinks.map((item) => item.url),
  };
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

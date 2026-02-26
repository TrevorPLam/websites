import React from 'react'

/**
 * @file apps/web/src/widgets/cta-section/ui/CtaSection.tsx
 * @summary CTA section component.
 * @description Call-to-action section with headline and button.
 * @security No sensitive data handling; UI component only.
 * @adr none
 * @requirements DOMAIN-3-6
 */

export interface CtaSectionProps {
  headline: string;
  subheadline?: string;
  cta: {
    label: string;
    href: string;
  };
}

/**
 * Renders a call-to-action section with headline and button.
 *
 * @param props CTA section props including headline, subheadline, and call-to-action button.
 * @returns JSX element representing the CTA section component.
 */
export function CtaSection({ headline, subheadline, cta }: CtaSectionProps) {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{headline}</h2>
        {subheadline && (
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">{subheadline}</p>
        )}
        <a
          href={cta.href}
          className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
        >
          {cta.label}
        </a>
      </div>
    </section>
  );
}

/**
 * @file apps/web/app/page.tsx
 * @role runtime
 * @summary Home page composition for the main landing experience.
 *
 * @entrypoints
 * - Route: /
 *
 * @exports
 * - default HomePage
 *
 * @depends_on
 * - Internal: apps/web/components/Hero.tsx
 * - Internal: apps/web/components/ValueProps.tsx
 * - Internal: apps/web/components/ServicesOverview.tsx
 * - Internal: apps/web/components/SocialProof.tsx
 * - Internal: apps/web/components/FinalCTA.tsx
 *
 * @used_by
 * - Next.js app router
 *
 * @runtime
 * - environment: server
 * - side_effects: none
 *
 * @data_flow
 * - inputs: none
 * - outputs: rendered homepage sections
 *
 * @invariants
 * - Section order maintains above-the-fold content priority
 *
 * @gotchas
 * - Dynamic imports use SSR; ensure components are server-compatible
 *
 * @issues
 * - [severity:low] None observed in-file.
 *
 * @opportunities
 * - Add page-specific metadata if SEO requirements change
 *
 * @verification
 * - Load / and verify sections render in order
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import ValueProps from '@/components/ValueProps';
import { ServicesOverview } from '@/features/services';

// Below-fold components loaded dynamically for better initial load
const SocialProof = dynamic(() => import('@/components/SocialProof'), {
  loading: () => <div className="sr-only">Loading testimonials…</div>,
  ssr: true,
});

const FinalCTA = dynamic(() => import('@/components/FinalCTA'), {
  loading: () => <div className="sr-only">Loading final call to action…</div>,
  ssr: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesOverview />
      <SocialProof />
      <FinalCTA />
    </>
  );
}

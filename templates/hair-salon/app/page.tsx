// File: app/page.tsx  [TRACE:FILE=app.homePage]
// Purpose: Homepage component orchestrating the main landing page layout with hero section,
//          value propositions, services overview, social proof, and call-to-action sections.
//          Implements performance optimization through dynamic imports for below-fold content.
//
// Exports / Entry: HomePage component
// Used by: Next.js as the default route for the root domain (/)
//
// Invariants:
// - Hero and value props must render synchronously for immediate visual feedback
// - Below-fold components must be dynamically loaded to optimize initial page load
// - All sections must maintain responsive design across mobile/tablet/desktop
// - Loading states must be accessible (screen reader friendly)
//
// Status: @public
// Features:
// - [FEAT:PERFORMANCE] Dynamic imports for below-fold content
// - [FEAT:UX] Progressive loading with accessible fallbacks
// - [FEAT:MARKETING] Hero, value props, services, social proof, and CTA sections

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

// [TRACE:FUNC=app.HomePage]
// [FEAT:PERFORMANCE] [FEAT:UX] [FEAT:MARKETING]
// NOTE: Landing page orchestration - balances immediate visual feedback with performance optimization.
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

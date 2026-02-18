// File: lib/services-config.ts  [TRACE:FILE=lib.services-config]
// Purpose: Template-level service configuration. Derives overview and detail data
//          from site config and industry-specific content for the services feature.
//
// Exports / Entry: servicesOverviewItems, getServiceDetailProps helper types
// Used by: Homepage, service detail pages, @repo/features ServicesOverview
//
// Invariants:
// - Data structure must match ServiceOverviewItem and ServiceDetailProps
// - Can be extended for CMS/API content source in future
//
// Status: @public
// Features:
// - [FEAT:SERVICES] Config-driven service taxonomy
// - [FEAT:CONFIGURATION] Cross-industry naming support

import { Scissors, Palette, Sparkles, Calendar } from 'lucide-react';
import type { ServiceOverviewItem } from '@repo/features';

/**
 * Services overview items for the homepage grid.
 * Align with footer.services links and service detail routes.
 */
export const servicesOverviewItems: ServiceOverviewItem[] = [
  {
    icon: Scissors,
    title: 'Haircuts & Styling',
    description:
      'Precision cuts and styling for women, men, and children to suit your lifestyle.',
    href: '/services/haircuts',
  },
  {
    icon: Palette,
    title: 'Coloring Services',
    description: 'Full color, highlights, balayage, and corrections by master colorists.',
    href: '/services/coloring',
  },
  {
    icon: Sparkles,
    title: 'Treatments',
    description: 'Deep conditioning, keratin, and scalp treatments for healthy, shiny hair.',
    href: '/services/treatments',
  },
  {
    icon: Calendar,
    title: 'Special Occasions',
    description: 'Bridal hair, updos, and styling for weddings, proms, and special events.',
    href: '/services/special-occasions',
  },
];

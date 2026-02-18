/**
 * Services feature parity tests.
 * Verifies template services config matches @repo/features ServiceOverviewItem shape and
 * that data passed to ServicesOverview/ServiceDetailLayout satisfies package contract.
 * See docs/testing/refactor-parity-matrix.md (SV1–SV3).
 */

import type { ServiceOverviewItem, ServiceDetailProps } from '@repo/features/services';
import { servicesOverviewItems } from '@/lib/services-config';

describe('Services parity (@repo/features/services)', () => {
  describe('SV1: ServiceOverviewItem shape', () => {
    it('each item has icon, title, description, href', () => {
      expect(servicesOverviewItems.length).toBeGreaterThan(0);

      for (const item of servicesOverviewItems as ServiceOverviewItem[]) {
        expect(item).toHaveProperty('icon');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('href');
        expect(typeof item.title).toBe('string');
        expect(typeof item.description).toBe('string');
        expect(typeof item.href).toBe('string');
        expect(item.href.startsWith('/')).toBe(true);
      }
    });

    it('hrefs align with service detail routes', () => {
      const hrefs = (servicesOverviewItems as ServiceOverviewItem[]).map((i) => i.href);
      expect(hrefs).toContain('/services/haircuts');
      expect(hrefs).toContain('/services/coloring');
      expect(hrefs).toContain('/services/treatments');
      expect(hrefs).toContain('/services/special-occasions');
    });
  });

  describe('SV2: ServicesOverview props (data-shape parity)', () => {
    it('servicesOverviewItems can be used as ServicesOverview services prop type', () => {
      const props = {
        services: servicesOverviewItems as ServiceOverviewItem[],
        heading: 'Our Services',
        subheading: 'Professional care',
      };
      expect(props.services.length).toBeGreaterThan(0);
      expect(props.services[0]).toHaveProperty('icon');
      expect(props.services[0]).toHaveProperty('title');
      expect(props.services[0]).toHaveProperty('href');
    });
  });

  describe('SV3: ServiceDetailProps shape', () => {
    it('ServiceDetailProps accepts siteName, baseUrl, and content props', () => {
      const minimalDetailProps: ServiceDetailProps = {
        siteName: 'Hair Salon Template',
        baseUrl: 'https://example.com',
        title: 'Haircuts',
        description: 'Precision cuts.',
        steps: [],
        pricingTiers: [],
        faqItems: [],
      };
      expect(minimalDetailProps.siteName).toBe('Hair Salon Template');
      expect(minimalDetailProps.baseUrl).toBe('https://example.com');
      expect(Array.isArray(minimalDetailProps.steps)).toBe(true);
      expect(Array.isArray(minimalDetailProps.pricingTiers)).toBe(true);
      expect(Array.isArray(minimalDetailProps.faqItems)).toBe(true);
    });
  });
});

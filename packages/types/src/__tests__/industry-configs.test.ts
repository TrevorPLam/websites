import { industryConfigs, getIndustryConfig } from '../industry-configs';
import type { Industry } from '../industry';

describe('industryConfigs', () => {
  const industries: Industry[] = [
    'salon',
    'restaurant',
    'law-firm',
    'dental',
    'medical',
    'fitness',
    'retail',
    'consulting',
    'realestate',
    'construction',
    'automotive',
    'general',
  ];

  it('has entries for all industries', () => {
    for (const industry of industries) {
      expect(industryConfigs[industry]).toBeTruthy();
    }
  });

  it('falls back to general when unknown', () => {
    // @ts-expect-error intentionally invalid industry
    const fallback = getIndustryConfig('unknown');
    expect(fallback).toBe(industryConfigs.general);
  });
});

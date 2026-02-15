import siteConfig from '@/site.config';
import { siteConfigSchema } from '@repo/types';

describe('site.config schema', () => {
  it('matches SiteConfig schema', () => {
    const parsed = siteConfigSchema.parse(siteConfig);
    expect(parsed).toBeTruthy();
  });
});

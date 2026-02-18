/**
 * @file packages/features/src/newsletter/lib/newsletter-config.ts
 * Purpose: Newsletter feature configuration
 */

export interface NewsletterFeatureConfig {
  /** Section title */
  title?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Button text */
  buttonText?: string;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
}

export function createNewsletterConfig(
  overrides: Partial<NewsletterFeatureConfig> = {}
): NewsletterFeatureConfig {
  return {
    title: 'Stay in the loop',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing!',
    errorMessage: 'Something went wrong. Please try again.',
    ...overrides,
  };
}

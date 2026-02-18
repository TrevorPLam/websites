/**
 * @file packages/features/src/newsletter/components/NewsletterSection.tsx
 * Purpose: Newsletter signup section with configurable submit handler
 */

'use client';

import { Container, Section } from '@repo/ui';
import { Input } from '@repo/ui';
import { useState } from 'react';
import type { NewsletterFeatureConfig } from '../lib/newsletter-config';

export interface NewsletterSectionProps extends NewsletterFeatureConfig {
  /** Called when user submits email */
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
}

export function NewsletterSection({
  title = 'Stay in the loop',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  errorMessage = 'Something went wrong. Please try again.',
  onSubmit,
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !onSubmit) return;
    setIsSubmitting(true);
    setStatus('idle');
    try {
      await onSubmit(email.trim());
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className={className}>
      <Container>
        <div className="max-w-md">
          {title && <h2 className="mb-4 text-2xl font-bold">{title}</h2>}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="min-w-0 flex-1"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? '...' : buttonText}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-2 text-sm text-green-600">{successMessage}</p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      </Container>
    </Section>
  );
}

/**
 * @file packages/marketing-components/src/footer/hooks.ts
 * @role hooks
 * @summary useNewsletter for footer newsletter signup
 */

'use client';

import { useState, useCallback } from 'react';

export type NewsletterStatus = 'idle' | 'success' | 'error';

export function useNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<NewsletterStatus>('idle');

  const handleSubmit = useCallback(
    async (e: React.FormEvent, onSubmit?: (email: string) => Promise<void>) => {
      e.preventDefault();
      if (!email.trim()) return;
      setIsSubmitting(true);
      setStatus('idle');
      try {
        if (onSubmit) {
          await onSubmit(email.trim());
        }
        setStatus('success');
        setEmail('');
      } catch {
        setStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email]
  );

  return { email, setEmail, handleSubmit, isSubmitting, status };
}

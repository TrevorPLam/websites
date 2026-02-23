/**
 * ContactForm component tests.
 * Verifies rendering, basic form behavior, and accessibility with mocked submission.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ContactForm from '../ContactForm';
import type { ContactFeatureConfig, ContactSubmissionHandler } from '../../lib/contact-config';

vi.mock('@repo/infra/client', () => ({
  setSentryContext: vi.fn().mockResolvedValue(undefined),
  setSentryUser: vi.fn().mockResolvedValue(undefined),
  withSentrySpan: vi.fn((_: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../../lib/contact-actions', () => ({
  submitContactForm: vi.fn().mockResolvedValue({ success: true, message: 'Thank you!' }),
}));

const minimalConfig: ContactFeatureConfig = {
  fields: [
    { id: 'name', label: 'Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'message', label: 'Message', type: 'textarea', required: true },
  ],
  successMessage: 'Thank you!',
  errorMessage: 'Something went wrong.',
};

describe('ContactForm', () => {
  const mockOnSubmit: ContactSubmissionHandler = vi.fn().mockResolvedValue({
    success: true,
    message: 'Received',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ContactForm config={minimalConfig} onSubmit={mockOnSubmit} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders form with configured fields', () => {
    render(<ContactForm config={minimalConfig} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactForm config={minimalConfig} onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<ContactForm config={minimalConfig} onSubmit={mockOnSubmit} />);

    await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await screen.findByText(/thank you/i);
    const { submitContactForm } = require('../../lib/contact-actions');
    expect(submitContactForm).toHaveBeenCalled();
  });
});

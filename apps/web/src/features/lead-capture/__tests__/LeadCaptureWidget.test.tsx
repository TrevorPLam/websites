/**
 * @file apps/web/src/features/lead-capture/__tests__/LeadCaptureWidget.test.tsx
 * @summary Unit tests for Lead Capture Widget component.
 * @description Comprehensive test suite covering functionality, accessibility, and error handling.
 * @security Tests for GDPR/CCPA compliance and data validation
 * @performance Tests for Core Web Vitals optimization
 * @compliance WCAG 2.2 AA accessibility testing
 * @requirements TASK-007, unit-testing, accessibility-testing
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LeadCaptureWidget } from '../ui/Lead-capture';

// Mock Server Actions
vi.mock('../api/lead-capture-server-actions', () => ({
  createLeadAction: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

// Mock window object for analytics
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'performance', {
  value: {
    mark: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com/test-page',
  },
  writable: true,
});

Object.defineProperty(document, 'referrer', {
  value: 'https://google.com',
  writable: true,
});

describe('LeadCaptureWidget', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    tenantId: 'test-tenant-id',
    landingPage: 'https://example.com/test-page',
    referrer: 'https://google.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal with correct title and description', () => {
    render(<LeadCaptureWidget {...defaultProps} />);

    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText(/Fill out the form below/)).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<LeadCaptureWidget {...defaultProps} />);

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I consent to the processing of my personal data/)
    ).toBeInTheDocument();
  });

  it('renders optional fields when showOptionalFields is true', () => {
    render(<LeadCaptureWidget {...defaultProps} showOptionalFields={true} />);

    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/I consent to receive marketing communications/)
    ).toBeInTheDocument();
  });

  it('does not render optional fields when showOptionalFields is false', () => {
    render(<LeadCaptureWidget {...defaultProps} showOptionalFields={false} />);

    expect(screen.queryByLabelText(/Phone Number/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Company/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Message/)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/I consent to receive marketing communications/)
    ).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    const emailInput = screen.getByLabelText(/Email Address/);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} showOptionalFields={true} />);

    const phoneInput = screen.getByLabelText(/Phone Number/);
    await user.type(phoneInput, 'invalid-phone');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid phone number/)).toBeInTheDocument();
    });
  });

  it('requires processing consent', async () => {
    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Fill in required fields but don't check consent
    const nameInput = screen.getByLabelText(/Full Name/);
    const emailInput = screen.getByLabelText(/Email Address/);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/You must consent to data processing to continue/)
      ).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const { createLeadAction } = await import('../api/lead-capture-server-actions');
    vi.mocked(createLeadAction).mockResolvedValue({
      success: true,
      data: { id: 'test-lead-id' },
    });

    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Fill in required fields
    const nameInput = screen.getByLabelText(/Full Name/);
    const emailInput = screen.getByLabelText(/Email Address/);
    const consentCheckbox = screen.getByLabelText(
      /I consent to the processing of my personal data/
    );

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(consentCheckbox);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(createLeadAction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          tenantId: 'test-tenant-id',
          consent: {
            processing: true,
            marketing: false,
          },
        })
      );
    });
  });

  it('shows success message after successful submission', async () => {
    const { createLeadAction } = await import('../api/lead-capture-server-actions');
    vi.mocked(createLeadAction).mockResolvedValue({
      success: true,
      data: { id: 'test-lead-id' },
    });

    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Fill and submit form
    const nameInput = screen.getByLabelText(/Full Name/);
    const emailInput = screen.getByLabelText(/Email Address/);
    const consentCheckbox = screen.getByLabelText(
      /I consent to the processing of my personal data/
    );

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(consentCheckbox);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Success!/)).toBeInTheDocument();
      expect(screen.getByText(/Thank you! We'll be in touch soon./)).toBeInTheDocument();
    });
  });

  it('shows error message on submission failure', async () => {
    const { createLeadAction } = await import('../api/lead-capture-server-actions');
    vi.mocked(createLeadAction).mockResolvedValue({
      success: false,
      error: 'Test error message',
    });

    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Fill and submit form
    const nameInput = screen.getByLabelText(/Full Name/);
    const emailInput = screen.getByLabelText(/Email Address/);
    const consentCheckbox = screen.getByLabelText(
      /I consent to the processing of my personal data/
    );

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(consentCheckbox);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Submission Error/)).toBeInTheDocument();
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });
  });

  it('resets form when modal is reopened', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<LeadCaptureWidget {...defaultProps} open={false} />);

    // Open modal
    rerender(<LeadCaptureWidget {...defaultProps} open={true} />);

    // Fill form
    const nameInput = screen.getByLabelText(/Full Name/);
    await user.type(nameInput, 'John Doe');

    // Close and reopen modal
    rerender(<LeadCaptureWidget {...defaultProps} open={false} />);
    rerender(<LeadCaptureWidget {...defaultProps} open={true} />);

    // Check form is reset
    expect(screen.getByLabelText(/Full Name/)).toHaveValue('');
  });

  it('disables form during submission', async () => {
    const { createLeadAction } = await import('../api/lead-capture-server-actions');
    vi.mocked(createLeadAction).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Fill and submit form
    const nameInput = screen.getByLabelText(/Full Name/);
    const emailInput = screen.getByLabelText(/Email Address/);
    const consentCheckbox = screen.getByLabelText(
      /I consent to the processing of my personal data/
    );

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(consentCheckbox);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    // Check form is disabled during submission
    expect(screen.getByLabelText(/Full Name/)).toBeDisabled();
    expect(screen.getByLabelText(/Email Address/)).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<LeadCaptureWidget {...defaultProps} />);

    // Check for proper ARIA attributes
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');

    // Check form labels are properly associated
    const nameInput = screen.getByLabelText(/Full Name/);
    expect(nameInput).toHaveAttribute('aria-required', 'true');

    // Check consent checkboxes have proper labels
    const consentCheckbox = screen.getByLabelText(
      /I consent to the processing of my personal data/
    );
    expect(consentCheckbox).toHaveAttribute('aria-required', 'true');
    expect(consentCheckbox).toHaveAttribute('id', 'consent-processing');
    expect(consentCheckbox).toHaveAttribute('aria-describedby', 'consent-processing-desc');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LeadCaptureWidget {...defaultProps} />);

    // Tab through form fields
    await user.tab();
    expect(screen.getByLabelText(/Full Name/)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/Email Address/)).toHaveFocus();

    // Check Escape key closes modal
    await user.keyboard('{Escape}');
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('handles custom props correctly', () => {
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      description: 'Custom description',
      submitText: 'Custom Submit',
      successMessage: 'Custom success message',
    };

    render(<LeadCaptureWidget {...customProps} />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('Custom Submit')).toBeInTheDocument();
  });
});

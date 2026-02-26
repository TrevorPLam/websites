/**
 * @file apps/web/src/features/lead-capture/__tests__/LeadCaptureForm.test.tsx
 * @summary Lead capture form component tests.
 * @description Comprehensive test suite for LeadCaptureForm component.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeadCaptureForm } from '../ui/LeadCaptureForm';
import type { LeadData } from '../ui/LeadCaptureForm';

// Mock the @x imports
vi.mock('@/entities/lead/@x/lead-capture', () => ({
  LeadSchema: {
    safeParse: vi.fn(),
  },
  validateLeadData: vi.fn(),
  type: {
    Lead: {} as any,
  },
}));

// Mock the Button component
vi.mock('@/shared/ui/Button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

describe('LeadCaptureForm', () => {
  const mockOnSubmit = vi.fn();
  const tenantId = 'test-tenant-id';

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form with all fields by default', () => {
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/company/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument();
  });

  it('renders form with custom field configuration', () => {
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        fields={{
          name: true,
          email: true,
          phone: true,
          company: true,
          message: true,
        }}
        tenantId={tenantId}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockValidateLeadData = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLeadData.mockReturnValue({
      success: true,
      data: {},
    });

    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        company: '',
        message: '',
      });
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    const mockValidateLeadData = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLeadData.mockReturnValue({
      success: true,
      data: {},
    });

    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup();
    const mockValidateLeadData = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLeadData.mockReturnValue({
      success: true,
      data: {},
    });

    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to submit form/i)).toBeInTheDocument();
    });
  });

  it('disables submit button during submission', async () => {
    const user = userEvent.setup();
    const mockValidateLeadData = vi.mocked(
      require('@/entities/lead/@x/lead-capture').validateLeadData
    );
    
    mockValidateLeadData.mockReturnValue({
      success: true,
      data: {},
    });

    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('clears field errors when user starts typing', async () => {
    const user = userEvent.setup();
    
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        tenantId={tenantId}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Trigger validation error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });

    // Start typing in name field
    await user.type(nameInput, 'J');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        fields={{
          name: true,
          email: true,
          phone: true,
          company: true,
          message: true,
        }}
        tenantId={tenantId}
      />
    );

    // Check for proper form structure
    expect(screen.getByRole('form')).toBeInTheDocument();
    
    // Check for proper labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // Check for autocomplete attributes
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('autoComplete', 'name');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autoComplete', 'email');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('autoComplete', 'tel');
    expect(screen.getByLabelText(/company/i)).toHaveAttribute('autoComplete', 'organization');
  });

  it('applies custom className', () => {
    const { container } = render(
      <LeadCaptureForm
        onSubmit={mockOnSubmit}
        className="custom-class"
        tenantId={tenantId}
      />
    );

    expect(container.querySelector('form')).toHaveClass('custom-class');
  });
});

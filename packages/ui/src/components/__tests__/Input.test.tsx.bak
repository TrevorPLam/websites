/**
 * Input component tests.
 * Verifies rendering, label, error state, and accessibility.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from '../Input';

describe('Input', () => {
  it('has no accessibility violations when labeled', async () => {
    const { container } = render(<Input label="Email" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message when error prop is set', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('has aria-invalid when error is set', () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'John');
    expect(input).toHaveValue('John');
  });
});

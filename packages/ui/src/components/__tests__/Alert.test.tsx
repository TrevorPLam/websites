/**
 * Alert component tests.
 * Verifies rendering, variants, and accessibility (role="alert").
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Alert, AlertTitle, AlertDescription } from '../Alert';

describe('Alert', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with role="alert"', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Message');
  });

  it('renders AlertTitle and AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description text</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Alert _variant="destructive">Error</Alert>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('text-destructive');
  });

  it('passes custom className', () => {
    const { container } = render(<Alert className="custom-alert">Content</Alert>);
    expect(container.querySelector('[role="alert"]')).toHaveClass('custom-alert');
  });
});

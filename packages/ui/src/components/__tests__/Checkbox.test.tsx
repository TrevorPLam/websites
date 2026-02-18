/**
 * Checkbox component tests.
 * Verifies rendering, checked state, and accessibility.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('has no accessibility violations when labelled', async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with role="checkbox"', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is checked when checked prop is true', () => {
    render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('passes custom className', () => {
    const { container } = render(<Checkbox className="custom-checkbox" />);
    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveClass('custom-checkbox');
  });
});

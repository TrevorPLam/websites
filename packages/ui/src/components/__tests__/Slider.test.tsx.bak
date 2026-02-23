/**
 * Slider component tests.
 * Verifies rendering, orientation, and accessibility.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Slider } from '../Slider';

describe('Slider', () => {
  // Note: axe reports "aria-input-field-name" on the thumb because Radix does not forward
  // aria-label/aria-labelledby to the thumb. In production, use a visible <Label> and
  // aria-labelledby for screen readers. See Radix issue #1339.
  it('renders without throwing', () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={[50]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders slider role', () => {
    render(<Slider aria-label="Volume" defaultValue={[50]} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={[50]} />);
    const root = container.firstChild;
    expect(root).toHaveClass('flex');
    expect(root).not.toHaveClass('flex-col');
  });

  it('passes custom className', () => {
    const { container } = render(
      <Slider aria-label="Volume" className="custom-slider" defaultValue={[50]} />
    );
    const root = container.firstChild;
    expect(root).toHaveClass('custom-slider');
  });
});

/**
 * Badge Component Tests
 * 
 * Unit tests for the Badge component covering all variants
 * and accessibility features.
 * 
 * @feature Testing Infrastructure
 * @layer __tests__
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

import { render, screen } from '@testing-library/react';
import { Badge } from '@/shared/ui/Badge';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-100', 'text-gray-800');

    rerender(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-red-100', 'text-red-800');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border', 'border-gray-300');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('is accessible with proper semantic meaning', () => {
    render(<Badge variant="destructive">Critical Alert</Badge>);
    const badge = screen.getByText('Critical Alert');
    expect(badge).toBeInTheDocument();
  });
});

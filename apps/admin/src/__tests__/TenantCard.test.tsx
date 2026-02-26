/**
 * TenantCard Component Tests
 * 
 * Unit tests for the TenantCard component covering all functionality
 * and user interactions.
 * 
 * @feature Testing Infrastructure
 * @layer __tests__
 * @priority high
 * @author Marketing Websites Team
 * @since 2026.02.25
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { TenantCard } from '@/features/tenants/ui/TenantCard';
import { createMockTenant, createMockTenantMetrics } from './setup';

const mockTenant = createMockTenant();
const mockMetrics = createMockTenantMetrics();

describe('TenantCard Component', () => {
  it('renders tenant information correctly', () => {
    render(
      <TenantCard
        tenant={mockTenant}
        metrics={mockMetrics}
        selected={false}
        onSelect={() => {}}
        onEdit={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
        onSuspend={() => {}}
        onActivate={() => {}}
      />
    );

    expect(screen.getByText(mockTenant.name)).toBeInTheDocument();
    expect(screen.getByText(`@${mockTenant.slug}`)).toBeInTheDocument();
    expect(screen.getByText(mockTenant.status)).toBeInTheDocument();
  });

  it('displays metrics when provided', () => {
    render(
      <TenantCard
        tenant={mockTenant}
        metrics={mockMetrics}
        selected={false}
        onSelect={() => {}}
        onEdit={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
        onSuspend={() => {}}
        onActivate={() => {}}
      />
    );

    expect(screen.getByText(mockMetrics.activeUsers.toString())).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.totalLeads.toString())).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.totalSites.toString())).toBeInTheDocument();
  });

  it('handles selection correctly', () => {
    const onSelect = jest.fn();
    render(
      <TenantCard
        tenant={mockTenant}
        metrics={mockMetrics}
        selected={false}
        onSelect={onSelect}
        onEdit={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
        onSuspend={() => {}}
        onActivate={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows selected state', () => {
    render(
      <TenantCard
        tenant={mockTenant}
        metrics={mockMetrics}
        selected={true}
        onSelect={() => {}}
        onEdit={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
        onSuspend={() => {}}
        onActivate={() => {}}
      />
    );

    const card = screen.getByText(mockTenant.name).closest('div');
    expect(card).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('calls action handlers correctly', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onSuspend = jest.fn();
    const onActivate = jest.fn();

    render(
      <TenantCard
        tenant={mockTenant}
        metrics={mockMetrics}
        selected={false}
        onSelect={() => {}}
        onEdit={onEdit}
        onUpdate={() => {}}
        onDelete={onDelete}
        onSuspend={onSuspend}
        onActivate={onActivate}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });
});

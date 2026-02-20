/**
 * Tabs component tests.
 * Verifies CVA variant/size resolution, context propagation, rendering, and accessibility.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs';

const BasicTabs = ({ variant, size }: { variant?: string; size?: string }) => (
  <Tabs defaultValue="tab1" variant={variant as any} size={size as any}>
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
);

describe('Tabs', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<BasicTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders tablist and triggers', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<BasicTabs />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('applies default variant classes to TabsList', () => {
    const { container } = render(<BasicTabs />);
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('bg-muted');
  });

  it('applies underline variant classes to TabsList', () => {
    const { container } = render(<BasicTabs variant="underline" />);
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('border-b');
  });

  it('applies pills variant classes to TabsList', () => {
    const { container } = render(<BasicTabs variant="pills" />);
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('bg-transparent');
  });

  it('applies size sm class to TabsTrigger', () => {
    const { container } = render(<BasicTabs size="sm" />);
    const trigger = container.querySelector('[role="tab"]');
    expect(trigger).toHaveClass('h-7');
  });

  it('applies size xl class to TabsTrigger', () => {
    const { container } = render(<BasicTabs size="xl" />);
    const trigger = container.querySelector('[role="tab"]');
    expect(trigger).toHaveClass('h-11');
  });

  it('propagates variant via context to TabsTrigger', () => {
    const { container } = render(<BasicTabs variant="pills" />);
    const trigger = container.querySelector('[role="tab"]');
    expect(trigger).toHaveClass('rounded-full');
  });

  it('allows TabsList to override variant from context', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" variant="default">
        <TabsList variant="underline">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('border-b');
    expect(list).not.toHaveClass('bg-muted');
  });

  it('passes custom className to TabsList', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('custom-list');
  });

  it('passes custom className to TabsTrigger', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    const trigger = screen.getByRole('tab', { name: 'Tab 1' });
    expect(trigger).toHaveClass('custom-trigger');
  });
});

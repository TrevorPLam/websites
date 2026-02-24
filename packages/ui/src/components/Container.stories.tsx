/**
 * @file packages/ui/src/components/Container.stories.tsx
 * @summary Storybook stories for Container component.
 * @description Component stories showcasing different states and variations for design system documentation.
 * @security none
 * @adr none
 * @requirements WCAG-2.2-AA
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    centered: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-gray-100 rounded">
        <h3>Container Content</h3>
        <p>This is the default container size.</p>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <div className="p-4 bg-blue-100 rounded">
        <h3>Small Container</h3>
        <p>Maximum width of 640px.</p>
      </div>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: (
      <div className="p-4 bg-green-100 rounded">
        <h3>Medium Container</h3>
        <p>Maximum width of 768px.</p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <div className="p-4 bg-yellow-100 rounded">
        <h3>Large Container</h3>
        <p>Maximum width of 1024px.</p>
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: (
      <div className="p-4 bg-purple-100 rounded">
        <h3>Extra Large Container</h3>
        <p>Maximum width of 1280px.</p>
      </div>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    size: 'full',
    children: (
      <div className="p-4 bg-red-100 rounded">
        <h3>Full Width Container</h3>
        <p>Takes up the full width with padding.</p>
      </div>
    ),
  },
};

export const Centered: Story = {
  args: {
    centered: true,
    children: (
      <div className="p-4 bg-indigo-100 rounded">
        <h3>Centered Container</h3>
        <p>This container is centered on the page.</p>
      </div>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-gray-200 rounded">
          <h4>Section 1</h4>
          <p>Content with padding.</p>
        </div>
        <div className="p-4 bg-gray-300 rounded">
          <h4>Section 2</h4>
          <p>More content with padding.</p>
        </div>
      </div>
    ),
  },
};

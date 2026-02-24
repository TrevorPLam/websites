import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'accent'],
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
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Section Title</h2>
        <p>This is a default section with standard spacing.</p>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Small Section</h3>
        <p>Compact section with reduced padding.</p>
      </div>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-3">Medium Section</h2>
        <p>Standard section with medium spacing.</p>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Large Section</h2>
        <p>Spacious section with generous padding.</p>
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: (
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-8">Extra Large Section</h2>
        <p>Very spacious section for hero content.</p>
      </div>
    ),
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Muted Section</h2>
        <p>Section with subtle background styling.</p>
      </div>
    ),
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Accent Section</h2>
        <p>Section with accent background styling.</p>
      </div>
    ),
  },
};

export const Centered: Story = {
  args: {
    centered: true,
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Centered Content</h2>
        <p>This content is centered within the section.</p>
      </div>
    ),
  },
};

export const WithMultipleRows: Story = {
  args: {
    children: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Column 1</h3>
          <p>Content for the first column.</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Column 2</h3>
          <p>Content for the second column.</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Column 3</h3>
          <p>Content for the third column.</p>
        </div>
      </div>
    ),
  },
};

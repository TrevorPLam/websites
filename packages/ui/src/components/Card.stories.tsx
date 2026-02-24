/**
 * @file packages/ui/src/components/Card.stories.tsx
 * @summary Storybook stories for Card component.
 * @description Component stories showcasing different states and variations for design system documentation.
 * @security none
 * @adr none
 * @requirements WCAG-2.2-AA
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'testimonial', 'service'],
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default card content',
    className: 'w-[350px] p-4',
  },
};

export const Testimonial: Story = {
  args: {
    variant: 'testimonial',
    children: 'Testimonial card with built-in padding',
    className: 'w-[350px]',
  },
};

export const Service: Story = {
  args: {
    variant: 'service',
    children: 'Service card with hover effect and padding',
    className: 'w-[350px]',
  },
};

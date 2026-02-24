/**
 * @file packages/ui/src/components/Label.stories.tsx
 * @summary Storybook stories for Label component demonstrating various label configurations.
 * @description Interactive stories showcasing label variants, sizes, and form integration.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Forms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
};

export const WithHtmlFor: Story = {
  args: {
    htmlFor: 'email',
    children: 'Email Address',
  },
};

export const Required: Story = {
  render: () => (
    <Label htmlFor="password">
      Password <span className="text-red-500">*</span>
    </Label>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Label',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <input
        id="name"
        type="text"
        className="w-full px-3 py-2 border rounded-md"
        placeholder="Enter your full name"
      />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <input id="terms" type="checkbox" className="rounded" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
};

export const MultipleLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <input
          id="firstName"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <input
          id="lastName"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your last name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your email"
        />
      </div>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username" className="text-red-600">
        Username (Required)
      </Label>
      <input
        id="username"
        type="text"
        className="w-full px-3 py-2 border border-red-500 rounded-md"
        placeholder="Enter username"
      />
      <p className="text-sm text-red-600">Username is required</p>
    </div>
  ),
};

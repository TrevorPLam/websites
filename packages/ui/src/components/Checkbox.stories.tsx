/**
 * @file packages/ui/src/components/Checkbox.stories.tsx
 * @summary Storybook stories for Checkbox component demonstrating various checkbox states.
 * @description Interactive stories showcasing checkbox sizes, variants, and form integration.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'checkbox-default',
    children: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    id: 'checkbox-checked',
    checked: true,
    children: 'Accept terms and conditions',
  },
};

export const Disabled: Story = {
  args: {
    id: 'checkbox-disabled',
    disabled: true,
    children: 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'checkbox-disabled-checked',
    disabled: true,
    checked: true,
    children: 'Disabled and checked',
  },
};

export const Required: Story = {
  args: {
    id: 'checkbox-required',
    required: true,
    children: 'Required field',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="newsletter" className="text-sm font-medium">
        Email Preferences
      </label>
      <Checkbox id="newsletter">
        Subscribe to newsletter
      </Checkbox>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-3">
      <div>
        <Checkbox id="option1">Option 1</Checkbox>
      </div>
      <div>
        <Checkbox id="option2" checked>
          Option 2 (selected)
        </Checkbox>
      </div>
      <div>
        <Checkbox id="option3" disabled>
          Option 3 (disabled)
        </Checkbox>
      </div>
      <div>
        <Checkbox id="option4" disabled checked>
          Option 4 (disabled and selected)
        </Checkbox>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Notification Settings</h3>
      <div className="space-y-3">
        <Checkbox id="email-notifications">
          Email notifications
        </Checkbox>
        <Checkbox id="push-notifications" checked>
          Push notifications
        </Checkbox>
        <Checkbox id="sms-notifications">
          SMS notifications
        </Checkbox>
        <Checkbox id="marketing-emails" disabled>
          Marketing emails (unavailable)
        </Checkbox>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Save Preferences
      </button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Checkbox id="analytics">
          Enable analytics
        </Checkbox>
        <p className="text-sm text-gray-600 ml-6">
          Help us improve our product by sharing anonymous usage data
        </p>
      </div>
      <div className="space-y-2">
        <Checkbox id="cookies" checked>
          Accept cookies
        </Checkbox>
        <p className="text-sm text-gray-600 ml-6">
          Allow us to store cookies for a better experience
        </p>
      </div>
    </div>
  ),
};

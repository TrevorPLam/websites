/**
 * @file packages/ui/src/components/Switch.stories.tsx
 * @summary Storybook stories for Switch component demonstrating various switch configurations.
 * @description Interactive stories showcasing switch sizes, variants, and form integration.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
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
    id: 'switch-default',
    children: 'Enable notifications',
  },
};

export const Checked: Story = {
  args: {
    id: 'switch-checked',
    checked: true,
    children: 'Enable notifications',
  },
};

export const Disabled: Story = {
  args: {
    id: 'switch-disabled',
    disabled: true,
    children: 'Disabled switch',
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'switch-disabled-checked',
    disabled: true,
    checked: true,
    children: 'Disabled and checked',
  },
};

export const Required: Story = {
  args: {
    id: 'switch-required',
    required: true,
    children: 'Required field',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="dark-mode" className="text-sm font-medium">
        Appearance Settings
      </label>
      <Switch id="dark-mode">Enable dark mode</Switch>
    </div>
  ),
};

export const MultipleSwitches: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Switch id="notifications">Email notifications</Switch>
      </div>
      <div>
        <Switch id="push-notifications" checked>
          Push notifications
        </Switch>
      </div>
      <div>
        <Switch id="sms-notifications">
          SMS notifications
        </Switch>
      </div>
      <div>
        <Switch id="marketing-emails" disabled>
          Marketing emails (unavailable)
        </Switch>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>
      <div className="space-y-3">
        <Switch id="email-alerts">Email alerts</Switch>
        <Switch id="push-alerts" checked>
          Push alerts
        </Switch>
        <Switch id="sms-alerts">SMS alerts</Switch>
        <Switch id="weekly-digest" checked>
          Weekly digest
        </Switch>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Save Preferences
      </button>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="space-y-4">
        <Switch
          id="interactive-switch"
          checked={enabled}
          onCheckedChange={setEnabled}
        >
          {enabled ? 'Feature enabled' : 'Feature disabled'}
        </Switch>
        <p className="text-sm text-gray-600">
          Current state: <strong>{enabled ? 'ON' : 'OFF'}</strong>
        </p>
      </div>
    );
  },
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Switch id="analytics" checked>
          Enable analytics
        </Switch>
        <p className="text-sm text-gray-600 ml-6">
          Help us improve our product by sharing anonymous usage data
        </p>
      </div>
      <div className="space-y-2">
        <Switch id="cookies">
          Accept cookies
        </Switch>
        <p className="text-sm text-gray-600 ml-6">
          Allow us to store cookies for a better experience
        </p>
      </div>
      <div className="space-y-2">
        <Switch id="personalization" checked>
          Personalization
        </Switch>
        <p className="text-sm text-gray-600 ml-6">
          Get personalized recommendations based on your usage
        </p>
      </div>
    </div>
  ),
};

export const SettingsPanel: Story = {
  render: () => (
    <div className="w-80 space-y-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Settings</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Privacy</h4>
          <div className="space-y-3">
            <Switch id="profile-visibility" checked>
              Profile visibility
            </Switch>
            <Switch id="activity-status">
              Show activity status
            </Switch>
            <Switch id="online-status" checked>
              Online status
            </Switch>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Communication</h4>
          <div className="space-y-3">
            <Switch id="direct-messages" checked>
              Direct messages
            </Switch>
            <Switch id="group-messages">
              Group messages
            </Switch>
            <Switch id="email-updates">
              Email updates
            </Switch>
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">
        Save All Settings
      </button>
    </div>
  ),
};

/**
 * @file packages/ui/src/components/Tabs.stories.tsx
 * @summary Storybook stories for Tabs component demonstrating various tab configurations.
 * @description Interactive stories showcasing tab variants, orientations, and content panels.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-gray-600">
            Manage your account information and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Password Settings</h3>
          <p className="text-sm text-gray-600">
            Update your password and security settings.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <p className="text-sm text-gray-600">
            Configure how you receive notifications.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Settings</h3>
          <p className="text-sm text-gray-600">
            Basic application settings and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Security Settings</h3>
          <p className="text-sm text-gray-600">
            Security and authentication preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="privacy">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <p className="text-sm text-gray-600">
            Privacy and data sharing preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithForms: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="john@example.com"
              />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="billing">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Billing Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Card Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="•••• •••• •••• 1234"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Billing Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="integrations">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connected Services</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Google Calendar</span>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Slack</span>
              <button className="px-3 py-1 text-sm bg-gray-200 rounded">
                Connected
              </button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dashboard Overview</h3>
              <p className="text-sm text-gray-600">
                Current active tab: <strong>{activeTab}</strong>
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analytics Data</h3>
              <p className="text-sm text-gray-600">
                Detailed analytics and metrics.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reports</h3>
              <p className="text-sm text-gray-600">
                Generated reports and summaries.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password (Disabled)
        </TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-gray-600">
            Manage your account information.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Settings</h3>
          <p className="text-sm text-gray-600">
            Configure your notification preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

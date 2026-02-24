/**
 * @file packages/ui/src/components/Avatar.stories.tsx
 * @summary Storybook stories for Avatar component demonstrating various avatar configurations.
 * @description Interactive stories showcasing avatar sizes, fallbacks, and custom content.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithInitials: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">EF</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Online User" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" alt="Away User" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Offline User" />
          <AvatarFallback>OFF</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">John Doe</h4>
          <p className="text-sm text-gray-600">Software Engineer</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <Avatar>
          <AvatarFallback className="bg-blue-500 text-white">JS</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">Jane Smith</h4>
          <p className="text-sm text-gray-600">Product Manager</p>
        </div>
      </div>
    </div>
  ),
};

export const TeamList: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="text-lg font-semibold">Team Members</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar size="sm">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="Alice" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Alice Johnson</p>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar size="sm">
              <AvatarFallback className="bg-blue-500 text-white">BJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Bob Johnson</p>
              <p className="text-xs text-gray-500">Developer</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar size="sm">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="Carol" />
              <AvatarFallback>CL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Carol Lee</p>
              <p className="text-xs text-gray-500">Marketing</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar className="animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </Avatar>
      <Avatar className="animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </Avatar>
      <Avatar className="animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      </Avatar>
    </div>
  ),
};

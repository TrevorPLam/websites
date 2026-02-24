/**
 * @file packages/ui/src/components/Progress.stories.tsx
 * @summary Storybook stories for Progress component demonstrating various progress configurations.
 * @description Interactive stories showcasing progress bars, circles, and value displays.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      min: 0,
      max: 100,
    },
    max: {
      control: 'number',
      min: 1,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Zero: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const CustomMax: Story = {
  args: {
    value: 75,
    max: 200,
  },
};

export const Small: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Upload Progress</p>
        <Progress value={30} className="h-2" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Download Progress</p>
        <Progress value={60} className="h-2" />
      </div>
    </div>
  ),
};

export const Large: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">System Update</p>
        <Progress value={75} className="h-4" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">File Transfer</p>
        <Progress value={45} className="h-4" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Profile Completion</span>
          <span>65%</span>
        </div>
        <Progress value={65} />
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Storage Used</span>
          <span>8.2 GB / 15 GB</span>
        </div>
        <Progress value={55} />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [progress, setProgress] = useState(25);

    return (
      <div className="w-64 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setProgress(Math.min(100, progress + 10))}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            +10%
          </button>
          <button
            onClick={() => setProgress(Math.max(0, progress - 10))}
            className="px-3 py-1 text-sm bg-gray-200 rounded"
          >
            -10%
          </button>
          <button
            onClick={() => setProgress(0)}
            className="px-3 py-1 text-sm bg-red-200 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};

export const MultipleProgress: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Frontend Development</span>
          <span>85%</span>
        </div>
        <Progress value={85} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Backend Development</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Testing</span>
          <span>30%</span>
        </div>
        <Progress value={30} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Documentation</span>
          <span>95%</span>
        </div>
        <Progress value={95} />
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Loading...</p>
        <Progress className="animate-pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Processing...</p>
        <Progress className="animate-pulse" />
      </div>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Success</p>
        <Progress value={75} className="bg-green-100" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Warning</p>
        <Progress value={50} className="bg-yellow-100" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Error</p>
        <Progress value={25} className="bg-red-100" />
      </div>
    </div>
  ),
};

export const CircularProgress: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.75)}`}
            className="text-blue-600"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">75%</span>
        </div>
      </div>
      <div className="relative w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.5)}`}
            className="text-green-600"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">50%</span>
        </div>
      </div>
    </div>
  ),
};

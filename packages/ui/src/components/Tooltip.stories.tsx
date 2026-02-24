/**
 * @file packages/ui/src/components/Tooltip.stories.tsx
 * @summary Storybook stories for Tooltip component demonstrating various tooltip configurations.
 * @description Interactive stories showcasing tooltip variants, positions, and trigger behaviors.
 * @security None - UI component stories only.
 * @adr none
 * @requirements none
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    delayDuration: {
      control: 'number',
    },
    disableHoverableContent: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover over me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for 1 second</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delayed tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const DifferentPositions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-96">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Tooltip>
        <TooltipTrigger>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <span className="text-sm">⚙️</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <span className="text-sm">🔔</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <span className="text-sm">👤</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Profile</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Rich Tooltip</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <h4 className="font-semibold">Feature Details</h4>
          <p className="text-sm text-gray-600">
            This feature allows you to customize your experience with advanced options.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>•</span>
            <span>Available in Pro plan</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const FormElements: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="text"
              placeholder="Enter your email"
              className="px-3 py-2 border rounded-md"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>We'll never share your email with anyone else.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Submit
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to submit the form</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button disabled>Disabled Button</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <div className="space-y-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setCount(count + 1)}
              variant="outline"
            >
              Click me ({count})
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to increment counter</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setCount(0)}
              variant="outline"
            >
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset counter to zero</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

export const WithArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">With Arrow</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip with arrow indicator</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Custom Styled</Button>
      </TooltipTrigger>
      <TooltipContent className="bg-purple-600 text-white border-purple-700">
        <p>Custom styled tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

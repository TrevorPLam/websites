import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email...',
    type: 'email',
    required: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password...',
    label: 'Password',
    required: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input...',
    value: 'This input is disabled',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your email...',
    type: 'email',
    error: 'Please enter a valid email address',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined input...',
    label: 'Outlined Field',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled input...',
    label: 'Filled Field',
  },
};

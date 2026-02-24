/**
 * @file packages/ui/src/components/Alert.stories.tsx
 * @summary Storybook stories for Alert component.
 * @description Component stories showcasing different states and variations for design system documentation.
 * @security none
 * @adr none
 * @requirements WCAG-2.2-AA
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'success', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert message for informational purposes.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Please review your input before proceeding.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>Did you know? You can customize this alert message.</AlertDescription>
    </Alert>
  ),
};

export const Simple: Story = {
  render: () => (
    <Alert>
      <AlertDescription>Simple alert message without a title.</AlertDescription>
    </Alert>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Important Notice</AlertTitle>
      <AlertDescription>
        This is a longer alert message that demonstrates how the component handles text wrapping and
        maintains readability across multiple lines of content. It's important to ensure that alert
        messages are clear and concise while providing all necessary information to the user.
      </AlertDescription>
    </Alert>
  ),
};

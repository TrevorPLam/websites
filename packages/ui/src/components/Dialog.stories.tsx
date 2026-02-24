import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { Button } from './Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
    },
    modal: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog description that provides context for the dialog content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here. You can add any content you need.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Simple Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
          <DialogDescription>
            A dialog without footer buttons.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Content area with no footer actions.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Long Content Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read through our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Use License</h3>
              <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Disclaimer</h3>
              <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Limitations</h3>
              <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Role</label>
            <select id="role" className="w-full px-3 py-2 border rounded-md">
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This will permanently delete the item and all associated data.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

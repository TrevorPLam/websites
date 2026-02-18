// File: packages/ui/src/components/__tests__/Dialog.test.tsx  [TRACE:FILE=packages.ui.components.Dialog.test]
// Purpose: Unit tests for Dialog component to verify accessibility, rendering, and behavior.
//          Tests cover component composition, props handling, and Radix UI integration.
//
// Exports / Entry: Dialog component test suite
// Used by: Jest test runner, CI/CD pipeline
//
// Invariants:
// - All Dialog sub-components must render without errors
// - Accessibility attributes must be present
// - Props must be passed through correctly
// - TypeScript types must be enforced
//
// Status: @internal
// Features:
// - [FEAT:TESTING] Comprehensive component coverage
// - [FEAT:ACCESSIBILITY] ARIA attribute verification
// - [FEAT:TYPE_SAFETY] TypeScript prop validation

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../Dialog';

describe('Dialog Components', () => {
  describe('Accessibility', () => {
    it('has no accessibility violations when open', async () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Title</DialogTitle>
              <DialogDescription>Test Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Dialog Root', () => {
    it('renders trigger when closed', () => {
      render(
        <Dialog open={false}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent ariaTitle="Dialog">Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument();
    });

    it('shows dialog when open', () => {
      render(
        <Dialog open={true}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent ariaTitle="Dialog">Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles onOpenChange when trigger clicked', async () => {
      const mockOnOpenChange = jest.fn();
      const user = userEvent.setup();
      render(
        <Dialog open={false} onOpenChange={mockOnOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent ariaTitle="Dialog">Content</DialogContent>
        </Dialog>
      );
      await user.click(screen.getByRole('button', { name: /open dialog/i }));
      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Dialog Content', () => {
    it('renders with close button by default when open', () => {
      render(
        <Dialog open={true}>
          <DialogContent ariaTitle="Dialog">Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Dialog open={true}>
          <DialogContent ariaTitle="Dialog" showCloseButton={false}>Content</DialogContent>
        </Dialog>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('passes className prop correctly', () => {
      render(
        <Dialog open={true}>
          <DialogContent ariaTitle="Dialog" className="custom-class">Content</DialogContent>
        </Dialog>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom-class');
    });
  });

  describe('Dialog Sub-components', () => {
    it('renders complete dialog structure when open', () => {
      render(
        <Dialog open={true}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Title</DialogTitle>
              <DialogDescription>Test Description</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button>Cancel</button>
              <button>Submit</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

  describe('TypeScript Types', () => {
    it('accepts correct props for Dialog', () => {
      const props: React.ComponentProps<typeof Dialog> = {
        open: true,
        onOpenChange: () => {},
        children: <div>Test</div>,
      };
      expect(props).toBeDefined();
    });

    it('accepts correct props for DialogContent', () => {
      const props: React.ComponentProps<typeof DialogContent> = {
        showCloseButton: false,
        className: 'test-class',
        children: <div>Test</div>,
      };
      expect(props).toBeDefined();
    });
  });
});

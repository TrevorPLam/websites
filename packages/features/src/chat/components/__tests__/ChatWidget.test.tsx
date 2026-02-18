/**
 * @file packages/features/src/chat/components/__tests__/ChatWidget.test.tsx
 * @role test
 * @summary Tests for ChatWidget component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ChatWidget } from '../ChatWidget';

describe('ChatWidget', () => {
  it('has no accessibility violations when enabled', async () => {
    const { container } = render(
      <ChatWidget provider="intercom" enabled />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders nothing when disabled', () => {
    const { container } = render(<ChatWidget enabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when provider is none', () => {
    const { container } = render(<ChatWidget provider="none" enabled />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with data attributes when enabled', () => {
    const { container } = render(
      <ChatWidget provider="crisp" enabled />
    );
    const div = container.querySelector('[data-chat-provider="crisp"]');
    expect(div).toBeInTheDocument();
    expect(div).toHaveAttribute('data-chat-enabled', 'true');
  });

  it('renders children when provided', () => {
    const { container } = render(
      <ChatWidget provider="tidio" enabled>
        <span data-testid="custom-widget">Custom</span>
      </ChatWidget>
    );
    expect(container.querySelector('[data-testid="custom-widget"]')).toBeInTheDocument();
    expect(container.textContent).toContain('Custom');
  });
});

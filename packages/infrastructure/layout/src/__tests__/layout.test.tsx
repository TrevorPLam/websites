/**
 * @file packages/infrastructure/layout/src/__tests__/layout.test.tsx
 * Tests for: Grid, Flex, Stack, Spacer, responsive utilities
 */

// Mock window.matchMedia (jsdom does not implement it)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Grid, GridItem } from '../grid';
import { Flex, Stack, Spacer } from '../flexbox';
import {
  BREAKPOINTS,
  resolveResponsiveValue,
} from '../responsive';
import { gapClass, alignClass, justifyClass, colsClass, rowsClass } from '../utils';

// ─── utility functions ────────────────────────────────────────────────────────

describe('gapClass', () => {
  it('maps semantic keys', () => {
    expect(gapClass('md')).toBe('gap-4');
    expect(gapClass('sm')).toBe('gap-2');
    expect(gapClass('none')).toBe('gap-0');
  });

  it('maps numeric values', () => {
    expect(gapClass(6)).toBe('gap-6');
  });

  it('returns empty string for undefined', () => {
    expect(gapClass()).toBe('');
  });
});

describe('alignClass', () => {
  it('maps align-items values', () => {
    expect(alignClass('center')).toBe('items-center');
    expect(alignClass('start')).toBe('items-start');
  });
  it('returns empty string for undefined', () => {
    expect(alignClass()).toBe('');
  });
});

describe('justifyClass', () => {
  it('maps justify-content values', () => {
    expect(justifyClass('between')).toBe('justify-between');
    expect(justifyClass('center')).toBe('justify-center');
  });
});

describe('colsClass', () => {
  it('returns grid-cols-N for numeric cols', () => {
    expect(colsClass(3)).toBe('grid-cols-3');
  });
  it('returns empty string for undefined', () => {
    expect(colsClass()).toBe('');
  });
  it('returns grid-cols-none for 0', () => {
    expect(colsClass(0)).toBe('grid-cols-none');
  });
});

describe('rowsClass', () => {
  it('returns grid-rows-N', () => {
    expect(rowsClass(2)).toBe('grid-rows-2');
  });
});

// ─── resolveResponsiveValue ───────────────────────────────────────────────────

describe('resolveResponsiveValue', () => {
  it('returns plain value directly', () => {
    expect(resolveResponsiveValue(42, new Set())).toBe(42);
  });

  it('returns base when no breakpoints active', () => {
    expect(resolveResponsiveValue({ base: 1, md: 2 }, new Set())).toBe(1);
  });

  it('returns md value when md is active', () => {
    expect(resolveResponsiveValue({ base: 1, md: 2, lg: 3 }, new Set(['sm', 'md']))).toBe(2);
  });

  it('returns largest active breakpoint value', () => {
    expect(resolveResponsiveValue({ base: 1, md: 2, lg: 3 }, new Set(['sm', 'md', 'lg']))).toBe(3);
  });
});

// ─── BREAKPOINTS constant ─────────────────────────────────────────────────────

describe('BREAKPOINTS', () => {
  it('has Tailwind default values', () => {
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
  });
});

// ─── Grid component ───────────────────────────────────────────────────────────

describe('Grid', () => {
  it('renders a div with grid class', () => {
    render(<Grid data-testid="grid"><span>child</span></Grid>);
    const el = screen.getByTestId('grid');
    expect(el.classList.contains('grid')).toBe(true);
  });

  it('applies gap class', () => {
    render(<Grid gap="md" data-testid="grid"><span /></Grid>);
    expect(screen.getByTestId('grid').classList.contains('gap-4')).toBe(true);
  });

  it('renders as a custom element', () => {
    render(<Grid as="section" data-testid="grid"><span /></Grid>);
    expect(screen.getByTestId('grid').tagName.toLowerCase()).toBe('section');
  });
});

// ─── GridItem component ───────────────────────────────────────────────────────

describe('GridItem', () => {
  it('renders children', () => {
    render(<GridItem data-testid="item">content</GridItem>);
    expect(screen.getByTestId('item').textContent).toBe('content');
  });

  it('applies col-span class', () => {
    render(<GridItem colSpan={2} data-testid="item"><span /></GridItem>);
    expect(screen.getByTestId('item').classList.contains('col-span-2')).toBe(true);
  });

  it('applies col-span-full for "full"', () => {
    render(<GridItem colSpan="full" data-testid="item"><span /></GridItem>);
    expect(screen.getByTestId('item').classList.contains('col-span-full')).toBe(true);
  });
});

// ─── Flex component ───────────────────────────────────────────────────────────

describe('Flex', () => {
  it('renders with flex class', () => {
    render(<Flex data-testid="flex"><span /></Flex>);
    expect(screen.getByTestId('flex').classList.contains('flex')).toBe(true);
  });

  it('defaults to flex-row', () => {
    render(<Flex data-testid="flex"><span /></Flex>);
    expect(screen.getByTestId('flex').classList.contains('flex-row')).toBe(true);
  });

  it('applies flex-col when direction is col', () => {
    render(<Flex direction="col" data-testid="flex"><span /></Flex>);
    expect(screen.getByTestId('flex').classList.contains('flex-col')).toBe(true);
  });

  it('applies justify and align classes', () => {
    render(<Flex justify="between" align="center" data-testid="flex"><span /></Flex>);
    const classList = screen.getByTestId('flex').classList;
    expect(classList.contains('justify-between')).toBe(true);
    expect(classList.contains('items-center')).toBe(true);
  });
});

// ─── Stack component ──────────────────────────────────────────────────────────

describe('Stack', () => {
  it('defaults to flex-col', () => {
    render(<Stack data-testid="stack"><span /></Stack>);
    expect(screen.getByTestId('stack').classList.contains('flex-col')).toBe(true);
  });

  it('renders row direction', () => {
    render(<Stack direction="row" data-testid="stack"><span /></Stack>);
    expect(screen.getByTestId('stack').classList.contains('flex-row')).toBe(true);
  });
});

// ─── Spacer ───────────────────────────────────────────────────────────────────

describe('Spacer', () => {
  it('renders with flex-1 class', () => {
    render(<Spacer data-testid="spacer" />);
    expect(screen.getByTestId('spacer').classList.contains('flex-1')).toBe(true);
  });

  it('is aria-hidden', () => {
    render(<Spacer data-testid="spacer" />);
    expect(screen.getByTestId('spacer').getAttribute('aria-hidden')).toBe('true');
  });
});

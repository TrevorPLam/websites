/// <reference types="@testing-library/jest-dom" />

// Ambient module declarations — keep this file import-free so all declarations remain global

// react-window — @types/react-window lives in @repo/ui devDeps; stub prevents implicit-any in tsc
declare module 'react-window' {
  import { ComponentType, CSSProperties } from 'react';
  export interface ListChildComponentProps {
    index: number;
    style: CSSProperties;
    data?: unknown;
  }
  export const FixedSizeList: ComponentType<Record<string, unknown>>;
  export const VariableSizeList: ComponentType<Record<string, unknown>>;
}

// jest-axe — no @types package; stub provides minimal types used by test files
declare module 'jest-axe' {
  export interface JestAxeOptions {
    [key: string]: unknown;
  }
  export interface AxeResults {
    violations: unknown[];
    [key: string]: unknown;
  }
  export function axe(html: Element | string, options?: JestAxeOptions): Promise<AxeResults>;
  export const toHaveNoViolations: {
    toHaveNoViolations(received: AxeResults): { message(): string; pass: boolean };
  };
}

// Extend Jest's Matchers with toHaveNoViolations (registered via jest-axe expect.extend)
declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}

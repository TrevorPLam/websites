/**
 * Shim for react-window types when type-checking @repo/ui (VirtualList) from this package.
 * The actual dependency lives in @repo/ui; this declaration satisfies resolution from marketing-components.
 */
declare module 'react-window' {
  import { ComponentType } from 'react';
  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
  }
  export const FixedSizeList: ComponentType<Record<string, unknown>>;
  export const VariableSizeList: ComponentType<Record<string, unknown>>;
}

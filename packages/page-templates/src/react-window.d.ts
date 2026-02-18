/** Declaration for react-window (used by @repo/ui VirtualList). */
declare module 'react-window' {
  import type { ComponentType, CSSProperties } from 'react';
  export interface ListChildComponentProps {
    index: number;
    style: CSSProperties;
  }
  export const FixedSizeList: ComponentType<Record<string, unknown>>;
  export const VariableSizeList: ComponentType<Record<string, unknown>>;
}

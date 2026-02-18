declare module 'react-window' {
  import { ComponentType } from 'react';
  export interface ListChildComponentProps {
    index: number;
    style: React.CSSProperties;
  }
  export const FixedSizeList: ComponentType<Record<string, unknown>>;
  export const VariableSizeList: ComponentType<Record<string, unknown>>;
}

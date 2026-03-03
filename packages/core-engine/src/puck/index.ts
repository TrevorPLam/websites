/**
 * @file packages/core-engine/src/puck/index.ts
 * @summary Public barrel export for the Puck editor module.
 * @description Aggregates configuration, component registry, field definitions,
 *   plugins, and theme-bridge utilities into a single public import surface.
 * @requirements TASK-PUCK-001
 */

export { createPuckConfig, puckConfig } from './config';
export type { PuckConfig } from './config';

export { componentRegistry, getComponent, getComponentCategory } from './components/registry';

export { puckFields, getFields } from './fields/index';
export type {
  HeadingField,
  ButtonField,
  ImageField,
  InputField,
  CardField,
  GridField,
  BadgeField,
} from './fields/index';

export { puckPlugins, getEnabledPlugins } from './plugins/index';

export { buildPuckCssVars, getPuckEditorStyles, puckTypography, puckTheme } from './theme-bridge';
export type { PuckTypography } from './theme-bridge';

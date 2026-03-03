/**
 * @file packages/testing-chaos/tsup.config.ts
 * @summary Build configuration for testing-chaos package using tsup.
 * @description Configures tsup bundler for ESM/CJS output with TypeScript declarations and source maps.
 * @security Build configuration; no sensitive information stored.
 * @adr none
 * @requirements DOMAIN-4 / testing-infrastructure
 */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/database-failure.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
});

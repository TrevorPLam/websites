import { defineConfig } from 'steiger';

export default defineConfig({
  projectRoot: '.',
  include: ['packages/**/*.ts', 'packages/**/*.tsx', 'clients/**/*.ts', 'clients/**/*.tsx'],
  rules: {
    // Domain-3 architectural baseline rules
    'fsd/layer-imports': 'error',
    'fsd/public-api': 'error',
    'fsd/no-cross-slice-direct-import': 'warn',
  },
});

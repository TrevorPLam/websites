import tseslint from 'typescript-eslint';
import { boundaryRules } from './boundaries.js';

const recommended = tseslint.configs.recommended;
const mergedRules = recommended.reduce(
  (acc, config) => ({
    ...acc,
    ...(config.rules ?? {}),
  }),
  {}
);

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...mergedRules,
      'no-console': 'off',
      ...boundaryRules,
    },
  },
];

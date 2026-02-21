import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
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
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      ...mergedRules,
      'no-console': 'off',
      ...boundaryRules,
      // Define react-hooks rules so eslint-disable-next-line comments are valid; off by default.
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      // Complexity and size thresholds (code smell analysis recommendations)
      complexity: ['warn', { max: 15 }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      // Accessibility: jsx-a11y recommended rules
      ...jsxA11y.configs.recommended.rules,
    },
  },
];

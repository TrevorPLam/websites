import config from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Allow ./templates/* relative imports within this package (boundary rule is over-broad for our structure)
      'no-restricted-imports': 'off',
      // Allow unused params in stub templates (e.g. _props) until implementation
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];

// Local ESLint config for @repo/utils to ensure TS parsing works under ESLint 9
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {
    ...tseslint.configs.recommended.reduce((acc, cfg) => ({ ...acc, ...(cfg.rules ?? {}) }), {}),
    'no-console': 'off',
  },
});

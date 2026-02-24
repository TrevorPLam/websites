/**
 * @file packages/ui/.storybook/main.ts
 * @summary Storybook configuration: main.
 * @description Configuration for Storybook documentation and testing setup.
 * @security none
 * @adr none
 * @requirements WCAG-2.2-AA
 */

const config = {
  stories: ['../src*.@(mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
  ],
  framework: '@storybook/react-vite',
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;

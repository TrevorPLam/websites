# storybook-documentation.md


## Overview

Storybook is a frontend workshop for building UI components and pages in isolation. It provides a sandbox environment for developing, testing, and documenting components independently of your application context.

## Installation

### Quick Start

Install Storybook into an existing project or create a new one:

```bash
npm create storybook@latest
```

### Supported Frameworks (2026)

**Officially Supported:**

- **Next.js** (with Vite and Webpack)
- **React** (with Vite and Webpack 5)
- **React Native Web** (in-browser Vite)
- **React Native** (on-device)
- **Preact** (with Vite)
- **Vue 3** (with Vite)
- **Angular**
- **SvelteKit** and **Svelte** (with Vite)
- **Web Components** (with Vite)

**Community-Maintained:**

- **Analog** (with Vite)
- **Nuxt** (with Vite)
- **SolidJS** (with Vite)
- **React** (with Rspack/Rsbuild)
- **Vue** (with Rspack/Rsbuild)
- **Web Components** (with Rspack/Rsbuild)

### Framework-Specific Installation

```bash
# For React with Vite
npx storybook@latest init --type react-vite

# For Next.js
npx storybook@latest init --type nextjs

# For Vue 3
npx storybook@latest init --type vue3-vite
```

## Project Structure

### File Organization

Storybook follows a co-located pattern where stories live alongside components:

```
components/
├─ Button/
│  ├─ Button.tsx
│  ├─ Button.stories.ts
│  ├─ Button.test.ts
│  └─ Button.module.css
├─ Card/
│  ├─ Card.tsx
│  └─ Card.stories.ts
└── .storybook/
   ├─ main.ts
   ├─ preview.ts
   └─ tsconfig.json
```

### Configuration Files

**`.storybook/main.ts`** - Main configuration:

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    backgrounds: false, // Disable backgrounds
    measure: false, // Disable measure tool
  },
};
```

### Popular Third-Party Addons

#### Chromatic Visual Testing

```bash
npx storybook@latest add @chromatic-com/storybook
```

#### Accessibility Testing

```bash
npx storybook@latest add @storybook/addon-a11y
```

#### Design Tokens

```bash
npx storybook@latest add @storybook/addon-design-tokens
```

## Controls & Dynamic Props

### Automatic Controls

Controls automatically generate UI for component props:

```typescript
export const WithControls: Story = {
  args: {
    label: 'Interactive Button',
    primary: true,
    size: 'medium',
    disabled: false,
  },
};
```

### Control Annotations

```typescript
const meta = {
  component: Button,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: 'color',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;
```

### Advanced Control Types

- **`select`**: Dropdown selection
- **`radio`**: Radio button group
- **`inline-radio`**: Inline radio buttons
- **`check`**: Checkbox
- **`inline-check`**: Inline checkboxes
- **`multi-select`**: Multi-select dropdown
- **`color`**: Color picker
- **`date`**: Date picker
- **`number`**: Number input
- **`range`**: Range slider
- **`object`**: Object editor
- **`file`**: File upload

## Documentation Generation

### Autodocs

Enable automatic documentation:

```typescript
const meta = {
  component: Button,
  tags: ['autodocs'], // Enable autodocs
} satisfies Meta<typeof Button>;
```

### MDX Documentation

Create custom documentation with MDX:

```typescript
// Button.mdx
import { Meta, Story, Canvas, ArgsTable } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Components/Button" component={Button} />

# Button Documentation

Buttons allow users to take actions and make choices.

<Canvas>
  <Story of="Primary" />
</Canvas>

## Props

<ArgsTable of="Button" />
```

### Doc Blocks

Available doc blocks for MDX:

- **`Canvas`**: Render stories
- **`Story`**: Individual story rendering
- **`ArgsTable`**: Props documentation
- **`Controls`**: Interactive controls
- **`Primary`**: Highlighted story
- **`Stories`**: Story grid
- **`Meta`**: Component metadata

## Testing with Storybook

### Interaction Testing

Test component interactions with the `play` function:

```typescript
import { within, userEvent } from '@storybook/test';

export const InteractiveTest: Story = {
  args: {
    label: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked!');
  },
};
```

### Visual Testing

#### Chromatic Integration

```bash
# Install Chromatic addon
npx storybook@latest add @chromatic-com/storybook
```

#### Local Visual Testing

```typescript
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    chromatic: {
      disableSnapshot: false,
      modes: {
        desktop: {
          viewport: 'desktop',
        },
        mobile: {
          viewport: 'iphone12',
        },
      },
    },
  },
};
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

export const AccessibilityTest: Story = {
  play: async ({ canvasElement }) => {
    const results = await axe(canvasElement);
    expect(results).toHaveNoViolations();
  },
};
```

## Composition Patterns

### Component Composition

```typescript
// ButtonGroup.stories.ts
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  component: ButtonGroup,
  subcomponents: { Button },
} satisfies Meta<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button label="Cancel" />
      <Button primary label="Submit" />
    </ButtonGroup>
  ),
};
```

### Template Composition

```typescript
const Template = (args: any) => <ButtonGroup {...args} />;

export const WithChildren: Story = {
  render: Template,
  args: {
    children: [
      <Button key="1" label="First" />,
      <Button key="2" primary label="Second" />,
    ],
  },
};
```

## Advanced Configuration

### Custom Webpack Configuration

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: ['../src*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: async (config) => {
    // Custom Vite configuration
    config.css = {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    };
    return config;
  },
};
```

### Environment Variables

```typescript
// .storybook/preview.ts
const preview: Preview = {
  env: {
    STORYBOOK_API_URL: process.env.STORYBOOK_API_URL || 'http://localhost:3000',
  },
};
```

## Performance Optimization

### Lazy Loading

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  stories: [
    {
      directory: '../src/components',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Components',
    },
  ],
  lazyCompilation: true, // Enable lazy compilation
};
```

### Bundle Optimization

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.build.rollupOptions = {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@storybook/components'],
        },
      },
    };
    return config;
  },
};
```

## Deployment & Sharing

### Static Build

```bash
# Build static Storybook
npm run build-storybook

# Output in storybook-static/
```

### Chromatic Publishing

```bash
# Install Chromatic CLI
npm install -g chromatic

# Publish to Chromatic
chromatic --project-token=your-token
```

### GitHub Actions Integration

```yaml
# .github/workflows/storybook.yml
name: Storybook
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build-storybook
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Best Practices (2026)

### Story Organization

1. **Co-locate stories** with components
2. **Use descriptive names** for story exports
3. **Group related stories** with subcomponents
4. **Implement autodocs** for automatic documentation
5. **Use consistent naming** conventions

### Component Design

1. **Design for isolation** - components should work standalone
2. **Provide sensible defaults** for all props
3. **Handle all states** - loading, error, empty, success
4. **Document edge cases** with dedicated stories
5. **Test accessibility** in each story

### Performance

1. **Enable lazy compilation** for large projects
2. **Optimize bundle size** with code splitting
3. **Use efficient controls** configuration
4. **Limit story complexity** - split complex components
5. **Monitor build times** regularly

### Testing Strategy

1. **Write interaction tests** for user flows
2. **Implement visual regression testing** with Chromatic
3. **Test accessibility** with automated tools
4. **Validate responsive behavior** with viewports
5. **Cover edge cases** with dedicated stories

## Migration Guide

### Upgrading to Storybook 8.x

```bash
# Upgrade Storybook
npx storybook@latest upgrade

# Update dependencies
npm install @storybook/react@latest @storybook/addon-essentials@latest
```

### Breaking Changes

- **CSF 3.0** required for all stories
- **TypeScript 5.0+** recommended
- **Node 18+** minimum requirement
- **Vite 5.x** for Vite-based projects

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Official Storybook Documentation](https://storybook.js.org/docs) - Complete documentation and guides
- [Component Story Format Specification](https://storybook.js.org/docs/api/csf) - CSF 3.0 standard
- [Storybook Addons](https://storybook.js.org/addons) - Available addons and integrations
- [Chromatic Visual Testing](https://www.chromatic.com/storybook) - Official visual testing platform
- [Storybook Showcase](https://storybook.js.org/showcase) - Real-world implementations
- [Storybook Community](https://storybook.js.org/community) - Community resources and support
- [GitHub Repository](https://github.com/storybookjs/storybook) - Source code and contributions


## Implementation

[Add content here]
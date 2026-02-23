# tailwindcss-v4-documentation.md

Official Tailwind CSS v4 documentation covering CSS-first configuration, the @theme directive, and modern features as of February 2026.

## Overview

Tailwind CSS v4.0 represents a ground-up rewrite of the framework, optimized for performance and flexibility with a reimagined configuration and customization experience. It takes full advantage of the latest advancements in the web platform.

## Key Features

### Performance Improvements

- **3.5x faster** full rebuilds
- **8x faster** incremental builds
- **100x faster** micro-builds (no new CSS needed)
- Native cascade layers for better control
- Registered custom properties for improved performance

### Modern Web Platform Adoption

- **CSS cascade layers** for style rule interaction control
- **Registered custom properties** for animating gradients
- **color-mix()** for opacity adjustments with CSS variables
- **Logical properties** for simplified RTL support
- **Oklch color space** for wider gamut colors

## Installation

### Simplified Setup

Install Tailwind CSS v4 with minimal configuration:

```bash
npm install tailwindcss @tailwindcss/postcss
```

### PostCSS Configuration

Create a `postcss.config.js` file:

```javascript
export default {
  plugins: ['@tailwindcss/postcss'],
};
```

### CSS Import

Add a single line to your main CSS file:

```css
@import 'tailwindcss';
```

### Vite Plugin (Alternative)

For Vite users, install the dedicated plugin:

```bash
npm install @tailwindcss/vite
```

Configure in `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

## CSS-First Configuration

### The @theme Directive

Tailwind CSS v4 replaces `tailwind.config.js` with CSS-based configuration using the `@theme` directive:

```css
@import 'tailwindcss';

@theme {
  --font-display: 'Satoshi', 'sans-serif';
  --font-mono: 'JetBrains Mono', 'monospace';

  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;

  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  --spacing: 0.25rem;
  --border-radius: 0.5rem;
}
```

### CSS Theme Variables

All design tokens are automatically available as CSS variables:

```css
:root {
  --font-display: 'Satoshi', 'sans-serif';
  --breakpoint-3xl: 1920px;
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --spacing: 0.25rem;
}
```

These can be referenced at runtime:

```css
.custom-component {
  font-family: var(--font-display);
  background-color: var(--color-avocado-500);
  transition-timing-function: var(--ease-fluid);
}
```

## Directives and Functions

### @import

Import CSS files including Tailwind itself:

```css
@import 'tailwindcss';
@import './custom-components.css';
```

### @source

Explicitly specify source files for class detection:

```css
@import 'tailwindcss';
@source "../node_modules/@my-company/ui-lib";
@source "./legacy-components/**/*.js";
```

### @utility

Add custom utilities that work with variants:

```css
@utility tab-4 {
  tab-size: 4;
}

@utility perspective-distant {
  perspective: 1000px;
}
```

### @variant

Apply Tailwind variants to custom styles:

```css
.my-element {
  background: white;

  @variant dark {
    background: black;
  }

  @variant hover {
    transform: scale(1.05);
  }
}
```

### @custom-variant

Create custom variants:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
@custom-variant browser-safari (@supports (-webkit-backdrop-filter: none));
```

Usage:

```html
<div class="theme-midnight:bg-black browser-safari:backdrop-blur-lg"></div>
```

### @apply

Inline existing utilities into custom CSS:

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}

.select2-search {
  @apply rounded border border-gray-300;
}

.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
```

### Functions

#### --alpha()

Adjust opacity of any color:

```css
.custom-bg {
  background: oklch(0.84 0.18 117.33 / var(--alpha, 1));
}

/* Usage */
<div class="custom-bg" style="--alpha: 0.5">
```

#### --spacing()

Calculate spacing values:

```css
.custom-margin {
  margin: calc(var(--spacing) * 3);
}
```

## Automatic Content Detection

### Zero-Configuration Scanning

Tailwind CSS v4 automatically detects content files using intelligent heuristics:

- **Respects .gitignore** - Excludes ignored files and directories
- **Filters binary files** - Ignores images, videos, ZIP files
- **Scans common extensions** - `.js`, `.jsx`, `.ts`, `.tsx`, `.vue`, `.svelte`, `.html`, `.php`, etc.
- **Follows import patterns** - Traces component imports

### Manual Source Specification

Add sources not detected automatically:

```css
@import 'tailwindcss';
@source "../node_modules/@my-company/ui-lib";
@source "./generated-templates/*.hbs";
```

## Container Queries

### Native Container Query Support

Built-in container query functionality without plugins:

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    <!-- Content -->
  </div>
</div>
```

### Max-Width Container Queries

New `@max-*` variants for maximum-width queries:

```html
<div class="@container">
  <div class="grid grid-cols-3 @max-md:grid-cols-1">
    <!-- Content -->
  </div>
</div>
```

### Container Query Ranges

Combine `@min-*` and `@max-*` for range queries:

```html
<div class="@container">
  <div class="flex @min-md:@max-xl:hidden">
    <!-- Content -->
  </div>
</div>
```

## Modern Color System

### Oklch Color Space

Default palette upgraded from RGB to Oklch for wider gamut:

```css
@theme {
  --color-blue-500: oklch(0.62 0.18 237); /* More vibrant than sRGB */
  --color-green-500: oklch(0.72 0.15 160);
  --color-red-500: oklch(0.65 0.22 20);
}
```

### Color Mixing with color-mix()

Adjust opacity of any color including CSS variables:

```css
.bg-blue-500\/50 {
  background-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent);
}

.custom-overlay {
  background: color-mix(in oklab, currentColor 20%, transparent);
}
```

### Dynamic Color Values

Colors accept arbitrary values without configuration:

```html
<div class="bg-[oklch(0.84_0.18_117.33)]">
  <div class="border-[color-mix(in_oklab,_theme('colors.blue.500')_50%,_transparent)]"></div>
</div>
```

## Dynamic Utilities and Variants

### Arbitrary Grid Sizes

Create grids of any size:

```html
<div class="grid grid-cols-15 gap-4">
  <!-- 15 columns -->
</div>
```

### Custom Data Attributes

Target any boolean data attribute:

```html
<div data-current class="opacity-75 data-current:opacity-100">
  <!-- Full opacity when data-current="true" -->
</div>

<div data-variant="large" class="p-4 data-variant-large:p-8">
  <!-- Larger padding when data-variant="large" -->
</div>
```

### Dynamic Spacing

All spacing utilities accept any value:

```html
<div class="mt-17 w-29 pr-42">
  <!-- Custom spacing values -->
</div>
```

Under the hood:

```css
@layer theme {
  :root {
    --spacing: 0.25rem;
  }
}

@layer utilities {
  .mt-17 {
    margin-top: calc(var(--spacing) * 17);
  }
  .w-29 {
    width: calc(var(--spacing) * 29);
  }
  .pr-42 {
    padding-right: calc(var(--spacing) * 42);
  }
}
```

## 3D Transform Utilities

### New 3D Transform API

Comprehensive 3D transformation utilities:

```html
<div class="perspective-distant">
  <article class="rotate-x-51 rotate-z-43 transform-3d transition-transform">
    <!-- 3D transformed content -->
  </article>
</div>
```

### Available 3D Utilities

**Rotation:**

- `rotate-x-*`, `rotate-y-*`, `rotate-z-*`
- `rotate-3d-*` (combined rotation)

**Scale:**

- `scale-x-*`, `scale-y-*`, `scale-z-*`
- `scale-3d-*` (combined scaling)

**Translation:**

- `translate-x-*`, `translate-y-*`, `translate-z-*`
- `translate-3d-*` (combined translation)

**Perspective:**

- `perspective-none`, `perspective-near`, `perspective-distant`
- `perspective-[value]` (custom values)

**Transform Style:**

- `transform-style-flat`, `transform-style-preserve-3d`

## Expanded Gradient APIs

### Enhanced Gradient Features

New gradient capabilities for complex effects:

```html
<!-- Linear gradients with angles -->
<div
  class="bg-gradient-to-r from-blue-500 to-purple-600 [background-image:linear-gradient(45deg,theme('colors.blue.500'),theme('colors.purple.600'))]"
>
  <!-- Conic gradients -->
  <div class="bg-gradient-conic from-red-500 via-yellow-500 to-green-500">
    <!-- Radial gradients -->
    <div class="bg-gradient-radial from-blue-500 to-transparent">
      <!-- Gradient interpolation modifiers -->
      <div class="bg-gradient-to-r from-blue-500/50 to-purple-600/75"></div>
    </div>
  </div>
</div>
```

### Gradient Interpolation

Control color interpolation in gradients:

```css
@theme {
  --gradient-interpolation: oklch; /* or hsl, srgb */
}

.bg-gradient-to-r {
  background-image: linear-gradient(
    to right,
    color-mix(in var(--gradient-interpolation), var(--color-blue-500) 50%, transparent),
    color-mix(in var(--gradient-interpolation), var(--color-purple-500) 50%, transparent)
  );
}
```

## Animation and Transitions

### @starting-style Support

Native support for entry animations:

```css
.dialog {
  opacity: 0;
  transform: scale(0.9);

  @starting-style {
    opacity: 0;
    transform: scale(0.8);
  }

  &:open {
    opacity: 1;
    transform: scale(1);
  }
}
```

### New Animation Variants

Enhanced animation control:

```html
<div class="animate-in fade-in slide-in-from-bottom duration-300">
  <!-- Animated entry -->
</div>

<div class="animate-out fade-out slide-out-to-top duration-200">
  <!-- Animated exit -->
</div>
```

## Modern CSS Features Integration

### Cascade Layers

Tailwind CSS v4 uses native cascade layers:

```css
@layer theme, base, components, utilities;

@layer theme {
  /* Theme variables */
}

@layer base {
  /* Base styles */
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Utility classes */
}
```

### Registered Custom Properties

Performance-optimized custom properties:

```css
@property --tw-gradient-from {
  syntax: '<color>';
  inherits: false;
  initial-value: #0000;
}

@property --tw-rotate-x {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

### Logical Properties

RTL-friendly layout utilities:

```html
<div class="ms-4 me-8 ps-2 pe-4">
  <!-- margin-inline-start, margin-inline-end -->
  <!-- padding-inline-start, padding-inline-end -->
</div>
```

## Migration from v3

### Upgrade Command

Automatically upgrade from v3 to v4:

```bash
npx @tailwindcss/upgrade@latest
```

### Configuration Changes

**v3 (JavaScript):**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        avocado: {
          500: '#84e339',
        },
      },
    },
  },
};
```

**v4 (CSS):**

```css
@import 'tailwindcss';

@theme {
  --color-avocado-500: oklch(0.84 0.18 117.33);
}
```

### API Changes

**Removed:**

- `tailwind.config.js` (replaced with `@theme`)
- `content` array (automatic detection)
- `corePlugins`, `safelist`, `separator` options

**Added:**

- `@theme` directive
- `@source` directive
- Built-in container queries
- 3D transform utilities

## Performance Optimization

### Build Performance

**Optimizations:**

- Lazy compilation for large projects
- Incremental builds with caching
- Micro-builds for unchanged styles
- Lightning CSS integration

**Benchmark Results:**

- Full rebuilds: 3.5x faster
- Incremental builds: 8x faster
- Micro-builds: 100x+ faster

### Runtime Performance

**CSS Optimizations:**

- Registered custom properties for animations
- Cascade layers for specificity control
- Logical properties for reduced CSS size
- color-mix() for dynamic opacity

## Best Practices (2026)

### Theme Organization

1. **Group related tokens** in `@theme` blocks
2. **Use semantic names** for custom colors
3. **Leverage Oklch** for better color accuracy
4. **Document custom tokens** with comments
5. **Use CSS variables** for runtime theming

### Performance

1. **Enable lazy compilation** for large projects
2. **Use container queries** for responsive components
3. **Leverage dynamic utilities** to reduce configuration
4. **Optimize gradient usage** with interpolation
5. **Monitor build times** regularly

### Migration Strategy

1. **Backup existing config** before upgrading
2. **Use upgrade tool** for automated migration
3. **Test thoroughly** in staging environment
4. **Update team documentation** with new patterns
5. **Train team** on CSS-first configuration

## Framework Integration

### Next.js Integration

**postcss.config.js:**

```javascript
export default {
  plugins: ['@tailwindcss/postcss'],
};
```

**app/globals.css:**

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', 'sans-serif';
}
```

### Vite Integration

**vite.config.js:**

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Remix Integration

**app/root.css:**

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', 'sans-serif';
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Official Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) - Complete documentation and guides
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) - Release announcement and features
- [Functions and Directives Reference](https://tailwindcss.com/docs/functions-and-directives) - Complete API reference
- [Theme Variables Documentation](https://tailwindcss.com/docs/theme) - Theme configuration guide
- [Container Queries Documentation](https://tailwindcss.com/docs/responsive-design) - Container query usage
- [Detecting Classes in Source Files](https://tailwindcss.com/docs/detecting-classes-in-source-files) - Content detection guide
- [Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles) - Custom utilities and variants
- [Tailwind CSS GitHub Repository](https://github.com/tailwindlabs/tailwindcss) - Source code and development

## Implementation

[Add content here]

## Testing

[Add content here]

<!--
/**
 * @file css-variables-guide.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for css variables guide.
 * @entrypoints docs/guides/css-variables-guide.md
 * @exports css variables guide
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# css-variables-guide.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


MDN guide to CSS custom properties (variables) for runtime theming and design token implementation as of February 2026.

## Overview

CSS custom properties, also known as CSS variables, are entities defined by CSS authors that contain specific values to be reused throughout a document. They provide a native, runtime-capable variable system that integrates with the cascade, inheritance, JavaScript, and the browser's rendering engine.

## Key Features

### Native Browser Support

- **Runtime manipulation** via JavaScript
- **Cascade integration** with CSS specificity
- **Inheritance** through the DOM tree
- **Type safety** with `@property` at-rule
- **Animation support** for smooth transitions

### Design Token Foundation

- **Atomic design decisions** stored as variables
- **Runtime theming** capabilities
- **Cross-component consistency**
- **Dynamic updates** without recompilation
- **Accessibility support** through system integration

## Declaration Syntax

### Basic Declaration with `--` Prefix

```css
/* Simple declaration */
element {
  --primary-color: #007bff;
  --spacing-unit: 1rem;
  --font-family: 'Inter', sans-serif;
}

/* Global declaration */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
}
```

### Advanced Declaration with `@property`

```css
/* Typed custom property with inheritance control */
@property --primary-color {
  syntax: '<color>';
  inherits: true;
  initial-value: #007bff;
}

/* Length property with validation */
@property --spacing-unit {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

/* Complex property with multiple values */
@property --shadow-elevation {
  syntax: '<length>+ <color>';
  inherits: false;
  initial-value: 0px #000000;
}
```

## Usage with `var()` Function

### Basic Usage

```css
.component {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
  font-family: var(--font-family);
}
```

### Fallback Values

```css
/* Single fallback */
.button {
  color: var(--accent-color, #007bff);
}

/* Nested fallbacks */
.card {
  background: var(--card-bg, var(--default-bg, #ffffff));
}

/* Invalid fallback (comma parsing) */
.warning {
  /* This treats "red, blue" as the fallback value */
  color: var(--warning-color, red, blue);
}
```

### Complex Values

```css
/* Multiple values in fallback */
.gradient-bg {
  background: linear-gradient(
    to right,
    var(--gradient-start, #007bff),
    var(--gradient-end, #6c757d)
  );
}

/* Shadow with multiple components */
.elevated {
  box-shadow: var(--shadow-x, 0) var(--shadow-y, 4px) var(--shadow-blur, 6px)
    var(--shadow-color, rgba(0, 0, 0, 0.1));
}
```

## Scope and Inheritance

### Global Scope with `:root`

```css
:root {
  /* Global design tokens */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-background: #ffffff;
  --color-text: #212529;

  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}
```

### Local Scope with Element Selectors

```css
/* Component-specific variables */
.card {
  --card-bg: var(--color-background);
  --card-border: var(--color-secondary);
  --card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
}

/* Override for specific variant */
.card--dark {
  --card-bg: #1a1a1a;
  --card-border: #333333;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

### Inheritance Through the DOM Tree

```css
/* Parent sets variables */
.parent {
  --theme-color: #007bff;
  --theme-spacing: 1rem;
}

/* Child inherits unless overridden */
.child {
  /* Inherits --theme-color and --theme-spacing */
  color: var(--theme-color);
  margin: var(--theme-spacing);

  /* Can override inherited values */
  --theme-spacing: 0.5rem;
  padding: var(--theme-spacing);
}
```

### Controlling Inheritance with `@property`

```css
/* Non-inheriting property */
@property --component-bg {
  syntax: '<color>';
  inherits: false;
  initial-value: #ffffff;
}

/* Each component gets initial-value unless explicitly set */
.component {
  background: var(--component-bg);
}

.nested-component {
  /* Does not inherit parent's --component-bg */
  background: var(--component-bg);
}
```

## JavaScript Integration

### Reading Custom Properties

```javascript
// Get computed style
const element = document.querySelector('.component');
const computedStyle = getComputedStyle(element);

// Read custom property values
const primaryColor = computedStyle.getPropertyValue('--primary-color');
const spacingUnit = computedStyle.getPropertyValue('--spacing-unit');

console.log(primaryColor); // "#007bff"
console.log(spacingUnit); // "1rem"
```

### Writing Custom Properties

```javascript
// Set on individual element
const button = document.querySelector('.button');
button.style.setProperty('--accent-color', '#28a745');

// Set on root for global changes
document.documentElement.style.setProperty('--primary-color', '#dc3545');

// Remove custom property
button.style.removeProperty('--accent-color');
```

### Practical Example: User-Controlled Theme

```javascript
class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8f9fa',
        '--text-primary': '#212529',
        '--text-secondary': '#6c757d',
        '--accent': '#007bff'
      },
      dark: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#2d2d2d',
        '--text-primary': '#ffffff',
        '--text-secondary': '#adb5bd',
        '--accent': '#0d6efd'
      },
      high-contrast: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#1a1a1a',
        '--text-primary': '#ffffff',
        '--text-secondary': '#cccccc',
        '--accent': '#ffff00'
      }
    };
  }

  setTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Store preference
    localStorage.setItem('preferred-theme', themeName);
  }

  loadSavedTheme() {
    const saved = localStorage.getItem('preferred-theme');
    if (saved && this.themes[saved]) {
      this.setTheme(saved);
    }
  }
}

// Usage
const themeManager = new ThemeManager();
themeManager.loadSavedTheme();

// Theme switcher
document.querySelectorAll('[data-theme]').forEach(button => {
  button.addEventListener('click', () => {
    themeManager.setTheme(button.dataset.theme);
  });
});
```

### Tracking Mouse Position

```javascript
// Update CSS variables based on mouse movement
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  document.documentElement.style.setProperty('--mouse-x', x);
  document.documentElement.style.setProperty('--mouse-y', y);
});

// CSS usage
.effect-element {
  background: radial-gradient(
    circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
    rgba(0, 123, 255, 0.3),
    transparent 50%
  );
}
```

## Design Tokens and Theming Systems

### Three-Layer Token Architecture

```css
:root {
  /* Primitive tokens (base values) */
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-900: #1e3a8a;

  --gray-50: #f9fafb;
  --gray-500: #6b7280;
  --gray-900: #111827;

  /* Semantic tokens (purpose-driven) */
  --color-primary: var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-primary-light: var(--blue-50);

  --color-background: var(--gray-50);
  --color-surface: #ffffff;
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-500);

  /* Component tokens (specific usage) */
  --button-bg: var(--color-primary);
  --button-bg-hover: var(--color-primary-hover);
  --button-text: #ffffff;
  --button-border: var(--color-primary);

  --card-bg: var(--color-surface);
  --card-border: var(--gray-200);
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Component API Pattern

```css
/* Component with configurable API */
.button {
  /* Default values */
  --button-bg: var(--color-primary);
  --button-text: #ffffff;
  --button-border: var(--color-primary);
  --button-size: var(--spacing-md);
  --button-radius: 0.375rem;

  /* Implementation */
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  padding: var(--button-size);
  border-radius: var(--button-radius);
  transition: all 0.2s ease;
}

/* Variant overrides */
.button--secondary {
  --button-bg: transparent;
  --button-text: var(--color-primary);
  --button-border: var(--color-primary);
}

.button--outline {
  --button-bg: transparent;
  --button-text: var(--color-primary);
  --button-border: var(--color-primary);
}

.button--ghost {
  --button-bg: transparent;
  --button-text: var(--color-text);
  --button-border: transparent;
}

.button--sm {
  --button-size: var(--spacing-sm);
}

.button--lg {
  --button-size: var(--spacing-lg);
}
```

## Dark Mode Implementation

### Strategy 1: `prefers-color-scheme` Media Query

```css
/* Light mode (default) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #adb5bd;
  }
}
```

### Strategy 2: Class or Data Attribute Toggle

```css
/* Light mode */
[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

/* Dark mode */
[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #adb5bd;
}

/* High contrast mode */
[data-theme='high-contrast'] {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
}
```

### Strategy 3: Combined (Recommended)

```css
/* Base light mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

/* Respect system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #adb5bd;
  }
}

/* Allow manual override */
[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

[data-theme='dark'] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #adb5bd;
}
```

## Responsive Design with Custom Properties

### Responsive Spacing and Typography

```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}

/* Tablet */
@media (min-width: 768px) {
  :root {
    --spacing-xs: 0.375rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1.25rem;
    --spacing-lg: 2rem;
    --spacing-xl: 2.5rem;

    --font-size-xs: 0.8125rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2.5rem;
    --spacing-xl: 3rem;

    --font-size-xs: 0.875rem;
    --font-size-sm: 1rem;
    --font-size-md: 1.125rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
  }
}
```

### Container Queries with Custom Properties

```css
.card-container {
  container-type: inline-size;
}

/* Default values for small containers */
.card {
  --card-padding: var(--spacing-sm);
  --card-font-size: var(--font-size-sm);
  --card-gap: var(--spacing-xs);
}

/* Medium containers */
@container (min-width: 400px) {
  .card {
    --card-padding: var(--spacing-md);
    --card-font-size: var(--font-size-md);
    --card-gap: var(--spacing-sm);
  }
}

/* Large containers */
@container (min-width: 800px) {
  .card {
    --card-padding: var(--spacing-lg);
    --card-font-size: var(--font-size-lg);
    --card-gap: var(--spacing-md);
  }
}

.card {
  padding: var(--card-padding);
  font-size: var(--card-font-size);
  gap: var(--card-gap);
}
```

## Animation with Custom Properties

### Animated Gradient Background

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-gradient {
  background: linear-gradient(var(--gradient-angle), #667eea 0%, #764ba2 100%);
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to {
    --gradient-angle: 360deg;
  }
}
```

### Animated Color Shift

```css
@property --hue-rotation {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.color-shifting {
  background-color: hsl(calc(200 + var(--hue-rotation)), 70%, 50%);
  animation: shift-hue 4s ease-in-out infinite;
}

@keyframes shift-hue {
  0%,
  100% {
    --hue-rotation: 0;
  }
  50% {
    --hue-rotation: 60;
  }
}
```

### Progress Bar Animation

```css
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

.progress-bar {
  width: var(--progress);
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transition: --progress 0.3s ease;
}

/* JavaScript control */
const progressBar = document.querySelector('.progress-bar');
progressBar.style.setProperty('--progress', '75%');
```

## `@property` Rule for Typed Custom Properties

### Type Safety

```css
/* Length property with validation */
@property --spacing {
  syntax: '<length>';
  inherits: true;
  initial-value: 1rem;
}

/* Invalid values fall back to initial-value */
.invalid-spacing {
  --spacing: 'blue'; /* Invalid, uses 1rem */
  padding: var(--spacing);
}
```

### Supported `@property` Syntax Types

```css
/* Single types */
@property --number {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
@property --integer {
  syntax: '<integer>';
  inherits: true;
  initial-value: 0;
}
@property --length {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}
@property --percentage {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}
@property --color {
  syntax: '<color>';
  inherits: true;
  initial-value: black;
}
@property --angle {
  syntax: '<angle>';
  inherits: true;
  initial-value: 0deg;
}
@property --time {
  syntax: '<time>';
  inherits: true;
  initial-value: 0s;
}
@property --resolution {
  syntax: '<resolution>';
  inherits: true;
  initial-value: 1dppx;
}
@property --image {
  syntax: '<image>';
  inherits: true;
  initial-value: none;
}
@property --transform {
  syntax: '<transform-function>';
  inherits: true;
  initial-value: none;
}

/* Combined types */
@property --size {
  syntax: '<length> | auto';
  inherits: false;
  initial-value: auto;
}
@property --sizes {
  syntax: '<length>+';
  inherits: false;
  initial-value: 0px;
}
@property --colors {
  syntax: '<color>#';
  inherits: false;
  initial-value: black;
}
@property --length-percentage {
  syntax: '<length-percentage>';
  inherits: true;
  initial-value: 0;
}
```

## Real-World Patterns and Best Practices

### Spacing Scale System

```css
:root {
  /* Modular scale (1.25 ratio) */
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
}

/* Semantic spacing */
:root {
  --spacing-xs: var(--space-1);
  --spacing-sm: var(--space-2);
  --spacing-md: var(--space-4);
  --spacing-lg: var(--space-6);
  --spacing-xl: var(--space-8);
  --spacing-2xl: var(--space-12);
  --spacing-3xl: var(--space-16);
}
```

### Fluid Typography with Custom Properties and `clamp()`

```css
:root {
  /* Fluid typography scale */
  --fluid-min-width: 20rem;
  --fluid-max-width: 75rem;
  --fluid-screen: 100vw;

  --fluid-min-scale: 0.875;
  --fluid-max-scale: 1.125;
  --fluid-preferred-scale: 1;
}

:root {
  --fluid-min: calc(var(--fluid-min-scale) * 1rem);
  --fluid-max: calc(var(--fluid-max-scale) * 1rem);
  --fluid-preferred: calc(var(--fluid-preferred-scale) * 1rem);

  --fluid-scaling: calc(
    (var(--fluid-preferred) - var(--fluid-min)) / (var(--fluid-max-width) - var(--fluid-min-width))
  );

  --fluid-viewport-scaling: calc(100 * var(--fluid-scaling) / var(--fluid-screen));

  --fluid-clamp: clamp(
    var(--fluid-min),
    var(--fluid-preferred) + var(--fluid-viewport-scaling) * 1vw,
    var(--fluid-max)
  );
}

/* Usage */
.text-fluid {
  font-size: var(--fluid-clamp);
}
```

### Consistent Border and Focus Styles

```css
:root {
  --border-width: 1px;
  --border-style: solid;
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;

  --color-border: var(--gray-200);
  --color-border-focus: var(--blue-500);

  --focus-width: 2px;
  --focus-offset: 2px;
}

/* Base border utility */
.border {
  border: var(--border-width) var(--border-style) var(--color-border);
}

/* Focus styles */
.focus-ring {
  outline: none;
  position: relative;
}

.focus-ring:focus::after {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--focus-offset));
  border: var(--focus-width) solid var(--color-border-focus);
  border-radius: inherit;
  pointer-events: none;
}
```

### Color Palette from a Single Hue

```css
:root {
  --hue: 220;
  --saturation: 90%;

  /* Generate color palette from single hue */
  --color-50: hsl(var(--hue), calc(var(--saturation) * 0.1), 98%);
  --color-100: hsl(var(--hue), calc(var(--saturation) * 0.2), 96%);
  --color-200: hsl(var(--hue), calc(var(--saturation) * 0.3), 94%);
  --color-300: hsl(var(--hue), calc(var(--saturation) * 0.5), 90%);
  --color-400: hsl(var(--hue), calc(var(--saturation) * 0.7), 85%);
  --color-500: hsl(var(--hue), var(--saturation), 80%);
  --color-600: hsl(var(--hue), var(--saturation), 70%);
  --color-700: hsl(var(--hue), calc(var(--saturation) * 0.9), 60%);
  --color-800: hsl(var(--hue), calc(var(--saturation) * 0.9), 50%);
  --color-900: hsl(var(--hue), calc(var(--saturation) * 0.8), 40%);
}

/* Theme variants */
[data-theme='purple'] {
  --hue: 270;
  --saturation: 85%;
}

[data-theme='green'] {
  --hue: 160;
  --saturation: 75%;
}
```

### Naming Conventions

```css
:root {
  /* Category/Type/Item pattern */
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #6366f1;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f9fafb;

  --size-font-xs: 0.75rem;
  --size-font-sm: 0.875rem;
  --size-font-md: 1rem;
  --size-font-lg: 1.125rem;
  --size-font-xl: 1.25rem;

  --size-spacing-xs: 0.25rem;
  --size-spacing-sm: 0.5rem;
  --size-spacing-md: 1rem;
  --size-spacing-lg: 1.5rem;
  --size-spacing-xl: 2rem;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;

  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

## Performance Considerations

### What Is Fast

- **Reading variables**: O(1) - Constant time lookup
- **Writing variables**: O(1) - Constant time assignment
- **Inheritance**: Efficient DOM tree traversal
- **Cascade resolution**: Native browser optimization
- **Animation with `@property`**: Hardware accelerated

### What to Watch Out For

- **Excessive variables**: Too many custom properties can increase memory usage
- **Complex fallbacks**: Nested `var()` calls add parsing overhead
- **Frequent JavaScript updates**: Rapid style changes can cause layout thrashing
- **Large values**: Very long variable values consume more memory
- **Deep inheritance chains**: Complex inheritance can slow down resolution

### Performance Best Practices

```css
/* Good: Simple, direct usage */
.fast-example {
  color: var(--text-primary);
  background: var(--bg-primary);
}

/* Avoid: Complex nested fallbacks */
.slow-example {
  color: var(--text-primary, var(--text-secondary, var(--text-default)));
}

/* Good: Typed properties for animation */
@property --animated-color {
  syntax: '<color>';
  inherits: true;
  initial-value: #000000;
}

.animated {
  color: var(--animated-color);
  transition: color 0.3s ease;
}
```

## Browser Support

### Modern Browser Support

- **Chrome**: 49+ (full support), 78+ (`@property` support)
- **Firefox**: 31+ (full support), 85+ (`@property` support)
- **Safari**: 9.1+ (full support), 15.4+ (`@property` support)
- **Edge**: 16+ (full support), 79+ (`@property` support)

### Feature Detection

```javascript
// Detect custom properties support
const supportsCustomProperties = CSS.supports('color', 'var(--test)');

// Detect @property support
const supportsPropertyAtRule = CSS.supports('background', 'paint(something)');

// Fallback for older browsers
if (!supportsCustomProperties) {
  // Load polyfill or use alternative approach
  console.log('Custom properties not supported');
}
```

### Progressive Enhancement

```css
/* Fallback for browsers without custom properties */
.button {
  /* Fallback */
  background-color: #007bff;
  color: #ffffff;

  /* Modern browsers */
  background-color: var(--button-bg, #007bff);
  color: var(--button-text, #ffffff);
}

/* Enhanced features for modern browsers */
@supports (background: paint(something)) {
  .button {
    transition: background-color 0.2s ease;
  }
}
```

## Comparison with Preprocessor Variables

### CSS Custom Properties vs Sass/Less Variables

| Feature             | CSS Custom Properties | Sass/Less Variables |
| ------------------- | --------------------- | ------------------- |
| Runtime changes     | ✅ Yes                | ❌ No               |
| JavaScript access   | ✅ Yes                | ❌ No               |
| Inheritance         | ✅ Yes                | ❌ No               |
| Cascade awareness   | ✅ Yes                | ❌ No               |
| Scope               | Dynamic               | Static              |
| Performance         | Native                | Compiled            |
| Type safety         | ✅ With `@property`   | ✅ Built-in         |
| Media query changes | ✅ Yes                | ❌ No               |

### When to Use Each

```css
/* Use CSS custom properties for: */
:root {
  /* Theme colors that change at runtime */
  --primary-color: #007bff;
  --text-color: #1f2937;

  /* Spacing that might need responsive adjustment */
  --container-padding: 1rem;

  /* Animation values */
  --animation-duration: 0.3s;
}

/* Use Sass variables for: */
$font-families: ('sans': ('Inter', sans-serif), 'mono': ('JetBrains Mono', monospace));

$breakpoints: ('sm': 640px, 'md': 768px, 'lg': 1024px, 'xl': 1280px);

/* Mixins and functions that don't change at runtime */
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

## Frequently Asked Questions

### What is the difference between CSS custom properties and Sass variables?

CSS custom properties are native browser features that can be changed at runtime, while Sass variables are compiled to static values before the CSS is sent to the browser.

### Can CSS custom properties be animated?

Yes, but only when they are registered with the `@property` at-rule with an appropriate syntax type like `<color>`, `<length>`, or `<angle>`.

### How do I implement dark mode with custom properties?

Use a combination of media queries for system preference and class/data attributes for manual overrides, defining different variable values for each theme.

### What are design tokens?

Design tokens are the atomic building blocks of a design system (colors, spacing, typography) that can be implemented using CSS custom properties for runtime theming.

### Do custom properties affect performance?

Generally no, they're very efficient. However, excessive variables or complex nested fallbacks can impact performance slightly.

### What happens when a custom property is undefined?

The `var()` function uses its fallback value if provided, or the property becomes invalid if no fallback exists.

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Resources

- [MDN: Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) - Comprehensive MDN guide
- [MDN: Custom properties (--\*)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/--*) - Reference documentation
- [MDN: var() function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var) - Function reference
- [MDN: @property at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property) - Property registration

### Advanced Resources

- [CSS Properties and Values API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Properties_and_Values_API) - JavaScript API reference
- [CSS Typed OM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Typed_OM_API) - Typed object model
- [Web.dev: CSS custom properties](https://web.dev/css-custom-properties/) - Practical guide with examples
- [Can I Use: CSS custom properties](https://caniuse.com/css-variables) - Browser support table

### Design Token Resources

- [Design Tokens W3C Community Group](https://www.designtokens.org/) - DTCG specification
- [Style Dictionary](https://styledictionary.com/) - Token transformation tool
- [Design Tokens for Web](https://design-tokens.github.io/community-group/format/) - Format specification

### Tools and Utilities

- [CSS Custom Properties Browser Extension](https://chrome.google.com/webstore/detail/css-custom-properties-pro) - Development tool
- [PostCSS Custom Properties](https://github.com/postcss/postcss-custom-properties) - PostCSS plugin
- [CSS Variables Polyfill](https://github.com/jhildenbiddle/cssvars-polyfill) - Fallback for older browsers


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]

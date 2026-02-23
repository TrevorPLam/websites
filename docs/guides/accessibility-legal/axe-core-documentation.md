# axe-core-documentation.md


# axe-core Documentation - Accessibility Testing Engine

## Overview

axe-core is the world's most trusted open-source accessibility testing engine for automated Web UI testing. Developed by Deque Systems, it provides zero false positives and integrates seamlessly with existing test environments to help development teams catch accessibility issues early in the development lifecycle.

## Key Features

### Trusted and Accurate

- **Zero False Positives**: Axe's commitment to accuracy ensures reliable results trusted by Google, Microsoft, and other industry leaders
- **Expert-Backed**: Backed by thousands of expert contributions from Deque and the open-source community
- **Industry Standard**: Used by 13+ million projects and analyzed 3+ billion pages

### Comprehensive Coverage

- **WCAG Compliance**: Covers WCAG 2.0, 2.1, and 2.2 at levels A, AA, and AAA
- **Global Standards**: Adheres to Section 508, EN 301 549, RGAA, and ADA requirements
- **57% Automated Coverage**: Automatically finds 57% of WCAG issues on average
- **Incomplete Results**: Returns elements as "incomplete" where manual review is needed

### Flexible Integration

- **Framework Agnostic**: Works with all modern browsers, tools, and frameworks
- **Test Integration**: Integrates with unit, integration, and functional testing
- **Multiple Environments**: Supports in-memory fixtures, static fixtures, integration tests, and iframes

## Installation and Setup

### Basic Installation

```bash
npm install axe-core --save-dev
```

### Browser Integration

Include the JavaScript file in your test pages:

```html
<script src="node_modules/axe-core/axe.min.js"></script>
```

### Module Import

For modern JavaScript environments:

```javascript
import * as axe from 'axe-core';
// or
const axe = require('axe-core');
```

## Core API Reference

### axe.run()

The primary method for running accessibility tests.

#### Basic Usage

```javascript
axe
  .run()
  .then((results) => {
    if (results.violations.length) {
      console.error('Accessibility issues found:', results.violations);
    }
  })
  .catch((err) => {
    console.error('Something bad happened:', err.message);
  });
```

#### Parameters

```javascript
axe.run(context, options, callback);
```

- **context** (optional): Defines the scope of analysis
- **options** (optional): Configuration for rule execution
- **callback** (optional): Function that receives results

#### Context Parameter

The context parameter specifies which elements to test:

```javascript
// Test entire document (default)
axe.run();

// Test specific element
axe.run(document.getElementById('content'));

// Test CSS selector
axe.run('#navBar, nav');

// Test multiple elements
axe.run(document.querySelectorAll('.button'));

// Exclude elements
axe.run({
  exclude: '.ad-banner',
});

// Test iframe content
axe.run({
  fromFrames: ['iframe#payment', 'form'],
});

// Test Shadow DOM
axe.run({
  fromShadowDom: ['.component-host', '.shadow-content'],
});
```

#### Options Parameter

Configure rule execution and output:

```javascript
// Run specific WCAG level
axe.run({
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa'],
  },
});

// Run specific rules
axe.run({
  runOnly: ['color-contrast', 'keyboard-navigation'],
});

// Disable specific rules
axe.run({
  rules: {
    'color-contrast': { enabled: false },
    'valid-lang': { enabled: false },
  },
});

// Limit result types
axe.run({
  resultTypes: ['violations', 'incomplete'],
});
```

### Configuration Options

| Property           | Default | Description                            |
| ------------------ | ------- | -------------------------------------- |
| `runOnly`          | n/a     | Limit which rules are executed         |
| `rules`            | n/a     | Enable/disable specific rules          |
| `reporter`         | `v1`    | Which reporter format to use           |
| `resultTypes`      | n/a     | Limit which result types are processed |
| `selectors`        | `true`  | Return CSS selectors for elements      |
| `ancestry`         | `false` | Return full ancestor selectors         |
| `xpath`            | `false` | Return XPath selectors                 |
| `iframes`          | `true`  | Test inside iframes                    |
| `frameWaitTime`    | `60000` | Frame timeout in milliseconds          |
| `performanceTimer` | `false` | Log performance metrics                |

## Results Object

### Structure

```javascript
{
  violations: [...],      // WCAG violations
  passes: [...],         // Passed rules
  incomplete: [...],      // Needs manual review
  inapplicable: [...],   // Not applicable rules
  timestamp: "2026-02-23T10:30:00.000Z",
  url: "https://example.com/page",
  testEnvironment: {
    userAgent: "...",
    windowWidth: 1024,
    windowHeight: 768,
    orientationAngle: 0
  },
  testRunner: {
    name: "axe"
  }
}
```

### Violation Object

```javascript
{
  id: "color-contrast",
  impact: "serious",
  tags: ["wcag2aa", "wcag143", "color"],
  description: "Elements must have sufficient color contrast",
  help: "Elements must have sufficient color contrast",
  helpUrl: "https://dequeuniversity.com/rules/axe/4.4/color-contrast",
  nodes: [
    {
      html: "<button class='btn'>Submit</button>",
      target: ["button.btn"],
      failureSummary: "Fix any of the following:\n  Element has insufficient color contrast...",
      any: [...],
      all: [...],
      none: [...],
      impact: "serious",
      message: null
    }
  ]
}
```

## Integration Patterns

### Unit Testing

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('component should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2E Testing with Playwright

```javascript
const { injectAxe, checkA11y } = require('axe-playwright');

test('page accessibility', async ({ page }) => {
  await page.goto('https://example.com');
  await injectAxe(page);
  await checkA11y(page);
});
```

### CI/CD Integration

```javascript
// GitHub Actions workflow
- name: Run accessibility tests
  run: |
    npm run test:a11y

// Package.json script
{
  "scripts": {
    "test:a11y": "axe --include '*.html' --exit"
  }
}
```

### React Integration

```javascript
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';

it('should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Rule Categories and Tags

### WCAG Tags

- **wcag2a**: WCAG 2.0 Level A
- **wcag2aa**: WCAG 2.0 Level AA
- **wcag2aaa**: WCAG 2.0 Level AAA
- **wcag21aa**: WCAG 2.1 Level AA
- **wcag22aa**: WCAG 2.2 Level AA

### Best Practice Tags

- **best-practice**: General accessibility best practices
- **experimental**: Experimental rules (disabled by default)
- **cat.aria**: ARIA-related rules
- **cat.color**: Color and contrast rules
- **cat.keyboard**: Keyboard navigation rules
- **cat.language**: Language and readability rules
- **cat.name-role-value**: Name, role, and value rules
- **cat.semantics**: Semantic HTML rules
- **cat.structure**: Document structure rules
- **cat.tables**: Table accessibility rules
- **cat.time-and-media**: Time-based media rules
- **cat.parsing**: Parsing and validation rules

## Common Rules

### Critical Rules

1. **color-contrast**: Ensures text has sufficient contrast
2. **keyboard-navigation**: All interactive elements keyboard accessible
3. **aria-labels**: Proper ARIA labels and descriptions
4. **focus-order**: Logical focus management
5. **image-alt**: Images have appropriate alt text

### Structure Rules

1. **heading-order**: Proper heading hierarchy
2. **landmark-one-main**: Exactly one main landmark
3. **region**: Proper use of landmark regions
4. **list**: Proper list structure
5. **frame-title**: Frames have descriptive titles

### ARIA Rules

1. **aria-valid-attr**: Valid ARIA attributes
2. **aria-required-attr**: Required ARIA attributes present
3. **aria-allowed-attr**: ARIA attributes allowed for role
4. **aria-hidden-body**: aria-hidden not on body element
5. **aria-hidden-focus**: Focusable elements not aria-hidden

## Advanced Configuration

### Custom Rules

```javascript
// Define custom rule
axe.registerRules([
  {
    id: 'custom-rule',
    selector: '[data-test]',
    any: ['custom-check'],
    all: [],
    none: [],
    tags: ['best-practice'],
    metadata: {
      description: 'Custom accessibility rule',
      help: 'Help text for custom rule',
      helpUrl: 'https://example.com/help',
    },
  },
]);

// Define custom check
axe.registerChecks([
  {
    id: 'custom-check',
    evaluate: function (node, options, virtualNode) {
      // Custom validation logic
      return true;
    },
    metadata: {
      impact: 'minor',
      messages: {
        pass: 'Custom check passed',
        fail: 'Custom check failed',
      },
    },
  },
]);
```

### Plugin System

```javascript
// Create plugin
const myPlugin = {
  id: 'myPlugin',
  run: function (context, options, callback) {
    // Plugin logic
    callback(null, results);
  },
  commands: [
    {
      id: 'my-command',
      execute: function (data, callback) {
        // Command logic
        callback(null, result);
      },
    },
  ],
};

// Register plugin
axe.registerPlugin(myPlugin);
```

### Performance Optimization

```javascript
// For large pages
axe.run({
  performanceTimer: true,
  resultTypes: ['violations'],
  frameWaitTime: 30000,
});

// Preload specific assets
axe.run({
  preload: {
    assets: ['cssom'],
    timeout: 5000,
  },
});
```

## Browser Support

### Fully Supported

- Microsoft Edge v40+
- Google Chrome v42+
- Mozilla Firefox v38+
- Apple Safari v7+

### Limited Support

- Internet Explorer v11 (deprecated)
- JSDOM (most rules work, color-contrast excluded)

### Environment Requirements

- Modern JavaScript features supported
- Correct polyfills for missing APIs
- Deprecated Shadow DOM v0 not supported

## Testing Strategies

### Shift-Left Testing

Integrate accessibility testing early in development:

1. **Component Level**: Test individual components
2. **Integration Level**: Test component interactions
3. **E2E Level**: Test complete user flows
4. **Visual Regression**: Include accessibility in visual tests

### Continuous Integration

```yaml
# GitHub Actions example
- name: Accessibility Audit
  run: |
    npm run build
    npm run test:a11y:ci
  continue-on-error: true
```

### Reporting and Monitoring

```javascript
// Generate accessibility report
const results = await axe.run();
const report = {
  violations: results.violations.length,
  passes: results.passes.length,
  incomplete: results.incomplete.length,
  timestamp: new Date().toISOString(),
  url: window.location.href,
};

// Send to monitoring service
sendToMonitoring(report);
```

## Best Practices

### Development Workflow

1. **Install axe-linter VS Code extension** for real-time feedback
2. **Configure axe-core in unit tests** for component-level testing
3. **Use axe DevTools extension** for manual testing
4. **Integrate in CI/CD pipeline** for automated checks
5. **Monitor production** with axe Monitor

### Configuration Guidelines

1. **Start with WCAG 2.1 AA** for comprehensive coverage
2. **Enable experimental rules** for cutting-edge checks
3. **Customize rules** based on project requirements
4. **Use context targeting** for focused testing
5. **Monitor performance** on large applications

### Error Handling

```javascript
try {
  const results = await axe.run();
  if (results.violations.length > 0) {
    // Handle violations
    reportViolations(results.violations);
  }
} catch (error) {
  // Handle axe-specific errors
  if (error.name === 'AxeError') {
    console.error('Axe error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Tools and Ecosystem

### Browser Extensions

- **axe DevTools Extension**: Manual testing and debugging
- **axe Linter**: Real-time VS Code feedback

### Testing Frameworks

- **jest-axe**: Jest integration
- **axe-playwright**: Playwright integration
- **axe-webdriverjs**: WebDriver integration
- **axe-selenium**: Selenium integration

### Paid Tools (Built on axe-core)

- **axe Auditor**: Comprehensive accessibility platform
- **axe Monitor**: Production monitoring
- **axe DevTools for Web**: Enterprise browser extension

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Documentation

- [axe-core GitHub Repository](https://github.com/dequelabs/axe-core)
- [axe-core API Documentation](https://www.deque.com/axe/core-documentation/api-documentation/)
- [axe-core Rule Descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Deque University](https://dequeuniversity.com/)

### Standards and Guidelines

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [Section 508 Standards](https://www.section508.gov/)
- [EN 301 549 Standards](https://www.etsi.org/standards/get-standards)

### Community Resources

- [axe-core NPM Package](https://www.npmjs.com/package/axe-core)
- [axe-core Discussions](https://github.com/dequelabs/axe-core/discussions)
- [Deque Accessibility Blog](https://www.deque.com/blog/)


## Implementation

[Add content here]
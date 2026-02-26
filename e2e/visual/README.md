# Visual Testing Framework

Comprehensive visual regression testing system for UI components using Playwright and Storybook integration.

## Overview

This visual testing framework provides:

- **Cross-browser testing** across Chrome, Firefox, and Safari
- **Responsive design testing** across mobile, tablet, and desktop viewports
- **Accessibility testing** with high contrast and reduced motion support
- **Component coverage** for all major UI components
- **Analytics dashboard** with trend analysis and health metrics

## Architecture

### Configuration Files

- `e2e/playwright-visual.config.ts` - Main visual testing configuration
- Cross-browser projects (Chrome, Firefox, Safari)
- Viewport-specific projects (Mobile, Tablet, Desktop)
- High DPI and dark mode testing

### Test Structure

```
e2e/visual/
├── components/
│   ├── buttons.spec.ts      # Button component visual tests
│   ├── cards.spec.ts        # Card component visual tests
│   └── inputs.spec.ts       # Input component visual tests
├── responsive/
│   └── responsive-design.spec.ts  # Comprehensive responsive testing
└── README.md               # This documentation
```

### Analytics System

- `scripts/visual/visual-analytics.mjs` - Analytics processing script
- Generates health scores, trend analysis, and quality metrics
- Tracks visual regression patterns over time

## Usage

### Running Visual Tests

```bash
# Run all visual tests
pnpm test:visual

# Run with CI reporting
pnpm test:visual:ci

# Update screenshots (after intentional changes)
pnpm test:visual:update
```

### Cross-Browser Testing

The framework automatically runs tests across:

- **Desktop**: Chrome, Firefox, Safari (1280x720)
- **Mobile**: iPhone 13, Pixel 7 (390x844)
- **Tablet**: iPad Pro (1024x1366)
- **High DPI**: Chrome with 2x scaling (1920x1080)
- **Dark Mode**: Chrome with dark color scheme

### Responsive Testing

Comprehensive viewport coverage:

- **Mobile**: 375x667, 390x844, 428x926, 384x854, 393x851
- **Tablet**: 768x1024, 820x1180, 834x1194, 1024x1366, 1368x912
- **Desktop**: 1280x720, 1440x900, 1920x1080, 2560x1440
- **Landscape**: Mobile and tablet orientations

### Accessibility Testing

Built-in accessibility visual tests:

- **High Contrast Mode**: Windows high contrast emulation
- **Reduced Motion**: Prefers-reduced-motion emulation
- **Keyboard Navigation**: Focus indicator testing
- **Touch Targets**: 44x44px minimum size validation

## Test Patterns

### Component Tests

Each component test covers:

```typescript
test.describe('Component Visual Regression', () => {
  test('variants visual consistency', async ({ page }) => {
    // Test all component variants
  });

  test('states and interactions', async ({ page }) => {
    // Test hover, focus, disabled states
  });

  test('accessibility compliance', async ({ page }) => {
    // Test high contrast, reduced motion
  });
});
```

### Responsive Tests

Responsive testing includes:

```typescript
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 1024, height: 1366 },
  { name: 'desktop', width: 1280, height: 720 },
];

viewports.forEach(({ name, width, height }) => {
  test(`responsive layout - ${name}`, async ({ page }) => {
    // Test responsive behavior
  });
});
```

## Analytics and Reporting

### Health Score Calculation

The visual testing health score (0-100) considers:

- **Base Score**: Pass rate percentage
- **Coverage Bonus**: Points for comprehensive test coverage
- **Accessibility**: WCAG compliance testing
- **Cross-browser**: Consistency across browsers

### Quality Metrics

- **Test Coverage**: Number of visual tests
- **Accessibility Compliance**: WCAG 2.2 AA compliance
- **Cross-browser Consistency**: Visual consistency across browsers
- **Responsive Design**: Viewport coverage completeness

### Trend Analysis

Tracks metrics over time:

```javascript
{
  timestamp: "2026-02-26T10:00:00.000Z",
  healthScore: 95,
  passRate: 98.5,
  totalTests: 42
}
```

## Best Practices

### Test Organization

1. **Co-locate tests** with components when possible
2. **Use descriptive names** for test cases
3. **Test all variants** of each component
4. **Include accessibility** tests for each component
5. **Test responsive behavior** for layout components

### Screenshot Guidelines

1. **Disable animations** to prevent timing issues
2. **Wait for elements** before capturing screenshots
3. **Use consistent viewports** for comparable screenshots
4. **Test interactive states** (hover, focus, disabled)
5. **Include accessibility** variations

### CI/CD Integration

```yaml
# .github/workflows/visual-testing.yml
name: Visual Testing
on: [push, pull_request]
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:visual:ci
      - run: node scripts/visual/visual-analytics.mjs
```

## Troubleshooting

### Common Issues

1. **Font Loading Issues**: Ensure fonts are loaded before screenshots
2. **Animation Timing**: Use `animations: 'disabled'` option
3. **Viewport Inconsistency**: Set viewport size before navigation
4. **Storybook Timing**: Wait for `#storybook-root` element

### Debugging Failed Tests

1. **Review screenshots** in HTML report
2. **Check browser differences** in cross-browser tests
3. **Verify responsive behavior** at different viewports
4. **Validate accessibility** features are working

### Updating Screenshots

When UI changes are intentional:

```bash
# Update all screenshots
pnpm test:visual:update

# Update specific component
pnpm test:visual --grep "Button"
```

## Integration with Development Workflow

### Before Committing

1. Run visual tests locally
2. Review any screenshot differences
3. Update screenshots if changes are intentional
4. Commit both code and updated screenshots

### Code Review Process

1. Visual tests run automatically in CI
2. Review failed tests for unintended changes
3. Request screenshot updates for intentional changes
4. Ensure accessibility compliance is maintained

### Release Process

1. Full visual test suite runs in release pipeline
2. Analytics dashboard reviewed for quality trends
3. Any regressions addressed before release
4. Visual quality metrics included in release notes

## Future Enhancements

Planned improvements to the visual testing framework:

- **Component Library Expansion**: Tests for all UI components
- **Advanced Analytics**: Machine learning for anomaly detection
- **Performance Integration**: Bundle size impact analysis
- **Design System Validation**: Design token compliance testing
- **Automated Reporting**: Slack/Teams integration for alerts

## References

- [Playwright Visual Testing](https://playwright.dev/docs/test-screenshots)
- [Storybook Visual Testing](https://storybook.js.org/docs/writing-tests/visual-testing)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [Responsive Design Principles](https://web.dev/responsive-web-design-basics/)

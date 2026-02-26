# Testing Infrastructure

Enterprise-grade testing infrastructure for the marketing websites monorepo, including visual regression testing, chaos engineering, and contract testing.

## Overview

This testing suite provides comprehensive quality assurance across three critical areas:

- **Visual Regression Testing**: UI component visual consistency across themes, viewports, and states
- **Chaos Engineering**: System resilience testing with realistic failure scenarios
- **Contract Testing**: API compatibility validation between providers and consumers

## Test Categories

### Visual Regression Testing (`/visual`)

Tests visual consistency of UI components across multiple dimensions:

- **Component Testing**: Buttons, forms, cards, navigation, modals
- **Theme Testing**: Light mode, dark mode, high contrast, reduced motion
- **Responsive Testing**: Mobile, tablet, desktop viewports
- **Accessibility Testing**: WCAG compliance, focus indicators, screen readers

#### Key Features
- Screenshot comparison with pixel-perfect accuracy
- Cross-browser testing (Chrome, Firefox)
- Theme-aware testing with CSS custom properties
- Responsive design validation
- Accessibility compliance checking

### Chaos Engineering (`/chaos`)

Tests system resilience under various failure conditions:

- **Database Layer**: Connection pool exhaustion, timeouts, deadlocks
- **External Services**: API rate limits, timeouts, service degradation
- **Infrastructure**: Memory pressure, network latency, resource limits
- **Application Layer**: Server actions, authentication, cache failures

#### Key Features
- Realistic failure scenario simulation
- Recovery pattern validation
- Performance impact measurement
- Circuit breaker testing
- Fault injection with configurable probability

### Contract Testing (`/contracts`)

Validates API compatibility and prevents breaking changes:

- **Provider Contracts**: API endpoint schema validation
- **Consumer Contracts**: Client integration testing
- **Evolution Testing**: Backward compatibility validation
- **Error Handling**: Proper error response validation

#### Key Features
- JSON Schema validation
- Request/response contract enforcement
- Backward compatibility testing
- Error handling validation
- Rate limiting compliance

## Configuration

### Visual Testing Configuration
```bash
# Run visual regression tests
pnpm test:visual

# Run in CI mode
pnpm test:visual:ci

# Update visual baselines
pnpm test:visual:update
```

### Chaos Testing Configuration
```bash
# Run chaos engineering tests
pnpm test:chaos

# Run in CI mode
pnpm test:chaos:ci
```

### Contract Testing Configuration
```bash
# Run contract tests
pnpm test:contracts

# Run in CI mode
pnpm test:contracts:ci
```

## File Structure

```
e2e/
├── visual/
│   ├── components/          # UI component visual tests
│   │   ├── buttons.spec.ts
│   │   ├── forms.spec.ts
│   │   └── navigation.spec.ts
│   ├── themes/              # Theme-specific visual tests
│   │   ├── light-mode.spec.ts
│   │   ├── dark-mode.spec.ts
│   │   └── high-contrast.spec.ts
│   └── responsive/          # Responsive design tests
│       ├── mobile.spec.ts
│       ├── tablet.spec.ts
│       └── desktop.spec.ts
├── chaos/
│   ├── database/            # Database layer chaos tests
│   │   ├── connection-pool.chaos.test.ts
│   │   ├── query-timeouts.chaos.test.ts
│   │   └── failover.chaos.test.ts
│   ├── external-services/   # External service chaos tests
│   │   ├── stripe-api.chaos.test.ts
│   │   ├── email-service.chaos.test.ts
│   │   └── webhook-delivery.chaos.test.ts
│   ├── infrastructure/       # Infrastructure chaos tests
│   │   ├── memory-pressure.chaos.test.ts
│   │   ├── network-latency.chaos.test.ts
│   │   └── resource-limits.chaos.test.ts
│   └── application/         # Application layer chaos tests
│       ├── server-actions.chaos.test.ts
│       ├── authentication.chaos.test.ts
│       └── cache-stampede.chaos.test.ts
└── contracts/
    ├── providers/           # API provider contract tests
    │   ├── api-contracts.spec.ts
    │   ├── webhook-contracts.spec.ts
    │   └── auth-contracts.spec.ts
    ├── consumers/           # Client consumer contract tests
    │   ├── client-integration.spec.ts
    │   ├── webhook-consumers.spec.ts
    │   └── third-party.spec.ts
    └── evolution/           # Contract evolution tests
        ├── compatibility.spec.ts
        ├── deprecation.spec.ts
        └── publishing.spec.ts
```

## Running Tests

### Prerequisites

1. **Storybook** (for visual testing):
   ```bash
   pnpm --filter @repo/ui run storybook
   ```

2. **Development servers** (for chaos and contract testing):
   ```bash
   pnpm --filter portal run start
   pnpm --filter web run start
   ```

### Test Execution

#### Visual Regression Tests
```bash
# Run all visual tests
pnpm test:visual

# Run specific component tests
pnpm playwright test --config=e2e/playwright-visual.config.ts visual/components/buttons.spec.ts

# Run theme tests
pnpm playwright test --config=e2e/playwright-visual.config.ts visual/themes/
```

#### Chaos Engineering Tests
```bash
# Run all chaos tests
pnpm test:chaos

# Run database chaos tests
pnpm playwright test --config=e2e/playwright-chaos.config.ts chaos/database/

# Run external service chaos tests
pnpm playwright test --config=e2e/playwright-chaos.config.ts chaos/external-services/
```

#### Contract Tests
```bash
# Run all contract tests
pnpm test:contracts

# Run provider contract tests
pnpm playwright test --config=e2e/playwright-contracts.config.ts contracts/providers/

# Run consumer contract tests
pnpm playwright test --config=e2e/playwright-contracts.config.ts contracts/consumers/
```

## CI/CD Integration

### GitHub Actions

The testing infrastructure is designed to integrate with GitHub Actions:

```yaml
# Example workflow
- name: Run Visual Regression Tests
  run: pnpm test:visual:ci

- name: Run Chaos Engineering Tests
  run: pnpm test:chaos:ci

- name: Run Contract Tests
  run: pnpm test:contracts:ci
```

### Reporting

- **Visual Tests**: HTML reports with screenshot diffs
- **Chaos Tests**: JSON reports with resilience metrics
- **Contract Tests**: JUnit XML reports for CI integration

## Best Practices

### Visual Testing
- Use consistent viewports and wait strategies
- Test all interactive states (hover, focus, disabled)
- Include accessibility testing (high contrast, reduced motion)
- Maintain screenshot baselines in version control

### Chaos Testing
- Start with low fault probability and increase gradually
- Test recovery patterns, not just failures
- Monitor system metrics during chaos tests
- Use realistic failure scenarios based on production incidents

### Contract Testing
- Define clear API contracts with JSON Schema
- Test both happy path and error scenarios
- Validate backward compatibility
- Include rate limiting and authentication testing

## Troubleshooting

### Visual Test Failures
1. Check if Storybook is running on the expected port
2. Verify component selectors are correct
3. Ensure proper wait strategies for dynamic content
4. Update baselines if changes are intentional

### Chaos Test Failures
1. Verify test environment isolation
2. Check fault injection configuration
3. Monitor system resources during tests
4. Review recovery logic implementation

### Contract Test Failures
1. Validate API endpoint availability
2. Check authentication token validity
3. Verify request/response format compliance
4. Review contract schema definitions

## Contributing

When adding new tests:

1. **Visual Tests**: Follow the established naming patterns and include theme testing
2. **Chaos Tests**: Use the fault injection pattern and include recovery validation
3. **Contract Tests**: Define clear schemas and test both success and failure cases

## Performance Considerations

- **Visual Tests**: Run in parallel where possible, use efficient screenshot strategies
- **Chaos Tests**: Use single worker to avoid interference, monitor resource usage
- **Contract Tests**: Parallel execution is safe, use efficient schema validation

## Security

- All tests use mock data and don't access production systems
- Authentication tokens are generated for testing only
- No sensitive data is included in test files or reports
- Chaos tests are isolated to prevent production impact

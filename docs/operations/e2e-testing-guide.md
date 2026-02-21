# E2E Testing Guide

## Overview

This guide covers the end-to-end (E2E) testing setup for the marketing websites monorepo using Playwright. The E2E testing framework validates critical user flows, multi-tenant isolation, accessibility compliance, and SEO optimization.

## Architecture

### Testing Stack

- **Playwright** - Primary E2E testing framework (2026 standard)
- **axe-playwright** - Accessibility testing with WCAG 2.2 AA compliance
- **Multi-browser support** - Chrome, Firefox, Safari, mobile browsers
- **Parallel execution** - Optimized for CI/CD pipeline performance
- **Visual regression** - Screenshot and video capture for debugging

### Test Organization

```
tests/e2e/
├── playwright.config.ts     # Playwright configuration
├── helpers/                  # Global setup/teardown utilities
│   ├── global-setup.ts      # Test environment preparation
│   └── global-teardown.ts   # Test environment cleanup
├── fixtures/                 # Reusable test fixtures
│   ├── tenant.ts            # Multi-tenant test isolation
│   └── auth.ts              # Authentication testing
└── specs/                    # Test specifications
    ├── booking.spec.ts      # Booking flow tests
    ├── tenant-isolation.spec.ts # Multi-tenant security tests
    ├── seo.spec.ts          # SEO optimization tests
    └── accessibility.spec.ts # WCAG 2.2 AA compliance tests
```

## Configuration

### Playwright Configuration

The `playwright.config.ts` file provides:

- **Multi-browser testing** - Chrome, Firefox, Safari, mobile
- **CI optimization** - Parallel workers, retry logic, reporting
- **Tenant isolation** - Base URL configuration for multi-tenant testing
- **Debugging support** - Screenshots, videos, traces on failure
- **Performance monitoring** - Timeout configurations and metrics

### Environment Variables

```bash
# Base URL for the application under test
E2E_BASE_URL=http://localhost:3101

# CI-specific settings
CI=true
NODE_ENV=test
```

## Test Fixtures

### Tenant Fixture

The tenant fixture (`fixtures/tenant.ts`) provides:

- **Automatic tenant provisioning** - Creates isolated test tenants
- **Data cleanup** - Removes test data after each test
- **Multi-tenant isolation** - Ensures no cross-tenant data leakage
- **URL generation** - Helper for tenant-specific URLs

```typescript
import { test } from '../fixtures/tenant';

test('my test', async ({ page, tenant }) => {
  // tenant is automatically created and cleaned up
  await page.goto(`/${tenant.slug}/booking`);
});
```

### Authentication Fixture

The auth fixture (`fixtures/auth.ts`) provides:

- **OAuth 2.1 compliance** - PKCE flow simulation
- **Multi-tenant auth** - Tenant-scoped authentication
- **Role-based testing** - Admin, user, owner roles
- **Session management** - Automatic login/logout

```typescript
import { test } from '../fixtures/auth';

test('authenticated flow', async ({ authenticatedPage }) => {
  // authenticatedPage is logged in and ready
  await authenticatedPage.goto('/dashboard');
});
```

## Test Categories

### 1. Booking Flow Tests (`booking.spec.ts`)

Validates the complete booking journey:

- **Form validation** - Required fields, email format, date validation
- **Booking creation** - Successful booking submission and confirmation
- **Data persistence** - Booking saved correctly in database
- **Double booking prevention** - Time slot availability checking
- **Confirmation emails** - Email sending verification

### 2. Tenant Isolation Tests (`tenant-isolation.spec.ts`)

Critical security tests for multi-tenant architecture:

- **Cross-tenant access prevention** - Tenant A cannot access Tenant B data
- **API endpoint isolation** - Database RLS policy enforcement
- **Session isolation** - Proper tenant-scoped authentication
- **Error message security** - Generic errors prevent tenant enumeration
- **Cache isolation** - No cross-tenant cache leakage

### 3. SEO Tests (`seo.spec.ts`)

Search engine optimization validation:

- **Meta tags** - Title, description, canonical URLs
- **Structured data** - JSON-LD schema validation
- **Open Graph** - Social media sharing tags
- **Twitter Cards** - Twitter-specific meta tags
- **Heading structure** - Proper H1-H6 hierarchy
- **Image alt attributes** - Accessibility and SEO compliance

### 4. Accessibility Tests (`accessibility.spec.ts`)

WCAG 2.2 AA compliance validation:

- **axe-core integration** - Comprehensive accessibility audit
- **Touch targets** - 24x24 CSS pixels minimum requirement
- **Keyboard navigation** - Full keyboard accessibility
- **Focus management** - Proper focus trapping and restoration
- **Color contrast** - Text-to-background contrast ratios
- **Screen reader support** - Alt text, labels, ARIA attributes

## Running Tests

### Local Development

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests with UI (interactive mode)
pnpm test:e2e:ui

# Debug tests with browser inspector
pnpm test:e2e:debug

# Generate test code from browser actions
pnpm test:e2e:codegen

# Run specific test file
pnpm test:e2e booking.spec.ts

# Run tests with specific browser
pnpm test:e2e --project=chromium

# Run tests with visual debugging
pnpm test:e2e --debug --headed
```

### CI/CD Integration

The E2E tests run automatically in GitHub Actions:

- **Quality gates** - Run on all PRs and main branch pushes
- **Parallel execution** - Tests split across 3 shards for performance
- **Comprehensive reporting** - HTML reports, JSON results, videos on failure
- **Artifact storage** - Test results and reports available for 7 days

### Test Sharding

Tests are automatically sharded across 3 parallel jobs:

```bash
# Shard 1: Booking and authentication tests
# Shard 2: Tenant isolation and security tests
# Shard 3: SEO and accessibility tests
```

## Best Practices

### 1. Test Isolation

- Each test gets its own tenant
- Automatic cleanup prevents data leakage
- No shared state between tests
- Deterministic test results

### 2. Data Management

- Use test factories for consistent data
- Clean up resources in `afterEach`/`afterAll`
- Validate data persistence in database
- Test edge cases and error conditions

### 3. Performance Optimization

- Use `page.waitForLoadState('networkidle')` for dynamic content
- Implement smart waits instead of fixed delays
- Leverage Playwright's auto-waiting features
- Optimize test data size and complexity

### 4. Debugging Support

- Screenshots captured automatically on failure
- Video recordings for failed tests
- Trace files for step-by-step debugging
- HTML reports with detailed error information

### 5. Accessibility Testing

- Run axe-core audits on all major pages
- Test keyboard navigation flows
- Validate touch target sizes (24x24 minimum)
- Check color contrast ratios

## Troubleshooting

### Common Issues

**Test timeouts:**

- Increase timeout in `playwright.config.ts`
- Check application startup time
- Verify network requests are completing

**Flaky tests:**

- Add retry logic in configuration
- Use proper wait conditions
- Check for race conditions

**Browser compatibility:**

- Test in multiple browsers
- Check for browser-specific issues
- Use browser-agnostic selectors

**Authentication failures:**

- Verify auth fixture setup
- Check token expiration
- Validate tenant context

### Debug Commands

```bash
# Run single test with debugging
pnpm test:e2e --grep "should create booking" --debug

# Run with specific browser
pnpm test:e2e --project=webkit --headed

# Generate detailed trace
pnpm test:e2e --trace on

# Keep browser open after test
pnpm test:e2e --headed
```

## Maintenance

### Regular Tasks

- **Update Playwright** - Keep browsers and framework current
- **Review test coverage** - Add tests for new features
- **Monitor flakiness** - Address unstable tests
- **Update fixtures** - Maintain test data factories

### Performance Monitoring

- Track test execution time
- Monitor CI/CD pipeline duration
- Optimize test parallelization
- Review resource utilization

### Security Updates

- Update browser versions
- Review accessibility standards compliance
- Validate security test coverage
- Monitor dependency vulnerabilities

## Integration with Development Workflow

### Pre-commit Hooks

Consider adding E2E smoke tests to pre-commit hooks for critical paths:

```bash
# Run smoke tests before commit
pnpm test:e2e --grep "smoke"
```

### Code Review Checklist

- [ ] E2E tests added for new features
- [ ] Accessibility compliance verified
- [ ] Multi-tenant isolation tested
- [ ] SEO optimization validated
- [ ] Test documentation updated

### Release Process

- Run full E2E test suite before release
- Verify all critical user journeys
- Check cross-browser compatibility
- Validate performance benchmarks

## Future Enhancements

### Planned Improvements

1. **Visual Regression Testing** - Percy or Playwright snapshots
2. **Performance Testing** - Core Web Vitals validation
3. **API Testing** - Direct API endpoint testing
4. **Mobile Testing** - Enhanced mobile device coverage
5. **Cross-browser Testing** - Additional browser support

### Advanced Features

- **Test Data Management** - Database seeding and cleanup automation
- **Mock Services** - External service mocking for isolated testing
- **Load Testing** - Concurrent user simulation
- **Analytics Testing** - Conversion tracking validation

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [axe-core Accessibility Testing](https://www.deque.com/axe/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [SEO Best Practices](https://developers.google.com/search/docs)
- [Multi-tenant Architecture](../architecture/multi-tenant.md)

## Support

For E2E testing issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review [GitHub Actions logs](https://github.com/your-org/marketing-websites/actions)
3. Consult the [Playwright community](https://github.com/microsoft/playwright/discussions)
4. Create an issue in the repository with detailed error information

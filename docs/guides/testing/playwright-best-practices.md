<!--
/**
 * @file playwright-best-practices.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for playwright best practices.
 * @entrypoints docs/guides/playwright-best-practices.md
 * @exports playwright best practices
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

# playwright-best-practices.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


# Playwright Best Practices

> A comprehensive guide to writing reliable, maintainable, and efficient Playwright tests in 2026. This document covers testing philosophy, best practices, and practical patterns for building robust end-to-end test suites that scale with your application.

## Overview

Playwright testing becomes challenging as test suites grow. Tests that seem stable initially can become flaky due to fragile selectors, inconsistent waits, or environment differences. Following established best practices ensures tests remain predictable, maintainable, and resilient as applications evolve.

### Key Principles

- **Test user-visible behavior**: Focus on what users see and interact with
- **Maintain test isolation**: Each test should run independently
- **Use stable locators**: Prefer semantic selectors over DOM structure
- **Leverage Playwright's tooling**: Use built-in debugging and reporting features
- **Optimize for performance**: Use parallelism and sharding effectively

## Testing Philosophy

### Test User-Visible Behavior

Automated tests should verify that the application works for end users, avoiding reliance on implementation details that users don't see or interact with.

**✅ Good Practice:**

```typescript
// Test what the user sees
await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
await expect(page.getByText('Success!')).toBeVisible();
```

**❌ Avoid:**

```typescript
// Don't test implementation details
expect(element.className).toContain('submit-button');
expect(await page.$eval('#form', (el) => el.dataset.valid)).toBe('true');
```

### Make Tests as Isolated as Possible

Each test should be completely isolated from others, running independently with its own local storage, session storage, data, and cookies.

```typescript
import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
});

test('first test', async ({ page }) => {
  // page is signed in
});

test('second test', async ({ page }) => {
  // page is signed in
});
```

### Avoid Testing Third-Party Dependencies

Only test what you control. Don't test external sites or third-party servers that you don't control.

```typescript
// ✅ Mock third-party dependencies
await page.route('**/api/third-party-data', (route) =>
  route.fulfill({
    status: 200,
    body: testData,
  })
);

// ❌ Don't test external sites
await page.goto('https://external-site.com');
```

### Testing with Databases

When working with databases, ensure you control the data. Test against staging environments and prevent data changes.

## Best Practices

### Use Locators

Playwright's built-in locators come with auto-waiting and retry-ability, making tests more resilient.

#### Prefer User-Facing Attributes

```typescript
// ✅ Good: User-facing locators
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email address').fill('user@example.com');
await page.getByPlaceholder('Search').fill('query');

// ❌ Avoid: DOM-dependent selectors
await page.locator('button.btn-primary.submit').click();
await page.locator('#email-input').fill('user@example.com');
```

#### Use Chaining and Filtering

```typescript
// Chain locators to narrow down search
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });

// Filter and chain actions
await page
  .getByRole('listitem')
  .filter({ hasText: 'Product 2' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

### Generate Locators

Use Playwright's test generator to create locators automatically:

```bash
# Generate locators for a page
npx playwright codegen https://example.com
```

The generator prioritizes role, text, and test ID locators, making them resilient to DOM changes.

### Use Web First Assertions

Web first assertions wait until the expected condition is met, reducing flaky tests.

```typescript
// ✅ Good: Web-first assertions
await expect(page.getByText('Welcome')).toBeVisible();
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

// ❌ Avoid: Manual assertions
expect(await page.getByText('Welcome').isVisible()).toBe(true);
```

### Configure Debugging

#### Local Debugging

Use the VS Code extension or `--debug` flag for live debugging:

```bash
# Debug specific test
npx playwright test example.spec.ts:9 --debug

# Debug all tests
npx playwright test --debug
```

#### CI Debugging

Use trace viewer for CI failures instead of videos and screenshots:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Record trace on first retry
  },
});
```

View traces with:

```bash
npx playwright show-report
```

### Use Playwright's Tooling

Playwright provides comprehensive tooling for test development:

- **VS Code Extension**: Great developer experience for writing, running, and debugging tests
- **Test Generator**: Generate tests and pick locators automatically
- **Trace Viewer**: Full trace of tests as a PWA with timeline and DOM snapshots
- **UI Mode**: Time-travel experience with watch mode for exploring tests
- **TypeScript**: Built-in TypeScript support with better IDE integrations

### Test Across All Browsers

Configure projects for cross-browser testing:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### Keep Playwright Updated

Maintain up-to-date Playwright versions to test against latest browser versions:

```bash
# Update to latest version
npm install -D @playwright/test@latest

# Check current version
npx playwright --version
```

### Run Tests on CI

Set up CI/CD to run tests frequently on each commit and pull request.

#### Optimize Browser Downloads

Install only necessary browsers on CI:

```bash
# Instead of all browsers
npx playwright install --with-deps

# Install only Chromium
npx playwright install chromium --with-deps
```

#### Use Linux on CI

Use Linux for CI (cheaper) while developers can use any environment locally.

### Lint Your Tests

Use TypeScript and ESLint for early error detection:

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

Run type checking on CI:

```bash
tsc --noEmit
```

### Use Parallelism and Sharding

#### Parallel Execution

Tests run in parallel by default. Configure parallel mode for tests within files:

```typescript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('runs in parallel 1', async ({ page }) => {
  /* ... */
});

test('runs in parallel 2', async ({ page }) => {
  /* ... */
});
```

#### Sharding

Distribute tests across multiple machines:

```bash
# Run shard 1 of 3
npx playwright test --shard=1/3
```

## Advanced Practices

### Page Object Model

Use Page Object Model for reusable components:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async getErrorMessage() {
    return this.page.getByText('Invalid credentials');
  }
}

// tests/login.spec.ts
test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Test Data Management

#### Fixtures

Use fixtures for test setup and data:

```typescript
// fixtures/user.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  user: async ({ page }, use) => {
    const user = { name: 'Test User', email: 'test@example.com' };
    await page.goto('/setup');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByRole('button', { name: 'Create' }).click();
    await use(user);
  },
});

// tests/user.spec.ts
test('user profile test', async ({ page, user }) => {
  await page.goto('/profile');
  await expect(page.getByText(user.name)).toBeVisible();
});
```

#### Data Factories

Create test data factories for consistent test data:

```typescript
// factories/UserFactory.ts
export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      ...overrides,
    };
  }

  static createAdmin(): User {
    return this.create({ role: 'admin' });
  }
}
```

### Smart Waits and Timeouts

#### Use Built-in Waits

Leverage Playwright's auto-waiting capabilities:

```typescript
// ✅ Good: Auto-waiting
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Success')).toBeVisible();

// ❌ Avoid: Fixed delays
await page.waitForTimeout(2000);
await page.click('button');
```

#### Configure Timeouts

Set appropriate timeouts for your environment:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    actionTimeout: 10000, // 10 seconds
    navigationTimeout: 30000, // 30 seconds
  },
});
```

### Error Handling and Reporting

#### Soft Assertions

Use soft assertions to continue testing after failures:

```typescript
// Make checks that won't stop the test
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('progress')).toHaveText('100%');

// Continue with more checks
await page.getByRole('link', { name: 'next page' }).click();
```

#### Custom Error Messages

Provide descriptive error messages:

```typescript
await expect(
  page.getByRole('button', { name: 'Submit' }),
  'Submit button should be enabled'
).toBeEnabled();
```

### Performance Optimization

#### Headless Mode

Use headless mode for CI to improve performance:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    headless: process.env.CI ? true : false,
  },
});
```

#### Resource Optimization

Optimize resource usage:

```typescript
// Block unnecessary resources
await page.route('**/*.{png,jpg,jpeg,svg}', (route) => route.abort());

// Mock API responses
await page.route('**/api/data', (route) => route.fulfill({ status: 200, body: mockData }));
```

### Visual Regression Testing

Implement visual regression testing:

```typescript
import { expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Network Monitoring

Monitor and control network requests:

```typescript
// Wait for specific request
const response = await page.waitForResponse('**/api/data');
const data = await response.json();

// Mock network conditions
await page.route('**/*', (route) => {
  // Simulate slow network
  setTimeout(() => route.continue(), 1000);
});
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Run tests
        run: npx playwright test --shard=${{ strategy.job-index }}/${{ strategy.job-total }}
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Docker Integration

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.49.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
```

## Monitoring and Maintenance

### Test Health Metrics

Track key metrics for test health:

- **Flakiness Rate**: Percentage of tests that fail intermittently
- **Execution Time**: Average test duration
- **Coverage**: Percentage of critical user journeys tested
- **Pass Rate**: Overall test success rate

### Regular Maintenance

#### Refactoring

Regularly refactor tests to:

- Remove duplication
- Update outdated selectors
- Improve test organization
- Optimize performance

#### Version Management

- Keep Playwright updated
- Update test dependencies
- Review and update test configurations
- Document breaking changes

### Flake Mitigation

#### Identify Root Causes

Common causes of flaky tests:

- Timing issues
- Network dependency
- Race conditions
- Environment differences

#### Strategies

- Use retry mechanisms sparingly
- Implement proper waits
- Mock external dependencies
- Stabilize test environments

## Troubleshooting

### Common Issues

#### Timeout Errors

```typescript
// Increase timeout for specific operations
await expect(page.getByText('Slow loading content')).toBeVisible({ timeout: 30000 });
```

#### Selector Issues

```typescript
// Use Playwright's picker to find stable selectors
npx playwright codegen --target=local
```

#### Network Issues

```typescript
// Wait for network idle
await page.waitForLoadState('networkidle');
```

### Debugging Techniques

#### Trace Viewer

```bash
# Generate trace for debugging
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

#### Screenshots and Videos

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Playwright Official Documentation](https://playwright.dev/docs)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright VS Code Extension](https://playwright.dev/docs/getting-started-vscode)
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Playwright UI Mode](https://playwright.dev/docs/test-ui-mode)
- [Playwright GitHub Repository](https://github.com/microsoft/playwright)
- [BrowserStack Playwright Guide](https://www.browserstack.com/guide/playwright-best-practices)
- [Playwright Release Notes](https://playwright.dev/docs/release-notes)


## Implementation

[Add content here]

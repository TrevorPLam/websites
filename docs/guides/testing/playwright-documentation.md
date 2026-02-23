<!--
/**
 * @file playwright-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for playwright documentation.
 * @entrypoints docs/guides/playwright-documentation.md
 * @exports playwright documentation
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

# playwright-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


# Playwright Documentation

> Comprehensive documentation for Playwright, the end-to-end testing framework for modern web applications. This guide covers core concepts, APIs, selectors, assertions, network control, and advanced features for building reliable automated tests.

## Overview

Playwright is a Node.js library for automating Chromium, Firefox, and WebKit with a single API. It enables reliable end-to-end testing for modern web apps with features like auto-waiting, network interception, and powerful selectors.

### Key Features

- **Cross-browser support**: Test Chromium, Firefox, and Safari (WebKit)
- **Auto-waiting**: Eliminates flaky tests by waiting for elements to be ready
- **Network control**: Intercept, modify, and mock network requests
- **Powerful selectors**: Find elements by role, text, and accessibility attributes
- **Web-first assertions**: Retry assertions until conditions are met
- **Parallel execution**: Run tests in parallel across multiple browsers
- **Rich tooling**: VS Code extension, trace viewer, test generator

## Installation and Setup

### Installation

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

### Basic Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
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

## Core Concepts

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');

  await page.getByRole('link', { name: 'More information' }).click();
  await expect(page.getByRole('heading', { name: 'Example' })).toBeVisible();
});
```

### Browser Contexts

Browser contexts are isolated browser sessions:

```typescript
import { test, expect } from '@playwright/test';

test('browser context', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://example.com');
  // Test logic here

  await context.close();
});
```

### Fixtures

Fixtures provide test setup and teardown:

```typescript
import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Authentication logic
    await page.goto('/login');
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await use(page);
  },
});

test('authenticated test', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.getByText('Welcome')).toBeVisible();
});
```

## Locators and Selectors

### Built-in Locators

Playwright provides built-in locators that are resilient to DOM changes:

```typescript
// Role-based locators
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('heading', { name: 'Welcome' }).isVisible();

// Text-based locators
await page.getByText('Submit').click();
await page.getByText('Welcome', { exact: true }).isVisible();

// Label-based locators
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password', { exact: true }).fill('secret');

// Placeholder locators
await page.getByPlaceholder('Search').fill('query');

// Alt text locators
await page.getByAltText('Company logo').click();

// Title locators
await page.getByTitle('Page Title').isVisible();

// Test ID locators
await page.getByTestId('submit-button').click();
```

### Locator Methods

```typescript
// Chaining locators
const submitButton = page.getByRole('form').getByRole('button', { name: 'Submit' });

// Filtering locators
const buttons = page.getByRole('button').filter({ hasText: 'Submit' });

// First and last
const firstButton = page.getByRole('button').first();
const lastButton = page.getByRole('button').last();

// Count
const buttonCount = await page.getByRole('button').count();

// Get all elements
const allButtons = await page.getByRole('button').all();
```

### CSS and XPath Selectors

```typescript
// CSS selectors
await page.locator('.submit-button').click();
await page.locator('#username').fill('user');

// XPath selectors
await page.locator('//button[contains(text(), "Submit")]').click();
await page.locator('//*[@id="username"]').fill('user');
```

### Locator Best Practices

```typescript
// ✅ Good: User-facing locators
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email address').fill('user@example.com');

// ❌ Avoid: DOM-dependent selectors
await page.locator('button.btn-primary.submit').click();
await page.locator('#email-input').fill('user@example.com');

// ✅ Good: Test ID for dynamic content
await page.getByTestId('dynamic-element').isVisible();

// ✅ Good: Combine locators for specificity
await page
  .getByRole('listitem')
  .filter({ hasText: 'Product A' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

## Actions and Interactions

### Basic Actions

```typescript
// Click actions
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('button', { name: 'Submit' }).dblClick();
await page.getByRole('button', { name: 'Submit' }).click({ position: { x: 10, y: 10 } });

// Type actions
await page.getByLabel('Name').fill('John Doe');
await page.getByLabel('Name').fill('John', { delay: 100 });
await page.getByLabel('Name').press('Tab');

// Select actions
await page.getByLabel('Country').selectOption('US');
await page.getByLabel('Country').selectOption(['US', 'CA']);

// Check/uncheck
await page.getByLabel('Subscribe').check();
await page.getByLabel('Subscribe').uncheck();

// Focus/blur
await page.getByLabel('Email').focus();
await page.getByLabel('Email').blur();
```

### Keyboard Actions

```typescript
// Keyboard shortcuts
await page.getByRole('textbox').press('Control+A');
await page.getByRole('textbox').fill('text');
await page.getByRole('textbox').press('Control+C');
await page.getByRole('textbox').press('Control+V');

// Individual keys
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.press('Tab');
```

### Mouse Actions

```typescript
// Mouse movements
await page.mouse.move(100, 100);
await page.mouse.click(100, 100);
await page.mouse.dblclick(100, 100);
await page.mouse.down(100, 100);
await page.mouse.up(100, 100);

// Drag and drop
await page
  .getByRole('button', { name: 'Source' })
  .dragTo(page.getByRole('button', { name: 'Target' }));
```

## Assertions

### Web-First Assertions

Web-first assertions automatically retry until the condition is met:

```typescript
// Visibility assertions
await expect(page.getByText('Welcome')).toBeVisible();
await expect(page.getByText('Hidden')).toBeHidden();

// State assertions
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
await expect(page.getByRole('checkbox')).toBeChecked();

// Text content assertions
await expect(page.getByTestId('status')).toHaveText('Success');
await expect(page.getByTestId('status')).toContainText('Success');
await expect(page.getByTestId('count')).toHaveText(/\d+/);

// Attribute assertions
await expect(page.getByRole('button')).toHaveAttribute('disabled');
await expect(page.getByRole('button')).toHaveClass('active');
await expect(page.getByRole('button')).toHaveId('submit-btn');

// Value assertions
await page.getByLabel('Input').toHaveValue('text');
await page.getByLabel('Select').toHaveValue('option1');
```

### Page Assertions

```typescript
// Page title
await expect(page).toHaveTitle('Page Title');

// Page URL
await expect(page).toHaveURL('https://example.com/path');
await expect(page).toHaveURL(/\/path$/);

// Page screenshot
await expect(page).toHaveScreenshot();
await expect(page).toHaveScreenshot('homepage.png');
```

### Generic Assertions

```typescript
// Basic comparisons
expect(value).toBe(42);
expect(value).toEqual({ name: 'John' });
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Array/object assertions
expect(array).toContain('item');
expect(array).toHaveLength(3);
expect(object).toHaveProperty('name');
expect(object).toMatchObject({ name: 'John' });

// String assertions
expect(string).toContain('substring');
expect(string).toMatch(/pattern/);
expect(string).toEqual('exact match');
```

### Soft Assertions

Soft assertions don't terminate test execution on failure:

```typescript
// Multiple checks without stopping
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('progress')).toHaveText('100%');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// Check for any soft assertion failures
expect(test.info().errors).toHaveLength(0);
```

### Custom Assertion Messages

```typescript
// Custom error messages
await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
await expect(value, 'should be 42').toBe(42);
```

## Network Control

### Request Interception

```typescript
// Handle requests with mock responses
await page.route('**/api/data', (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data: [] }),
  })
);

// Abort requests
await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
await page.route('**/api/block', (route) => route.abort());
```

### Request Modification

```typescript
// Modify request headers
await page.route('**/*', async (route) => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer token';
  await route.continue({ headers });
});

// Modify request method
await page.route('**/*', (route) => route.continue({ method: 'POST' }));

// Modify request body
await page.route('**/api/data', async (route) => {
  const postData = route.request().postData();
  const modifiedData = postData.replace('old', 'new');
  await route.continue({ postData: modifiedData });
});
```

### Response Modification

```typescript
// Modify response body
await page.route('**/api/data', async (route) => {
  const response = await route.fetch();
  const body = await response.text();
  const modifiedBody = body.replace('old', 'new');

  await route.fulfill({
    response,
    body: modifiedBody,
    headers: { ...response.headers(), 'content-type': 'application/json' },
  });
});

// Modify response headers
await page.route('**/api/data', async (route) => {
  const response = await route.fetch();
  await route.fulfill({
    response,
    headers: { ...response.headers(), 'custom-header': 'value' },
  });
});
```

### API Mocking

```typescript
// Mock API responses
test('mock API calls', async ({ page }) => {
  // Mock GET request
  await page.route('**/api/users', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]),
    })
  );

  // Mock POST request
  await page.route('**/api/users', (route) => {
    const postData = route.request().postData();
    const userData = JSON.parse(postData);

    route.fulfill({
      status: 201,
      body: JSON.stringify({ id: 3, ...userData }),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('John Doe')).toBeVisible();
});
```

### WebSocket Handling

```typescript
test('handle WebSocket', async ({ page }) => {
  const ws = await page.evaluateHandle(() => {
    return new WebSocket('ws://localhost:8080');
  });

  await ws.evaluate((ws) => {
    ws.addEventListener('message', (event) => {
      console.log('Received:', event.data);
    });
  });
});
```

## Browser and Context Configuration

### Browser Options

```typescript
// Custom browser launch options
const browser = await playwright.chromium.launch({
  headless: false,
  slowMo: 100,
  devtools: true,
  args: ['--disable-web-security'],
});
```

### Context Options

```typescript
// Custom context options
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent: 'Custom User Agent',
  locale: 'en-US',
  timezoneId: 'America/New_York',
  geolocation: { latitude: 52.52, longitude: 13.405 },
  permissions: ['geolocation'],
  colorScheme: 'dark',
  httpCredentials: {
    username: 'user',
    password: 'pass',
  },
});
```

### Device Emulation

```typescript
// Use predefined device descriptors
const iPhone = playwright.devices['iPhone 13'];
const context = await browser.newContext({
  ...iPhone,
});

// Custom device configuration
const customDevice = {
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

const context = await browser.newContext(customDevice);
```

## Advanced Features

### Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async getErrorMessage() {
    return this.page.getByText('Invalid credentials');
  }

  async getSuccessMessage() {
    return this.page.getByText('Welcome back');
  }
}

// tests/login.spec.ts
test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(loginPage.getSuccessMessage()).toBeVisible();
});
```

### Test Hooks

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test
  await page.goto('/setup');
});

test.afterEach(async ({ page }) => {
  // Runs after each test
  await page.goto('/cleanup');
});

test.beforeAll(async ({ browser }) => {
  // Runs once before all tests
  // Setup database, start services, etc.
});

test.afterAll(async ({ browser }) => {
  // Runs once after all tests
  // Cleanup database, stop services, etc.
});
```

### Test Describes

```typescript
test.describe('authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login', async ({ page }) => {
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('pass');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('failed login', async ({ page }) => {
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
```

### Parallel Execution

```typescript
// Configure parallel execution within describe blocks
test.describe.configure({ mode: 'parallel' });

test('parallel test 1', async ({ page }) => {
  // Runs in parallel
});

test('parallel test 2', async ({ page }) => {
  // Runs in parallel
});
```

### Sharding

```bash
# Run tests in shards
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

## Debugging and Troubleshooting

### Debug Mode

```bash
# Debug all tests
npx playwright test --debug

# Debug specific test
npx playwright test example.spec.ts:10 --debug
```

### Trace Viewer

```typescript
// Configure trace recording
export default defineConfig({
  use: {
    trace: 'on-first-retry',
  },
});
```

```bash
# View traces
npx playwright show-report
```

### Screenshots and Videos

```typescript
// Configure screenshots and videos
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});

// Manual screenshot
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ fullPage: true });
```

### Error Handling

```typescript
test('error handling', async ({ page }) => {
  try {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Success')).toBeVisible();
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  }
});
```

## Performance Testing

### Performance Metrics

```typescript
test('performance metrics', async ({ page }) => {
  // Start timing
  const startTime = Date.now();

  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Load Data' }).click();
  await expect(page.getByText('Data loaded')).toBeVisible();

  // End timing
  const endTime = Date.now();
  const loadTime = endTime - startTime;

  console.log(`Page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000);
});
```

### Network Performance

```typescript
test('network performance', async ({ page }) => {
  const responses: Response[] = [];

  page.on('response', (response) => {
    responses.push(response);
  });

  await page.goto('https://example.com');

  // Check response times
  const slowResponses = responses.filter((r) => r.status() === 200 && r.url().includes('api'));

  for (const response of slowResponses) {
    const timing = response.headers()['x-response-time'];
    expect(parseInt(timing || '0')).toBeLessThan(1000);
  }
});
```

## Accessibility Testing

### Accessibility Assertions

```typescript
test('accessibility checks', async ({ page }) => {
  await page.goto('/dashboard');

  // Check for proper ARIA roles
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();

  // Check for proper labels
  await expect(page.getByLabel('Search')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

  // Check for proper headings
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

### Accessibility Testing Tools

```typescript
// Use axe-playwright for comprehensive accessibility testing
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility with axe', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkAxe(page);
});
```

## Mobile Testing

### Mobile Device Testing

```typescript
import { devices } from '@playwright/test';

test.describe('mobile tests', () => {
  const mobileDevices = [devices['iPhone 13'], devices['Pixel 5']];

  mobileDevices.forEach((device) => {
    test.describe(`on ${device.name}`, () => {
      test.use({ ...device });

      test('mobile layout', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
      });
    });
  });
});
```

### Touch Interactions

```typescript
test('touch interactions', async ({ page }) => {
  await page.goto('/');

  // Tap gestures
  await page.getByRole('button', { name: 'Tap me' }).tap();

  // Swipe gestures
  await page.getByRole('list').swipe('down');

  // Pinch zoom
  await page.locator('body').pinch({ x: 100, y: 100 });
});
```

## Integration Examples

### React Testing

```typescript
test('React component testing', async ({ page }) => {
  await page.goto('/react-app');

  // Component interaction
  await page.getByTestId('counter-button').click();
  await expect(page.getByTestId('counter-value')).toHaveText('1');

  // Form submission
  await page.getByLabel('Name').fill('John Doe');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Form submitted')).toBeVisible();
});
```

### Vue Testing

```typescript
test('Vue component testing', async ({ page }) => {
  await page.goto('/vue-app');

  // Component state
  await expect(page.getByTestId('message')).toHaveText('Hello World');

  // Event handling
  await page.getByTestId('toggle-button').click();
  await expect(page.getByTestId('message')).toHaveText('Goodbye World');
});
```

### Angular Testing

```typescript
test('Angular component testing', async ({ page }) => {
  await page.goto('/angular-app');

  // Service interaction
  await page.getByRole('button', { name: 'Load Data' }).click();
  await expect(page.getByTestId('loading')).toBeVisible();
  await expect(page.getByTestId('data-list')).toBeVisible();

  // Form validation
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Please enter a valid email')).toBeVisible();
});
```

## Best Practices

### Test Organization

```typescript
// tests/auth/login.spec.ts
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Successful Login', () => {
    test('with valid credentials', async ({ page }) => {
      await page.getByLabel('Email').fill('user@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Welcome')).toBeVisible();
    });

    test('remembers login', async ({ page }) => {
      await page.getByLabel('Email').fill('user@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByLabel('Remember me').check();
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Verify session persistence
      await page.reload();
      await expect(page.getByText('Welcome')).toBeVisible();
    });
  });

  test.describe('Failed Login', () => {
    test('with invalid credentials', async ({ page }) => {
      await page.getByLabel('Email').fill('user@example.com');
      await page.getByLabel('Password').fill('wrong');
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('with empty credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByText('Email is required')).toBeVisible();
    });
  });
});
```

### Data Management

```typescript
// factories/UserFactory.ts
export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      ...overrides,
    };
  }

  static createAdmin(): User {
    return this.create({ role: 'admin' });
  }

  static createMultiple(count: number): User[] {
    return Array.from({ length: count }, (_, i) =>
      this.create({ id: i + 1, email: `user${i + 1}@example.com` })
    );
  }
}
```

### Environment Configuration

```typescript
// config/test.config.ts
export const testConfig = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  headless: process.env.CI ? true : false,
  slowMo: process.env.SLOW_MO ? 100 : 0,
};

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './test.config';

export default defineConfig({
  testDir: './tests',
  timeout: testConfig.timeout,
  retries: testConfig.retries,
  use: {
    baseURL: testConfig.baseUrl,
    headless: testConfig.headless,
    slowMo: testConfig.slowMo,
  },
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

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Playwright Official Documentation](https://playwright.dev/docs)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Test Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Network](https://playwright.dev/docs/network)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Playwright VS Code Extension](https://playwright.dev/docs/getting-started-vscode)
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Playwright GitHub Repository](https://github.com/microsoft/playwright)
- [Playwright Release Notes](https://playwright.dev/docs/release-notes)


## Implementation

[Add content here]


## Testing

[Add content here]

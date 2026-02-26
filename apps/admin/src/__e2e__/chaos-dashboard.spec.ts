import { test, expect } from '@playwright/test';

/**
 * Chaos Dashboard E2E Tests
 * 
 * Tests the chaos engineering dashboard functionality including:
 * - Dashboard rendering and data display
 * - Real-time metrics updates
 * - Experiment management (start/stop)
 * - Resilience score visualization
 * - Multi-tenant impact analysis
 */

test.describe('Chaos Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chaos dashboard
    await page.goto('/admin/chaos-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should render dashboard with system resilience metrics', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="chaos-dashboard"]');
    
    // Check main dashboard elements
    await expect(page.locator('h1')).toContainText('Chaos Engineering Dashboard');
    
    // Check resilience metrics cards
    await expect(page.locator('[data-testid="overall-resilience"]')).toBeVisible();
    await expect(page.locator('[data-testid="availability-metric"]')).toBeVisible();
    await expect(page.locator('[data-testid="fault-tolerance"]')).toBeVisible();
    await expect(page.locator('[data-testid="recovery-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="data-consistency"]')).toBeVisible();
    await expect(page.locator('[data-testid="security-compliance"]')).toBeVisible();
    
    // Verify metrics are displayed with proper formatting
    const overallResilience = page.locator('[data-testid="overall-resilience"] .text-2xl');
    await expect(overallResilience).toBeVisible();
    const resilienceText = await overallResilience.textContent();
    expect(resilienceText).toMatch(/\d+\.\d+%$/); // Should be a percentage with 1 decimal
  });

  test('should display active and available experiments', async ({ page }) => {
    // Wait for experiments tab to be available
    await page.waitForSelector('[data-testid="experiments-tab"]');
    await page.click('[data-testid="experiments-tab"]');
    
    // Check active experiments section
    await expect(page.locator('[data-testid="active-experiments"]')).toBeVisible();
    await expect(page.locator('[data-testid="available-experiments"]')).toBeVisible();
    
    // Mock experiment data
    await page.route('/api/admin/chaos/metrics', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: [],
          resilience: {
            overallScore: 85.5,
            availability: 99.9,
            faultTolerance: 78.2,
            recoveryTime: 2500,
            dataConsistency: 92.1,
            securityCompliance: 88.7,
            lastUpdated: new Date().toISOString(),
          },
          experiments: [
            {
              id: 'exp-1',
              name: 'Database Connection Pool Exhaustion',
              description: 'Test system behavior under database connection pool exhaustion',
              failureTypes: ['connection_timeout', 'pool_exhausted'],
              probability: 0.7,
              duration: 30000,
              severity: 'high',
              isActive: true,
            },
            {
              id: 'exp-2',
              name: 'Email Service Outage',
              description: 'Test email service failure handling',
              failureTypes: ['service_unavailable'],
              probability: 0.5,
              duration: 20000,
              severity: 'medium',
              isActive: false,
            },
          ],
        }),
      });
    });
    
    // Refresh to load mock data
    await page.click('[data-testid="refresh-button"]');
    await page.waitForTimeout(1000);
    
    // Verify active experiments are displayed
    const activeExperiments = page.locator('[data-testid="active-experiments"] .border');
    await expect(activeExperiments).toHaveCount(1);
    
    const activeExperiment = activeExperiments.first();
    await expect(activeExperiment.locator('h4')).toContainText('Database Connection Pool Exhaustion');
    await expect(activeExperiment.locator('[data-testid="severity-badge"]')).toContainText('high');
    await expect(activeExperiment.locator('button')).toContainText('Stop');
    
    // Verify available experiments are displayed
    const availableExperiments = page.locator('[data-testid="available-experiments"] .border');
    await expect(availableExperiments).toHaveCount(1);
    
    const availableExperiment = availableExperiments.first();
    await expect(availableExperiment.locator('h4')).toContainText('Email Service Outage');
    await expect(availableExperiment.locator('[data-testid="severity-badge"]')).toContainText('medium');
    await expect(availableExperiment.locator('button')).toContainText('Start');
  });

  test('should start and stop chaos experiments', async ({ page }) => {
    // Mock API endpoints for experiment control
    let experimentState = { isActive: false };
    
    await page.route('/api/admin/chaos/metrics', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: [],
          resilience: {
            overallScore: 85.5,
            availability: 99.9,
            faultTolerance: 78.2,
            recoveryTime: 2500,
            dataConsistency: 92.1,
            securityCompliance: 88.7,
            lastUpdated: new Date().toISOString(),
          },
          experiments: [
            {
              id: 'exp-test',
              name: 'Test Experiment',
              description: 'Test experiment for E2E testing',
              failureTypes: ['test_failure'],
              probability: 0.5,
              duration: 10000,
              severity: 'low',
              isActive: experimentState.isActive,
            },
          ],
        }),
      });
    });
    
    await page.route('/api/admin/chaos/experiments/exp-test/start', (route) => {
      experimentState.isActive = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Experiment started' }),
      });
    });
    
    await page.route('/api/admin/chaos/experiments/exp-test/stop', (route) => {
      experimentState.isActive = false;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Experiment stopped' }),
      });
    });
    
    // Navigate to experiments tab
    await page.click('[data-testid="experiments-tab"]');
    await page.waitForTimeout(1000);
    
    // Initially should be in available experiments
    const availableExperiments = page.locator('[data-testid="available-experiments"] .border');
    await expect(availableExperiments).toHaveCount(1);
    
    // Start the experiment
    await availableExperiments.locator('button').click();
    await page.waitForTimeout(1000);
    
    // Should now be in active experiments
    const activeExperiments = page.locator('[data-testid="active-experiments"] .border');
    await expect(activeExperiments).toHaveCount(1);
    
    // Stop the experiment
    await activeExperiments.locator('button').click();
    await page.waitForTimeout(1000);
    
    // Should be back in available experiments
    await expect(availableExperiments).toHaveCount(1);
  });

  test('should display metrics and resilience trends', async ({ page }) => {
    // Mock metrics data with trends
    await page.route('/api/admin/chaos/metrics', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: [
            {
              experimentId: 'exp-1',
              experimentName: 'Database Chaos Test',
              status: 'completed',
              startTime: new Date(Date.now() - 3600000).toISOString(),
              endTime: new Date(Date.now() - 3000000).toISOString(),
              duration: 600000,
              resilienceScore: 78.5,
              failureTypes: ['connection_timeout'],
              totalTests: 50,
              passedTests: 42,
              failedTests: 8,
              systemImpact: {
                availability: 95.2,
                responseTime: 1250,
                errorRate: 4.8,
                throughput: 850,
              },
              tenantImpact: {
                affectedTenants: 12,
                totalTenants: 100,
                isolationViolations: 0,
              },
            },
            {
              experimentId: 'exp-2',
              experimentName: 'Email Service Test',
              status: 'completed',
              startTime: new Date(Date.now() - 7200000).toISOString(),
              endTime: new Date(Date.now() - 6600000).toISOString(),
              duration: 300000,
              resilienceScore: 92.1,
              failureTypes: ['service_unavailable'],
              totalTests: 30,
              passedTests: 28,
              failedTests: 2,
              systemImpact: {
                availability: 98.7,
                responseTime: 890,
                errorRate: 1.3,
                throughput: 1200,
              },
              tenantImpact: {
                affectedTenants: 5,
                totalTenants: 100,
                isolationViolations: 0,
              },
            },
          ],
          resilience: {
            overallScore: 85.3,
            availability: 97.0,
            faultTolerance: 85.2,
            recoveryTime: 2100,
            dataConsistency: 94.5,
            securityCompliance: 91.8,
            lastUpdated: new Date().toISOString(),
          },
          experiments: [],
        }),
      });
    });
    
    // Navigate to metrics tab
    await page.click('[data-testid="metrics-tab"]');
    await page.waitForTimeout(1000);
    
    // Check recent experiment results
    await expect(page.locator('[data-testid="recent-experiments"]')).toBeVisible();
    const experimentResults = page.locator('[data-testid="recent-experiments"] .border');
    await expect(experimentResults).toHaveCount(2);
    
    // Verify first experiment details
    const firstResult = experimentResults.first();
    await expect(firstResult.locator('h4')).toContainText('Database Chaos Test');
    await expect(firstResult.locator('[data-testid="status-badge"]')).toContainText('completed');
    await expect(firstResult).toContainText('78.5%');
    await expect(firstResult).toContainText('42/50');
    
    // Check system impact chart
    await expect(page.locator('[data-testid="system-impact-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-impact-chart"] svg')).toBeVisible();
    
    // Navigate to resilience trends tab
    await page.click('[data-testid="resilience-tab"]');
    await page.waitForTimeout(1000);
    
    // Check resilience score trends
    await expect(page.locator('[data-testid="resilience-trends-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="resilience-trends-chart"] svg')).toBeVisible();
    
    // Check tenant impact analysis
    await expect(page.locator('[data-testid="tenant-impact-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="tenant-impact-chart"] svg')).toBeVisible();
    
    // Verify isolation violations display
    await expect(page.locator('[data-testid="isolation-violations"]')).toContainText('Isolation violations: 0');
  });

  test('should handle real-time WebSocket updates', async ({ page }) => {
    // Mock WebSocket for real-time updates
    await page.addInitScript(() => {
      // Mock WebSocket in the page
      window.WebSocket = class MockWebSocket {
        constructor(url: string) {
          setTimeout(() => {
            // Simulate initial connection
            this.onopen?.();
            
            // Simulate real-time metrics update
            setTimeout(() => {
              this.onmessage?.({
                data: JSON.stringify({
                  type: 'chaos_metrics_update',
                  experimentId: 'exp-realtime',
                  metrics: {
                    experimentName: 'Real-time Test',
                    status: 'running',
                    resilienceScore: 82.3,
                    systemImpact: {
                      availability: 96.1,
                      responseTime: 1100,
                      errorRate: 3.9,
                      throughput: 950,
                    },
                  },
                }),
              });
            }, 1000);
            
            // Simulate resilience update
            setTimeout(() => {
              this.onmessage?.({
                data: JSON.stringify({
                  type: 'resilience_update',
                  resilience: {
                    overallScore: 86.7,
                    availability: 97.8,
                    faultTolerance: 87.2,
                    recoveryTime: 1950,
                    dataConsistency: 95.3,
                    securityCompliance: 92.9,
                    lastUpdated: new Date().toISOString(),
                  },
                }),
              });
            }, 2000);
          }, 100);
        }
        
        onopen: () => {};
        onmessage: () => {};
        onerror: () => {};
        onclose: () => {};
        send: () => {};
        close: () => {};
      } as any;
    });
    
    // Initial load
    await page.waitForTimeout(500);
    
    // Check initial resilience score
    const initialResilience = page.locator('[data-testid="overall-resilience"] .text-2xl');
    const initialScore = await initialResilience.textContent();
    
    // Wait for WebSocket updates
    await page.waitForTimeout(3000);
    
    // Check if resilience score updated (should change from initial value)
    const updatedResilience = page.locator('[data-testid="overall-resilience"] .text-2xl');
    const updatedScore = await updatedResilience.textContent();
    
    // The score should have changed due to WebSocket update
    expect(updatedScore).not.toBe(initialScore);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/admin/chaos/metrics', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch chaos metrics' }),
      });
    });
    
    // Should display error message
    await expect(page.locator('[data-testid="error-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-alert"]')).toContainText('Error');
    await expect(page.locator('[data-testid="error-alert"]')).toContainText('Failed to fetch chaos metrics');
    
    // Should not display metrics when error occurs
    await expect(page.locator('[data-testid="overall-resilience"]')).not.toBeVisible();
  });

  test('should display loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/admin/chaos/metrics', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metrics: [],
          resilience: null,
          experiments: [],
        }),
      });
    });
    
    // Should show loading state initially
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading-spinner"]')).toContainText('Loading chaos metrics...');
    
    // Wait for loading to complete
    await page.waitForTimeout(2500);
    
    // Should not show loading state after data loads
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check mobile layout
    await expect(page.locator('[data-testid="chaos-dashboard"]')).toBeVisible();
    
    // Metrics should stack vertically on mobile
    const metricsGrid = page.locator('[data-testid="metrics-grid"]');
    await expect(metricsGrid).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Should adapt to tablet layout
    await expect(page.locator('[data-testid="chaos-dashboard"]')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // Should show full desktop layout
    await expect(page.locator('[data-testid="chaos-dashboard"]')).toBeVisible();
  });
});

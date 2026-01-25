/**
 * Meta-commentary:
 * - Current Status: Verifies the public OG image endpoint returns a PNG payload.
 * - Mapping: Exercises /api/og which is documented in docs/apis/openapi/openapi.yaml.
 * - Reasoning: End-to-end coverage ensures the API contract matches live behavior.
 */
import { test, expect } from '@playwright/test'

test('og image endpoint returns a png payload', async ({ request }) => {
  const response = await request.get('/api/og?title=Hello&description=World')

  expect(response.ok()).toBeTruthy()
  expect(response.headers()['content-type']).toContain('image/png')

  const body = await response.body()
  expect(body.length).toBeGreaterThan(0)
})

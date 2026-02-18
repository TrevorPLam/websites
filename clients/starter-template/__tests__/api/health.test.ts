/**
 * Health check endpoint tests.
 * Verifies GET /api/health returns 200 with { status: 'ok' }.
 */

import { GET } from '../../app/api/health/route';

describe('GET /api/health', () => {
  it('returns 200 OK', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('returns application/json content type', async () => {
    const response = await GET();
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('returns { status: "ok" } body', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toEqual({ status: 'ok' });
  });
});

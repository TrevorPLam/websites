/**
 * Health check endpoint for container orchestration and uptime monitoring.
 * Returns 200 OK with a JSON payload containing status and timestamp.
 *
 * Used by: Docker HEALTHCHECK, load balancers, Kubernetes probes
 * @task 1.6.1
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

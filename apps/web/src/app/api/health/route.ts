/**
 * @file apps/web/app/api/health/route.ts
 * @role api-route
 * @summary Public health check endpoint for uptime monitoring
 * @exports GET /api/health - Comprehensive health status
 * @security Public endpoint with limited information disclosure
 * @description Health check for load balancers and monitoring systems
 * @requirements PROD-007 / observability / health-endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckManager } from '@repo/infrastructurestructure/monitoring';

/**
 * GET /api/health
 *
 * Public health check endpoint for:
 * - Load balancer health checks
 * - Uptime monitoring services
 * - Infrastructure monitoring
 * - Basic service availability
 *
 * Returns limited information to avoid exposing sensitive data
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const checkType = url.searchParams.get('type');
    const verbose = url.searchParams.get('verbose') === 'true';

    // Simple liveness check (minimal response)
    if (checkType === 'liveness') {
      const liveness = await healthCheckManager.getLiveness();
      return NextResponse.json(liveness, {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // Readiness check (service dependencies)
    if (checkType === 'readiness') {
      const readiness = await healthCheckManager.getReadiness();
      const statusCode = readiness.status === 'ready' ? 200 : 503;
      return NextResponse.json(readiness, {
        status: statusCode,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // Full health check (detailed, requires verbose flag)
    if (checkType === 'full' && verbose) {
      const health = await healthCheckManager.runAllHealthChecks();
      const statusCode =
        health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503;

      return NextResponse.json(health, {
        status: statusCode,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    // Default public health check (limited information)
    const health = await healthCheckManager.runAllHealthChecks();

    // Create public-safe response (hide sensitive details)
    const publicResponse = {
      status: health.overall,
      timestamp: health.timestamp,
      uptime: health.uptime,
      version: health.version,
      services: health.services.map((service: any) => ({
        service: service.service,
        status: service.status,
        latency: service.latency,
        lastChecked: service.lastChecked,
        // Hide detailed error messages in public endpoint
        error: service.error ? 'Service unavailable' : undefined,
      })),
    };

    const statusCode =
      health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503;

    return NextResponse.json(publicResponse, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        // Health check specific headers
        'X-Health-Check': 'true',
        'X-Status': health.overall,
        'X-Uptime': health.uptime.toString(),
      },
    });
  } catch (error) {
    // Return error status but don't expose error details
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date(),
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Health-Check': 'true',
          'X-Status': 'unhealthy',
        },
      }
    );
  }
}

/**
 * HEAD /api/health
 *
 * Lightweight health check for load balancers
 * Returns only headers, no body
 */
export async function HEAD(request: NextRequest) {
  try {
    const health = await healthCheckManager.runAllHealthChecks();
    const statusCode =
      health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503;

    return new NextResponse(null, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Health-Check': 'true',
        'X-Status': health.overall,
        'X-Uptime': health.uptime.toString(),
        'Content-Length': '0',
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Health-Check': 'true',
        'X-Status': 'unhealthy',
        'Content-Length': '0',
      },
    });
  }
}

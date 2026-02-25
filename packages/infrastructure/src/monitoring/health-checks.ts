/**
 * @file packages/infrastructure/monitoring/health-checks.ts
 * @summary Production health check endpoints for core services
 * @exports HealthCheckManager with comprehensive service monitoring
 * @security Production-safe with tenant isolation awareness
 * @description Health monitoring for database, auth, payments, and external services
 * @requirements PROD-007 / observability / health-checks
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { withServerSpan } from '../sentry/server';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastChecked: Date;
  details?: Record<string, any>;
  error?: string;
}

export interface HealthCheckSummary {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: HealthCheckResult[];
  uptime: number;
  version: string;
}

/**
 * Health Check Manager
 *
 * Provides comprehensive health monitoring for:
 * - Database connectivity and performance
 * - Authentication service availability
 * - Payment gateway connectivity
 * - External service dependencies
 * - System resource utilization
 */
export class HealthCheckManager {
  private supabase: SupabaseClient<any>;
  private startTime: Date;

  constructor() {
    this.startTime = new Date();
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Run comprehensive health checks for all services
   */
  async runAllHealthChecks(): Promise<HealthCheckSummary> {
    const startTime = Date.now();

    const services = await Promise.allSettled([
      this.checkDatabase(),
      this.checkAuthentication(),
      this.checkPaymentGateway(),
      this.checkEmailService(),
      this.checkExternalAPIs(),
      this.checkSystemResources(),
    ]);

    const results: HealthCheckResult[] = services.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          service: 'unknown',
          status: 'unhealthy' as const,
          latency: 0,
          lastChecked: new Date(),
          error: result.reason?.message || 'Unknown error',
        };
      }
    });

    const overall = this.calculateOverallHealth(results);
    const uptime = Date.now() - this.startTime.getTime();

    return {
      overall,
      timestamp: new Date(),
      services: results,
      uptime,
      version: process.env.NEXT_PUBLIC_PLATFORM_VERSION || 'unknown',
    };
  }

  /**
   * Check database connectivity and performance
   */
  private async checkDatabase(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.database', op: 'db.query' }, async () => {
      const startTime = Date.now();

      try {
        // Test basic connectivity
        const { error: connectError } = await this.supabase
          .from('tenants')
          .select('count')
          .limit(1);

        if (connectError) {
          return {
            service: 'database',
            status: 'unhealthy',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: `Connection failed: ${connectError.message}`,
          };
        }

        // Test query performance
        const queryStart = Date.now();
        const { error: queryError, data } = await this.supabase
          .from('tenants')
          .select('id, created_at')
          .limit(5);

        const queryLatency = Date.now() - queryStart;

        if (queryError) {
          return {
            service: 'database',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: `Query failed: ${queryError.message}`,
          };
        }

        // Check database size (if available)
        let dbSize = 'unknown';
        try {
          const { data: sizeData } = await this.supabase.rpc('get_database_size');
          dbSize = sizeData ? `${Math.round(sizeData / 1024 / 1024)}MB` : 'unknown';
        } catch {
          // Size check is optional
        }

        return {
          service: 'database',
          status: queryLatency > 1000 ? 'degraded' : 'healthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            queryLatency,
            recordCount: data?.length || 0,
            databaseSize: dbSize,
          },
        };
      } catch (error) {
        return {
          service: 'database',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Check authentication service availability
   */
  private async checkAuthentication(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.auth', op: 'http.client' }, async () => {
      const startTime = Date.now();

      try {
        // Test Clerk authentication (if configured)
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
          const clerkUrl = `https://api.clerk.dev/v1/instance`;
          const response = await fetch(clerkUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          });

          if (!response.ok) {
            return {
              service: 'authentication',
              status: 'degraded',
              latency: Date.now() - startTime,
              lastChecked: new Date(),
              error: `Clerk API returned ${response.status}`,
            };
          }

          const instanceData = await response.json();

          return {
            service: 'authentication',
            status: 'healthy',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            details: {
              provider: 'clerk',
              instanceId: instanceData.id,
              supportedFactors: instanceData.supported_factors,
            },
          };
        }

        // Fallback to Supabase auth check
        const { data, error } = await this.supabase.auth.getSession();

        if (error) {
          return {
            service: 'authentication',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: `Auth check failed: ${error.message}`,
          };
        }

        return {
          service: 'authentication',
          status: 'healthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            provider: 'supabase',
            sessionValid: !!data.session,
          },
        };
      } catch (error) {
        return {
          service: 'authentication',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Check payment gateway connectivity
   */
  private async checkPaymentGateway(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.payments', op: 'http.client' }, async () => {
      const startTime = Date.now();

      try {
        if (!process.env.STRIPE_SECRET_KEY) {
          return {
            service: 'payments',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: 'Stripe not configured',
          };
        }

        // Test Stripe API connectivity
        const stripeUrl = 'https://api.stripe.com/v1/account';
        const response = await fetch(stripeUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          },
        });

        if (!response.ok) {
          return {
            service: 'payments',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: `Stripe API returned ${response.status}`,
          };
        }

        const accountData = await response.json();

        return {
          service: 'payments',
          status: 'healthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            provider: 'stripe',
            accountId: accountData.id,
            country: accountData.country,
            chargesEnabled: accountData.charges_enabled,
            payoutsEnabled: accountData.payouts_enabled,
          },
        };
      } catch (error) {
        return {
          service: 'payments',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Check email service availability
   */
  private async checkEmailService(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.email', op: 'http.client' }, async () => {
      const startTime = Date.now();

      try {
        if (!process.env.RESEND_API_KEY) {
          return {
            service: 'email',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: 'Resend not configured',
          };
        }

        // Test Resend API connectivity
        const resendUrl = 'https://api.resend.com/domains';
        const response = await fetch(resendUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
        });

        if (!response.ok) {
          return {
            service: 'email',
            status: 'degraded',
            latency: Date.now() - startTime,
            lastChecked: new Date(),
            error: `Resend API returned ${response.status}`,
          };
        }

        const domainsData = await response.json();

        return {
          service: 'email',
          status: 'healthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            provider: 'resend',
            domainCount: domainsData.data?.length || 0,
            verifiedDomains: domainsData.data?.filter((d: any) => d.verified).length || 0,
          },
        };
      } catch (error) {
        return {
          service: 'email',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Check external API dependencies
   */
  private async checkExternalAPIs(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.external-apis', op: 'http.client' }, async () => {
      const startTime = Date.now();
      const checks: Promise<{ name: string; status: string; latency: number }>[] = [];

      // Check Vercel API
      if (process.env.VERCEL_PROJECT_ID) {
        checks.push(
          fetch('https://api.vercel.com/v9/projects', {
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            },
          })
            .then((r) => ({ name: 'vercel', status: r.ok ? 'ok' : 'error', latency: 0 }))
            .catch(() => ({ name: 'vercel', status: 'error', latency: 0 }))
        );
      }

      // Check Upstash Redis
      if (process.env.UPSTASH_REDIS_REST_URL) {
        checks.push(
          fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          })
            .then((r) => ({ name: 'upstash', status: r.ok ? 'ok' : 'error', latency: 0 }))
            .catch(() => ({ name: 'upstash', status: 'error', latency: 0 }))
        );
      }

      try {
        const results = await Promise.allSettled(checks);
        const apiResults: any[] = [];

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            apiResults.push(result.value);
          } else {
            apiResults.push({ name: 'unknown', status: 'error', latency: 0 });
          }
        });

        const healthyCount = apiResults.filter((r) => r.status === 'ok').length;
        const totalCount = apiResults.length;

        return {
          service: 'external-apis',
          status:
            healthyCount === totalCount ? 'healthy' : healthyCount > 0 ? 'degraded' : 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            apis: apiResults,
            healthyCount,
            totalCount,
          },
        };
      } catch (error) {
        return {
          service: 'external-apis',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Check system resources
   */
  private async checkSystemResources(): Promise<HealthCheckResult> {
    return withServerSpan({ name: 'health-check.system', op: 'function' }, async () => {
      const startTime = Date.now();

      try {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        // Memory checks
        const totalMemory = memUsage.heapTotal + memUsage.external;
        const usedMemory = memUsage.heapUsed + memUsage.external;
        const memoryUsagePercent = (usedMemory / totalMemory) * 100;

        // CPU usage (simplified)
        const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds

        const status =
          memoryUsagePercent > 90 ? 'unhealthy' : memoryUsagePercent > 75 ? 'degraded' : 'healthy';

        return {
          service: 'system',
          status,
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          details: {
            memory: {
              heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
              heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
              external: Math.round(memUsage.external / 1024 / 1024),
              rss: Math.round(memUsage.rss / 1024 / 1024),
              usagePercent: Math.round(memoryUsagePercent),
            },
            cpu: {
              user: cpuPercent,
              system: cpuUsage.system / 1000000,
            },
            uptime: Math.round(process.uptime()),
          },
        };
      } catch (error) {
        return {
          service: 'system',
          status: 'unhealthy',
          latency: Date.now() - startTime,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
  }

  /**
   * Calculate overall health status
   */
  private calculateOverallHealth(
    results: HealthCheckResult[]
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthyCount = results.filter((r) => r.status === 'unhealthy').length;
    const degradedCount = results.filter((r) => r.status === 'degraded').length;
    const totalServices = results.length;

    if (unhealthyCount > 0) {
      return 'unhealthy';
    }

    if (degradedCount > totalServices * 0.3) {
      return 'degraded';
    }

    return 'healthy';
  }

  /**
   * Get simple liveness check
   */
  async getLiveness(): Promise<{ status: string; timestamp: Date }> {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }

  /**
   * Get readiness check
   */
  async getReadiness(): Promise<{ status: string; timestamp: Date; checks: string[] }> {
    const startTime = Date.now();
    const checks: string[] = [];

    try {
      // Check database
      await this.supabase.from('tenants').select('count').limit(1);
      checks.push('database');
    } catch {
      // Database not ready
    }

    return {
      status: checks.length > 0 ? 'ready' : 'not-ready',
      timestamp: new Date(),
      checks,
    };
  }
}

/**
 * Global health check manager instance
 */
export const healthCheckManager = new HealthCheckManager();

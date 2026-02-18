<!--
/**
 * @file docs/api/health.md
 * @role docs
 * @summary API documentation for the health check endpoint.
 *
 * @entrypoints
 * - Health endpoint reference for orchestrators, operators, and integrators
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - clients/*/app/api/health/route.ts
 *
 * @used_by
 * - Docker HEALTHCHECK, Kubernetes probes, load balancers, monitoring tools
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Health Check API

**Last Updated:** 2026-02-18

## Overview

All client applications in the marketing-websites monorepo expose a health check endpoint. This endpoint is used by container orchestrators (Docker, Kubernetes, ECS), load balancers, and monitoring tools to verify that the application is running and ready to accept traffic.

## Endpoint

| Property | Value |
|----------|-------|
| **Path** | `/api/health` |
| **Method** | `GET` |
| **Authentication** | None (public) |
| **Content-Type** | `application/json` |

## Response

### Success (200 OK)

```json
{
  "status": "ok"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Always `"ok"` when the application is healthy |

## Use Cases

1. **Docker HEALTHCHECK** — The Dockerfile uses this endpoint for container health checks. See [docs/deployment/docker.md](../deployment/docker.md).

2. **Kubernetes Probes** — Configure liveness and readiness probes:
   ```yaml
   livenessProbe:
     httpGet:
       path: /api/health
       port: 3101
     initialDelaySeconds: 5
     periodSeconds: 10
   ```

3. **Load Balancer Health Checks** — Point health check requests at `/api/health` to determine instance fitness.

4. **Manual Verification** — Quick sanity check during development or debugging:
   ```bash
   curl -s http://localhost:3101/api/health
   ```

## Client-Specific Ports

| Client | Default Port |
|--------|--------------|
| starter-template | 3101 |
| luxe-salon | 3102 |
| Other clients | Check `package.json` scripts |

## Related Documentation

- [Docker Deployment](../deployment/docker.md) — Health check usage in containers
- [API Style Guide](style-guide.md) — API design conventions for future endpoints

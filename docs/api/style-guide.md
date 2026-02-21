<!--
/**
 * @file docs/api/style-guide.md
 * @role docs
 * @summary API design style guide for REST endpoints and server actions.
 *
 * @entrypoints
 * - API design reference before implementing new endpoints
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - tasks/2-43-create-api-feature.md (future API feature)
 *
 * @used_by
 * - Developers implementing new REST endpoints
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

# API Style Guide

**Last Updated:** 2026-02-18

## Overview

This style guide defines conventions for API design across the marketing-websites platform. Follow these guidelines when adding new REST endpoints, Route Handlers, or extending the API surface. Reference: [tasks/2-43-create-api-feature.md](../../tasks/2-43-create-api-feature.md).

## Resource Naming

### URL Structure

- **Plural nouns** for collections: `/api/v1/users`, `/api/v1/bookings`, not `/api/v1/user`
- **kebab-case** for multi-word resources: `/api/v1/service-categories`, `/api/v1/booking-requests`
- **Nesting depth ≤ 2**: Prefer `/api/v1/bookings/{id}/confirmations` over deeper hierarchies
- **Avoid verbs in paths**: Use HTTP methods instead. Prefer `POST /api/v1/bookings` over `POST /api/v1/bookings/create`

### Examples

| Good                                | Bad                                |
| ----------------------------------- | ---------------------------------- |
| `GET /api/v1/services`              | `GET /api/v1/service`              |
| `GET /api/v1/booking-requests/{id}` | `GET /api/v1/bookingRequests/{id}` |
| `POST /api/v1/contacts`             | `POST /api/v1/contact/submit`      |

## Versioning

- **URL path versioning**: Use `/api/v1/`, `/api/v2/` for REST endpoints
- **Health and internal endpoints**: `/api/health` may remain unversioned (stable contract)
- **Version in first path segment**: Always include version before resource name for new endpoints

## HTTP Methods

| Method   | Usage                                        | Idempotent |
| -------- | -------------------------------------------- | ---------- |
| `GET`    | Retrieve resource(s). Safe, no side effects. | Yes        |
| `POST`   | Create resource. Non-idempotent.             | No         |
| `PUT`    | Full replace. Idempotent.                    | Yes        |
| `PATCH`  | Partial update. Idempotent for same input.   | Yes        |
| `DELETE` | Delete resource. Idempotent.                 | Yes        |

## Status Codes

Use semantic HTTP status codes consistently:

| Code                        | Usage                                                           |
| --------------------------- | --------------------------------------------------------------- |
| `200 OK`                    | Successful GET, PUT, PATCH                                      |
| `201 Created`               | Successful POST creating a resource. Include `Location` header. |
| `204 No Content`            | Successful DELETE or update with no response body               |
| `400 Bad Request`           | Malformed request syntax                                        |
| `401 Unauthorized`          | Missing or invalid authentication                               |
| `403 Forbidden`             | Authenticated but not authorized                                |
| `404 Not Found`             | Resource does not exist                                         |
| `409 Conflict`              | Duplicate resource, version conflict                            |
| `422 Unprocessable Entity`  | Validation errors (field-level)                                 |
| `500 Internal Server Error` | Unexpected server error                                         |

## Request/Response Formats

### Content-Type

- **Requests**: `Content-Type: application/json` for JSON payloads
- **Responses**: Always set `Content-Type: application/json` for JSON responses

### Success Envelope (Optional)

For consistency, consider wrapping success responses:

```json
{
  "data": { ... },
  "meta": { "timestamp": "2026-02-18T12:00:00Z" }
}
```

Simple endpoints (e.g. health) may return a minimal object: `{ "status": "ok" }`.

### Error Envelope

Use a consistent error structure for all error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "path": ["email"], "message": "Invalid email format" }]
  }
}
```

| Field           | Required | Description                                                                  |
| --------------- | -------- | ---------------------------------------------------------------------------- |
| `error.code`    | Yes      | Machine-readable code (e.g. `VALIDATION_ERROR`, `NOT_FOUND`, `RATE_LIMITED`) |
| `error.message` | Yes      | Human-readable summary                                                       |
| `error.details` | No       | Field-level validation errors or additional context                          |

### Pagination

When returning collections that may grow, support pagination:

```
GET /api/v1/bookings?page=1&limit=10&sort=createdAt&order=desc
```

Response:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

## Query Parameters

- **Filtering**: `?status=pending`
- **Sorting**: `?sort=createdAt&order=desc`
- **Pagination**: `?page=1&limit=10`
- **camelCase** for parameter names to align with JSON conventions

## Security

- **Authentication**: Document which endpoints require auth. Use `Authorization: Bearer <token>` or session cookies.
- **IDOR prevention**: Never allow access to another user's resources by ID alone. Require ownership proof (e.g. confirmation token + email).
- **Rate limiting**: Apply rate limits to mutations and public endpoints. See `@repo/infra` rate-limit.
- **HTTPS**: All production APIs must be served over TLS.

## Documentation

- Document all public endpoints (path, method, parameters, response shapes).
- Maintain OpenAPI spec when REST surface expands.
- Include request/response examples in docs.
- See [Health Check API](health.md) for an example.

## Related

- [Health Check API](health.md)
- [tasks/2-43-create-api-feature.md](../../tasks/2-43-create-api-feature.md)

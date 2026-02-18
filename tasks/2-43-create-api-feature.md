# 2.43 Create API Feature

**Status:** [ ] TODO | **Batch:** E | **Effort:** 24h | **Deps:** 2.11

**Related Research:** §5.1 (Spec-driven), REST, GraphQL, tRPC

**Objective:** API feature with 5+ implementation patterns supporting REST, GraphQL, and tRPC.

**Implementation Patterns:** Config-Based, REST-Based, GraphQL-Based, tRPC-Based, Hybrid (5+ total)

**Files:** `packages/features/src/api/` (index, lib/schema, lib/adapters, lib/api-config.ts, lib/rest.ts, lib/graphql.ts, lib/trpc.ts, components/APISection.tsx, components/APIConfig.tsx, components/APIREST.tsx, components/APIGraphQL.tsx, components/APItRPC.tsx, components/APIHybrid.tsx)

**API:** `APISection`, `apiSchema`, `createAPIConfig`, `createRESTEndpoint`, `createGraphQLEndpoint`, `createTRPCEndpoint`, `APIConfig`, `APIREST`, `APIGraphQL`, `APItRPC`, `APIHybrid`

**Checklist:** Schema; adapters; REST; GraphQL; tRPC; implementation patterns; export.
**Done:** Builds; all patterns work; REST functional; GraphQL works; tRPC works.
**Anti:** No custom API framework; use existing libraries.

---

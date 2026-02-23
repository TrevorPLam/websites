## The Perfect Agentic Coding Task Template

The most critical insight from GitHub's analysis of 2,500+ `agents.md` files: **vague specs fail, specialist specs win**. The template below applies that principle to a single, atomic task file — one task per file, scoped tightly, executable from start to finish. [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)

---

````markdown
---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: TASK-001
title: 'Short, imperative title (verb + object)'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/TASK-001-short-slug
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(pytest:*)
---

# TASK-001 · Short, imperative title

## Objective

One or two sentences. State **what** to build and **why** it matters.
Focus on user/system outcome, not implementation details.

> Example: "Add JWT refresh-token rotation to the auth service so that
> users stay logged in without re-authenticating every 15 minutes."

---

## Context

Relevant background the agent needs to avoid wrong assumptions.
Keep it factual and minimal — no fluff.

- **Codebase area:** `src/auth/` — token issuance and validation
- **Related files:** `src/auth/tokenService.ts`, `src/middleware/auth.ts`
- **Dependencies:** `jsonwebtoken ^9.0`, `prisma ^5.0`
- **Prior work:** TASK-000 established the base auth flow (already merged)
- **Constraints:** Must be backward-compatible with existing access tokens

---

## Tech Stack

Be version-specific. Vague stack descriptions produce vague code [web:2].

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Language  | TypeScript 5.4                      |
| Runtime   | Node.js 22 LTS                      |
| Framework | Express 4.x                         |
| ORM       | Prisma 5 + PostgreSQL 16            |
| Testing   | Jest 29 + Supertest                 |
| Linting   | ESLint + Prettier (configs in root) |

---

## Acceptance Criteria

Testable, binary conditions. Each line must be verifiable [page:1].
Use "Given / When / Then" framing where it adds clarity.

- [ ] `POST /auth/refresh` accepts a valid refresh token and returns a new
      access token + rotated refresh token
- [ ] Used refresh tokens are invalidated immediately (single-use)
- [ ] Expired or invalid refresh tokens return `401 Unauthorized` with
      message `"Invalid or expired refresh token"`
- [ ] Rotation window is configurable via `REFRESH_TOKEN_TTL` env var
- [ ] All existing auth tests continue to pass (`npm test -- --coverage`)
- [ ] New endpoint has ≥ 90% branch coverage

---

## Implementation Plan

Ordered, dependency-aware steps. Each step is independently testable [page:1].
Do NOT skip steps. Do NOT combine steps.

1. **Schema** — Add `refreshTokens` table via Prisma migration
   (`id`, `token_hash`, `user_id`, `expires_at`, `used_at`)
2. **Service** — Implement `issueRefreshToken()` and `rotateRefreshToken()`
   in `src/auth/tokenService.ts`
3. **Route** — Add `POST /auth/refresh` in `src/routes/auth.ts`
4. **Middleware** — Update `src/middleware/auth.ts` to reject used tokens
5. **Tests** — Write unit tests for service layer; integration tests for route
6. **Docs** — Update `docs/api/auth.md` with new endpoint spec

> ⚠️ Ask before proceeding if step 1 conflicts with existing migrations.

---

## Commands

Put commands here so the agent references them directly [web:2].
Include flags. Do not use tool names without the full invocation.

```bash
# Install / sync deps
npm install

# Run database migration (step 1 only)
npx prisma migrate dev --name add-refresh-tokens

# Run all tests (must pass before commit)
npm test

# Run tests with coverage report
npm test -- --coverage

# Lint and auto-fix
npm run lint --fix

# Type-check only (no emit)
npx tsc --noEmit
```
````

---

## Code Style

One concrete example beats three paragraphs of description [web:2].

```typescript
// ✅ Correct — descriptive name, explicit return type, early validation
async function rotateRefreshToken(
  rawToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  if (!rawToken) throw new AppError(401, 'Token required');
  const record = await db.refreshToken.findUnique({ where: { tokenHash: hash(rawToken) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }
  // ... rotation logic
}

// ❌ Incorrect — vague name, implicit any, no validation
async function refresh(t) {
  const r = await db.refreshToken.findUnique({ where: { tokenHash: hash(t) } });
  // ...
}
```

**Naming conventions:**

- Functions: `camelCase` — `rotateRefreshToken`, `hashToken`
- Classes: `PascalCase` — `TokenService`, `AuthController`
- Constants: `UPPER_SNAKE_CASE` — `REFRESH_TOKEN_TTL`, `JWT_SECRET`
- Files: `camelCase.ts` — `tokenService.ts`, `authMiddleware.ts`

---

## Boundaries

Three-tier system. Unambiguous. The agent must not proceed past a 🚫 [web:2][page:1].

| Tier             | Scope                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Write to `src/auth/`, `src/routes/`, `tests/auth/`, `docs/api/auth.md`; run tests before every commit; follow naming conventions above       |
| ⚠️ **Ask first** | Modifying existing database schemas; adding new npm dependencies; changing `src/middleware/auth.ts` logic beyond token validation            |
| 🚫 **Never**     | Commit secrets or API keys; edit `node_modules/` or `prisma/migrations/` directly; remove a failing test; touch `src/billing/` or CI configs |

---

## Success Verification

How the agent (or reviewer) confirms the task is truly done [page:1].

1. Run `npm test` — all tests green, coverage ≥ 90% on new files
2. Run `npx tsc --noEmit` — zero type errors
3. Run `npm run lint` — zero lint errors
4. Manually test with `curl` or Postman against local dev server
5. Confirm `prisma migrate status` shows no pending migrations
6. Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

Domain knowledge the agent cannot infer on its own [page:1].

- **Clock skew:** Use `Date.now()` not `new Date()` for expiry comparisons
  to avoid timezone bugs with Prisma's `DateTime` fields
- **Race condition:** Two simultaneous refresh requests with the same token
  must both be rejected after the first succeeds — use a DB transaction
- **Token length:** `crypto.randomBytes(48).toString('hex')` gives 96-char
  tokens; do not truncate
- **Env fallback:** If `REFRESH_TOKEN_TTL` is not set, default to `7d`

---

## Out of Scope

Explicitly state what this task does NOT cover [web:10].

- OAuth2 / third-party provider tokens
- Refresh token revocation by admin (TASK-012)
- Frontend cookie handling (TASK-008)
- Rate limiting on `/auth/refresh` (TASK-015)

---

## References

- [JWT Best Practices — RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725)
- `docs/architecture/auth-flow.md` — existing auth sequence diagram
- `src/auth/tokenService.ts` — base implementation to extend

```

***

## Why Every Section Exists

| Section | Rationale |
|---|---|
| **YAML frontmatter** | Machine-readable metadata for orchestrators, CI, and task trackers  [agentskills](https://agentskills.io/specification) |
| **Objective** | Anchors intent; prevents the agent from optimizing for the wrong outcome  [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding) |
| **Context** | Reduces hallucination by telling the agent exactly where to look  [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) |
| **Tech Stack** | Version-specific stack prevents wrong library choices  [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) |
| **Acceptance Criteria** | Binary, testable; the agent can self-audit against these  [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding) |
| **Implementation Plan** | Ordered steps prevent "house of cards" code from combining too much at once  [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding) |
| **Commands** | Full commands with flags so the agent can execute without guessing  [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) |
| **Code Style** | One real example beats three paragraphs of prose  [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) |
| **Boundaries** | Three-tier system (✅/⚠️/🚫) is the single highest-impact spec pattern found in real repo analysis  [github](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) |
| **Success Verification** | Forces a self-audit loop before the task is marked done  [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding) |
| **Edge Cases** | Encodes domain knowledge the agent cannot infer — the highest-value human contribution  [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding) |
| **Out of Scope** | Prevents scope creep and premature coupling to sibling tasks  [servicenow](https://www.servicenow.com/docs/r/intelligent-experiences/gg-creating-aia.html) |

The one-task-per-file constraint is intentional: GitHub's research confirmed that giving an agent multiple simultaneous goals causes it to satisfy the first few and silently drop the rest (the "curse of instructions"). One file, one mission, full focus. [docs.memex](https://docs.memex.tech/in-depth/best-practices/best-practices-for-agentic-coding)
```

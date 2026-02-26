---
title: "Qstash Client Setup"
description: "> **Reference Documentation — February 2026**"
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: intermediate
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "qstash", "client", "setup"]
legacy_path: "backend-data\messaging\qstash-client-setup.md"
---
# Qstash Client Setup

> **Reference Documentation — February 2026**

## Overview

QStash is Upstash's serverless message queue and scheduler. It enables background processing in Next.js without requiring a persistent server — jobs are invoked via HTTP POST from QStash to your API routes. [upstash](https://upstash.com/docs/qstash/quickstarts/vercel-nextjs)

---

## Installation

```bash
pnpm add @upstash/qstash
```

---

## Client Setup

```typescript
// packages/jobs/src/client.ts
import { Client } from '@upstash/qstash';

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// Shorthand for publishing to an internal API route
export function publishJob<T extends Record<string, unknown>>(
  route: string,
  body: T,
  options?: {
    delay?: number; // Delay in seconds
    retries?: number; // Default: 3
    timeout?: number; // Handler timeout in seconds
    deduplicationId?: string; // Prevent duplicate messages
  }
) {
  return qstash.publishJSON({
    url: `${process.env.APP_URL}${route}`,
    body,
    retries: options?.retries ?? 3,
    delay: options?.delay,
    timeout: options?.timeout,
    deduplicationId: options?.deduplicationId,
  });
}
```

---

## Request Verification Middleware

Every QStash consumer route **must** verify the signature to prevent unauthorized invocation: [upstash](https://upstash.com/docs/qstash/quickstarts/vercel-nextjs)

```typescript
// packages/jobs/src/verify.ts
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';

// Wrap any API route handler with this to verify QStash signature
export { verifySignatureAppRouter as verifyQStashSignature };

// Usage in a route:
// export const POST = verifyQStashSignature(async (req: Request) => { ... });
```

---

## Example: Weekly Report Job

```typescript
// apps/*/src/app/api/jobs/reports/weekly/route.ts
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { generateAndSendWeeklyReports } from '@repo/jobs/handlers/weekly-reports';

export const maxDuration = 60; // Required for PDF generation
export const runtime = 'nodejs';

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  await generateAndSendWeeklyReports(body);
  return Response.json({ success: true });
});
```

---

## Scheduled Jobs Registration

```typescript
// packages/jobs/src/schedules/register.ts
// Run once at startup or via admin action to register cron schedules

import { qstash } from '../client';

const SCHEDULES = [
  {
    name: 'weekly-reports',
    cron: '0 23 * * 0', // Sunday 11 PM UTC
    url: '/api/jobs/reports/weekly',
    body: { trigger: 'cron' },
  },
  {
    name: 'daily-crm-sync',
    cron: '0 6 * * *', // Daily at 6 AM UTC
    url: '/api/jobs/crm/sync',
    body: { trigger: 'cron' },
  },
  {
    name: 'gdpr-deletion-check',
    cron: '0 2 * * 0', // Weekly Sunday 2 AM UTC
    url: '/api/jobs/gdpr/deletion-check',
    body: { trigger: 'cron' },
  },
];

export async function registerAllSchedules() {
  const existing = await qstash.schedules.list();
  const existingNames = existing.map((s: any) => s.destination.split('/').pop());

  for (const schedule of SCHEDULES) {
    if (!existingNames.includes(schedule.name)) {
      await qstash.schedules.create({
        destination: `${process.env.APP_URL}${schedule.url}`,
        cron: schedule.cron,
        body: JSON.stringify(schedule.body),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(`[QStash] Registered schedule: ${schedule.name}`);
    }
  }
}
```

---

## References

- QStash Next.js Quickstart — https://upstash.com/docs/qstash/quickstarts/vercel-nextjs
- QStash Background Jobs — https://upstash.com/docs/qstash/features/background-jobs
- QStash Schedules — https://upstash.com/docs/qstash/features/schedules
- Upstash QStash SDK — https://github.com/upstash/qstash-js

---
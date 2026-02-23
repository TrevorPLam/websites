<!--
/**
 * @file realtime-lead-feed-implementation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for realtime lead feed implementation.
 * @entrypoints docs/guides/realtime-lead-feed-implementation.md
 * @exports realtime lead feed implementation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# realtime-lead-feed-implementation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

A real-time lead feed delivers new leads to the client portal dashboard the instant they are inserted into the database — no polling, no page refresh. This is built on **Supabase Realtime Postgres Changes**, which streams WAL (Write-Ahead Log) events over a persistent WebSocket connection filtered by `tenant_id`. [supabase](https://supabase.com/docs/guides/realtime/postgres-changes)

## Architecture

```
Lead form POST → /api/contact → INSERT into leads table
                                        │
                          Supabase WAL → Realtime Server
                                        │ (RLS policy applied)
                                        │
                          WebSocket → Client (portal dashboard)
                                        │
                               React state update → UI
```

### Three Realtime Primitives

Supabase Realtime exposes three distinct channels: [github](https://github.com/supabase/realtime)

| Primitive          | Use Case                                                 |
| ------------------ | -------------------------------------------------------- |
| `postgres_changes` | Listen to INSERT/UPDATE/DELETE on database tables        |
| `broadcast`        | Client-to-client ephemeral messaging (presence, cursors) |
| `presence`         | Track which users are online in a channel                |

For the lead feed, `postgres_changes` with `event: 'INSERT'` is the correct primitive.

---

## Security: RLS on Realtime

Supabase applies Row Level Security policies to Realtime change streams — the same policies that govern REST/GraphQL reads. The authenticated user's JWT must carry a `tenant_id` claim that satisfies the RLS policy before any row is broadcast to them. [supabase](https://supabase.com/blog/realtime-row-level-security-in-postgresql)

**Critical:** When subscribing, always include the server-side `filter` parameter. This is evaluated **before** broadcast — only matching rows are sent over the WebSocket, not all rows filtered client-side. [docs-pgth9qjfy-supabase.vercel](https://docs-pgth9qjfy-supabase.vercel.app/docs/guides/realtime/extensions/postgres-changes)

```sql
-- RLS policy (must already exist from Domain 4)
-- Realtime respects this automatically
CREATE POLICY "Tenants see only their own leads"
  ON leads
  FOR SELECT
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenantId')::uuid);

-- Enable Realtime publication for the leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
```

---

## Channel Subscription Pattern

```typescript
// packages/realtime/src/use-realtime-leads.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeLead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  score: number;
  source: string;
  status: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

interface UseRealtimeLeadsOptions {
  tenantId: string;
  onNewLead: (lead: RealtimeLead) => void;
  onLeadUpdated?: (lead: RealtimeLead) => void;
  enabled?: boolean;
}

export function useRealtimeLeads({
  tenantId,
  onNewLead,
  onLeadUpdated,
  enabled = true,
}: UseRealtimeLeadsOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const subscribe = useCallback(() => {
    if (!enabled || !tenantId) return;

    // Unsubscribe from any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`tenant-leads-${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          // Server-side filter — only rows matching this predicate are sent
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          onNewLead(payload.new as RealtimeLead);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          onLeadUpdated?.(payload.new as RealtimeLead);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Subscribed to leads for tenant ${tenantId}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] Channel error — will retry on visibility change');
        }
      });

    channelRef.current = channel;
  }, [tenantId, onNewLead, onLeadUpdated, enabled]);

  useEffect(() => {
    subscribe();

    // Reconnect when tab regains visibility (handles browser tab sleep)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        subscribe();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [subscribe]);
}
```

---

## Lead Feed UI Component

```typescript
// apps/portal/src/features/leads/ui/RealtimeLeadFeed.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRealtimeLeads, type RealtimeLead } from '@repo/realtime/use-realtime-leads';

interface RealtimeLeadFeedProps {
  tenantId: string;
  initialLeads: RealtimeLead[];
}

const scoreColor = (score: number) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-500';
};

export function RealtimeLeadFeed({ tenantId, initialLeads }: RealtimeLeadFeedProps) {
  const [leads, setLeads] = useState<RealtimeLead[]>(initialLeads);
  const [newLeadIds, setNewLeadIds] = useState<Set<string>>(new Set());

  const handleNewLead = useCallback((lead: RealtimeLead) => {
    // Prepend to feed — newest first
    setLeads((prev) => [lead, ...prev].slice(0, 100)); // Cap at 100

    // Highlight animation — clear after 3s
    setNewLeadIds((prev) => new Set([...prev, lead.id]));
    setTimeout(() => {
      setNewLeadIds((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }, 3000);

    // Notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New lead: ${lead.name}`, {
        body: `Score: ${lead.score} · Source: ${lead.source}`,
        icon: '/icon-192.png',
      });
    }
  }, []);

  const handleLeadUpdated = useCallback((updated: RealtimeLead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  }, []);

  useRealtimeLeads({
    tenantId,
    onNewLead: handleNewLead,
    onLeadUpdated: handleLeadUpdated,
  });

  return (
    <section aria-label="Live lead feed" aria-live="polite">
      <div className="space-y-3">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className={`
              flex items-center justify-between p-4 rounded-xl border transition-all duration-500
              ${newLeadIds.has(lead.id)
                ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                : 'border-gray-200 bg-white'}
            `}
            aria-label={`Lead from ${lead.name}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center
                              text-gray-600 font-bold text-sm flex-shrink-0">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{lead.name}</p>
                <p className="text-sm text-gray-500">{lead.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${scoreColor(lead.score)}`}>
                {lead.score}
              </span>
              <span className="text-xs text-gray-400 capitalize">{lead.source.replace(/_/g, ' ')}</span>
              <time className="text-xs text-gray-400" dateTime={lead.created_at}>
                {new Date(lead.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric', minute: '2-digit',
                })}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

---

## Scalability Notes

Supabase Realtime `postgres_changes` uses WAL decoding, which adds load proportional to write throughput. At high insert rates (>500 leads/min across all tenants), consider migrating the lead feed to **Realtime Broadcast** instead: the `/api/contact` route publishes a broadcast message after inserting the lead, and the portal subscribes to that broadcast channel. This decouples read load from WAL processing and is the recommended pattern above ~100 concurrent tenants. [reddit](https://www.reddit.com/r/Supabase/comments/1lfs6b7/supabase_realtime_postgres_changes_scalability/)

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- Supabase Realtime Postgres Changes — https://supabase.com/docs/guides/realtime/postgres-changes
- Supabase Realtime RLS — https://supabase.com/blog/realtime-row-level-security-in-postgresql
- Supabase Realtime GitHub — https://github.com/supabase/realtime
- Supabase Realtime Filter Syntax — https://supabase.com/docs/guides/realtime/postgres-changes#filtering-for-specific-changes


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]

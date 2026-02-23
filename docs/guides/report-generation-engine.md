<!--
/**
 * @file report-generation-engine.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for report generation engine.
 * @entrypoints docs/guides/report-generation-engine.md
 * @exports report generation engine
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

# report-generation-engine.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

The automated report engine generates weekly PDF performance reports for every active tenant and emails them with a signed download link. It uses **`@react-pdf/renderer`** for server-side PDF generation, **QStash** for job scheduling, and **Supabase Storage** for PDF hosting. [pdfnoodle](https://pdfnoodle.com/blog/how-to-generate-pdf-reports-from-html-with-react-pdf)

---

## Library Choice: `@react-pdf/renderer` vs. Puppeteer

| Factor               | `@react-pdf/renderer`    | Puppeteer                   |
| -------------------- | ------------------------ | --------------------------- |
| Runtime              | Pure Node.js             | Requires headless Chromium  |
| Binary size          | ~5 MB                    | ~300 MB                     |
| Vercel compatibility | ✅ (within 250 MB limit) | ❌ (exceeds limit)          |
| Cold start           | ~50–100ms                | ~2–5s                       |
| CSS support          | Custom layout engine     | Full browser CSS            |
| API                  | JSX components           | `page.pdf()` on a live page |
| Best for             | Structured data reports  | Pixel-perfect HTML-to-PDF   |

For structured lead/analytics reports, `@react-pdf/renderer` is the correct choice. [reddit](https://www.reddit.com/r/nextjs/comments/1pqkmeu/anyone_generating_pdfs_serverside_in_nextjs/)

---

## Node API

```typescript
import { renderToBuffer, renderToStream } from '@react-pdf/renderer';
import { createElement } from 'react';
import { WeeklyReportDocument } from './templates/WeeklyReport';

// Option 1: Buffer (for Supabase Storage upload)
const pdfBuffer = await renderToBuffer(createElement(WeeklyReportDocument, props));

// Option 2: Stream (for direct HTTP response)
const pdfStream = await renderToStream(createElement(WeeklyReportDocument, props));
// Pipe to response: pdfStream.pipe(res)
```

The `@react-pdf/node` package is required for server-side use — not `@react-pdf/renderer` directly, as the main package targets browser environments. [react-pdf](https://react-pdf.org/node)

---

## Core PDF Primitives

```typescript
import {
  Document, Page, Text, View, StyleSheet,
  Font, Image, Svg, Rect, G,
} from '@react-pdf/renderer';

// Fonts must be registered before use
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/.../Inter-Regular.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/.../Inter-Bold.woff', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', padding: 48, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 700, color: '#111827' },
  body: { fontSize: 10, color: '#374151', lineHeight: 1.5 },
});

export function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Weekly Report</Text>
        <Text style={styles.body}>Lead summary goes here.</Text>
      </Page>
    </Document>
  );
}
```

---

## QStash Weekly Schedule

```typescript
// packages/jobs/src/schedules/weekly-reports.ts
import { Client } from '@upstash/qstash';

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// Called once during initial deployment (or via admin action)
export async function registerWeeklyReportSchedule() {
  await qstash.schedules.create({
    destination: `${process.env.APP_URL}/api/jobs/reports/weekly`,
    cron: '0 23 * * 0', // Sunday 11 PM UTC (5 PM CST)
    body: JSON.stringify({ trigger: 'cron' }),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

The job handler fetches all active tenants with `weeklyReport !== false` and enqueues one `report.weekly` job per tenant — fanned out as individual QStash messages to avoid timeout on large tenant counts.

---

## Signed URL Delivery

```typescript
// Upload PDF to private Supabase Storage bucket
const fileName = `reports/${tenantId}/weekly-${date}.pdf`;

await supabaseAdmin.storage
  .from('tenant-documents')
  .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true });

// Create 7-day signed URL
const { data } = await supabaseAdmin.storage
  .from('tenant-documents')
  .createSignedUrl(fileName, 7 * 24 * 60 * 60);

const downloadUrl = data!.signedUrl;
```

The signed URL is time-limited — it cannot be shared or accessed after 7 days. Reports are also retained in storage for 90 days for compliance, then purged via a Storage lifecycle policy.

---

## Report Content Structure

```
Page 1: Cover + KPI cards
  ├── Business name, report period, logo
  ├── Total leads (+ delta vs prior week)
  ├── Qualified leads (score ≥ 70)
  ├── Total bookings
  └── Average lead score

Page 1 (cont): Charts
  ├── Daily lead volume bar chart (pure SVG via <Svg>/<Rect>)
  └── Lead source breakdown (horizontal bar chart)

Page 2: Top leads table
  ├── Name | Email | Score | Source | Date
  └── Score colored chip (green/yellow/gray)

Footer (fixed): Generation date + page number
```

---

## `maxDuration` Requirement

PDF generation with custom fonts and SVG charts can take 10–40 seconds on a cold Vercel function start. The route handler **must** set `export const maxDuration = 60` to prevent premature termination: [reddit](https://www.reddit.com/r/nextjs/comments/1pqkmeu/anyone_generating_pdfs_serverside_in_nextjs/)

```typescript
// apps/*/src/app/api/jobs/reports/weekly/route.ts
export const maxDuration = 60; // Seconds — required for PDF generation

export const POST = createJobHandler(async (payload) => {
  const pdfBuffer = await renderToBuffer(/* ... */);
  // ...
});
```

This route must use the **Node.js runtime**, not Edge — `@react-pdf/renderer` has no Edge-compatible build.

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- `@react-pdf/renderer` npm — https://www.npmjs.com/package/@react-pdf/renderer
- React PDF Node API — https://react-pdf.org/node
- Generating PDFs in React — https://blog.logrocket.com/generating-pdfs-react/
- PDF Generation with React-PDF — https://pdfnoodle.com/blog/how-to-generate-pdf-reports-from-html-with-react-pdf
- Upstash QStash Documentation — https://upstash.com/docs/qstash/overall/getstarted


## Implementation

[Add content here]


## Best Practices

[Add content here]


## Testing

[Add content here]

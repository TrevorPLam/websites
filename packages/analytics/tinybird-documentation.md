# tinybird-documentation.md

# Tinybird Official Documentation: Real-Time Analytics & Core Web Vitals

## Overview

Tinybird is a real-time data platform designed for developers to ingest, transform, and serve massive datasets through low-latency APIs. Built on top of ClickHouse, it abstracts the complexity of infrastructure management while providing high-performance analytical capabilities for streaming data.

## Real-Time Analytics with Tinybird

Tinybird enables the creation of real-time data pipelines using SQL. It is particularly well-suited for:

- **User-facing dashboards**: Providing instantaneous insights into application state.
- **Operational monitoring**: Tracking system performance and error rates in real-time.
- **Product analytics**: Understanding user behavior as it happens.

## Core Web Vitals Tracking

Tinybird provides a dedicated **Web Analytics Starter Kit**, an open-source template for monitoring web performance metrics.

### Key Metrics Tracked

1. **Largest Contentful Paint (LCP)**: Measures loading performance.
2. **Interaction to Next Paint (INP)**: Measures responsiveness to user interactions.
3. **Cumulative Layout Shift (CLS)**: Measures visual stability.
4. **First Contentful Paint (FCP)**: Measures when the first piece of content is rendered.
5. **Time to First Byte (TTFB)**: Measures server responsiveness.

### Implementation Pattern

Developers can ingest web vitals data via the Tinybird Events API or by using the provided JavaScript snippet in the starter kit.

```javascript
// Example: Sending Web Vitals to Tinybird
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToTinybird({ name, delta, id }) {
  fetch('https://api.tinybird.co/v0/events?name=web_vitals', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_TINYBIRD_TOKEN',
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      metric: name,
      value: delta,
      page_id: id,
    }),
  });
}

onLCP(sendToTinybird);
onINP(sendToTinybird);
onCLS(sendToTinybird);
```

## Advanced Features

### Pipes and Endpoints

Tinybird uses **Pipes** to define data transformations in SQL. These pipes are broken down into **Nodes** for better maintainability. Once a pipe is defined, it can be published as an **API Endpoint** with a single click.

### Data Ingestion

- **Events API**: For streaming data from applications.
- **Connectors**: Native support for Kafka, AWS S3, Google BigQuery, and Snowflake.
- **CLI**: For version control and CI/CD integration of data projects.

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Tinybird Official Documentation](https://www.tinybird.co/docs)
- [Tinybird Web Analytics Starter Kit](https://www.tinybird.co/web-analytics)
- [Tracking Core Web Vitals with Tinybird](https://www.tinybird.co/docs/guides/web-analytics-starter-kit.html)
- [Tinybird Events API Reference](https://www.tinybird.co/docs/api-reference/events-api.html)

## Best Practices

[Add content here]

## Testing

[Add content here]

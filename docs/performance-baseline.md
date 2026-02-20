# Performance Baseline (Task 0.6)

**Status:** In progress (metrics capture pending local run)

**Last Updated:** 2026-02-15

## Objectives

- Capture Core Web Vitals baseline (LCP, INP, CLS, TTFB, FCP) for the starter client.
- Establish budgets and repeatable measurement steps to detect regressions.

## Budgets now enforced (webpack)

- **Max asset size:** 250 KB
- **Max entrypoint size:** 550 KB
- **Hints:** warnings during `next build` (see `clients/starter-template/next.config.js`).

## How to run the baseline locally (evidence-only)

1. Install deps and build with budgets + analyzer toggle available:

   ```bash
   pnpm install
   pnpm --filter ./clients/starter-template build
   ```

2. Serve the built app on port 3100 (in another shell):

   ```bash
   pnpm --filter ./clients/starter-template start -- --port 3100
   ```

3. Run Lighthouse (desktop) against the live server (requires Chrome):

   ```bash
   npx lighthouse http://localhost:3100 \
     --preset=desktop \
     --only-categories=performance \
     --throttling.rttMs=40 --throttling.throughputKbps=10240 \
     --output=json --output-path=./docs/performance-baseline.lhdesktop.json
   ```

4. For mobile profile:

   ```bash
   npx lighthouse http://localhost:3100 \
     --preset=mobile \
     --only-categories=performance \
     --output=json --output-path=./docs/performance-baseline.lhmobile.json
   ```

5. Record metrics in the table below and commit the JSON artifacts if policy allows.

## Analyzer usage

- To inspect bundle composition:

  ```bash
  cd clients/starter-template
  ANALYZE=true next build
  ```

- Opens static reports at `.next/analyze/*.html` to pinpoint heavy chunks.

## Metrics table (to be filled after first run)

| Profile | LCP | INP | CLS | TTFB | FCP | Notes                                     |
| ------- | --- | --- | --- | ---- | --- | ----------------------------------------- |
| Desktop | TBD | TBD | TBD | TBD  | TBD | Run on baseline hardware (document specs) |
| Mobile  | TBD | TBD | TBD | TBD  | TBD | Throttling: 4G/High-Latency as above      |

## Follow-ups

- Automate Lighthouse via CI (e.g., `pnpm perf:ci` + headless Chrome) and store artifacts under `docs/` or build artifacts.
- Consider integrating `@next/bundle-analyzer` output into CI warnings.
- Revisit budgets after first measurement; tighten if comfortably passing.

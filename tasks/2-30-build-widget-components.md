# 2.30 Build Widget Components

**Status:** [ ] TODO | **Batch:** B | **Effort:** 12h | **Deps:** 1.7

**Related Research:** §2.1, §4.2, §2.2

**Objective:** 8+ Widget variants including weather, clock, and countdown. L2.

**Requirements:**

- **Variants:** Weather, Clock, Countdown, Stock Ticker, News Feed, Social Feed, Calendar Widget, Minimal (8+ total)
- **Real-Time Updates:** Live data, auto-refresh, API integration

**Files:** `packages/marketing-components/src/widget/types.ts`, `WeatherWidget.tsx`, `ClockWidget.tsx`, `CountdownWidget.tsx`, `widget/updates.tsx`, `index.ts`

**API:** `WidgetDisplay`. Props: `variant`, `config`, `autoRefresh`, `updateInterval`.

**Checklist:** Types; variants; real-time updates; export.
**Done:** All 8+ variants render; updates work; API integration functional.
**Anti:** No custom APIs; standard providers only.

---

### Feature Breadth (2.16–2.19)

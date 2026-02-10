/**
 * @file apps/web/features/search/index.ts
 * @role runtime
 * @summary Search feature public exports.
 *
 * @entrypoints
 * - Module barrel
 *
 * @exports
 * - search helpers
 * - SearchDialog
 * - SearchPage
 *
 * @depends_on
 * - Internal: ./lib/search
 * - Internal: ./components/SearchDialog
 * - Internal: ./components/SearchPage
 *
 * @used_by
 * - apps/web/app/search/page.tsx
 * - apps/web/components/Navigation.tsx
 *
 * @runtime
 * - environment: shared
 * - side_effects: none
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-09
 */

export { default as SearchDialog } from './components/SearchDialog';
export { default as SearchPage } from './components/SearchPage';

# Site Search Workflow

> **Last Updated:** 2026-01-05

## Overview

The site search experience is implemented as a lightweight, client-side search that indexes blog posts and key marketing pages at build time. It uses in-memory filtering with no third-party service dependencies.

## Search Solution

- **Approach:** Custom client-side filtering
- **Entry Points:**
  - Global search modal (Navigation)
  - Dedicated `/search` page for deep linking
- **Keyboard Shortcut:** Cmd/Ctrl + K

## Source of Truth

Search content is defined in `lib/search.ts`:

- **Static pages** are listed in `staticPages` (title, description, href, tags).
- **Blog posts** are pulled from `lib/blog.ts` and added dynamically.

## Updating Search Content

1. **Add or update static pages** in `lib/search.ts` → `staticPages`.
2. **Blog posts** update automatically when new MDX files are added to `content/blog/`.
3. **Search metadata** is displayed in:
   - `components/SearchDialog.tsx` (modal)
   - `components/SearchPage.tsx` (search page)

## UX Notes

- The modal is available on all pages via the top navigation.
- `/search?q=your+query` supports deep linking.
- Results are capped for empty queries to keep the UI quick.

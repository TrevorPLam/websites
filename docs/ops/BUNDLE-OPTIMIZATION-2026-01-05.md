# Bundle Optimization - 2026-01-05

## Summary

Performed a bundle optimization pass focused on reducing initial client-side JavaScript. The work centered on lazy-loading non-critical UI and isolating MDX rendering.

## Actions

- **Lazy-loaded non-critical UI:** `components/InstallPrompt` is now dynamically imported so it does not ship in the initial bundle.
- **Isolated MDX rendering:** moved MDX rendering into `components/BlogPostContent` to enable code-splitting of heavy MDX processing logic.
- **Dependency scan:** attempted `npm ls --depth=1` to review duplicates; output shows unmet dependencies in the local node_modules tree, so a clean install is required before deeper dedupe analysis.

## Bundle Analysis Attempt

Command executed:

```bash
ANALYZE=true npm run build
```

Result:
- Build failed due to blocked Google Fonts fetches (`Inter` and `IBM Plex Sans`).
- The analyzer output could not be generated in the current environment.

## Follow-Up

- Re-run `ANALYZE=true npm run build` in an environment with access to Google Fonts.
- Review analyzer output for duplicate dependencies and large chunks.
- Validate Sentry bundle impact after analyzer data is available.

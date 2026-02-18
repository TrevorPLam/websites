<!--
/**
 * @file docs/getting-started/troubleshooting.md
 * @role docs
 * @summary Comprehensive troubleshooting guide for common issues and solutions.
 *
 * @entrypoints
 * - Referenced from documentation hub
 * - Linked from FAQ and error messages
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/getting-started/onboarding.md (setup context)
 * - docs/resources/faq.md (related questions)
 *
 * @used_by
 * - Developers encountering issues
 * - Users setting up the platform
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: common errors and issues
 * - outputs: solutions and diagnostic steps
 *
 * @invariants
 * - Solutions must be tested and verified
 * - Steps must be clear and actionable
 *
 * @gotchas
 * - Some issues may have multiple causes
 * - Environment-specific differences may apply
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add automated diagnostic scripts
 * - Link to related documentation
 *
 * @verification
 * - ✅ Solutions verified against common issues
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Troubleshooting Guide

**Last Updated:** 2026-02-18  
**Status:** Active Guide  
**Related:** [FAQ](../resources/faq.md), [Onboarding](onboarding.md)

---

This guide helps you diagnose and resolve common issues when working with the marketing-websites platform. If you don't find your issue here, check the [FAQ](../resources/faq.md) or [open an issue](https://github.com/your-org/marketing-websites/issues).

## Quick Diagnostic Commands

Before diving into specific issues, run these diagnostic commands:

```bash
# Check Node.js version
node --version  # Should be >=24.0.0

# Check pnpm version
pnpm --version  # Should be 10.29.2

# Verify installation
pnpm install

# Check for type errors
pnpm type-check

# Check for lint errors
pnpm lint

# Verify build
pnpm build
```

## Installation Issues

### Issue: pnpm version mismatch

**Symptoms:**
- Error: "This project requires pnpm 10.29.2"
- Installation fails

**Solutions:**
```bash
# Install correct pnpm version
npm install -g pnpm@10.29.2

# Verify version
pnpm --version
```

**Prevention:** Use `corepack` to manage pnpm version:
```bash
corepack enable
corepack prepare pnpm@10.29.2 --activate
```

### Issue: Node.js version too old

**Symptoms:**
- Error: "Engine 'node' is incompatible"
- Build fails with syntax errors

**Solutions:**
1. Upgrade Node.js to >=24.0.0
2. Use `nvm` (Node Version Manager) if available:
   ```bash
   nvm install 24
   nvm use 24
   ```

### Issue: Dependency installation fails

**Symptoms:**
- `pnpm install` fails
- Missing dependencies errors

**Solutions:**
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# On Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
pnpm install
```

## Build Issues

### Issue: Build fails with TypeScript errors

**Symptoms:**
- Type errors during build
- "Cannot find module" errors

**Solutions:**
1. Run type check to see all errors:
   ```bash
   pnpm type-check
   ```

2. Ensure types package is installed:
   ```bash
   pnpm --filter @repo/types build
   ```

3. Check import paths:
   - Use `@repo/` prefix for internal packages
   - Verify package exports in `package.json`

4. Clear TypeScript cache:
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   pnpm build
   ```

### Issue: Build succeeds locally but fails in CI

**Symptoms:**
- Local build works
- CI/CD pipeline fails

**Common Causes & Solutions:**

1. **Node.js version mismatch:**
   - Ensure CI uses Node.js >=24.0.0
   - Check `.github/workflows/*.yml` for version

2. **Missing environment variables:**
   - Add required env vars to CI secrets
   - Check `.env.example` for required variables

3. **Cache issues:**
   - Clear CI cache
   - Rebuild without cache

4. **Platform differences:**
   - Check for Windows/Unix path differences
   - Verify file permissions

### Issue: Module not found errors

**Symptoms:**
- "Cannot find module '@repo/...'"
- Import errors

**Solutions:**
1. Verify package exists in workspace:
   ```bash
   pnpm -r list --depth -1
   ```

2. Check `pnpm-workspace.yaml` includes the package

3. Rebuild the package:
   ```bash
   pnpm --filter @repo/[package-name] build
   ```

4. Verify package exports in `package.json`:
   ```json
   {
     "exports": {
       ".": "./dist/index.js"
     }
   }
   ```

## Development Server Issues

### Issue: Port already in use

**Symptoms:**
- Error: "Port 3000 is already in use"
- Server won't start

**Solutions:**
```bash
# Use a different port
pnpm dev --port 3001

# Or kill the process using the port
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue: Hot reload not working

**Symptoms:**
- Changes don't reflect in browser
- Manual refresh required

**Solutions:**
1. Check file watcher limits (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   pnpm dev
   ```

3. Restart dev server

4. Check for syntax errors preventing compilation

### Issue: "Cannot find module" in development

**Symptoms:**
- Module resolves in build but not in dev
- Import errors

**Solutions:**
1. Check TypeScript path mappings in `tsconfig.json`
2. Verify package exports include development entry points
3. Restart TypeScript server in your IDE
4. Clear `.next` cache

## Runtime Issues

### Issue: Environment variables not loading

**Symptoms:**
- `process.env.VARIABLE` is undefined
- Configuration not working

**Solutions:**
1. Check file naming:
   - Development: `.env.local`
   - Production: Set in deployment platform

2. Verify variable names:
   - Must start with `NEXT_PUBLIC_` for client-side access
   - Server-side variables don't need prefix

3. Restart dev server after adding variables

4. Check for typos in variable names

### Issue: API routes returning 404

**Symptoms:**
- API endpoints not found
- 404 errors

**Solutions:**
1. Verify route file location:
   - Should be in `app/api/[route]/route.ts` (App Router)

2. Check HTTP method:
   - Export `GET`, `POST`, etc. functions

3. Verify route is not blocked by middleware

4. Check Next.js version compatibility

### Issue: Styling not applying

**Symptoms:**
- Tailwind classes not working
- Styles missing

**Solutions:**
1. Verify Tailwind config includes correct paths:
   ```js
   content: [
     './app/**/*.{js,ts,jsx,tsx}',
     './components/**/*.{js,ts,jsx,tsx}',
   ]
   ```

2. Check for CSS import in root layout:
   ```tsx
   import './globals.css'
   ```

3. Restart dev server after config changes

4. Verify Tailwind is installed:
   ```bash
   pnpm list tailwindcss
   ```

## Package-Specific Issues

### Issue: @repo/ui components not rendering

**Symptoms:**
- Components import but don't render
- Type errors

**Solutions:**
1. Verify React version compatibility:
   ```bash
   pnpm list react
   # Should match across all packages
   ```

2. Check peer dependencies:
   - `@repo/ui` uses `peerDependencies` for React
   - App must provide React

3. Rebuild UI package:
   ```bash
   pnpm --filter @repo/ui build
   ```

### Issue: Feature components not working

**Symptoms:**
- Features don't load
- Integration errors

**Solutions:**
1. Check feature configuration in `site.config.ts`
2. Verify feature package is built:
   ```bash
   pnpm --filter @repo/features build
   ```
3. Check feature dependencies are installed
4. Review feature-specific documentation

## Performance Issues

### Issue: Slow build times

**Symptoms:**
- Builds take too long
- Development is slow

**Solutions:**
1. Enable Turbo caching:
   ```bash
   # Verify Turbo is configured
   cat turbo.json
   ```

2. Use remote cache if available:
   ```bash
   pnpm build --force
   ```

3. Check for unnecessary dependencies
4. Optimize imports (avoid barrel exports in some cases)

### Issue: Large bundle size

**Symptoms:**
- Slow page loads
- Large JavaScript bundles

**Solutions:**
1. Analyze bundle:
   ```bash
   ANALYZE=true pnpm build
   ```

2. Use dynamic imports for large components:
   ```tsx
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

3. Enable tree shaking (verify proper ES module imports)
4. Remove unused dependencies

## Integration Issues

### Issue: Third-party API not working

**Symptoms:**
- Integration fails
- API errors

**Solutions:**
1. Check API keys in environment variables
2. Verify API endpoint URLs
3. Check network requests in browser DevTools
4. Review integration-specific documentation
5. Test API directly (curl/Postman)

### Issue: Database connection errors

**Symptoms:**
- Supabase connection fails
- Database queries error

**Solutions:**
1. Verify Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Check Supabase project status
3. Verify Row-Level Security (RLS) policies
4. Review connection string format

## Deployment Issues

### Issue: Build fails on Vercel/Netlify

**Symptoms:**
- Deployment fails
- Build errors in logs

**Solutions:**
1. Check build command:
   - Should be: `pnpm build`
   - Verify in deployment settings

2. Set Node.js version:
   - Vercel: `engines.node` in `package.json`
   - Netlify: `.nvmrc` file

3. Verify environment variables are set
4. Check build logs for specific errors
5. Test build locally: `pnpm build`

### Issue: Environment variables not available

**Symptoms:**
- Variables work locally but not in production
- Configuration errors

**Solutions:**
1. Add variables in deployment platform settings
2. Verify variable names match exactly
3. Check for `NEXT_PUBLIC_` prefix for client-side
4. Redeploy after adding variables

## TypeScript Issues

### Issue: Type errors that shouldn't exist

**Symptoms:**
- False positive type errors
- Types not resolving

**Solutions:**
1. Restart TypeScript server:
   - VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

2. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.cache
   ```

3. Verify `tsconfig.json` extends base config
4. Check for conflicting type definitions

### Issue: Module resolution errors

**Symptoms:**
- "Cannot find module" in TypeScript
- Import paths not resolving

**Solutions:**
1. Check `tsconfig.json` paths:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@repo/*": ["./packages/*/src"]
       }
     }
   }
   ```

2. Verify package has proper exports
3. Restart TypeScript server
4. Check for circular dependencies

## Git Issues

### Issue: Merge conflicts in pnpm-lock.yaml

**Symptoms:**
- Merge conflicts
- Lock file issues

**Solutions:**
1. Resolve conflicts by regenerating lock file:
   ```bash
   git checkout --theirs pnpm-lock.yaml
   pnpm install
   ```

2. Or regenerate completely:
   ```bash
   rm pnpm-lock.yaml
   pnpm install
   ```

### Issue: Large file commits

**Symptoms:**
- Git operations slow
- Repository size issues

**Solutions:**
1. Use `.gitignore` properly
2. Don't commit:
   - `node_modules/`
   - `.next/`
   - `dist/`
   - `.env.local`

3. Use Git LFS for large assets if needed

## Getting More Help

If you've tried the solutions above and still have issues:

1. **Check the FAQ:** [docs/resources/faq.md](../resources/faq.md)
2. **Search existing issues:** [GitHub Issues](https://github.com/your-org/marketing-websites/issues)
3. **Review documentation:** [Documentation Hub](../README.md)
4. **Open a new issue:** Include:
   - Error messages (full text)
   - Steps to reproduce
   - Environment details (OS, Node.js version, pnpm version)
   - What you've already tried

## Diagnostic Scripts

For automated diagnostics, run:

```bash
# Health check (if available)
pnpm health

# Validate exports
pnpm validate-exports

# Check dependencies
pnpm syncpack:check
```

---

**Contributing:** Found a solution not listed here? [Submit a PR](https://github.com/your-org/marketing-websites/pulls) to add it!

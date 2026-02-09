# Immediate Actions Required

## ⚠️ CRITICAL: Do These Steps IN ORDER

### Step 1: Review Changes
```bash
# See what was changed
git status
git diff package.json
git diff apps/web/package.json
git diff turbo.json
```

### Step 2: Commit Current State (BEFORE installing)
```bash
git add .
git commit -m "chore: upgrade all dependencies to latest stable versions

- Turborepo 1.10 → 2.2.3
- Next.js 14.0 → 15.1.6
- React 18.0 → 19.0.0
- ESLint 8.0 → 9.18.0 (migrated to flat config)
- TypeScript 5.0 → 5.9.3
- All dependencies pinned (removed ^ prefixes)

BREAKING CHANGES:
- React 19 requires code updates (async APIs, ref as prop)
- Next.js 15 requires async headers/cookies/params
- ESLint now uses flat config (eslint.config.mjs)
- Turborepo uses new tasks schema"
```

### Step 3: Install Dependencies
```bash
pnpm install
```

**Expected Output:**
- Should download ~500-1000 packages
- May show peer dependency warnings (normal)
- Should complete in 1-3 minutes

**If it fails:**
- Check error message carefully
- May need to delete node_modules: `rm -rf node_modules apps/*/node_modules packages/*/node_modules`
- Try again: `pnpm install`

### Step 4: Check for Type Errors
```bash
pnpm type-check
```

**Expected Errors:**
You WILL see errors related to:
1. **Async Next.js APIs** - headers(), cookies(), params are now async
2. **React 19 types** - ref handling changed
3. **Component props** - some type definitions updated

**Don't panic!** These are expected. See MIGRATION_COMPLETE.md for fixes.

### Step 5: Try Building
```bash
pnpm build
```

**This will likely fail** on first try due to:
- Async API usage in server components
- Type errors from React 19
- Next.js 15 breaking changes

### Step 6: Fix Code Issues

#### Common Fix #1: Async headers/cookies
Find all files using `headers()` or `cookies()`:
```bash
# Search for usage
grep -r "headers()" apps/web/
grep -r "cookies()" apps/web/
```

Update each file to use `await`:
```typescript
// Before
const headersList = headers();

// After
const headersList = await headers();
```

And make the function async:
```typescript
// Before
export default function Page() {

// After
export default async function Page() {
```

#### Common Fix #2: Dynamic params
```typescript
// Before
export default function Page({ params }: { params: { slug: string } }) {

// After
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
```

#### Common Fix #3: fetch caching
```typescript
// Before (was cached by default)
const data = await fetch(url);

// After (must be explicit)
const data = await fetch(url, { cache: 'force-cache' });
// or
const data = await fetch(url, { cache: 'no-store' });
```

### Step 7: Run Dev Server
```bash
pnpm dev
```

**Check:**
- Server starts on port 3000
- No immediate crashes
- Can access http://localhost:3000
- Hot reload works when you edit a file

### Step 8: Test Linting
```bash
pnpm lint
```

**Expected:**
- May show some new warnings
- Should not crash
- Flat config should work

---

## Quick Reference: Files That Need Updates

### High Priority (Will Break Build):
1. **Any file using `headers()`** - Make async
2. **Any file using `cookies()`** - Make async  
3. **Any file using `params` prop** - Make async
4. **Any file using `searchParams` prop** - Make async
5. **Route handlers** - Check caching behavior

### Medium Priority (May Have Type Errors):
1. **Components using `forwardRef`** - Can simplify with React 19
2. **Components with ref props** - Type definitions changed
3. **Context providers** - May need updates

### Low Priority (Nice to Have):
1. **Remove unused React imports** - JSX transform is automatic
2. **Update to new React 19 hooks** - `use()`, `useOptimistic()`, etc.
3. **Optimize with new features** - Actions, transitions, etc.

---

## Troubleshooting

### "Cannot find module 'eslint-config-next'"
```bash
cd apps/web
pnpm install
```

### "Module not found: Can't resolve '@repo/ui'"
```bash
# Rebuild workspace
pnpm install
pnpm build
```

### "Type error: Property 'ref' does not exist"
Update component to accept ref as regular prop:
```typescript
type Props = {
  ref?: React.Ref<HTMLElement>;
  // ... other props
}
```

### "Error: headers() expects the second argument"
You're using the old API. Update to:
```typescript
const headersList = await headers();
```

### ESLint errors about config format
Make sure you deleted all .eslintrc.json files and created eslint.config.mjs files.

### Turbo errors about "pipeline"
Check turbo.json - should use "tasks" not "pipeline".

---

## Success Criteria

✅ `pnpm install` completes  
✅ `pnpm type-check` passes (after fixes)  
✅ `pnpm build` succeeds  
✅ `pnpm dev` starts  
✅ Can load pages in browser  
✅ No console errors  
✅ Hot reload works  

---

## If Everything Breaks

### Nuclear Option - Rollback:
```bash
# Undo all changes
git reset --hard HEAD~1

# Reinstall old versions
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# Back to working state
pnpm dev
```

### Partial Rollback - Just Dependencies:
```bash
# Keep config changes, rollback versions
git checkout HEAD~1 -- package.json apps/web/package.json packages/*/package.json
pnpm install
```

---

## Getting Help

1. **Check MIGRATION_COMPLETE.md** - Detailed migration guide
2. **Check DEPENDENCY_AUDIT.md** - Full analysis of changes
3. **Search error messages** - Most issues are documented
4. **Next.js docs** - https://nextjs.org/docs/app/guides/upgrading/version-15
5. **React docs** - https://react.dev/blog/2024/12/05/react-19

---

## Timeline Estimate

- **Step 1-3:** 5 minutes (review, commit, install)
- **Step 4-5:** 10 minutes (check errors, try build)
- **Step 6:** 1-4 hours (fix code issues - depends on codebase size)
- **Step 7-8:** 15 minutes (test dev server, linting)

**Total: 1.5 - 4.5 hours** depending on how many async API calls you have.

---

## Current Status

✅ All configuration files updated  
✅ All package.json files updated  
✅ ESLint migrated to flat config  
✅ Turborepo config updated  
✅ TypeScript configs updated  
⏳ **NEXT: Run `pnpm install`**

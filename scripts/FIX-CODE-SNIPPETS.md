# Fix: Code Snippets Preservation

**Date:** 2026-02-18  
**Issue:** Automation script was deleting existing code snippets from task files  
**Status:** ✅ Fixed

---

## Problem

The `update-tasks-with-research.js` script was replacing the entire "Code Snippets / Examples" section, deleting existing code snippets that were manually added to task files.

### Example

**Before (original file):**

````typescript
## Code Snippets / Examples

```typescript
// Expected API (based on Radix UI Slider v1.3.6)
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  min?: number;
  max?: number;
  // ... more code
}
````

**After (script ran):**

```markdown
## Code Snippets / Examples

### Related Patterns

- See [R-UI - Repo-Specific Context](RESEARCH-INVENTORY.md#r-ui) for additional examples
```

**Result:** All existing code snippets were deleted! ❌

---

## Solution

Updated the script to:

1. **Detect existing code snippets** by checking for code blocks (```)
2. **Preserve existing code** if present
3. **Add Related Patterns section** only if missing
4. **Generate full section** only if no existing code exists

### Updated Logic

````javascript
// Extract existing code snippets before replacing
const codeSnippetsMatch = content.match(/## Code Snippets \/ Examples([\s\S]*?)(?=\n## |$)/);
const existingCodeSnippets = codeSnippetsMatch ? codeSnippetsMatch[1].trim() : '';

// Check if existing section has actual code blocks (not just links)
const hasExistingCode = existingCodeSnippets && existingCodeSnippets.match(/```[\s\S]*?```/);

if (hasExistingCode) {
  // Preserve existing code snippets - only add Related Patterns if missing
  const newPatternsSection = codeSnippetsSection.match(/### Related Patterns[\s\S]*/);
  if (newPatternsSection && !existingCodeSnippets.includes('### Related Patterns')) {
    // Add new patterns section at the end
    updatedContent = updatedContent.replace(
      codeSnippetsRegex,
      `## Code Snippets / Examples\n\n${existingCodeSnippets}\n\n${newPatternsSection[0]}`
    );
  } else {
    // Keep existing content as-is - don't replace
  }
} else {
  // No existing code, use generated section
  updatedContent = updatedContent.replace(codeSnippetsRegex, codeSnippetsSection);
}
````

---

## Verification

### Test Case: `1-12-create-slider-component.md`

**Before fix:**

- ❌ Code snippets deleted
- ❌ Only Related Patterns remained

**After fix:**

- ✅ Code snippets preserved
- ✅ Related Patterns added
- ✅ Both sections present

**Result:**

````markdown
## Code Snippets / Examples

```typescript
// Expected API (based on Radix UI Slider v1.3.6)
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  // ... preserved code ...
}
```
````

### Related Patterns

- See [R-UI - Repo-Specific Context](RESEARCH-INVENTORY.md#r-ui) for additional examples
- See [R-A11Y - Repo-Specific Context](RESEARCH-INVENTORY.md#r-a11y) for additional examples
- See [R-RADIX - Repo-Specific Context](RESEARCH-INVENTORY.md#r-radix) for additional examples

```

---

## Impact

### Files Affected
- All task files that had existing code snippets were affected
- Script was run on multiple categories (1-xx, 2-xx, etc.)

### Recovery
- Files can be restored from git history: `git checkout HEAD -- tasks/<filename>.md`
- Script now preserves existing code snippets going forward

---

## Prevention

### Best Practices
1. **Always review changes** before committing: `git diff tasks/<filename>.md`
2. **Test on single file** before running on all files
3. **Backup important content** before running automation scripts
4. **Check git history** if content is missing

### Script Improvements
- ✅ Added detection for existing code snippets
- ✅ Added warning messages when preserving code
- ✅ Only adds Related Patterns if missing
- ✅ Never deletes existing code blocks

---

## Status

✅ **Fixed** - Script now preserves existing code snippets
✅ **Tested** - Verified on `1-12-create-slider-component.md`
✅ **Documented** - Updated AUTOMATION-GUIDE.md with preservation behavior

---

**Last Updated:** 2026-02-18
```

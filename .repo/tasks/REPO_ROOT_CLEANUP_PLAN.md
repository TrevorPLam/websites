# Repository Root Cleanup Plan

**Date:** 2026-01-23  
**Purpose:** Organize repository root by moving documentation and historical files to appropriate locations  
**Status:** Planning

---

## Overview

The repository root contains several documentation files, historical summaries, and analysis documents that should be organized into appropriate directories for better maintainability and clarity.

---

## Current Root Directory Files Analysis

### ✅ Files That Should Stay in Root

**Configuration Files (Required in root):**
- `package.json` - Node.js package configuration
- `package-lock.json` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E test configuration
- `sentry.*.config.ts` - Sentry configuration files (3 files)
- `wrangler.toml` - Cloudflare Pages configuration
- `mise.toml` - Mise tool configuration
- `Makefile` - Build automation
- `env.example` - Environment variable template
- `VERSION` - Version file

**Agent Framework Entry Points (Required in root per framework):**
- `AGENTS.json` - Primary agent entry point (structured JSON)
- `AGENTS.md` - Agent entry point (human-readable)
- `repo.manifest.yaml` - Repository manifest (command definitions)

**Essential Documentation:**
- `README.md` - Main repository documentation

---

## Files to Move/Archive

### Category 1: Historical Analysis & Summary Documents

**Destination:** `.repo/archive/assessments/`

These are historical documents from the agentic system injection and analysis process:

1. **CODEBASE_ANALYSIS.md** (2725 lines)
   - Comprehensive codebase analysis
   - **Action:** Move to `.repo/archive/assessments/CODEBASE_ANALYSIS.md`
   - **Reason:** Historical analysis document, useful for reference but not operational

2. **ORIENTATION_SUMMARY.md** (95 lines)
   - Agentic system orientation summary
   - **Action:** Move to `.repo/archive/assessments/ORIENTATION_SUMMARY.md`
   - **Reason:** Historical orientation document

3. **CLEANUP_COMPLETE.md** (69 lines)
   - Cleanup completion summary
   - **Action:** Move to `.repo/archive/assessments/CLEANUP_COMPLETE.md`
   - **Reason:** Historical cleanup documentation

4. **INJECTION_COMPLETE.md** (86 lines)
   - Injection completion summary
   - **Action:** Move to `.repo/archive/assessments/INJECTION_COMPLETE.md`
   - **Reason:** Historical injection documentation

5. **INJECTION_SUMMARY.md** (106 lines)
   - Injection system summary
   - **Action:** Move to `.repo/archive/assessments/INJECTION_SUMMARY.md`
   - **Reason:** Historical injection documentation

6. **AGENTIC_ANALYSIS.md** (116 lines)
   - Agentic system analysis
   - **Action:** Move to `.repo/archive/assessments/AGENTIC_ANALYSIS.md`
   - **Reason:** Historical analysis document

### Category 2: Security Checklist

**Destination:** `docs/security/` (if docs/ exists) or `.repo/archive/assessments/`

7. **DIAMOND.md** (965 lines)
   - DIAMOND standard security checklist
   - **Action:** Move to `docs/security/DIAMOND.md` (if docs/security/ exists) OR `.repo/archive/assessments/DIAMOND.md`
   - **Reason:** Security checklist, could be useful reference but is assessment/documentation

### Category 3: Injection System Files

**Destination:** `.repo/archive/injection/` or `scripts/archive/`

8. **injection.py** (496 lines)
   - Python script for agentic system injection
   - **Action:** Move to `.repo/archive/injection/injection.py` OR `scripts/archive/injection.py`
   - **Reason:** One-time use script for system injection, no longer needed

9. **agentic.json** (2122 lines)
   - Agentic system mapping/configuration
   - **Action:** Move to `.repo/archive/injection/agentic.json` OR `scripts/archive/agentic.json`
   - **Reason:** Configuration for injection system, historical reference

---

## Directory Structure to Create

### If `docs/` directory exists:
```
docs/
└── security/
    └── DIAMOND.md (if moving there)
```

### If `docs/` doesn't exist:
Create `.repo/archive/` subdirectories:
```
.repo/archive/
├── assessments/
│   ├── CODEBASE_ANALYSIS.md
│   ├── ORIENTATION_SUMMARY.md
│   ├── CLEANUP_COMPLETE.md
│   ├── INJECTION_COMPLETE.md
│   ├── INJECTION_SUMMARY.md
│   ├── AGENTIC_ANALYSIS.md
│   └── DIAMOND.md (if not moving to docs/)
└── injection/
    ├── injection.py
    └── agentic.json
```

---

## Implementation Steps

### Phase 1: Create Archive Directories
1. Create `.repo/archive/assessments/` if it doesn't exist
2. Create `.repo/archive/injection/` if it doesn't exist
3. Check if `docs/security/` exists, create if needed for DIAMOND.md

### Phase 2: Move Historical Documents
1. Move CODEBASE_ANALYSIS.md → `.repo/archive/assessments/`
2. Move ORIENTATION_SUMMARY.md → `.repo/archive/assessments/`
3. Move CLEANUP_COMPLETE.md → `.repo/archive/assessments/`
4. Move INJECTION_COMPLETE.md → `.repo/archive/assessments/`
5. Move INJECTION_SUMMARY.md → `.repo/archive/assessments/`
6. Move AGENTIC_ANALYSIS.md → `.repo/archive/assessments/`

### Phase 3: Move Security Checklist
1. Check if `docs/security/` exists
2. If yes: Move DIAMOND.md → `docs/security/DIAMOND.md`
3. If no: Move DIAMOND.md → `.repo/archive/assessments/DIAMOND.md`

### Phase 4: Move Injection System Files
1. Move injection.py → `.repo/archive/injection/injection.py`
2. Move agentic.json → `.repo/archive/injection/agentic.json`

### Phase 5: Update References
1. Search codebase for references to moved files
2. Update any documentation that references these files
3. Update README.md if it references any moved files
4. Update .repo/INDEX.md if needed

### Phase 6: Create Archive README
1. Create `.repo/archive/assessments/README.md` explaining the archive
2. Create `.repo/archive/injection/README.md` explaining the injection system archive

---

## Files Summary

### Total Files to Move: 9

**Historical Analysis (6 files):**
- CODEBASE_ANALYSIS.md
- ORIENTATION_SUMMARY.md
- CLEANUP_COMPLETE.md
- INJECTION_COMPLETE.md
- INJECTION_SUMMARY.md
- AGENTIC_ANALYSIS.md

**Security Checklist (1 file):**
- DIAMOND.md

**Injection System (2 files):**
- injection.py
- agentic.json

---

## Verification Checklist

After cleanup:
- [ ] All historical documents moved to `.repo/archive/assessments/`
- [ ] Injection system files moved to `.repo/archive/injection/`
- [ ] DIAMOND.md moved to appropriate location
- [ ] All references updated
- [ ] Archive README files created
- [ ] Root directory contains only essential files
- [ ] No broken links or references

---

## Expected Root Directory After Cleanup

```
Root Directory (Essential Files Only):
├── Configuration Files (package.json, tsconfig.json, etc.)
├── Agent Entry Points (AGENTS.json, AGENTS.md, repo.manifest.yaml)
├── README.md
└── Source Code Directories (app/, components/, lib/, etc.)
```

**Total root files:** ~20-25 essential files (down from ~30+)

---

## Notes

- **CODEBASE_ANALYSIS.md** is comprehensive and valuable - consider keeping a reference in README.md or creating a summary
- **DIAMOND.md** might be useful for ongoing security checks - consider if it should be in `docs/security/` instead of archive
- **injection.py** and **agentic.json** are one-time use files but may be useful for reference if the system needs to be re-injected

---

## Risk Assessment

**Low Risk:**
- Moving historical documents (no code dependencies)
- Moving injection system files (one-time use)

**Medium Risk:**
- Need to verify no code references these files
- Need to update documentation references

**Mitigation:**
- Search codebase for references before moving
- Update all references after moving
- Test that nothing breaks

---

**Plan Created:** 2026-01-23  
**Status:** ✅ **COMPLETED** - 2026-01-23

---

## Execution Summary

**Completed:** 2026-01-23

### Files Moved Successfully:
- ✅ CODEBASE_ANALYSIS.md → `.repo/archive/assessments/`
- ✅ ORIENTATION_SUMMARY.md → `.repo/archive/assessments/`
- ✅ CLEANUP_COMPLETE.md → `.repo/archive/assessments/`
- ✅ INJECTION_COMPLETE.md → `.repo/archive/assessments/`
- ✅ INJECTION_SUMMARY.md → `.repo/archive/assessments/`
- ✅ AGENTIC_ANALYSIS.md → `.repo/archive/assessments/`
- ✅ DIAMOND.md → `.repo/archive/assessments/`
- ✅ injection.py → `.repo/archive/injection/`
- ✅ agentic.json → `.repo/archive/injection/`

### Directories Created:
- ✅ `.repo/archive/assessments/` (with README.md)
- ✅ `.repo/archive/injection/` (with README.md)

### References Updated:
- ✅ Updated `.repo/policy/BESTPR.md` to reference archived DIAMOND.md location

### Root Directory Status:
- ✅ Cleaned up - only essential files remain in root
- ✅ No broken references found
- ✅ Archive README files created

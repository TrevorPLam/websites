# iteration/AGENTS.md — Working Drafts

Last Updated: 2026-01-21
Applies To: Any agent working in iteration/

**Quick Reference:** See `/BESTPR.md` for comprehensive repo standards.

## Purpose
This folder contains temporary working drafts, iterations, and exploratory documents during development. **Files here are non-authoritative** and should not be used as reference for implementation.

---

## Important: Temporary Status

**This folder is for work-in-progress only.**

- Files here are drafts, not final documents
- Do not reference these files as source of truth
- Move finalized content to appropriate locations:
  - Features → `/specs/features/`
  - Documentation → `/docs/`
  - Tasks → `/TODO.md`
- Clean up when iteration is complete

---

## Structure

```
iteration/
├── AGENTS.md           # This file
└── [working-files]     # Temporary drafts
```

---

## File Lifecycle

### 1. Draft Phase
Create files here during brainstorming, exploration, or initial drafting.

### 2. Review Phase
Share with team/owner for feedback.

### 3. Finalize Phase
Move to permanent location:
- Specs → `/specs/`
- Docs → `/docs/`
- Tasks → `/TODO.md`
- Content → `/content/`

### 4. Cleanup Phase
Delete or archive completed iterations.

---

## Adding a Working File

1. **Create:** `iteration/descriptive-name.md`
2. **Add header:** Include "DRAFT" status clearly
3. **Work:** Iterate on content
4. **Move:** When finalized, move to permanent location
5. **Clean up:** Delete draft from iteration/

---

## Draft Template

```markdown
# [DRAFT] Document Title

**Status:** Work in Progress
**Author:** [Name]
**Created:** YYYY-MM-DD
**Purpose:** Brief description

---

[Your working content here]

---

## Next Steps
- [ ] Review with team
- [ ] Finalize content
- [ ] Move to `/destination/`
- [ ] Delete from iteration/
```

---

## Don't

- ❌ Reference files here as authoritative
- ❌ Leave completed work here (move to permanent location)
- ❌ Store production code here
- ❌ Commit sensitive information (even in drafts)

---

**See also:** 
- `/BESTPR.md` for complete best practices guide
- `/specs/AGENTS.md` for non-binding specifications
- `/docs/AGENTS.md` for documentation guidelines

# Marketing Websites Monorepo - Research Update Tasks

_Generated: February 18, 2026_  
_Total Tasks: 7_

---

## Critical Research Update Tasks

### High Priority

- [ ] Fix integration tasks (4-2 to 4-6) duplicate content
- [ ] Update UI component tasks (1-12 to 1-50) with 2026 research

### Medium Priority

- [ ] Update performance metrics (FID → INP) across all tasks
- [ ] Update Radix UI references to unified package
- [ ] Standardize accessibility sections with WCAG 2.2 details

### Low Priority

- [ ] Update testing frameworks (Jest → Vitest) across tasks

---

## Task Details

### 1. Fix Integration Tasks (4-2 to 4-6) - High Priority

**Issue**: All five integration tasks contain identical content  
**Files**:

- 4-2-scheduling.md (Calendly/Acuity/Cal.com adapters)
- 4-3-chat.md (Intercom/Crisp/Tidio adapters)
- 4-4-review-platform.md (Google/Yelp/Trustpilot adapters)
- 4-5-maps.md (Google Maps static + interactive)
- 4-6-industry-schemas.md (JSON-LD generators per industry)

**Action**: Create unique adapter contract content for each task

### 2. Update UI Component Tasks (1-12 to 1-50) - High Priority

**Issue**: Missing 2026 research citations and outdated references  
**Files**: 39 UI component tasks (8 completed, 31 active)

**Actions**:

- Add date-stamped research citations (2026-02-18)
- Update Radix UI to unified package
- Add React 19 compatibility details
- Include WCAG 2.2 AA specific requirements

### 3. Update Performance Metrics (FID → INP) - Medium Priority

**Issue**: Tasks reference deprecated FID metric  
**Target**: All tasks across all categories

**Actions**:

- Replace FID with INP references
- Add thresholds: ≤200ms good, 200-500ms needs improvement, >500ms poor
- Update Core Web Vitals language

### 4. Update Radix UI References - Medium Priority

**Issue**: Tasks reference individual @radix-ui/react-\* packages  
**Target**: UI component tasks (1-x series)

**Actions**:

- Update to unified `radix-ui` package
- Change import patterns: `import { Dialog } from 'radix-ui'`
- Note May 2025 unified package release

### 5. Standardize Accessibility Sections - Medium Priority

**Issue**: Generic WCAG references without specifics  
**Target**: All UI tasks

**Actions**:

- Add 24×24 CSS pixel minimum touch targets
- Include focus appearance requirements (2px thick, 3:1 contrast)
- Reference component-a11y-rubric.md consistently

### 6. Update Testing Frameworks - Low Priority

**Issue**: Jest references in testing requirements  
**Target**: All tasks with testing sections

**Actions**:

- Replace Jest with Vitest references
- Add MSW for network stubs where applicable
- Update testing strategy sections

---

## Implementation Order

1. **Week 1**: Fix integration tasks duplicate content (4-2 to 4-6)
2. **Week 1-2**: Update UI component tasks with 2026 research
3. **Week 2**: Update performance metrics and Radix UI references
4. **Week 2-3**: Standardize accessibility sections
5. **Week 3**: Update testing frameworks

---

## Success Criteria

- [ ] All integration tasks have unique, accurate content
- [ ] All UI component tasks have 2026 research citations
- [ ] No FID references remain (replaced with INP)
- [ ] All Radix UI references use unified package
- [ ] WCAG 2.2 details are consistent across tasks
- [ ] Testing framework references are updated to Vitest

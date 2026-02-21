---
diataxis: reference
audience: developer
last_reviewed: 2026-02-19
review_interval_days: 30
project: marketing-websites
description: Documentation review schedule and ownership
tags: [documentation, review, schedule, maintenance]
primary_language: typescript
---

# Documentation Review Schedule

This document defines the review cadence and ownership for all documentation in the marketing-websites repository, ensuring content freshness and accuracy.

## Review Cadence

### Standard Review Intervals

| Document Type          | Review Interval | Owner              | Priority |
| ---------------------- | --------------- | ------------------ | -------- |
| **Core Documentation** | 90 days         | Maintainer         | High     |
| **API Documentation**  | 60 days         | Package Maintainer | High     |
| **Architecture Docs**  | 180 days        | Architecture Team  | Medium   |
| **Tutorials**          | 120 days        | Documentation Team | Medium   |
| **Reference Docs**     | 180 days        | Domain Experts     | Low      |
| **CHANGELOG.md**       | 7 days          | Release Manager    | High     |

### Trigger-Based Reviews

Reviews are also triggered by:

- **Major Releases** - All affected documentation
- **Architecture Changes** - Architecture and design documents
- **API Changes** - API documentation and integration guides
- **Security Updates** - SECURITY.md and related documentation
- **Community Feedback** - Based on issues, PRs, and discussions

## Document Ownership

### Core Documentation

| Document            | Owner      | Review Interval | Last Reviewed | Next Review |
| ------------------- | ---------- | --------------- | ------------- | ----------- |
| **README.md**       | Trevor Lam | 90 days         | 2026-02-19    | 2026-05-19  |
| **ARCHITECTURE.md** | Trevor Lam | 180 days        | 2026-02-19    | 2026-08-19  |
| **DEVELOPMENT.md**  | Trevor Lam | 120 days        | 2026-02-19    | 2026-06-19  |
| **TESTING.md**      | Trevor Lam | 120 days        | 2026-02-19    | 2026-06-19  |
| **SUPPORT.md**      | Trevor Lam | 90 days         | 2026-02-19    | 2026-05-19  |
| **AUTHORS.md**      | Trevor Lam | 180 days        | 2026-02-19    | 2026-08-19  |
| **SECURITY.md**     | Trevor Lam | 30 days         | 2026-02-19    | 2026-03-19  |
| **CONTRIBUTING.md** | Trevor Lam | 90 days         | 2026-02-19    | 2026-05-19  |
| **CHANGELOG.md**    | Trevor Lam | 7 days          | 2026-02-19    | 2026-02-26  |
| **ROADMAP.md**      | Trevor Lam | 90 days         | 2026-02-19    | 2026-05-19  |

### Package Documentation

| Package            | Owner         | Review Interval | Status |
| ------------------ | ------------- | --------------- | ------ |
| **@repo/ui**       | UI Team       | 60 days         | Active |
| **@repo/features** | Features Team | 60 days         | Active |
| **@repo/types**    | Platform Team | 180 days        | Active |
| **@repo/infra**    | Platform Team | 90 days         | Active |
| **@repo/utils**    | Platform Team | 180 days        | Active |

### Client Documentation

| Client               | Owner              | Review Interval | Status |
| -------------------- | ------------------ | --------------- | ------ |
| **starter-template** | Documentation Team | 120 days        | Active |
| **luxe-salon**       | Client Success     | 180 days        | Active |
| **bistro-central**   | Client Success     | 180 days        | Active |
| **chen-law**         | Client Success     | 180 days        | Active |
| **sunrise-dental**   | Client Success     | 180 days        | Active |
| **urban-outfitters** | Client Success     | 180 days        | Active |

## Review Process

### Automated Checks

The CI pipeline automatically checks:

1. **Frontmatter Validation** - Ensures `last_reviewed` and `review_interval_days` are present
2. **Review Overdue Detection** - Flags documents past their review date
3. **Link Validation** - Checks internal and external links
4. **Format Validation** - Ensures markdown formatting compliance
5. **Spelling and Grammar** - Basic language checks

### Manual Review Checklist

#### Content Review

- [ ] **Accuracy** - All technical information is correct
- [ ] **Completeness** - No missing critical information
- [ ] **Clarity** - Language is clear and understandable
- [ ] **Consistency** - Terminology and formatting are consistent
- [ ] **Relevance** - Content is still relevant and useful

#### Technical Review

- [ ] **Code Examples** - All code examples work and are up-to-date
- [ ] **API References** - API documentation matches current implementation
- [ ] **Configuration** - Configuration examples are valid
- [ ] **Dependencies** - External dependencies are current
- [ ] **Security** - No sensitive information is exposed

#### Accessibility Review

- [ ] **Headings** - Proper heading structure (H1-H6)
- [ ] **Links** - Descriptive link text
- [ ] **Images** - Alt text for all images
- [ ] **Tables** - Proper table headers and captions
- [ ] **Code** - Language specified for all code blocks

#### Style Review

- [ ] **Tone** - Consistent with project voice and style
- [ ] **Grammar** - Proper grammar and spelling
- [ ] **Formatting** - Consistent markdown formatting
- [ ] **Diátaxis** - Correct diataxis classification
- [ ] **Frontmatter** - Complete and accurate frontmatter

### Review Workflow

1. **Scheduled Review** - Automated system identifies due reviews
2. **Assignment** - Review assigned to document owner
3. **Review Execution** - Owner performs manual review using checklist
4. **Updates** - Document updated with changes and new `last_reviewed` date
5. **Verification** - CI validates updated document
6. **Approval** - Review marked complete in tracking system

## Review Metrics

### Key Performance Indicators

- **Review Compliance** - % of documents reviewed on schedule
- **Review Age** - Average age of last reviews
- **Overdue Reviews** - Number of documents past due date
- **Review Time** - Average time to complete reviews
- **Quality Score** - Post-review quality assessment

### Reporting

Monthly reports include:

- **Review Status Dashboard** - Overview of all document review status
- **Overdue Items** - List of documents requiring immediate attention
- **Quality Trends** - Documentation quality over time
- **Team Performance** - Review completion rates and times

## Automation

### CI Integration

The `.github/workflows/docs-validation.yml` workflow includes:

```yaml
- name: Check review schedule
  run: |
    # Check for overdue reviews
    node scripts/check-review-schedule.js

    # Generate review status report
    node scripts/generate-review-report.js
```

### Review Schedule Script

```javascript
// scripts/check-review-schedule.js
const fs = require('fs');
const path = require('path');

function checkReviewSchedule() {
  const docsDir = path.join(__dirname, '..');
  const today = new Date();

  // Find all markdown files
  const markdownFiles = findMarkdownFiles(docsDir);

  const overdue = [];
  const dueSoon = [];

  markdownFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const frontmatter = extractFrontmatter(content);

    if (frontmatter.last_reviewed && frontmatter.review_interval_days) {
      const lastReviewed = new Date(frontmatter.last_reviewed);
      const interval = parseInt(frontmatter.review_interval_days);
      const nextReview = new Date(lastReviewed);
      nextReview.setDate(nextReviewed.getDate() + interval);

      if (nextReview < today) {
        overdue.push({ file, nextReview });
      } else if (nextReview - today < 7 * 24 * 60 * 60 * 1000) {
        dueSoon.push({ file, nextReview });
      }
    }
  });

  console.log(`Found ${overdue.length} overdue reviews`);
  console.log(`Found ${dueSoon.length} reviews due soon`);

  if (overdue.length > 0) {
    console.error('Overdue reviews:');
    overdue.forEach(({ file, nextReview }) => {
      console.error(`  ${file} (was due ${nextReview.toISOString()})`);
    });
    process.exit(1);
  }
}
```

## Governance

### Review Policy

- **Mandatory Reviews** - Core documentation must be reviewed on schedule
- **Documentation Debt** - Track and prioritize overdue documentation
- **Quality Standards** - Maintain minimum quality thresholds
- **Continuous Improvement** - Regular review and improvement of review process

### Escalation Process

1. **First Overdue** - Automated reminder to document owner
2. **Second Overdue** - Escalation to team lead
3. **Third Overdue** - Assignment to alternate reviewer
4. **Critical Overdue** - Management intervention and resource allocation

### Documentation Standards Compliance

All reviews must ensure compliance with:

- **2026 Documentation Standard** - Extended tier requirements
- **Diátaxis Framework** - Proper content classification
- **Accessibility Guidelines** - WCAG 2.2 AA compliance
- **Security Standards** - No sensitive information exposure
- **Brand Guidelines** - Consistent voice and terminology

## Tools and Resources

### Review Tools

- **Automated Validation** - CI/CD pipeline checks
- **Link Checking** - Lychee for external link validation
- **Spell Checking** - LanguageTool integration
- **Accessibility Testing** - axe-core for accessibility checks
- **Analytics** - Documentation usage metrics

### Templates and Checklists

- **Review Template** - Standardized review format
- **Checklist Library** - Role-specific review checklists
- **Frontmatter Schema** - Standard metadata structure
- **Style Guide** - Writing and formatting guidelines

## Contact and Support

### Review Coordination

- **Documentation Team** - docs@marketing-websites.com
- **Review Questions** - GitHub Discussions: #documentation
- **Process Issues** - GitHub Issues: documentation-review
- **Urgent Reviews** - Contact team lead directly

### Training and Onboarding

- **Review Process Training** - Monthly workshops for new reviewers
- **Tool Training** - Documentation tool usage guides
- **Best Practices** - Review technique and checklist training
- **Quality Standards** - Documentation quality criteria

---

_This review schedule ensures documentation remains accurate, relevant, and valuable to users. Last updated: 2026-02-19_

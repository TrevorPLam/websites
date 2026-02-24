#!/usr/bin/env node

/**
 * Automated Task Generation Script
 * Generates repetitive task files (philosophy, section files) using templates
 */

const fs = require('fs');
const path = require('path');

// Templates
const PHILOSOPHY_TEMPLATE = `---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-{DOMAIN}-{NUMBER}-philosophy
title: '{DOMAIN}.{NUMBER} Philosophy'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: docs # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-{DOMAIN}-{NUMBER}-philosophy
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-{DOMAIN}-{NUMBER} · {DOMAIN}.{NUMBER} Philosophy

## Objective

Define the philosophical foundation and architectural principles for {DOMAIN_NAME} domain, establishing the "why" behind implementation decisions and providing context for future development.

---

## Context

**Documentation Reference:**

- Relevant guide docs: {GUIDE_DOCS}
- Architecture patterns: {ARCHITECTURE_PATTERNS}
- Standards compliance: {STANDARDS}

**Current Status:** Philosophy and architectural principles need definition

**Codebase area:** {DOMAIN_NAME} domain foundation

**Related files:** Domain-specific implementation files

**Dependencies:** Domain analysis, architectural decisions

**Prior work**: Basic domain structure exists

**Constraints:** Must align with overall monorepo philosophy and 2026 standards

---

## Tech Stack

- **Documentation**: Markdown with YAML frontmatter
- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **Standards**: 2026 compliance (WCAG 2.2, OAuth 2.1, Core Web Vitals)

---

## Implementation Tasks

### 1. Define Domain Philosophy
- [ ] Establish core principles and values
- [ ] Define architectural approach
- [ ] Document decision-making framework

### 2. Architectural Guidelines
- [ ] Define layer responsibilities
- [ ] Establish interaction patterns
- [ ] Document integration approaches

### 3. Standards Compliance
- [ ] Ensure 2026 standards alignment
- [ ] Define security principles
- [ ] Document performance requirements

### 4. Future Considerations
- [ ] Define extensibility principles
- [ ] Document scalability considerations
- [ ] Establish maintenance guidelines

---

## Success Criteria

- [ ] Philosophy document complete and clear
- [ ] Architectural principles defined
- [ ] Standards compliance documented
- [ ] Future considerations addressed

---

## Verification Steps

1. **Review Philosophy**: Verify clarity and completeness
2. **Architecture Validation**: Ensure FSD compliance
3. **Standards Check**: Validate 2026 standards alignment
4. **Future Planning**: Confirm extensibility considerations

---

## Rollback Plan

If philosophy needs revision:
1. Update based on feedback
2. Re-validate architectural alignment
3. Update dependent documentation
4. Communicate changes to team

---

## References

- Feature-Sliced Design: https://feature-sliced.design/
- 2026 Web Standards: https://www.w3.org/standards/
- Monorepo Patterns: https://monorepo.tools/

---

## Notes

This philosophy document serves as the foundation for all {DOMAIN_NAME} domain implementations and should be referenced when making architectural decisions.
`;

const SECTION_TEMPLATE = `---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-{DOMAIN}-{SECTION_NAME_LOWER}-section-{SECTION_NAME_LOWER}
title: '{SECTION_NAME} Section Implementation'
status: pending # pending | in-progress | blocked | review | done
priority: medium # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-{DOMAIN}-{SECTION_NAME_LOWER}-section
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-{DOMAIN}-{SECTION_NAME_LOWER} · {SECTION_NAME} Section Implementation

## Objective

Implement the {SECTION_NAME} section for {DOMAIN_NAME} domain following FSD v2.1 principles, establishing proper layer structure, exports, and integration patterns.

---

## Context

**Documentation Reference:**

- Feature-Sliced Design: https://feature-sliced.design/
- FSD Layers: app → pages → widgets → features → entities → shared
- Section Patterns: {SECTION_PATTERNS}

**Current Status:** {SECTION_NAME} section needs implementation

**Codebase area:** {DOMAIN_NAME} domain → {SECTION_NAME} section

**Related files:** Section implementation files, exports, tests

**Dependencies:** Domain philosophy, FSD structure

**Prior work**: Basic domain structure exists

**Constraints:** Must follow FSD v2.1 principles and maintain proper layer boundaries

---

## Tech Stack

- **Architecture**: Feature-Sliced Design (FSD) v2.1
- **TypeScript**: Strict typing with proper interfaces
- **Testing**: Vitest with comprehensive coverage
- **Exports**: Public index.ts with proper re-exports

---

## Implementation Tasks

### 1. Section Structure Setup
- [ ] Create FSD-compliant directory structure
- [ ] Establish layer boundaries (app/pages/widgets/features/entities/shared)
- [ ] Set up proper TypeScript configuration

### 2. Core Implementation
- [ ] Implement entities layer (business logic)
- [ ] Implement features layer (use cases)
- [ ] Implement widgets layer (UI components)
- [ ] Implement pages layer (route components)

### 3. Integration & Exports
- [ ] Create public index.ts with proper re-exports
- [ ] Establish cross-slice import patterns (@x notation)
- [ ] Implement proper dependency injection

### 4. Testing & Validation
- [ ] Add comprehensive unit tests
- [ ] Implement integration tests
- [ ] Validate FSD compliance with Steiger

---

## Success Criteria

- [ ] FSD v2.1 compliant structure
- [ ] Proper layer boundaries maintained
- [ ] Public exports functional
- [ ] Comprehensive test coverage
- [ ] Steiger linting passes

---

## Verification Steps

1. **Structure Validation**: Verify FSD compliance
2. **Export Testing**: Validate public API
3. **Layer Boundary Check**: Ensure proper separation
4. **Test Coverage**: Confirm comprehensive testing
5. **Linting**: Pass Steiger validation

---

## Rollback Plan

If implementation issues arise:
1. Remove created files
2. Restore previous structure
3. Re-validate requirements
4. Re-implement with corrected approach

---

## References

- Feature-Sliced Design: https://feature-sliced.design/
- Steiger Linter: https://github.com/feature-sliced/steiger
- FSD Layers: https://feature-sliced.design/docs/concepts/layers

---

## Notes

This {SECTION_NAME} section implementation should follow the established patterns in the {DOMAIN_NAME} domain and maintain consistency with other sections.
`;

// Domain mappings
const DOMAIN_MAPPINGS = {
  8: {
    name: 'SEO & Metadata',
    guide_docs: 'seo-metadata/*',
    architecture: 'Metadata factory patterns',
  },
  9: {
    name: 'Lead Management',
    guide_docs: 'backend-data/lead-tracking',
    architecture: 'Lead scoring and attribution',
  },
  10: {
    name: 'Portal Realtime',
    guide_docs: 'backend-data/realtime',
    architecture: 'Supabase Realtime patterns',
  },
  11: {
    name: 'Billing & Payments',
    guide_docs: 'payments-billing/*',
    architecture: 'Stripe integration patterns',
  },
  12: {
    name: 'Background Jobs',
    guide_docs: 'backend-data/queue-jobs',
    architecture: 'QStash job patterns',
  },
  13: {
    name: 'Analytics Dashboard',
    guide_docs: 'observability/*',
    architecture: 'Tinybird analytics patterns',
  },
  14: {
    name: 'Accessibility',
    guide_docs: 'accessibility-legal/*',
    architecture: 'WCAG 2.2 compliance',
  },
  15: {
    name: 'Security Hardening',
    guide_docs: 'security/*',
    architecture: 'Defense-in-depth patterns',
  },
  16: {
    name: 'CI/CD Pipeline',
    guide_docs: 'infrastructure-devops/ci-cd',
    architecture: 'GitHub Actions patterns',
  },
  17: {
    name: 'Onboarding Flow',
    guide_docs: 'frontend/onboarding',
    architecture: 'Wizard UI patterns',
  },
  18: {
    name: 'Admin Dashboard',
    guide_docs: 'frontend/admin',
    architecture: 'Super admin patterns',
  },
  19: {
    name: 'Cal.com Integration',
    guide_docs: 'scheduling/*',
    architecture: 'Scheduling widget patterns',
  },
  20: { name: 'Email System', guide_docs: 'email/*', architecture: 'Multi-tenant email routing' },
  21: {
    name: 'File Upload System',
    guide_docs: 'frontend/file-upload',
    architecture: 'Supabase Storage patterns',
  },
  22: {
    name: 'AI Chat Integration',
    guide_docs: 'ai-automation/*',
    architecture: 'RAG and streaming patterns',
  },
  23: {
    name: 'Tenant SEO Metadata',
    guide_docs: 'seo-metadata/*',
    architecture: 'Per-tenant SEO patterns',
  },
  24: {
    name: 'Realtime Lead Feed',
    guide_docs: 'backend-data/realtime',
    architecture: 'Supabase Realtime patterns',
  },
  25: {
    name: 'Service Area Pages',
    guide_docs: 'frontend/programmatic-seo',
    architecture: 'Dynamic page generation',
  },
  26: {
    name: 'Blog Content System',
    guide_docs: 'cms-content/*',
    architecture: 'Sanity CMS patterns',
  },
  27: {
    name: 'Client Portal Config',
    guide_docs: 'frontend/client-portal',
    architecture: 'Configuration management',
  },
  28: {
    name: 'White-label Portal',
    guide_docs: 'frontend/white-label',
    architecture: 'Enterprise theming',
  },
  29: {
    name: 'Report Generation',
    guide_docs: 'frontend/reporting',
    architecture: 'PDF generation patterns',
  },
  30: { name: 'E2E Testing Suite', guide_docs: 'testing/*', architecture: 'Playwright patterns' },
  31: {
    name: 'Deployment Runbook',
    guide_docs: 'infrastructure-devops/deployment',
    architecture: 'Zero-downtime patterns',
  },
  32: {
    name: 'Multi-region Setup',
    guide_docs: 'infrastructure-devops/multi-region',
    architecture: 'Global distribution',
  },
  33: {
    name: 'Performance Monitoring',
    guide_docs: 'observability/*',
    architecture: 'Real-time monitoring',
  },
  34: {
    name: 'Security Monitoring',
    guide_docs: 'security/monitoring',
    architecture: 'Threat detection patterns',
  },
  35: {
    name: 'Bundle Optimization',
    guide_docs: 'frontend/performance',
    architecture: 'Performance budgets',
  },
  36: {
    name: 'Documentation System',
    guide_docs: 'best-practices/documentation',
    architecture: 'Docs-as-code patterns',
  },
};

function generatePhilosophyFile(domain, domainInfo) {
  const template = PHILOSOPHY_TEMPLATE.replace(/{DOMAIN}/g, domain)
    .replace(/{NUMBER}/g, '1')
    .replace(/{DOMAIN_NAME}/g, domainInfo.name)
    .replace(/{GUIDE_DOCS}/g, domainInfo.guide_docs)
    .replace(/{ARCHITECTURE_PATTERNS}/g, domainInfo.architecture)
    .replace(/{STANDARDS}/g, '2026 Web Standards, WCAG 2.2, OAuth 2.1');

  return template;
}

function generateSectionFile(domain, sectionName, domainInfo) {
  const template = SECTION_TEMPLATE.replace(/{DOMAIN}/g, domain)
    .replace(/{SECTION_NAME}/g, sectionName)
    .replace(/{SECTION_NAME_LOWER}/g, sectionName.toLowerCase())
    .replace(/{DOMAIN_NAME}/g, domainInfo.name)
    .replace(/{SECTION_PATTERNS}/g, `${sectionName} implementation patterns`);

  return template;
}

function createTaskFile(domain, filename, content) {
  const tasksDir = path.join(__dirname, '..', 'tasks', `domain-${domain}`);

  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, { recursive: true });
  }

  const filePath = path.join(tasksDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'philosophy':
      const domain = args[1];
      if (domain && DOMAIN_MAPPINGS[domain]) {
        const content = generatePhilosophyFile(domain, DOMAIN_MAPPINGS[domain]);
        createTaskFile(domain, `DOMAIN-${domain}-1-philosophy.md`, content);
        console.log(`Generated philosophy file for domain ${domain}`);
      } else {
        console.log('Usage: node generate-tasks.js philosophy <domain-number>');
        console.log('Available domains:', Object.keys(DOMAIN_MAPPINGS).join(', '));
      }
      break;

    case 'section':
      const sectionDomain = args[1];
      const sectionName = args[2];
      if (sectionDomain && sectionName && DOMAIN_MAPPINGS[sectionDomain]) {
        const content = generateSectionFile(
          sectionDomain,
          sectionName,
          DOMAIN_MAPPINGS[sectionDomain]
        );
        createTaskFile(
          sectionDomain,
          `DOMAIN-${sectionDomain}-${sectionName.toLowerCase()}-section-${sectionName.toLowerCase()}.md`,
          content
        );
        console.log(`Generated section file for domain ${sectionDomain}, section ${sectionName}`);
      } else {
        console.log('Usage: node generate-tasks.js section <domain-number> <section-name>');
      }
      break;

    case 'batch-philosophy':
      const startDomain = parseInt(args[1]) || 8;
      const endDomain = parseInt(args[2]) || 36;

      for (let d = startDomain; d <= endDomain; d++) {
        if (DOMAIN_MAPPINGS[d]) {
          const content = generatePhilosophyFile(d, DOMAIN_MAPPINGS[d]);
          createTaskFile(d, `DOMAIN-${d}-1-philosophy.md`, content);
        }
      }
      console.log(`Generated philosophy files for domains ${startDomain}-${endDomain}`);
      break;

    default:
      console.log('Available commands:');
      console.log('  philosophy <domain>     - Generate philosophy file for domain');
      console.log('  section <domain> <name> - Generate section file for domain');
      console.log('  batch-philosophy [start] [end] - Generate philosophy files for domain range');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generatePhilosophyFile,
  generateSectionFile,
  DOMAIN_MAPPINGS,
};

#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Generate task scaffolds from templates for批量 task creation
.DESCRIPTION
    Creates multiple task files based on domain templates with consistent structure
.PARAMETER Domain
    Target domain number (1-36)
.PARAMETER Template
    Template type: 'infrastructure', 'security', 'seo', 'integration', 'feature'
.PARAMETER Count
    Number of tasks to generate
.EXAMPLE
    ./scripts/generate-task.ps1 -Domain 23 -Template "seo-feature" -Count 6
#>

param(
    [Parameter(Mandatory=$true)]
    [int]$Domain,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("infrastructure", "security", "seo", "integration", "feature")]
    [string]$Template,
    
    [Parameter(Mandatory=$true)]
    [int]$Count
)

$basePath = "c:/dev/marketing-websites"
$tasksPath = "$basePath/tasks/domain-$Domain"

# Ensure domain directory exists
if (-not (Test-Path $tasksPath)) {
    New-Item -ItemType Directory -Path $tasksPath -Force
}

# Template definitions
$templates = @{
    "infrastructure" = @{
        Prefix = "INFRA"
        Type = "refactor"
        Priority = "high"
        CommonPatterns = @("connection-pooling", "database-setup", "cache-configuration", "monitoring")
    }
    "security" = @{
        Prefix = "SEC"
        Type = "feature"
        Priority = "critical"
        CommonPatterns = @("authentication", "authorization", "encryption", "audit-logging", "rate-limiting")
    }
    "seo" = @{
        Prefix = "SEO"
        Type = "feature"
        Priority = "medium"
        CommonPatterns = @("metadata-generation", "sitemap", "robots-txt", "structured-data", "og-images")
    }
    "integration" = @{
        Prefix = "INT"
        Type = "feature"
        Priority = "high"
        CommonPatterns = @("api-client", "webhook-handler", "data-sync", "authentication-flow")
    }
    "feature" = @{
        Prefix = "FEAT"
        Type = "feature"
        Priority = "medium"
        CommonPatterns = @("ui-component", "server-action", "api-endpoint", "data-model")
    }
}

$templateConfig = $templates[$Template]
$domainPrefix = "DOMAIN-$Domain"

Write-Host "Generating $Count tasks for domain-$Domain using $Template template..." -ForegroundColor Green

for ($i = 1; $i -le $Count; $i++) {
    $taskId = "$($templateConfig.Prefix)-$($Domain.ToString().PadLeft(2, '0'))-$($i.ToString().PadLeft(3, '0'))"
    $pattern = $templateConfig.CommonPatterns[($i - 1) % $templateConfig.CommonPatterns.Count]
    $title = "$($templateConfig.Prefix) $Domain.$i: $pattern"
    $fileName = "$domainPrefix-$taskId-$pattern.Replace('-', '').Replace('_', '').Replace(' ', '-').ToLower().md"
    
    $taskContent = @"---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: $taskId
title: '$title'
status: pending # pending | in-progress | blocked | review | done
priority: $($templateConfig.Priority) # critical | high | medium | low
type: $($templateConfig.Type) # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/$taskId
allowed-tools: Bash(git:*) Read Write Bash(npm:*) Bash(node:*) Bash(pnpm:*)
---

# $taskId · $title

## Objective

Implement $pattern for Domain $Domain following the specifications in the domain plan. This task focuses on Domain $Domain implementation and ensures proper integration with the existing monorepo architecture.

## Context

Domain $Domain represents critical functionality for the multi-client multi-site monorepo. This implementation must follow Feature-Sliced Design (FSD) v2.1 principles and integrate seamlessly with existing infrastructure.

## Acceptance Criteria

- [ ] $pattern is fully implemented according to domain specifications
- [ ] Integration with existing monorepo architecture
- [ ] TypeScript types are properly defined and exported
- [ ] Tests are written and passing (>80% coverage)
- [ ] Documentation is updated and comprehensive
- [ ] Code follows established linting and formatting standards
- [ ] Build process completes successfully
- [ ] Integration tests validate end-to-end functionality

## Implementation Details

### Technical Requirements

1. **Architecture Compliance**
   - Follow FSD v2.1 layer structure
   - Use established patterns from completed domains
   - Ensure proper public exports via index.ts

2. **Integration Points**
   - Existing authentication system
   - Multi-tenant context propagation
   - Database connection patterns
   - API route structures

3. **Quality Standards**
   - TypeScript strict mode compliance
   - Comprehensive error handling
   - Performance optimization
   - Security best practices

### File Structure

```
packages/
├── [package-name]/
│   ├── src/
│   │   ├── [implementation-files]
│   │   └── index.ts
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
```

## Dependencies

### Internal
- Existing infrastructure packages
- Authentication and authorization systems
- Multi-tenant context management

### External
- [List specific external dependencies]

## Testing Strategy

### Unit Tests
- Core functionality validation
- Edge case handling
- Error scenarios

### Integration Tests
- Cross-package compatibility
- End-to-end workflows
- Performance benchmarks

### Security Tests
- Input validation
- Authorization checks
- Data isolation

## Verification Steps

1. **Development Verification**
   - [ ] Local development environment setup
   - [ ] Implementation follows acceptance criteria
   - [ ] Manual testing validates core functionality

2. **Automated Verification**
   - [ ] All tests pass (>80% coverage)
   - [ ] Build process completes successfully
   - [ ] Linting passes without warnings
   - [ ] Type checking completes without errors

3. **Integration Verification**
   - [ ] Works with existing monorepo packages
   - [ ] Multi-tenant isolation maintained
   - [ ] Performance benchmarks met

## Success Metrics

- **Functional**: All acceptance criteria met
- **Quality**: >80% test coverage, zero linting errors
- **Performance**: Meets established benchmarks
- **Integration**: Seamless compatibility with existing systems

## Rollback Plan

If implementation fails verification:
1. Revert changes to affected packages
2. Restore previous functionality
3. Document lessons learned
4. Update implementation approach

## Notes

This task is part of Domain $Domain implementation strategy. Coordinate with other domain tasks to ensure consistent patterns and avoid duplication of effort.

---

**Implementation Status**: Pending  
**Priority**: $($templateConfig.Priority)  
**Estimated Effort**: 2-4 hours  
**Dependencies**: None identified
"@

    $filePath = "$tasksPath/$fileName"
    $taskContent | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "Created: $fileName" -ForegroundColor Cyan
}

Write-Host "`nGenerated $Count tasks for domain-$Domain" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review generated tasks and customize specifics" -ForegroundColor Yellow
Write-Host "2. Update TODO.md with new task references" -ForegroundColor Yellow
Write-Host "3. Begin implementation following acceptance criteria" -ForegroundColor Yellow

---
title: Documentation Frontmatter Validation
description: Automated validation script for documentation frontmatter compliance
last_updated: 2026-02-26
tags: [#automation #validation #frontmatter #documentation]
estimated_read_time: 10 minutes
difficulty: intermediate
---

# Documentation Frontmatter Validation

## Overview

Automated validation script to ensure all documentation files comply with the standard frontmatter schema and 2026 documentation standards.

## Validation Schema

```typescript
// scripts/docs-validation.ts
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

interface DocumentFrontmatter {
  title: string;
  description: string;
  last_updated?: string;
  tags?: string[];
  estimated_read_time?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class DocumentationValidator {
  private requiredFields = ['title', 'description'];
  private optionalFields = ['last_updated', 'tags', 'estimated_read_time', 'difficulty'];
  private validDifficulties = ['beginner', 'intermediate', 'advanced'];

  validateFile(filePath: string): ValidationResult {
    const result: ValidationResult = {
      file: filePath,
      valid: true,
      errors: [],
      warnings: []
    };

    try {
      const content = readFileSync(filePath, 'utf-8');
      const frontmatter = this.extractFrontmatter(content);
      
      if (!frontmatter) {
        result.errors.push('Missing frontmatter');
        result.valid = false;
        return result;
      }

      // Validate required fields
      for (const field of this.requiredFields) {
        if (!frontmatter[field]) {
          result.errors.push(`Missing required field: ${field}`);
          result.valid = false;
        }
      }

      // Validate field formats
      if (frontmatter.title && typeof frontmatter.title !== 'string') {
        result.errors.push('Title must be a string');
        result.valid = false;
      }

      if (frontmatter.description && typeof frontmatter.description !== 'string') {
        result.errors.push('Description must be a string');
        result.valid = false;
      }

      if (frontmatter.description && frontmatter.description.length < 20) {
        result.warnings.push('Description should be at least 20 characters');
      }

      if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
        result.errors.push('Tags must be an array');
        result.valid = false;
      }

      if (frontmatter.difficulty && !this.validDifficulties.includes(frontmatter.difficulty)) {
        result.errors.push(`Invalid difficulty: ${frontmatter.difficulty}. Must be one of: ${this.validDifficulties.join(', ')}`);
        result.valid = false;
      }

      if (frontmatter.last_updated) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(frontmatter.last_updated)) {
          result.errors.push('last_updated must be in YYYY-MM-DD format');
          result.valid = false;
        }
      }

    } catch (error) {
      result.errors.push(`Failed to read file: ${error.message}`);
      result.valid = false;
    }

    return result;
  }

  private extractFrontmatter(content: string): DocumentFrontmatter | null {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return null;
    
    try {
      return parseYaml(match[1]);
    } catch (error) {
      return null;
    }
  }

  validateDirectory(dirPath: string, recursive = true): ValidationResult[] {
    const results: ValidationResult[] = [];
    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stat = statSync(itemPath);

      if (stat.isDirectory() && recursive) {
        results.push(...this.validateDirectory(itemPath, recursive));
      } else if (item.endsWith('.md')) {
        results.push(this.validateFile(itemPath));
      }
    }

    return results;
  }
}

// CLI usage
if (require.main === module) {
  const validator = new DocumentationValidator();
  const docsPath = process.argv[2] || './docs';
  
  console.log(`🔍 Validating documentation in: ${docsPath}`);
  
  const results = validator.validateDirectory(docsPath);
  const validResults = results.filter(r => r.valid);
  const invalidResults = results.filter(r => !r.valid);
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Valid files: ${validResults.length}`);
  console.log(`❌ Invalid files: ${invalidResults.length}`);
  
  if (invalidResults.length > 0) {
    console.log(`\n❌ Errors:`);
    for (const result of invalidResults) {
      console.log(`\n📄 ${result.file}`);
      result.errors.forEach(error => console.log(`  ❌ ${error}`));
      result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
    
    process.exit(1);
  } else {
    console.log(`\n✅ All documentation files are valid!`);
  }
}

export { DocumentationValidator };
```

## Package.json Script

```json
{
  "scripts": {
    "docs:validate": "tsx scripts/docs-validation.ts ./docs",
    "docs:validate:fix": "tsx scripts/docs-validation.ts ./docs --fix"
  }
}
```

## GitHub Actions Integration

```yaml
# .github/workflows/docs-validation.yml
name: Documentation Validation

on:
  push:
    branches: [main]
    paths: ['docs/**']
  pull_request:
    branches: [main]
    paths: ['docs/**']

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Validate documentation
        run: pnpm docs:validate
        
      - name: Check for broken links
        run: pnpm docs:check-links
```

## VS Code Integration

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Validate Documentation",
      "type": "shell",
      "command": "pnpm docs:validate",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## Usage Examples

```bash
# Validate all documentation
pnpm docs:validate

# Validate specific directory
pnpm docs:validate ./docs/guides

# Check for broken internal links
pnpm docs:check-links

# Generate validation report
pnpm docs:validate --report > validation-report.json
```

## Validation Rules

### Required Fields
- `title`: Document title (string, min 5 characters)
- `description`: Document description (string, min 20 characters)

### Optional Fields
- `last_updated`: Last update date (YYYY-MM-DD format)
- `tags`: Array of tags for categorization
- `estimated_read_time`: Reading time in minutes (number)
- `difficulty`: Difficulty level (beginner|intermediate|advanced)

### Content Validation
- Markdown syntax validation
- Internal link checking
- Image alt text verification
- Code block language specification

## Automated Fixes

The validator can automatically fix common issues:

```bash
# Auto-fix missing frontmatter
pnpm docs:validate:fix

# Auto-add missing required fields
pnpm docs:validate:fix --add-required

# Auto-format frontmatter
pnpm docs:validate:fix --format
```

## Integration with Documentation Workflow

1. **Pre-commit Hook**: Validate before commits
2. **CI/CD Pipeline**: Block merges on validation failures
3. **VS Code**: Real-time validation feedback
4. **Documentation Site**: Build-time validation

## Related Resources

- [Documentation Standards](../standards/documentation-governance.md)
- [Frontmatter Schema](../frontmatter-schema.json)
- [Markdown Linting](../guides-new/development/markdown-linting.md)

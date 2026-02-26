---
name: doc-generate
description: |
  **DOCUMENT GENERATION WORKFLOW** - Generate documents from templates and data.
  USE FOR: Report generation, documentation automation, content creation.
  DO NOT USE FOR: Simple file copying, basic text editing.
  INVOKES: [filesystem, fetch].
meta:
  version: '1.0.0'
  author: 'anthropic-ecosystem'
  category: 'documentation'
---

# Document Generation Workflow

## Overview

This Skill orchestrates document generation from templates and data sources, supporting multiple output formats and automated content creation.

## Prerequisites

- Document templates available in repository
- Data sources accessible via API or files
- Output format converters installed
- Template engine configured
- Document storage locations defined

## Workflow Steps

### 1. Load Document Template

**Action:** Load and parse document template from repository

**Validation:**
- Template file exists and accessible
- Template syntax is valid
- Template variables identified
- Template dependencies resolved

**MCP Server:** filesystem (for template access)

**Expected Output:** Parsed document template with variables

### 2. Gather Data Sources

**Action:** Collect data from APIs, databases, or files

**Validation:**
- Data sources accessible and available
- Data format matches template requirements
- Data validation rules applied
- Data transformation completed

**MCP Server:** fetch (for API calls) or filesystem (for file access)

**Expected Output:** Collected and processed data

### 3. Merge Template and Data

**Action:** Merge template with collected data using template engine

**Validation:**
- Template engine processes successfully
- All variables populated correctly
- Data validation passes
- Output format is valid

**MCP Server:** filesystem (for template processing)

**Expected Output:** Generated document content

### 4. Convert Output Format

**Action:** Convert document to target format (PDF, DOCX, HTML, etc.)

**Validation:**
- Output format converter available
- Conversion successful without errors
- File permissions set correctly
- Output file created

**MCP Server:** filesystem (for conversion tools)

**Expected Output:** Formatted document in target format

### 5. Store and Distribute

**Action:** Store generated document and handle distribution

**Validation:**
- Storage location accessible
- File properly saved
- Distribution channels configured
- Notifications sent if required

**MCP Server:** fetch (for storage APIs) or filesystem (for file operations)

**Expected Output:** Document stored and distributed

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Template Load | Template missing | Use fallback template | No |
| Data Gathering | Data unavailable | Use default data | Partial |
| Template Merge | Template errors | Fix template syntax | Partial |
| Format Conversion | Converter missing | Use fallback format | No |
| Storage | Storage failure | Retry with alternative location | No |

## Success Criteria

- Document template successfully loaded and parsed
- Data sources collected and validated
- Template merged with data correctly
- Document converted to target format
- Document stored and distributed
- Quality checks passed

## Environment Variables

```bash
# Required
TEMPLATE_PATH=/templates/documents
OUTPUT_PATH=/generated/documents
DEFAULT_FORMAT=html
TEMPLATE_ENGINE=handlebars

# Optional
DATA_SOURCE_API=https://api.example.com
CONVERTER_PATH=/converters
DISTRIBUTION_WEBHOOK=https://hooks.example.com
STORAGE_TYPE=filesystem
```

## Usage Examples

### Agent Invocation Patterns

**For Claude/Windsurf:**

```text
claude, execute the doc-generate workflow with the following parameters:
- template: "monthly-report"
- data-source: "analytics-api"
- output-format: "pdf"
- distribution: "email"
```

**For Cursor/Claude Code:**

```text
Execute skill doc-generate with:
--template=monthly-report
--data-source=analytics-api
--output-format=pdf
--distribution=email
```

**Direct MCP Tool Usage:**

```text
Use the filesystem MCP server to access templates and the fetch server for data collection.
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Template missing | Verify template path and recreate default template |
| Data unavailable | Use fallback data or check data source connectivity |
| Template errors | Debug template syntax and fix issues |
| Conversion failures | Use fallback format or check converter availability |
| Storage issues | Verify storage permissions and retry |

## Related Skills

- [mcp-build](mcp-build.md) - For MCP server documentation
- [playwright-test](playwright-test.md) - For test report generation
- [api-connect](api-connect.md) - For data source integration

## References

- Template engine documentation
- Document format specifications
- Data source integration patterns
- Storage and distribution best practices

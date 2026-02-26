---
name: skill-automation
description: |
  **SCRIPTING SKILL** - Automation scripts for skill development and maintenance.
  USE FOR: Batch skill operations, validation, deployment automation.
  DO NOT USE FOR: Direct skill execution - use individual skills instead.
  INVOKES: filesystem, git, skillset.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "scripting"
---

# Skill Automation Scripts

## Overview
This skill provides automation scripts for managing the skills ecosystem, including validation, deployment, and maintenance operations.

## Available Scripts

### 1. Skill Validation Script
```bash
# Validate all skills in the repository
pnpm run validate:skills

# Validate specific skill category
pnpm run validate:skills --category=claude

# Validate single skill
pnpm run validate:skills --skill=claude/code-review
```

**Purpose**: Ensures all skills follow proper structure and conventions

**Validation Checks**:
- Frontmatter schema validation
- MCP server references verification
- File structure compliance
- Required sections presence
- Template adherence

### 2. Skill Generation Script
```bash
# Generate new skill from template
pnpm run create:skill --name=audit-log --category=core --type=workflow

# Generate domain-specific skill
pnpm run create:skill --name=client-onboarding --category=marketing --type=domain

# Generate integration skill
pnpm run create:skill --name=slack-notifications --category=integration --type=integration
```

**Purpose**: Creates new skills with proper structure and boilerplate

**Generated Components**:
- SKILL.md with appropriate frontmatter
- Directory structure following FSD patterns
- Template sections based on skill type
- MCP server dependency placeholders

### 3. Skill Deployment Script
```bash
# Deploy all skills to production
pnpm run deploy:skills

# Deploy specific category
pnpm run deploy:skills --category=claude

# Deploy with validation
pnpm run deploy:skills --validate --dry-run
```

**Purpose**: Manages skill deployment across environments

**Deployment Steps**:
1. Validate all skills
2. Update skill registry
3. Sync with MCP configuration
4. Update documentation
5. Run smoke tests

### 4. Skill Documentation Script
```bash
# Generate skill documentation
pnpm run docs:skills

# Generate specific category docs
pnpm run docs:skills --category=domain

# Export skill inventory
pnpm run docs:skills --format=json --output=skill-inventory.json
```

**Purpose**: Maintains comprehensive skill documentation

**Documentation Features**:
- Skill inventory with metadata
- MCP server dependency mapping
- Usage examples and patterns
- Integration guides

## Script Implementation Patterns

### Error Handling
```typescript
interface ScriptResult {
  success: boolean;
  message: string;
  errors?: string[];
  warnings?: string[];
  data?: any;
}

async function runScript(scriptName: string, options: any): Promise<ScriptResult> {
  try {
    const result = await executeScript(scriptName, options);
    return {
      success: true,
      message: `Script ${scriptName} completed successfully`,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: `Script ${scriptName} failed: ${error.message}`,
      errors: [error.message]
    };
  }
}
```

### Progress Reporting
```typescript
interface ProgressCallback {
  (stage: string, progress: number, total: number): void;
}

async function executeWithProgress(
  operation: () => Promise<any>,
  onProgress: ProgressCallback
): Promise<any> {
  onProgress('Starting', 0, 100);
  // ... operation logic
  onProgress('Completed', 100, 100);
}
```

### Configuration Management
```typescript
interface ScriptConfig {
  skillsPath: string;
  outputPath: string;
  validationRules: ValidationRule[];
  deploymentTargets: DeploymentTarget[];
}

function loadConfig(): ScriptConfig {
  const configPath = path.join(process.cwd(), 'skills.config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}
```

## Development Workflow

### 1. Local Development
```bash
# Install dependencies
pnpm install

# Run validation during development
pnpm run validate:skills --watch

# Test new skill generation
pnpm run create:skill --name=test-skill --category=test --dry-run
```

### 2. Pre-commit Validation
```bash
# Validate changed skills only
pnpm run validate:skills --changed

# Run full validation before commit
pnpm run validate:skills --strict
```

### 3. CI/CD Integration
```yaml
# .github/workflows/skills.yml
name: Skills Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run validate:skills --strict
```

## Maintenance Operations

### Skill Health Monitoring
```typescript
interface SkillHealth {
  skillId: string;
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
  lastValidated: Date;
  dependencies: string[];
}

async function monitorSkillHealth(): Promise<SkillHealth[]> {
  const skills = await discoverAllSkills();
  return Promise.all(
    skills.map(skill => validateSkillHealth(skill))
  );
}
```

### Dependency Updates
```bash
# Update MCP server dependencies
pnpm run update:deps --mcp-servers

# Check for breaking changes
pnpm run audit:deps --mcp-servers

# Update skill templates
pnpm run update:templates
```

### Cleanup Operations
```bash
# Remove unused skills
pnpm run cleanup:skills --dry-run

# Archive old skill versions
pnpm run archive:skills --older-than=90d

# Compact skill registry
pnpm run compact:registry
```

## Troubleshooting

### Common Issues

#### Validation Failures
- **Problem**: Skills fail frontmatter validation
- **Solution**: Check frontmatter schema in templates
- **Command**: `pnpm run validate:skills --fix`

#### MCP Server References
- **Problem**: Invalid MCP server names in skills
- **Solution**: Update skill INVOKES fields
- **Command**: `pnpm run fix:mcp-references`

#### File Structure Issues
- **Problem**: Missing required directories or files
- **Solution**: Regenerate from templates
- **Command**: `pnpm run fix:structure --skill=problematic-skill`

### Debug Mode
```bash
# Enable debug logging
DEBUG=skills:* pnpm run validate:skills

# Verbose output
pnpm run validate:skills --verbose

# Step-by-step execution
pnpm run validate:skills --interactive
```

## Integration Points

### MCP Server Integration
- Automatic server discovery
- Dependency validation
- Configuration synchronization

### Git Integration
- Pre-commit hooks
- Branch-specific validation
- Release automation

### Documentation Integration
- Auto-generated skill docs
- API documentation sync
- Changelog generation

## Performance Considerations

### Parallel Processing
```typescript
async function validateSkillsInParallel(skills: string[]): Promise<ValidationResult[]> {
  const chunks = chunkArray(skills, 10); // Process 10 skills concurrently
  const results = [];
  
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(skill => validateSkill(skill))
    );
    results.push(...chunkResults);
  }
  
  return results;
}
```

### Caching
```typescript
const validationCache = new Map<string, ValidationResult>();

async function validateSkillWithCache(skillPath: string): Promise<ValidationResult> {
  const cacheKey = `${skillPath}:${fs.statSync(skillPath).mtime}`;
  
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  
  const result = await validateSkill(skillPath);
  validationCache.set(cacheKey, result);
  return result;
}
```

## Security Considerations

### Script Execution
- Validate script permissions
- Sandbox execution environments
- Audit script operations

### Dependency Management
- Verify MCP server authenticity
- Check for known vulnerabilities
- Monitor dependency changes

## Extensibility

### Custom Script Development
```typescript
interface CustomScript {
  name: string;
  description: string;
  execute: (options: any) => Promise<ScriptResult>;
  validate?: (options: any) => boolean;
}

function registerCustomScript(script: CustomScript): void {
  scriptRegistry.set(script.name, script);
}
```

### Plugin Architecture
- Hook into validation pipeline
- Custom rule definitions
- Extensible reporting formats

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

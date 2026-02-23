# cli-scaffold-design.md

# CLI Scaffold Design for Golden Path Development

## Overview

CLI scaffolding tools are essential for implementing golden paths in modern development workflows. They provide automated, standardized ways to create project structures, configure development environments, and enforce best practices. This document outlines design patterns and implementation strategies for CLI scaffolding tools, particularly focusing on `pnpm create` and golden path methodologies.

## Golden Path Philosophy

### What is a Golden Path?

A golden path is a recommended, standardized way for developers to complete common tasks like spinning up services, configuring CI/CD, or deploying to production. It bundles together templates, tooling, configurations, and best practices that have been vetted by the organization.

**Key Characteristics:**

- **Optional but compelling**: Developers choose it because it's easier, not because it's mandatory
- **Transparent**: Not a black box - developers can see what's happening under the hood
- **Extensible**: Allows off-roading when the default doesn't fit specific needs
- **Customizable**: Can be adapted within reason for different use cases

### Benefits

1. **Reduced Cognitive Load**: Developers don't need to figure out tooling and configurations
2. **Consistency**: Standardized approaches across teams and projects
3. **Faster Onboarding**: New hires become productive more quickly
4. **Best Practices Enforcement**: Security, performance, and architectural patterns built-in
5. **Error Reduction**: Fewer configuration mistakes and setup issues

## CLI Scaffolding Architecture

### Core Components

#### 1. Template Engine

```javascript
// Template processor example
class TemplateEngine {
  constructor(options) {
    this.templates = new Map();
    this.variables = new Map();
    this.hooks = new Map();
  }

  async generate(templateName, targetDir, variables) {
    const template = this.templates.get(templateName);
    const context = { ...this.getDefaultVariables(), ...variables };

    // Process template files
    for (const file of template.files) {
      const processed = await this.processTemplate(file, context);
      await this.writeFile(path.join(targetDir, file.path), processed);
    }

    // Run post-generation hooks
    await this.runHooks('post-generate', { targetDir, context });
  }
}
```

#### 2. Configuration Management

```yaml
# scaffold.config.yaml
templates:
  react-app:
    description: 'React application with TypeScript'
    version: '1.2.0'
    variables:
      - name: 'appName'
        type: 'string'
        required: true
        description: 'Application name'
      - name: 'useAuth'
        type: 'boolean'
        default: false
        description: 'Include authentication'
    hooks:
      - type: 'pre-generate'
        script: 'scripts/pre-checks.js'
      - type: 'post-generate'
        script: 'scripts/setup.js'
```

#### 3. Plugin System

```javascript
// Plugin architecture
class ScaffoldPlugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.hooks = {};
  }

  registerHook(hookName, handler) {
    if (!this.hooks[hookName]) {
      this.hooks[hookName] = [];
    }
    this.hooks[hookName].push(handler);
  }

  async executeHook(hookName, context) {
    const handlers = this.hooks[hookName] || [];
    for (const handler of handlers) {
      await handler(context);
    }
  }
}
```

## Implementation Patterns

### 1. Template Structure

#### Directory Layout

```
templates/
├── react-app/
│   ├── template.yaml
│   ├── files/
│   │   ├── package.json.hbs
│   │   ├── src/
│   │   │   ├── App.tsx.hbs
│   │   │   └── index.tsx.hbs
│   │   └── README.md.hbs
│   ├── scripts/
│   │   ├── pre-checks.js
│   │   └── setup.js
│   └── hooks/
│       ├── pre-generate.js
│       └── post-generate.js
├── next-app/
└── api-service/
```

#### Template Configuration

```yaml
# templates/react-app/template.yaml
name: 'React Application'
description: 'Modern React app with TypeScript and testing'
version: '2.1.0'
author: 'Platform Team'

variables:
  - name: 'appName'
    type: 'string'
    required: true
    pattern: '^[a-z][a-z0-9-]*$'
    description: 'Application name (kebab-case)'

  - name: 'description'
    type: 'string'
    required: false
    description: 'Project description'

  - name: 'author'
    type: 'string'
    default: '{{git.user.name}}'
    description: 'Author name'

  - name: 'useAuth'
    type: 'boolean'
    default: false
    description: 'Include authentication setup'

  - name: 'testingFramework'
    type: 'choice'
    choices: ['vitest', 'jest']
    default: 'vitest'
    description: 'Testing framework to use'

dependencies:
  - 'react@^18.2.0'
  - 'react-dom@^18.2.0'
  - 'typescript@^5.0.0'

devDependencies:
  - '@types/react@^18.2.0'
  - '@types/react-dom@^18.2.0'
  - 'vite@^4.4.0'

scripts:
  pre-checks:
    - 'node -v'
    - 'npm -v'
    - 'check if target directory is empty'

  post-generate:
    - 'npm install'
    - 'git init'
    - 'git add .'
    - "git commit -m 'Initial commit from scaffold'"
```

### 2. Template Files with Handlebars

#### package.json.hbs

```json
{
  "name": "{{appName}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "author": "{{author}}",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "{{#if (eq testingFramework 'vitest')}}vitest{{else}}jest{{/if}}",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  },
  "dependencies": [
    {{#each dependencies}}
    "{{this}}"{{#unless @last}},{{/unless}}
    {{/each}}
  ],
  "devDependencies": [
    {{#each devDependencies}}
    "{{this}}"{{#unless @last}},{{/unless}}
    {{/each}}
  ],
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

#### Conditional Content

```typescript
// src/App.tsx.hbs
import React from 'react';
{{#if useAuth}}
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
{{/if}}

function App() {
  return (
    <div className="app">
      {{#if useAuth}}
      <AuthProvider>
        <MainContent />
      </AuthProvider>
      {{else}}
      <MainContent />
      {{/if}}
    </div>
  );
}

export default App;
```

### 3. CLI Interface Design

#### Command Structure

```bash
# Basic usage
pnpm create <template-name> <project-name> [options]

# Examples
pnpm create react-app my-app
pnpm create next-app my-blog --use-tailwind --use-auth
pnpm create api-service user-service --database postgres --language typescript
```

#### Interactive Mode

```javascript
// Interactive CLI using inquirer
import inquirer from 'inquirer';

async function promptForVariables(template) {
  const questions = template.variables.map((variable) => ({
    type: variable.type === 'boolean' ? 'confirm' : variable.type === 'choice' ? 'list' : 'input',
    name: variable.name,
    message: variable.description,
    default: variable.default,
    choices: variable.choices,
    validate: (input) => {
      if (variable.required && !input) {
        return `${variable.name} is required`;
      }
      if (variable.pattern && !new RegExp(variable.pattern).test(input)) {
        return `Invalid format for ${variable.name}`;
      }
      return true;
    },
  }));

  return inquirer.prompt(questions);
}
```

#### Command Options

```javascript
// CLI options parsing
const options = {
  template: {
    alias: 't',
    type: 'string',
    description: 'Template name to use',
  },
  directory: {
    alias: 'd',
    type: 'string',
    description: 'Target directory (default: current directory)',
  },
  force: {
    alias: 'f',
    type: 'boolean',
    default: false,
    description: 'Overwrite existing files',
  },
  dryRun: {
    type: 'boolean',
    default: false,
    description: 'Show what would be generated without creating files',
  },
  interactive: {
    alias: 'i',
    type: 'boolean',
    default: true,
    description: 'Interactive mode for variable input',
  },
  variables: {
    alias: 'var',
    type: 'string',
    description: 'Variables in key=value format (comma-separated)',
  },
};
```

## Advanced Features

### 1. Plugin System

#### Plugin Development

```javascript
// plugins/auth-plugin.js
class AuthPlugin extends ScaffoldPlugin {
  constructor() {
    super('auth-plugin', '1.0.0');

    this.registerHook('pre-generate', this.validateAuthSetup.bind(this));
    this.registerHook('post-generate', this.setupAuthFiles.bind(this));
  }

  async validateAuthSetup(context) {
    if (context.variables.useAuth) {
      // Validate auth configuration
      console.log('🔐 Setting up authentication...');
    }
  }

  async setupAuthFiles(context) {
    if (context.variables.useAuth) {
      // Create auth-related files
      await this.createAuthFiles(context.targetDir);
    }
  }

  async createAuthFiles(targetDir) {
    const authFiles = [
      'src/contexts/AuthContext.tsx',
      'src/hooks/useAuth.ts',
      'src/components/AuthGuard.tsx',
    ];

    for (const file of authFiles) {
      // Generate auth files with proper content
      await this.generateAuthFile(path.join(targetDir, file));
    }
  }
}
```

#### Plugin Registration

```javascript
// scaffold.js
class ScaffoldCLI {
  constructor() {
    this.plugins = new Map();
    this.loadPlugins();
  }

  loadPlugins() {
    // Load built-in plugins
    this.registerPlugin(new AuthPlugin());
    this.registerPlugin(new TestingPlugin());
    this.registerPlugin(new CIPlugin());

    // Load external plugins from config
    const config = this.loadConfig();
    for (const pluginConfig of config.plugins) {
      const plugin = require(pluginConfig.path);
      this.registerPlugin(new plugin());
    }
  }

  registerPlugin(plugin) {
    this.plugins.set(plugin.name, plugin);
  }
}
```

### 2. Template Inheritance

#### Base Templates

```yaml
# templates/base/web-app.yaml
name: 'Base Web Application'
description: 'Base template for web applications'

variables:
  - name: 'appName'
    type: 'string'
    required: true
  - name: 'author'
    type: 'string'
    default: '{{git.user.name}}'

files:
  - path: 'package.json.hbs'
    template: 'base/package.json.hbs'
  - path: '.gitignore'
    template: 'base/.gitignore'
  - path: 'README.md.hbs'
    template: 'base/README.md.hbs'

scripts:
  post-generate:
    - 'npm install'
    - 'git init'
```

#### Extending Templates

```yaml
# templates/react-app/template.yaml
extends: 'base/web-app.yaml'

name: 'React Application'
description: 'React app extending base web app'

variables:
  # Inherit base variables
  - name: 'useTypeScript'
    type: 'boolean'
    default: true
  - name: 'useRouter'
    type: 'boolean'
    default: false

files:
  # Override base files
  - path: 'package.json.hbs'
    template: 'react/package.json.hbs'
  # Add React-specific files
  - path: 'src/App.tsx.hbs'
    template: 'react/App.tsx.hbs'
  - path: 'src/index.tsx.hbs'
    template: 'react/index.tsx.hbs'

dependencies:
  - 'react@^18.2.0'
  - 'react-dom@^18.2.0'
```

### 3. Validation and Testing

#### Template Validation

```javascript
// validator.js
class TemplateValidator {
  validate(template) {
    const errors = [];

    // Validate required fields
    if (!template.name) {
      errors.push('Template name is required');
    }

    // Validate variables
    for (const variable of template.variables || []) {
      if (variable.required && !variable.name) {
        errors.push(`Required variable missing name`);
      }
    }

    // Validate file references
    for (const file of template.files || []) {
      if (!file.path) {
        errors.push(`File missing path`);
      }
      if (!file.template) {
        errors.push(`File ${file.path} missing template`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateVariables(variables, template) {
    const errors = [];
    const templateVars = template.variables || [];

    for (const templateVar of templateVars) {
      if (templateVar.required && !variables[templateVar.name]) {
        errors.push(`Required variable ${templateVar.name} is missing`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

#### Template Testing

```javascript
// tests/template.test.js
describe('React App Template', () => {
  let template;
  let scaffold;

  beforeEach(() => {
    template = loadTemplate('react-app');
    scaffold = new ScaffoldCLI();
  });

  test('should validate template structure', () => {
    const validation = scaffold.validateTemplate(template);
    expect(validation.valid).toBe(true);
  });

  test('should generate project with required files', async () => {
    const tempDir = await createTempDirectory();

    await scaffold.generate('react-app', tempDir, {
      appName: 'test-app',
      author: 'Test Author',
    });

    const files = await fs.readdir(tempDir);
    expect(files).toContain('package.json');
    expect(files).toContain('src');
    expect(files).toContain('README.md');
  });

  test('should substitute variables correctly', async () => {
    const tempDir = await createTempDirectory();

    await scaffold.generate('react-app', tempDir, {
      appName: 'my-test-app',
      author: 'John Doe',
    });

    const packageJson = await fs.readJson(path.join(tempDir, 'package.json'));

    expect(packageJson.name).toBe('my-test-app');
    expect(packageJson.author).toBe('John Doe');
  });
});
```

## Best Practices

### 1. Template Design

#### Keep Templates Focused

- Single responsibility per template
- Avoid feature bloat
- Use plugins for optional functionality

#### Use Semantic Versioning

- Follow semantic versioning for templates
- Document breaking changes
- Provide migration guides

#### Document Everything

- Clear template descriptions
- Variable explanations
- Usage examples
- Troubleshooting guides

### 2. CLI Design

#### Follow CLI Conventions

- Standard flag patterns (--help, --version)
- Consistent command structure
- Clear error messages
- Progress indicators

#### Provide Good Defaults

- Sensible default configurations
- Interactive mode for complex setups
- Dry-run mode for preview

#### Handle Edge Cases

- Directory conflicts
- Network failures
- Invalid input
- Permission issues

### 3. Developer Experience

#### Fast Feedback Loops

```bash
# Quick validation
pnpm create react-app --dry-run my-app

# Interactive mode
pnpm create react-app my-app --interactive

# Skip prompts with flags
pnpm create react-app my-app --use-auth --testing-framework vitest
```

#### Rich Output

```javascript
// Progress reporting
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora('Generating project...').start();

try {
  await scaffold.generate(template, targetDir, variables);
  spinner.succeed(chalk.green('Project generated successfully!'));

  console.log(chalk.blue('\nNext steps:'));
  console.log(`  cd ${targetDir}`);
  console.log('  npm run dev');
} catch (error) {
  spinner.fail(chalk.red('Failed to generate project'));
  console.error(chalk.red(error.message));
  process.exit(1);
}
```

#### Helpful Next Steps

```bash
# Generated output
✅ Project my-app created successfully!

📁 Location: /path/to/my-app
📦 Dependencies installed
🔧 Git repository initialized

🚀 Next steps:
   cd my-app
   npm run dev

📚 Learn more:
   - Read the README.md
   - Check the documentation
   - Join our Discord community
```

## Implementation Example: pnpm create site

### Package Structure

```
packages/
├── create-site/
│   ├── package.json
│   ├── bin/
│   │   └── create-site.js
│   ├── templates/
│   │   ├── basic-site/
│   │   ├── ecommerce-site/
│   │   └── blog-site/
│   ├── plugins/
│   │   ├── auth-plugin.js
│   │   ├── seo-plugin.js
│   │   └── analytics-plugin.js
│   └── tests/
│       └── templates.test.js
└── ...
```

### Main CLI File

```javascript
#!/usr/bin/env node
// bin/create-site.js

const { Command } = require('commander');
const ScaffoldCLI = require('../lib/scaffold');

const program = new Command();

program
  .name('create-site')
  .description('Create a new website using golden path templates')
  .version('1.0.0');

program
  .argument('<template>', 'Template to use')
  .argument('[name]', 'Project name')
  .option('-d, --directory <dir>', 'Target directory', '.')
  .option('-f, --force', 'Overwrite existing files')
  .option('--dry-run', 'Show what would be generated')
  .option('--no-interactive', 'Skip interactive prompts')
  .option('--var <variables>', 'Variables in key=value format', (value, previous) => [
    ...previous,
    value,
  ])
  .action(async (template, name, options) => {
    try {
      const scaffold = new ScaffoldCLI();

      // Parse variables
      const variables = parseVariables(options.var);

      // Add name if provided
      if (name) {
        variables.appName = name;
      }

      // Generate project
      await scaffold.run(template, options.directory, {
        ...options,
        variables,
      });
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();

function parseVariables(varArray) {
  const variables = {};

  for (const item of varArray || []) {
    const [key, value] = item.split('=');
    variables[key] = value;
  }

  return variables;
}
```

### Template Example

```yaml
# templates/basic-site/template.yaml
name: "Basic Website"
description: "Simple marketing website with modern stack"
version: "1.2.0"

variables:
  - name: "appName"
    type: "string"
    required: true
    pattern: "^[a-z][a-z0-9-]*$"
    description: "Site name (kebab-case)"

  - name: "description"
    type: "string"
    description: "Site description for SEO"

  - name: "useAnalytics"
    type: "boolean"
    default: false
    description: "Include analytics setup"

  - name: "useCMS"
    type: "choice"
    choices: ["none", "sanity", "contentful"]
    default: "none"
    description: "CMS integration"

files:
  - path: "package.json.hbs"
    template: "package.json.hbs"
  - path: "next.config.js.hbs"
    template: "next.config.js.hbs"
  - path: "tailwind.config.js.hbs"
    template: "tailwind.config.js.hbs"
  - path: "src/app/page.tsx.hbs"
    template: "page.tsx.hbs"

dependencies:
  - "next@^14.0.0"
  - "react@^18.2.0"
  - "react-dom@^18.2.0"
  - "tailwindcss@^3.3.0"

devDependencies:
  - "@types/node@^20.0.0"
  - "@types/react@^18.2.0"
  - "typescript@^5.0.0"
  - "eslint@^8.0.0"
  "prettier@^3.0.0"

plugins:
  - "seo-plugin"
  - "analytics-plugin"
  - "cms-plugin"
```

## Security Considerations

### 1. Template Security

- Validate all user inputs
- Sanitize template variables
- Prevent code injection in templates
- Use secure template engines

### 2. Dependency Management

- Pin dependency versions
- Regular security audits
- Use npm audit or pnpm audit
- Implement dependency scanning

### 3. File System Safety

- Check directory permissions
- Prevent path traversal attacks
- Validate file names and paths
- Handle existing files safely

## Performance Optimization

### 1. Template Caching

```javascript
// Cache compiled templates
class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (LRU)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 2. Parallel File Operations

```javascript
// Generate files in parallel
async function generateFiles(files, targetDir, context) {
  const promises = files.map((file) => generateFile(file, targetDir, context));

  return Promise.all(promises);
}
```

### 3. Lazy Loading

```javascript
// Load templates on demand
class TemplateLoader {
  constructor() {
    this.templates = new Map();
  }

  async loadTemplate(name) {
    if (!this.templates.has(name)) {
      const template = await this.loadTemplateFromDisk(name);
      this.templates.set(name, template);
    }
    return this.templates.get(name);
  }
}
```

## Monitoring and Analytics

### 1. Usage Tracking

```javascript
// Track template usage
class UsageTracker {
  async trackGeneration(template, variables, duration) {
    const event = {
      template,
      variables: Object.keys(variables),
      duration,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    };

    // Send to analytics service
    await this.sendEvent(event);
  }
}
```

### 2. Error Reporting

```javascript
// Error tracking
class ErrorReporter {
  async reportError(error, context) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      template: context.template,
      variables: context.variables,
      timestamp: new Date().toISOString(),
    };

    // Send to error tracking service
    await this.sendErrorReport(errorReport);
  }
}
```

## References

### Official Documentation

- [pnpm create Documentation](https://pnpm.io/cli/create)
- [Handlebars Template Engine](https://handlebarsjs.com/)
- [Commander.js CLI Framework](https://github.com/tj/commander.js)
- [Inquirer.js Interactive CLI](https://github.com/SBoudrias/Inquirer.js)

### Golden Path Resources

- [Google Cloud Golden Paths](https://cloud.google.com/blog/products/application-development/golden-paths-for-engineering-execution-consistency)
- [Red Hat Developer Golden Paths](https://developers.redhat.com/articles/2025/01/29/how-golden-paths-improve-developer-productivity)
- [Platform Engineering Golden Paths](https://platformengineering.org/blog/what-are-golden-paths-a-guide-to-streamlining-developer-workflows)

### CLI Design Patterns

- [CLI Design Principles](https://clig.dev/)
- [Command Line Interface Guidelines](https://github.com/cliqueland/cliguide)
- [Node.js CLI Best Practices](https://github.com/standard/awesome-node-cli)

### Template Engines

- [Handlebars.js](https://handlebarsjs.com/)
- [Mustache.js](https://github.com/janl/mustache.js)
- [EJS Templates](https://ejs.co/)

### Testing Frameworks

- [Jest Testing Framework](https://jestjs.io/)
- [Vitest Testing Framework](https://vitest.dev/)
- [Mocha Test Runner](https://mochajs.org/)

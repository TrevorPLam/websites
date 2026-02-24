# 🛠️ Tooling

> **Development tools and CLI utilities for the marketing websites platform**

This directory contains development tools, CLI utilities, and automation scripts that support the development, building, and maintenance of the marketing websites platform.

---

## 📁 Tooling Structure

```
tooling/
├── create-client/            # Client scaffolding CLI
├── create-site/              # Site generation CLI
├── generate-component/        # Component generation tool
└── validation/               # Quality assurance tools
```

---

## 🎯 Tooling Overview

### **🏗️ Create Client** (`tooling/create-client/`)

**Purpose**: CLI tool for scaffolding new client sites

**Key Features**:

- Interactive client setup wizard
- Template-based site generation
- Configuration file creation
- Workspace integration
- Validation and conflict detection

**Usage**:

```bash
# Create new client
pnpm create-client client-name

# Interactive mode with prompts
pnpm create-client --interactive

# Use specific template
pnpm create-client --template enterprise
```

**Generated Structure**:

```
clients/client-name/
├── app/                     # Next.js application
├── content/                 # Client content
├── site.config.ts          # Client configuration
├── package.json            # Client dependencies
└── README.md               # Client documentation
```

---

### **🌐 Create Site** (`tooling/create-site/`)

**Purpose**: Advanced site generation with custom configurations

**Key Features**:

- Site architecture generation
- Multi-tenant configuration
- Feature selection and setup
- Integration configuration
- Deployment preparation

**Usage**:

```bash
# Create new site with default configuration
pnpm create-site site-name

# Create site with specific features
pnpm create-site --features booking,analytics,billing

# Create enterprise site
pnpm create-site --template enterprise --domain client.com
```

**Configuration Options**:

- **Features**: booking, analytics, billing, scheduling
- **Templates**: basic, professional, enterprise
- **Integrations**: stripe, hubspot, calcom, resend
- **Security**: oauth, rls, rate-limiting

---

### **🧩 Generate Component** (`tooling/generate-component/`)

**Purpose**: Component generation with FSD compliance

**Key Features**:

- FSD layer-aware component generation
- TypeScript template generation
- Test file creation
- Storybook documentation
- Accessibility compliance

**Usage**:

```bash
# Generate basic component
pnpm generate-component Button

# Generate FSD component in specific layer
pnpm generate-component BookingWidget --layer widgets

# Generate component with tests and stories
pnpm generate-component UserCard --with-tests --with-stories
```

**Generated Files**:

```
packages/ui/src/entities/UserCard/
├── UserCard.tsx             # Component implementation
├── UserCard.test.tsx        # Unit tests
├── UserCard.stories.tsx     # Storybook stories
├── UserCard.types.ts        # TypeScript types
└── index.ts                # Export file
```

---

### **✅ Validation** (`tooling/validation/`)

**Purpose**: Quality assurance and validation tools

**Key Features**:

- Configuration validation
- FSD compliance checking
- Package dependency validation
- Security vulnerability scanning
- Performance analysis

**Usage**:

```bash
# Validate all configurations
pnpm validate-config

# Check FSD compliance
pnpm validate-fsd

# Validate package dependencies
pnpm validate-deps

# Security vulnerability scan
pnpm validate-security

# Performance analysis
pnpm validate-performance
```

---

## 🚀 Getting Started

### **Installation**

```bash
# Install all tooling dependencies
pnpm install

# Install specific tool
pnpm --filter @repo/create-client install
```

### **Development Commands**

```bash
# Build all tools
pnpm build

# Build specific tool
pnpm --filter @repo/create-client build

# Test all tools
pnpm test

# Test specific tool
pnpm --filter @repo/create-client test

# Lint all tools
pnpm lint

# Type check all tools
pnpm type-check
```

---

## 🔧 Development Guidelines

### **Tool Standards**

- **TypeScript**: Strict mode enabled
- **CLI Standards**: Consistent command patterns
- **Error Handling**: Graceful error handling with helpful messages
- **Documentation**: Comprehensive help and usage examples
- **Testing**: >80% coverage required

### **CLI Design Patterns**

- **Commander.js**: For CLI interface
- **Inquirer.js**: For interactive prompts
- **Chalk**: For colored output
- **Ora**: For loading spinners
- **Table**: For formatted output

### **Template Standards**

- **Handlebars**: For template rendering
- **TypeScript**: For type-safe templates
- **FSD Compliance**: Follow FSD architecture
- **2026 Standards**: Latest best practices
- **Accessibility**: WCAG 2.2 AA compliance

---

## 📊 Tooling Metrics

### **Usage Analytics**

- **Client Creation**: Track new client generation
- **Component Generation**: Monitor component creation patterns
- **Validation Results**: Track validation outcomes
- **Error Rates**: Monitor tool reliability

### **Performance Metrics**

- **Execution Time**: Tool performance benchmarks
- **Memory Usage**: Resource consumption monitoring
- **Success Rate**: Tool success and failure rates
- **User Satisfaction**: Developer feedback collection

---

## 🔗 Integration Examples

### **Create Client Integration**

```typescript
// In create-client tool
import { generateClient } from '@repo/create-client';
import { validateConfig } from '@repo/validation';
import { setupWorkspace } from '@repo/workspace-utils';

async function createClient(name: string, options: ClientOptions) {
  // Validate client name
  await validateClientName(name);

  // Generate client structure
  const client = await generateClient(name, options);

  // Validate configuration
  await validateConfig(client.config);

  // Setup workspace
  await setupWorkspace(client);

  return client;
}
```

### **Component Generation Integration**

```typescript
// In generate-component tool
import { generateComponent } from '@repo/generate-component';
import { validateFSD } from '@repo/validation';
import { createTests } from '@repo/test-utils';

async function generateComponent(name: string, layer: FSDDLayer) {
  // Validate FSD layer
  await validateFSD(layer);

  // Generate component
  const component = await generateComponent(name, layer);

  // Create tests
  await createTests(component);

  // Create stories
  await createStories(component);

  return component;
}
```

### **Validation Integration**

```typescript
// In validation tool
import { validateConfig } from '@repo/validation';
import { checkFSD } from '@repo/fsd-validator';
import { scanSecurity } from '@repo/security-scanner';

async function validateAll() {
  const results = await Promise.all([validateConfig(), checkFSD(), scanSecurity()]);

  return results;
}
```

---

## 🧪 Testing Strategy

### **Test Types**

- **Unit Tests**: Tool function testing
- **Integration Tests**: Tool interaction testing
- **CLI Tests**: Command-line interface testing
- **Template Tests**: Template rendering testing

### **Testing Commands**

```bash
# Run all tool tests
pnpm test

# Test specific tool
pnpm --filter @repo/create-client test

# Test CLI interface
pnpm test:cli

# Test templates
pnpm test:templates
```

### **Coverage Requirements**

- **Statements**: >80%
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%

---

## 📚 Documentation

### **Tool Documentation**

Each tool must include:

- **README.md**: Tool overview and usage
- **CLI Help**: Command help and examples
- **API Documentation**: Function documentation
- **Examples**: Usage examples and patterns

### **Documentation Standards**

- **Markdown Format**: Consistent markdown formatting
- **Code Examples**: Syntax-highlighted code blocks
- **CLI Examples**: Command-line usage examples
- **Troubleshooting**: Common issues and solutions

---

## 🚀 Publishing

### **Internal Tools**

- **Workspace Publishing**: Publish to internal registry
- **Version Management**: Semantic versioning
- **Change Logs**: Automated changelog generation
- **Release Notes**: Comprehensive release notes

### **External Tools**

- **NPM Publishing**: Public package publishing
- **Documentation Sites**: GitHub Pages deployment
- **CI/CD Integration**: Automated publishing pipeline
- **Release Automation**: Automated release process

---

## 🤝 Contributing

### **Tool Development**

1. **Create Tool Directory**: Follow tooling structure
2. **Implement Tool**: Follow development guidelines
3. **Add Tests**: Comprehensive test coverage
4. **Document**: Complete documentation
5. **Submit PR**: Pull request for review

### **Code Review**

- **CLI Standards**: Command-line interface compliance
- **Error Handling**: Graceful error handling
- **Documentation**: Complete and accurate documentation
- **Testing**: Adequate test coverage
- **Performance**: Efficient execution

---

## 📞 Support

### **Getting Help**

- **Tool Help**: Use `--help` flag with any tool
- **Documentation**: Check tool-specific README files
- **Issues**: Create GitHub issue with tooling tag
- **Discussions**: Use GitHub Discussions for questions

### **Troubleshooting**

- **Permission Issues**: Check file permissions
- **Node Version**: Ensure compatible Node.js version
- **Dependencies**: Check package dependencies
- **Configuration**: Verify tool configuration

---

## 📈 Future Enhancements

### **Planned Improvements**

- **AI Integration**: AI-powered tool assistance
- **Web Interface**: Web-based tool interface
- **Plugin System**: Extensible plugin architecture
- **Performance Optimization**: Faster tool execution
- **Enhanced Templates**: More template options

### **Technology Roadmap**

- **Bun Runtime**: Bun runtime support
- **Deno Support**: Deno compatibility
- **WebAssembly**: WASM-based tools
- **Cloud Integration**: Cloud-based tool execution
- **Mobile Support**: Mobile tool interfaces

---

_Tooling is designed to streamline development workflows, ensure consistency, and maintain high quality standards across the marketing websites platform._

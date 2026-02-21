---
diataxis: tutorial
audience: user
last_reviewed: 2026-02-19
review_interval_days: 90
project: marketing-websites
description: Getting started with the marketing-websites platform
tags: [getting-started, setup, installation, beginner]
primary_language: typescript
---

# Getting Started

Welcome to the marketing-websites platform! This guide will help you get up and running quickly, whether you're a developer, designer, or product manager.

## 🎯 What You'll Learn

- **Environment Setup** - Install and configure your development environment
- **First Project** - Create your first client website
- **Basic Concepts** - Understand the platform architecture
- **Development Workflow** - Learn daily development practices

## 🚀 Quick Start (15 Minutes)

If you're experienced with web development and want to get started quickly:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/marketing-websites.git
cd marketing-websites

# 2. Install dependencies
pnpm install

# 3. Copy the starter template
cp -r clients/starter-template clients/my-first-site

# 4. Configure your site
cd clients/my-first-site
cp .env.example .env.local
# Edit .env.local with your configuration

# 5. Start development
pnpm dev --port 3001

# 6. Open your browser
# Navigate to http://localhost:3001
```

## 📋 Prerequisites

Before you begin, ensure you have:

### Required Software

| Software    | Minimum Version | Recommended | Purpose             |
| ----------- | --------------- | ----------- | ------------------- |
| **Node.js** | >=22.0.0        | Latest      | Runtime environment |
| **pnpm**    | 10.29.2         | Latest      | Package manager     |
| **Git**     | 2.30.0          | Latest      | Version control     |

### Verification

```bash
# Check Node.js version
node --version  # Should be v22.0.0 or higher

# Check pnpm version
pnpm --version  # Should be 10.29.2 or higher

# Check Git version
git --version  # Should be 2.30.0 or higher
```

⚠️ **Important:** Node.js version >=22.0.0 is **strictly enforced** by the repository's `package.json` `engines` field. Lower versions will not install dependencies.

### Recommended Tools

- **VS Code** - Code editor with excellent TypeScript support
- **GitHub Desktop** - Git GUI for visual repository management
- **Chrome DevTools** - Browser development tools

## 🛠️ Environment Setup

### Step 1: Install Node.js

**Using nvm (Recommended):**

```bash
# Install Node.js 24 (latest LTS)
nvm install 24
nvm use 24
nvm alias default 24
```

**Direct Download:**

- Visit [nodejs.org](https://nodejs.org/)
- Download the LTS version for your operating system
- Run the installer and follow the prompts

### Step 2: Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm@10.29.2

# Verify installation
pnpm --version
```

### Step 3: Install Git

**Windows:**

- Download from [git-scm.com](https://git-scm.com/)
- Run the installer with default options

**macOS:**

```bash
# Using Homebrew
brew install git
```

**Linux:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install git
```

### Step 4: Configure VS Code (Optional)

Install these recommended extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

## 📦 Repository Setup

### Step 1: Clone the Repository

```bash
# Clone using HTTPS
git clone https://github.com/your-org/marketing-websites.git
cd marketing-websites

# Or using SSH (if you have SSH keys set up)
git clone git@github.com:your-org/marketing-websites.git
cd marketing-websites
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install

# Verify installation
pnpm --version
```

### Step 3: Environment Configuration

```bash
# Copy environment example
cp .env.example .env.local

# Edit environment variables
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3001
# Add other required variables as needed
```

### Step 4: Verify Setup

```bash
# Run all quality checks
pnpm lint
pnpm type-check
pnpm test
pnpm build

# All commands should pass without errors
```

## 🏗️ Your First Project

### Step 1: Create a New Client

```bash
# Copy the starter template
cp -r clients/starter-template clients/my-first-site

# Navigate to your client directory
cd clients/my-first-site
```

### Step 2: Configure Your Site

Edit `site.config.ts` to customize your site:

```typescript
export const siteConfig = {
  siteName: 'My First Website',
  description: 'A professional website built with marketing-websites',
  theme: {
    primaryColor: '174 100% 26%', // Blue
    secondaryColor: '210 100% 23%', // Purple
    accentColor: '346 100% 50%', // Green
  },
  features: {
    hero: true,
    services: true,
    contact: true,
    booking: false, // Disable for now
    blog: false, // Disable for now
  },
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  contact: {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
  },
  seo: {
    title: 'My First Website | Professional Services',
    description: 'Professional services website built with modern web technologies',
    siteUrl: 'https://my-first-site.com',
  },
};
```

### Step 3: Start Development

```bash
# Start the development server
pnpm dev --port 3001

# Open your browser
# Navigate to http://localhost:3001
```

### Step 4: Make Your First Changes

1. **Edit the homepage** - Open `app/page.tsx`
2. **Update navigation** - Modify the `navLinks` in `site.config.ts`
3. **Add content** - Create new pages in the `app/` directory
4. **See changes** - The browser will automatically reload

## 🔧 Development Workflow

### Daily Development

```bash
# Start development server
pnpm dev

# Check code quality
pnpm lint

# Run tests
pnpm test

# Type checking
pnpm type-check

# Build for production
pnpm build
```

### Working with Packages

```bash
# Work on UI package
cd packages/ui
pnpm dev

# Work on features package
cd packages/features
pnpm dev

# Run package-specific commands
pnpm --filter @repo/ui lint
pnpm --filter @repo/features test
```

### Client Development

```bash
# Navigate to client directory
cd clients/my-first-site

# Client-specific commands
pnpm dev
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

## 🧪 Testing Your Setup

### Verify Everything Works

```bash
# 1. Check that the development server starts
pnpm dev

# 2. Verify the site loads in browser
# Open http://localhost:3001

# 3. Test code quality
pnpm lint
pnpm type-check

# 4. Run tests
pnpm test

# 5. Build for production
pnpm build
```

### Common Issues and Solutions

**Installation Problems:**

```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

**Build Errors:**

```bash
# Clear build cache
pnpm clean
pnpm build
```

**TypeScript Errors:**

```bash
# Clear TypeScript cache
pnpm type-check --clearCache
```

## 🎯 Next Steps

Now that you're set up, explore these resources:

### Learn the Platform

- [**Architecture Overview**](../4-explanation/architecture/) - Understand the system design
- [**Configuration Guide**](../3-reference/configuration/) - Master site.config.ts
- [**Component Library**](../3-reference/components/) - Use UI components

### Build Your Skills

- [**Component Development**](../2-guides/component-development/) - Create reusable components
- [**Feature Integration**](../2-guides/feature-integration/) - Add business features
- [**Custom Templates**](../5-tutorials/custom-templates/) - Build industry-specific templates

### Join the Community

- [**GitHub Discussions**](https://github.com/your-org/marketing-websites/discussions) - Ask questions
- [**Contributing Guide**](../../CONTRIBUTING.md) - Contribute to the platform
- [**Support Documentation**](../../SUPPORT.md) - Get help from the team

## 🆘 Getting Help

### Quick Questions

- **FAQ** - [Common questions and answers](../2-guides/faq/)
- **Troubleshooting** - [Solve common problems](../2-guides/troubleshooting/)
- **Glossary** - [Understand terminology](../3-reference/glossary/)

### Community Support

- **GitHub Issues** - Report bugs and request features
- **GitHub Discussions** - Ask questions and share ideas
- **Slack/Discord** - Real-time community chat (if available)

### Professional Support

- **Email Support** - Contact the team directly
- **Consulting** - Get expert help with your project
- **Training** - Schedule team training sessions

---

_Ready to build amazing marketing websites? Let's get started!_ 🚀

_Last updated: 2026-02-19 | Review interval: 90 days_

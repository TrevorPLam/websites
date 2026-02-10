<!--
/**
 * @file README.md
 * @role docs
 * @summary Root project overview and quickstart instructions.
 *
 * @entrypoints
 * - First-stop documentation for users and contributors
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - N/A
 *
 * @used_by
 * - Developers and operators
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: repository configuration and tooling
 * - outputs: onboarding guidance
 *
 * @invariants
 * - Version claims must match package.json files
 *
 * @gotchas
 * - Quickstart commands are UNVERIFIED until executed
 *
 * @issues
 * - [severity:med] Contains unverified claims without file references.
 *
 * @opportunities
 * - Add evidence links for all tool versions and commands
 *
 * @verification
 * - TODO(verify): Run commands in docs/TESTING_STATUS.md and update this file
 *
 * @status
 * - confidence: medium
 * - last_audited: 2026-02-09
 */
-->

# Hair Salon Template

## Audit Status (PARTIAL)

- Verified: Node/pnpm requirements are defined in [package.json](package.json).
- Verified: Next.js and React versions are defined in [apps/web/package.json](apps/web/package.json).
- All other statements below are UNVERIFIED until audited and linked to source files.

Professional hair salon website template monorepo built with modern web technologies.

## Quick Start

### Prerequisites

- **Node.js** `>=20.0.0`
- **pnpm** `10.29.2` (enforced)

### Installation

```bash
# Install dependencies (pnpm required)
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Application runs on http://localhost:3000
```

### Building

```bash
# Build all packages
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format

# Check formatting (without changes)
pnpm format:check
```

## Project Structure

```
├── apps/
│   └── web/                 # Next.js 15 web application
├── packages/
│   ├── ui/                  # Shared React UI components
│   ├── utils/               # Shared utilities
│   └── config/              # Shared configurations (TS, ESLint)
├── docs/                    # Documentation
├── infrastructure/          # Deployment and infrastructure
└── scripts/                 # Utility scripts
```

## Technology Stack

- **Frontend Framework:** Next.js 15.1.6
- **UI Library:** React 19.0.0
- **Styling:** Tailwind CSS 3.4.17
- **Type Safety:** TypeScript 5.7.2
- **Linting:** ESLint 9 (flat config)
- **Code Formatting:** Prettier 3.2.5
- **Package Manager:** pnpm 10.29.2
- **Monorepo Tool:** Turbo 2.2.3
- **Error Tracking:** Sentry 8.0.0
- **Container:** Docker & Docker Compose

## Documentation

- **[CONFIG.md](CONFIG.md)** - Detailed configuration documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and setup
- **[docs/TEMPLATE_SETUP.md](docs/TEMPLATE_SETUP.md)** - Template setup and integration guide
- **[docs/INTEGRATION_GUARDRAILS.md](docs/INTEGRATION_GUARDRAILS.md)** - Consent, performance, and tracking guardrails
- **[SECURITY.md](SECURITY.md)** - Security policy

### Task Management

This repository uses a structured workflow to maintain quality:

- **[docs/TASK_WORKFLOW.md](docs/TASK_WORKFLOW.md)** - Complete workflow documentation
- **[docs/DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)** - Quality checklist
- **[TODO.md](TODO.md)** - Active tasks
- **[BACKLOG.md](BACKLOG.md)** - Task queue
- **[ARCHIVE.md](ARCHIVE.md)** - Completed tasks with notes

## Available Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Start development server         |
| `pnpm build`        | Build all packages and apps      |
| `pnpm start`        | Start production server          |
| `pnpm lint`         | Run ESLint across workspace      |
| `pnpm type-check`   | Run TypeScript type checking     |
| `pnpm test`         | Run tests                        |
| `pnpm format`       | Format code with Prettier        |
| `pnpm format:check` | Check formatting without changes |

## Docker

Build and run locally with Docker Compose:

```bash
docker-compose up -d
```

Application will be available at `http://localhost:3000`

## Contributing

Before contributing, please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Setting up development environment
- Code standards and style
- Making and submitting changes
- Pull request process

## License

MIT License - See [LICENSE](LICENSE) for details.

## Support

For issues, questions, or suggestions:

1. Check [CONFIG.md](CONFIG.md) for configuration troubleshooting
2. Review [CONTRIBUTING.md](CONTRIBUTING.md) for setup help
3. Open a GitHub issue with details

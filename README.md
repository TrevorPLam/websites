# Hair Salon Template

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
- **Container:** Docker & Docker Compose

## Documentation

- **[CONFIG.md](CONFIG.md)** - Detailed configuration documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and setup
- **[docs/TEMPLATE_SETUP.md](docs/TEMPLATE_SETUP.md)** - Template setup and integration guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[Security.md](SECURITY.md)** - Security policy

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

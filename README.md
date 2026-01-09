# Your Dedicated Marketer

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)
![Diamond Standard](https://img.shields.io/badge/Standard-Diamond-b91c1c)

A high-performance, edge-ready marketing platform template built for speed, SEO, and maintainability. Designed to be the "Diamond Standard" for modern web development agencies.

---

## 💎 The Diamond Standard

This repository adheres to a strict "Diamond Standard" of engineering excellence, ensuring that every deployment is:

*   **Secure by Design**: CSP headers, strict input validation (Zod), and secret scanning.
*   **Edge Native**: Optimized for the Cloudflare Pages Edge Runtime.
*   **Type Safe**: 100% TypeScript coverage with strict mode enabled.
*   **Observable**: Integrated Sentry monitoring and comprehensive logging.
*   **AI-Ready**: Structured specifically for effective collaboration with AI coding agents (`AGENTS.md`, `READMEAI.md`).

## 🚀 Key Features

*   **Next.js App Router**: Utilizing the latest React Server Components architecture (version 15.5.9, compatible with Cloudflare Pages adapter).
*   **Content Engine**: MDX-powered blog and case studies with static generation.
*   **Client-Side Search**: Zero-latency, pre-indexed search functionality (`lib/search.ts`).
*   **Performance First**: 
    *   Tailwind CSS for zero-runtime styling.
    *   Automatic image optimization.
    *   Static Site Generation (SSG) for core pages.
*   **Developer Experience**:
    *   Vitest for unit testing.
    *   Playwright for E2E testing.
    *   ESLint (Flat Config) & Prettier for code quality.
    *   Dev Container support for consistent environments.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | React meta-framework (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static typing and reliability |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight icons |
| **Validation** | [Zod](https://zod.dev/) | Schema validation for forms/env vars |
| **Testing** | [Vitest](https://vitest.dev/) / [Playwright](https://playwright.dev/) | Unit & End-to-End testing |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com/) | Global edge hosting |
| **Analytics** | [Sentry](https://sentry.io/) | Error tracking and performance monitoring |

## ⚡ Quick Start

### Prerequisites
*   Node.js 20+ (v20-v22 recommended)
*   npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/TrevorPLam/Your-Dedicated-Marketer.git

# Enter directory
cd Your-Dedicated-Marketer

# Install dependencies (legacy peer deps required for Cloudflare adapter)
npm install --legacy-peer-deps
```

### Local Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Verification

Run the full suite of "Diamond Standard" checks:

```bash
# Run unit tests
npm run test

# Run type check
npm run type-check

# Run linting
npm run lint

# Run full project audit
./scripts/check.sh
```

## 🌍 Deployment

This project is configured for **Cloudflare Pages**.

### Build Command
The build process uses `@cloudflare/next-on-pages` to adapt the Next.js output for the Edge Runtime.

```bash
npm run pages:build
```

**Output Directory:** `.vercel/output/static`

**Environment Variables:**
*   `NODE_VERSION`: `20`
*   Other secrets as defined in `.env.example`

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and API routes
├── components/           # React components (Atomic design principles)
│   ├── ui/               # Reusable base UI components
│   └── ...               # Feature-specific components
├── content/              # MDX content sources (Blog, Case Studies)
├── docs/                 # Project documentation and standards
├── lib/                  # Utilities, hooks, and core logic
├── public/               # Static assets
├── scripts/              # Maintenance and verification scripts
└── tests/                # Additional test configurations
```

## 🤖 AI Agent Instructions

If you are an AI coding assistant working on this repo, **YOU MUST READ**:

1.  [`AGENTS.md`](AGENTS.md) - Operational guidelines and cost control.
2.  [`CODEBASECONSTITUTION.md`](CODEBASECONSTITUTION.md) - The supreme laws of the repo.
3.  [`TODO.md`](TODO.md) - The single source of truth for tasks.

**Do not deviate from `TODO.md` without human approval.**

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

*maintained by Your Dedicated Marketer Team*

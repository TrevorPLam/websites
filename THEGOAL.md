# Marketing Website Monorepo — The Goal Architecture

**What the repository looks like when the evolution is complete.** Each line is annotated with the task ID that creates or modifies it. The end state is achieved via **evolutionary phases** (26-week Strangler Fig path) — see [NEW.md](NEW.md) and [docs/architecture/evolution-roadmap.md](docs/architecture/evolution-roadmap.md).

---

```
marketing-websites/                          # Root — pnpm monorepo
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  ROOT CONFIG (Wave 0 cleaned)                                      ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── .changeset/                              # [0.12] Changesets versioning
│   └── config.json                          #   Release channel config (stable + canary)
│
├── .env.example                             # [0.15] Updated: NEXT_PUBLIC_SENTRY_DSN (not SENTRY_DSN)
├── .env.production.local.example            # [0.32] NEW — Docker deploy env reference
│
├── .github/
│   └── workflows/
│       ├── ci.yml                           # [0.13] Strengthened: lint + type-check + test + build + affected
│       ├── release.yml                      # [0.12] Changeset release automation
│       ├── release-canary.yml               # [C.4]  Canary pre-release channel
│       ├── visual-regression.yml            # [C.7]  Storybook visual regression checks
│       ├── security-sast.yml                # [C.13] SAST scanning
│       ├── secret-scan.yml                  # [C.13] Updated: continuous scanning
│       ├── sbom-generation.yml              # [D.8]  SBOM supply-chain artifact
│       └── dependency-integrity.yml         # [D.8]  Dependency provenance checks
│
├── .githooks/                               # Pre-existing — git hooks
│
├── .npmrc                                   # [0.1] FIXED: node-linker line REMOVED
├── .pnpmrc                                  # [0.1] Authoritative: node-linker=pnpm
├── .syncpackrc.json                         # [0.18] NEW — version consistency rules
│
├── .prettierrc                              # Pre-existing
├── .prettierignore                          # Pre-existing
├── .editorconfig                            # Pre-existing
├── .gitignore                               # Pre-existing
├── .dockerignore                            # Pre-existing
├── .eslintignore                            # Pre-existing
├── .markdownlint.json                       # Pre-existing
│
├── docker-compose.yml                       # Pre-existing (refs .env.production.local.example now)
├── jest.config.js                           # [0.8] Updated: @repo/shared → @repo/types mapping
├── jest.setup.js                            # Pre-existing
│
├── knip.config.ts                           # [0.17] NEW — dead code/dependency detection config
├── package.json                             # [0.2][0.3][0.28] Synced workspaces, Turbo latest, node >=22
├── pnpm-lock.yaml                           # Auto-generated
├── pnpm-workspace.yaml                      # [0.27] All packages use catalog: protocol
│
├── renovate.json                            # Pre-existing (consider rename to .renovaterc for JSONC)
├── tsconfig.base.json                       # Pre-existing
├── tsconfig.json                            # Pre-existing
│
├── turbo.json                               # [0.3][0.29] Upgraded config + globalEnv added
│
├── TASKS.md                                 # Execution tracking (consolidated tasks, specs, research)
├── THEGOAL.md                               # This file — target architecture reference
├── README.md                                # [6.3] Updated with final architecture diagram
├── CONTRIBUTING.md                          # [0.32] Updated with Docker section
├── SECURITY.md                              # Pre-existing
├── LICENSE                                  # Pre-existing
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  SCRIPTS — Automation, validation, health checks                   ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── scripts/
│   ├── validate-exports.ts                  # [0.19] Verifies package.json exports → real files
│   ├── validate-client.ts                   # [5.1]  Config schema + route + metadata smoke check
│   ├── health-check.ts                      # [INNOV-3] Single `pnpm health` command
│   │
│   ├── architecture/
│   │   └── check-dependency-graph.ts        # [C.1]  Circular dep + layer violation checks
│   │
│   ├── ci/
│   │   └── report-cache-hit-rate.ts         # [C.3]  Turbo remote cache effectiveness metrics
│   │
│   ├── governance/
│   │   └── validate-schema-versioning.ts    # [D.1]  Schema version compatibility checks
│   │
│   ├── perf/
│   │   └── validate-budgets.ts              # [C.14] Performance budget CI gate
│   │
│   ├── reliability/
│   │   └── check-error-budget.ts            # [E.3]  Error-budget release gate logic
│   │
│   ├── strategy/
│   │   └── calculate-leverage-score.ts      # [F.3]  Leverage-point prioritization scoring
│   │
│   └── operations/
│       └── spc-control-charts.ts            # [F.8]  Delivery quality monitoring
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  TURBO GENERATORS — Client scaffolding factory                     ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── turbo/
│   └── generators/
│       └── config.ts                        # [5.1] `turbo gen new-client` — Plop-based scaffolding
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  PACKAGES — Shared libraries (Layer 0-2)                           ║
│  ║  Dependency direction: config → utils → ui/infra → types           ║
│  ║                        → features → marketing-components           ║
│  ║                        → page-templates → clients                  ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── packages/
│   │
│   │  ── CONFIG LAYER ──────────────────────────────────────────────────
│   │
│   ├── config/
│   │   ├── eslint-config/                   # Pre-existing — shared ESLint rules
│   │   │   └── ...                          # [0.11] Updated: monorepo boundary enforcement rules
│   │   │
│   │   ├── typescript-config/               # Pre-existing — shared tsconfig
│   │   │   └── ...
│   │   │
│   │   ├── tailwind-preset.js               # Pre-existing (or CSS-based if Tailwind v4 adopted)
│   │   │
│   │   └── tokens/                          # [C.5] NEW — Three-layer design token architecture
│   │       ├── option-tokens.css            #   Raw values: colors, spacing, type scales
│   │       ├── decision-tokens.css          #   Semantic aliases: --color-primary, --space-page
│   │       └── component-tokens.css         #   Component-specific: --button-bg, --card-radius
│   │
│   │  ── UTILITIES LAYER ──────────────────────────────────────────────
│   │
│   ├── utils/                               # Pre-existing — cn(), class merging
│   │   ├── src/
│   │   │   └── index.ts                     #   Canonical cn() — all imports point here now [0.21]
│   │   └── package.json
│   │
│   │  ── TYPES LAYER (was @repo/shared) ───────────────────────────────
│   │
│   ├── types/                               # [0.8] Shared types package — SiteConfig, industry, integration contracts
│   │   ├── src/
│   │   │   ├── index.ts                     #   Barrel export for all types
│   │   │   ├── site-config.ts               # [1.8] EXTENDED: +industry, +features, +integrations, +theme
│   │   │   ├── site-config.schema.ts        # [1.8] NEW — Zod runtime validator companion
│   │   │   ├── industry.ts                  # [1.9] Industry union type + IndustryConfig interface
│   │   │   ├── industry-configs.ts          # [1.9] Defaults for all 12 industries
│   │   │   └── compliance-packs.ts          # [C.17] Industry compliance overlays
│   │   ├── package.json                     #   @repo/types (renamed from @repo/shared)
│   │   └── tsconfig.json
│   │
│   │  ── UI PRIMITIVES LAYER ──────────────────────────────────────────
│   │
│   ├── ui/                                  # Pre-existing @repo/ui — atomic design system
│   │   ├── src/
│   │   │   ├── index.ts                     #   Barrel export (all 14+ components)
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── Accordion.tsx            #   Pre-existing
│   │   │   │   ├── Button.tsx               #   Pre-existing (CVA pattern reference)
│   │   │   │   ├── Card.tsx                 #   Pre-existing
│   │   │   │   ├── Container.tsx            #   Pre-existing
│   │   │   │   ├── Input.tsx                #   Pre-existing
│   │   │   │   ├── Section.tsx              #   Pre-existing
│   │   │   │   ├── Select.tsx               #   Pre-existing
│   │   │   │   ├── Textarea.tsx             #   Pre-existing
│   │   │   │   │
│   │   │   │   ├── Dialog.tsx               # [1.1] NEW — Modal/lightbox (Radix, focus trap, ESC)
│   │   │   │   ├── Toast.tsx                # [1.2] NEW — Notification banners (wraps sonner)
│   │   │   │   ├── Toaster.tsx              # [1.2] NEW — Toast container/host
│   │   │   │   ├── Tabs.tsx                 # [1.3] NEW — Tabbed content (Radix, roving focus)
│   │   │   │   ├── DropdownMenu.tsx         # [1.4] NEW — Action menus (nested, keyboard nav)
│   │   │   │   ├── Tooltip.tsx              # [1.5] NEW — Hover/focus help text
│   │   │   │   ├── Popover.tsx              # [1.6] NEW — Rich interactive overlays
│   │   │   │   ├── ThemeInjector.tsx        # [0.14] NEW — CSS vars from site.config theme
│   │   │   │   ├── ProgressStepper.tsx      # [E.6] Progressive conversion UX primitive
│   │   │   │   └── StepConfidenceHint.tsx   # [E.6] Decision support in multi-step forms
│   │   │   │
│   │   │   ├── motion/                      # [C.6] NEW — Animation primitives
│   │   │   │   ├── primitives.ts            #   Entrance, emphasis, page transition helpers
│   │   │   │   └── presets.ts               #   Named presets: fadeIn, slideUp, etc.
│   │   │   │
│   │   │   └── feedback/                    # [E.1][F.12] NEW — Loading and recovery states
│   │   │       ├── loading-patterns.ts      #   Latency-band response behavior
│   │   │       └── recovery-states.ts       #   Trust recovery after failures
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   │  ── INFRASTRUCTURE LAYER ─────────────────────────────────────────
│   │
│   ├── infra/                               # Pre-existing @repo/infra
│   │   ├── index.ts                         #   Barrel export (14 export paths)
│   │   ├── index.client.ts                  #   Client-safe exports
│   │   │
│   │   ├── context/                         #   Pre-existing — request context
│   │   ├── logger/
│   │   │   └── index.ts                     #   [0.15] Uses NEXT_PUBLIC_SENTRY_DSN consistently
│   │   │
│   │   ├── middleware/
│   │   │   └── create-middleware.ts          # [0.10] Export path FIXED to match filesystem
│   │   │
│   │   ├── security/
│   │   │   ├── csp.ts                       #   Pre-existing — CSP + nonce
│   │   │   └── rate-limit.ts                #   Pre-existing (Upstash, dynamic import)
│   │   │
│   │   ├── sentry/
│   │   │   ├── client.ts                    #   [0.15] NEXT_PUBLIC_SENTRY_DSN consistent
│   │   │   └── server.ts                    #   [0.15] NEXT_PUBLIC_SENTRY_DSN consistent
│   │   │
│   │   ├── env/
│   │   │   ├── validate.ts                  #   Pre-existing — env validation runner
│   │   │   ├── schemas/
│   │   │   │   ├── base.ts                  #   Pre-existing
│   │   │   │   ├── booking.ts               #   Pre-existing
│   │   │   │   ├── hubspot.ts               #   Pre-existing
│   │   │   │   ├── public.ts                #   Pre-existing
│   │   │   │   ├── rate-limit.ts            #   Pre-existing
│   │   │   │   ├── sentry.ts                # [0.15] FIXED: validates NEXT_PUBLIC_SENTRY_DSN
│   │   │   │   └── supabase.ts              #   Pre-existing
│   │   │   └── __tests__/                   #   Pre-existing
│   │   │
│   │   ├── experiments/                     # [C.8] NEW — Experimentation platform
│   │   │   ├── feature-flags.ts             #   Deterministic flag evaluation + kill-switch
│   │   │   ├── ab-testing.ts                #   Variant assignment + exposure logging
│   │   │   ├── guardrails.ts                # [D.2] SRM checks, minimum run validation
│   │   │   └── __tests__/
│   │   │       └── guardrails.test.ts
│   │   │
│   │   ├── edge/                            # [C.18] NEW — Edge middleware primitives
│   │   │   └── tenant-experiment-context.ts #   Edge variant selection + cache-safe keys
│   │   │
│   │   ├── ops/                             # [E.7] NEW — Operational governance
│   │   │   └── queue-policy.ts              #   Queue fairness, retry budgets, timeout rules
│   │   │
│   │   ├── __tests__/                       #   Pre-existing (9 test files)
│   │   │   └── security-regression/         # [C.13] NEW — SSRF/XSS/injection scenarios
│   │   │
│   │   └── package.json                     # [0.9] FIXED: zod→deps, upstash→peerDeps
│   │
│   │  ── MARKETING COMPONENTS LAYER ───────────────────────────────────
│   │
│   ├── marketing-components/                # [1.7] NEW — Marketing-specific UI components
│   │   ├── src/
│   │   │   ├── index.ts                     #   Barrel: all 10 component families
│   │   │   │
│   │   │   ├── hero/                        # [2.1] 4 variants
│   │   │   │   ├── HeroCentered.tsx         #   Full-width centered text + CTA
│   │   │   │   ├── HeroSplit.tsx            #   Image left / content right
│   │   │   │   ├── HeroVideo.tsx            #   Video background with overlay
│   │   │   │   ├── HeroCarousel.tsx         #   Rotating slides with auto-play
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── services/                    # [2.2] 4 layouts
│   │   │   │   ├── ServiceGrid.tsx          #   Card grid (2/3/4 columns)
│   │   │   │   ├── ServiceList.tsx          #   Detailed vertical list
│   │   │   │   ├── ServiceTabs.tsx          #   Grouped by category (uses Tabs)
│   │   │   │   ├── ServiceAccordion.tsx     #   Expandable sections (uses Accordion)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── team/                        # [2.3] 3 layouts
│   │   │   │   ├── TeamGrid.tsx             #   Photo + name + role cards
│   │   │   │   ├── TeamCarousel.tsx         #   Swipeable member cards
│   │   │   │   ├── TeamDetailed.tsx         #   Full bio + credentials + social
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── testimonials/                # [2.4] 3 variants
│   │   │   │   ├── TestimonialCarousel.tsx  #   Auto-rotating quotes
│   │   │   │   ├── TestimonialGrid.tsx      #   Static card grid
│   │   │   │   ├── TestimonialMarquee.tsx   #   Infinite scroll banner
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── pricing/                     # [2.5] 3 variants
│   │   │   │   ├── PricingTable.tsx         #   Feature comparison table
│   │   │   │   ├── PricingCards.tsx         #   Tiered plan cards
│   │   │   │   ├── PricingCalculator.tsx    #   Interactive quote builder
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── gallery/                     # [2.6] 3 variants
│   │   │   │   ├── ImageGrid.tsx            #   Responsive masonry grid
│   │   │   │   ├── ImageCarousel.tsx        #   Thumbnail + hero slider
│   │   │   │   ├── LightboxGallery.tsx      #   Click-to-expand (uses Dialog)
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── stats/                       # [2.7]
│   │   │   │   ├── StatsCounter.tsx         #   Animated count-up on scroll
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── cta/                         # [2.8] 2 variants
│   │   │   │   ├── CTABanner.tsx            #   Full-width action banner
│   │   │   │   ├── CTASplit.tsx             #   Image + text side-by-side
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── faq/                         # [2.9]
│   │   │   │   ├── FAQSection.tsx           #   Accordion Q&A with search/filter
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── contact/                     # [2.10] 3 variants
│   │   │   │   ├── SimpleContactForm.tsx    #   Single-step name/email/message
│   │   │   │   ├── MultiStepContactForm.tsx #   Wizard with step persistence
│   │   │   │   ├── BookingContactForm.tsx   #   Form + embedded booking calendar
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── experiments/                 # [F.5] Framing experiment library
│   │   │       └── framing/                 #   Reusable offer/CTA framing variants
│   │   │
│   │   ├── package.json                     #   @repo/marketing-components
│   │   ├── tsconfig.json
│   │   └── eslint.config.mjs
│   │
│   │  ── FEATURES LAYER ───────────────────────────────────────────────
│   │
│   ├── features/                            # [2.11] NEW — Shared feature modules
│   │   ├── src/
│   │   │   ├── index.ts                     #   Barrel: all 9 features
│   │   │   │
│   │   │   ├── booking/                     # [2.12] EXTRACTED from clients/starter-template/
│   │   │   │   ├── components/
│   │   │   │   │   └── BookingForm.tsx      #   Services/slots from props, not hardcoded
│   │   │   │   ├── lib/
│   │   │   │   │   ├── schema.ts            #   Zod schema — enums from SiteConfig
│   │   │   │   │   ├── actions.ts           #   Server actions — provider-agnostic
│   │   │   │   │   └── providers.ts         #   Strategy pattern (was 4 dup classes → 1 adapter)
│   │   │   │   ├── __tests__/
│   │   │   │   │   └── parity/              # [2.22] Parity tests vs original template
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── contact/                     # [2.13] EXTRACTED from clients/starter-template/
│   │   │   │   ├── components/
│   │   │   │   ├── lib/
│   │   │   │   ├── __tests__/parity/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── blog/                        # [2.14] EXTRACTED — content source adapter interface
│   │   │   │   ├── components/
│   │   │   │   │   └── BlogPostContent.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   ├── blog.ts              #   Source-agnostic content retrieval
│   │   │   │   │   └── blog-images.ts
│   │   │   │   ├── __tests__/parity/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── services/                    # [2.15] EXTRACTED — generic service taxonomy
│   │   │   │   ├── components/
│   │   │   │   │   ├── ServicesOverview.tsx  #   Grid/list/tabs view
│   │   │   │   │   └── ServiceDetailLayout.tsx  # Full detail page (8KB)
│   │   │   │   ├── lib/
│   │   │   │   ├── __tests__/parity/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── search/                      # [2.20] EXTRACTED — configurable search index
│   │   │   │   ├── components/
│   │   │   │   │   ├── SearchDialog.tsx     #   [0.30] Broken Tailwind class FIXED
│   │   │   │   │   └── SearchPage.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   └── search.ts            #   Moved FROM clients/starter-template/lib/
│   │   │   │   ├── __tests__/parity/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── testimonials/                # [2.16] NEW — multi-source review aggregation
│   │   │   │   ├── components/
│   │   │   │   │   └── TestimonialsSection.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   ├── testimonial-schema.ts
│   │   │   │   │   └── testimonial-actions.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── team/                        # [2.17] NEW — member profiles + layouts
│   │   │   │   ├── components/
│   │   │   │   │   └── TeamSection.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   └── team-schema.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── gallery/                     # [2.18] NEW — image management + lightbox
│   │   │   │   ├── components/
│   │   │   │   │   └── GallerySection.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   └── gallery-schema.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── pricing/                     # [2.19] NEW — data-driven pricing
│   │   │   │   ├── components/
│   │   │   │   │   └── PricingSection.tsx
│   │   │   │   ├── lib/
│   │   │   │   │   └── pricing-schema.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── personalization/             # [C.9][F.6] NEW — personalization engine
│   │   │   │   ├── rules-engine.ts          #   Privacy-safe, allowlist-only signals
│   │   │   │   ├── segments.ts              #   Geo, returning visitor, campaign source
│   │   │   │   └── co-creation-patterns.ts  # [F.6] IKEA-effect participatory UX
│   │   │   │
│   │   │   ├── localization/                # [C.11] NEW — i18n + RTL foundation
│   │   │   │   ├── i18n-config.ts           #   Locale routing + fallback chains
│   │   │   │   └── dictionaries/            #   Per-locale translation files
│   │   │   │
│   │   │   ├── content/                     # [C.10] NEW — CMS abstraction layer
│   │   │   │   ├── content-provider.ts      #   Unified content interface
│   │   │   │   ├── workflow-state.ts        # [D.3] Editorial lifecycle
│   │   │   │   └── adapters/
│   │   │   │       ├── mdx-adapter.ts       #   Git-based MDX content
│   │   │   │       ├── sanity-adapter.ts    #   Sanity CMS
│   │   │   │       └── storyblok-adapter.ts #   Storyblok
│   │   │   │
│   │   │   └── compliance/                  # [C.17] Industry compliance renderers
│   │   │       └── renderers/               #   Medical privacy, legal disclaimers
│   │   │
│   │   ├── package.json                     #   @repo/features
│   │   └── tsconfig.json
│   │
│   │  ── PAGE TEMPLATES LAYER ─────────────────────────────────────────
│   │
│   ├── page-templates/                      # [3.1] NEW — Composable page shells
│   │   ├── src/
│   │   │   ├── index.ts                     #   Barrel: all templates + registry
│   │   │   ├── registry.ts                  # [3.1] Section registry Map<string, Component>
│   │   │   │                                #   Composable assembly — no switch statements
│   │   │   └── templates/
│   │   │       ├── HomePageTemplate.tsx      # [3.2] Config-driven section composition
│   │   │       ├── ServicesPageTemplate.tsx  # [3.3] Grid/list/tabs + URL-synced filters
│   │   │       ├── AboutPageTemplate.tsx     # [3.4] Story, Team, Mission, Values, Timeline
│   │   │       ├── ContactPageTemplate.tsx   # [3.5] Form + business info + optional map
│   │   │       ├── BlogIndexTemplate.tsx     # [3.6] Post listing + pagination + categories
│   │   │       ├── BlogPostTemplate.tsx      # [3.7] Article + related posts + inline CTAs
│   │   │       └── BookingPageTemplate.tsx   # [3.8] Booking form with pre-fill context
│   │   │
│   │   ├── package.json                     #   @repo/page-templates
│   │   └── tsconfig.json
│   │
│   │  ── INTEGRATIONS LAYER ───────────────────────────────────────────
│   │
│   ├── integrations/
│   │   ├── analytics/                       #   Pre-existing
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── event-contract.ts        # [C.12] Conversion event taxonomy
│   │   │   │   └── __tests__/
│   │   │   │       └── event-contract.test.ts
│   │   │   └── package.json
│   │   │
│   │   ├── hubspot/                         #   Pre-existing — CRM
│   │   │   └── ...
│   │   │
│   │   ├── supabase/                        #   Pre-existing
│   │   │   ├── client.ts                    # [0.24] FIXED: lazy singleton, no eager init
│   │   │   ├── types.ts                     # [0.24] FIXED: no dup interface, unknown not any
│   │   │   └── ...
│   │   │
│   │   ├── mailchimp/                       # [4.1] NEW — Email marketing
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── sendgrid/                        # [4.1] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── convertkit/                      # [4.1] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── calendly/                        # [4.2] NEW — Scheduling
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── acuity/                          # [4.2] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── calcom/                          # [4.2] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── intercom/                        # [4.3] NEW — Chat support
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── crisp/                           # [4.3] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── tidio/                           # [4.3] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── google-reviews/                  # [4.4] NEW — Review aggregation
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── yelp/                            # [4.4] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   ├── trustpilot/                      # [4.4] NEW
│   │   │   ├── src/index.ts
│   │   │   └── package.json
│   │   │
│   │   └── google-maps/                     # [4.5] NEW — Maps embed
│   │       ├── src/index.ts
│   │       └── package.json
│   │
│   │  ── INDUSTRY SCHEMAS LAYER ───────────────────────────────────────
│   │
│   ├── industry-schemas/                    # [4.6] NEW — SEO JSON-LD generators
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── base.ts                  #   LocalBusiness, Service, Person, Review
│   │   │   │   ├── hair-salon.ts
│   │   │   │   ├── restaurant.ts
│   │   │   │   ├── law-firm.ts
│   │   │   │   ├── medical.ts
│   │   │   │   └── retail.ts
│   │   │   └── schemas/
│   │   │       ├── local-business.ts        #   Schema.org LocalBusiness
│   │   │       ├── service.ts               #   Schema.org Service
│   │   │       ├── review.ts                #   Schema.org Review
│   │   │       ├── faq.ts                   #   Schema.org FAQPage
│   │   │       ├── breadcrumb.ts            #   Schema.org BreadcrumbList
│   │   │       └── website.ts               #   Schema.org WebSite
│   │   └── package.json
│   │
│   │  ── AI PLATFORM (Future — Phase 7) ───────────────────────────────
│   │
│   ├── ai-platform/
│   │   ├── content-engine/                  # [7.1] Generative AI content tools
│   │   │   ├── src/
│   │   │   │   ├── generative-copy.ts
│   │   │   │   ├── image-generation.ts
│   │   │   │   └── content-optimization.ts
│   │   │   └── package.json
│   │   │
│   │   ├── llm-gateway/                     # [7.2] Multi-provider LLM routing
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   ├── providers/
│   │   │   │   │   ├── openai.ts
│   │   │   │   │   └── anthropic.ts
│   │   │   │   └── fallback.ts
│   │   │   └── package.json
│   │   │
│   │   └── agent-orchestration/             # [7.3] Trigger-based agents
│   │       ├── src/
│   │       │   ├── agents/
│   │       │   │   ├── content-agent.ts
│   │       │   │   └── seo-agent.ts
│   │       │   └── triggers.ts
│   │       └── package.json
│   │
│   │  ── CONTENT PLATFORM (Future — Phase 8) ──────────────────────────
│   │
│   ├── content-platform/
│   │   ├── visual-editor/                   # [8.1] Drag-drop page builder
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Canvas.tsx
│   │   │   │   │   └── ComponentPalette.tsx
│   │   │   │   └── hooks/
│   │   │   │       └── useDragDrop.ts
│   │   │   └── package.json
│   │   │
│   │   └── dam-core/                        # [8.2] Digital asset management
│   │       ├── src/
│   │       │   ├── asset-ingestion.ts
│   │       │   ├── ai-tagging.ts
│   │       │   └── variant-generation.ts
│   │       └── package.json
│   │
│   │  ── MARKETING OPS (Future — Phase 9) ─────────────────────────────
│   │
│   ├── marketing-ops/
│   │   └── campaign-orchestration/          # [9.1] Campaign workflow automation
│   │       ├── src/
│   │       │   ├── campaign-planning.ts
│   │       │   └── workflow-automation.ts
│   │       └── package.json
│   │
│   │  ── ADVANCED INFRA (Future — Phase 10) ───────────────────────────
│   │
│   └── infrastructure/
│       └── tenant-core/                     # [10.1] Full SaaS multi-tenancy
│           ├── src/
│           │   ├── tenant-context.ts
│           │   ├── tenant-provisioning.ts
│           │   └── feature-flags.ts
│           └── package.json
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  CLIENTS — Production websites (Layer 3)                           ║
│  ║  Each client = thin Next.js shell: site.config.ts + page routes    ║
│  ║  Zero business logic — everything comes from packages              ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── clients/
│   │
│   ├── starter-template/                    # [5.1] GOLDEN PATH — clone for every new client
│   │   ├── app/
│   │   │   ├── layout.tsx                   #   Root layout + ThemeInjector + providers
│   │   │   ├── page.tsx                     #   ← HomePageTemplate({ config: siteConfig })
│   │   │   ├── about/
│   │   │   │   └── page.tsx                 #   ← AboutPageTemplate
│   │   │   ├── services/
│   │   │   │   └── page.tsx                 #   ← ServicesPageTemplate
│   │   │   ├── contact/
│   │   │   │   └── page.tsx                 #   ← ContactPageTemplate
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                 #   ← BlogIndexTemplate
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx             #   ← BlogPostTemplate
│   │   │   ├── book/
│   │   │   │   └── page.tsx                 #   ← BookingPageTemplate
│   │   │   └── api/
│   │   │       └── [...routes]/             #   Health, OG (reads from siteConfig)
│   │   │
│   │   ├── site.config.ts                   #   ★ THE ONLY FILE A CLIENT CHANGES ★
│   │   ├── middleware.ts                    #   Edge: experiments, personalization
│   │   ├── next.config.js                   #   Build-time config validation via Zod
│   │   ├── tailwind.config.js
│   │   ├── package.json                     #   @repo/page-templates, features, ui, marketing-components
│   │   └── README.md                        #   Setup, deploy, customization quickstart
│   │
│   ├── luxe-salon/                          # [5.2] Example: salon industry
│   │   ├── site.config.ts                   #   industry: 'salon', booking: true, team: 'grid'
│   │   ├── app/...
│   │   └── package.json
│   │
│   ├── bistro-central/                      # [5.3] Example: restaurant industry
│   │   ├── site.config.ts                   #   industry: 'restaurant', booking: true
│   │   ├── app/...
│   │   └── package.json
│   │
│   ├── chen-law/                            # [5.4] Example: law firm industry
│   │   ├── site.config.ts                   #   industry: 'law-firm', team: 'detailed'
│   │   ├── app/...
│   │   └── package.json
│   │
│   ├── sunrise-dental/                      # [5.5] Example: medical/dental
│   │   ├── site.config.ts                   #   industry: 'dental', booking: true
│   │   ├── app/...
│   │   └── package.json
│   │
│   └── urban-outfitters/                    # [5.6] Example: retail
│       ├── site.config.ts                   #   industry: 'retail', gallery: 'grid'
│       ├── app/...
│       └── package.json
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  TEMPLATES — DELETED after Wave 3 [6.3]                            ║
│  ║  All code migrated to packages/ + clients/                         ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
│   templates/                               # [6.3] ❌ DELETED
│     ├── hair-salon/                        #   → clients/luxe-salon/ + packages/features/
│     └── shared/                            #   → packages/types/ [0.8]
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  TOOLING — Developer CLI + generators                              ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── tooling/                                 # [6.8] Developer CLI tools
│   ├── create-client/
│   │   ├── src/index.ts                     #   pnpm create-client my-client --industry=restaurant
│   │   ├── templates/
│   │   └── package.json
│   │
│   ├── validation/
│   │   └── src/
│   │       └── validate-site-config.ts      #   pnpm validate-config clients/x/site.config.ts
│   │
│   └── generate-component/
│       └── src/index.ts                     #   pnpm generate-component MyComponent --package=marketing
│
│  ╔══════════════════════════════════════════════════════════════════════╗
│  ║  DOCS — Architecture, guides, governance                           ║
│  ╚══════════════════════════════════════════════════════════════════════╝
│
├── docs/
│   ├── performance-baseline.md              # [0.6]
│   ├── accessibility-audit.md               # [0.7]
│   ├── testing-strategy.md                  # [2.21]
│   │
│   ├── architecture/
│   │   ├── module-boundaries.md             # [0.11]
│   │   ├── dependency-graph.md              # [C.1]
│   │   ├── package-management-policy.md     # [C.2]
│   │   └── edge-personalization.md          # [C.18]
│   │
│   ├── adr/                                 # [6.7] Architecture Decision Records
│   │   ├── 001-feature-based-architecture.md
│   │   ├── 002-radix-ui-primitives.md
│   │   ├── 003-pnpm-catalog.md
│   │   └── 004-industry-agnostic-design.md
│   │
│   ├── ci/
│   │   ├── required-checks.md              # [0.13]
│   │   └── turbo-remote-cache.md           # [C.3]
│   │
│   ├── configuration/
│   │   ├── site-config-reference.md         # [6.5]
│   │   └── industry-configs.md              # [6.5]
│   │
│   ├── components/                          # [6.4] Component library docs
│   │
│   ├── features/                            # [6.6] Feature docs
│   │   ├── booking.md
│   │   ├── contact.md
│   │   ├── blog.md
│   │   ├── services.md
│   │   ├── testimonials.md
│   │   ├── team.md
│   │   ├── gallery.md
│   │   └── pricing.md
│   │
│   ├── migration/
│   │   ├── template-to-client.md            # [6.2]
│   │   ├── client-validation-matrix.md      # [5.7]
│   │   ├── cutover-runbook.md               # [6.10]
│   │   ├── rollback-plan.md                 # [6.10]
│   │   └── checklists/
│   │       └── client-go-live-checklist.md  # [5.7]
│   │
│   ├── cleanup/
│   │   └── dependency-pruning-report.md     # [6.9]
│   │
│   ├── design/
│   │   ├── design-token-architecture.md     # [C.5]
│   │   └── motion-guidelines.md             # [C.6]
│   │
│   ├── testing/
│   │   └── refactor-parity-matrix.md        # [2.22]
│   │
│   ├── release/
│   │   └── versioning-strategy.md           # [0.12][C.4]
│   │
│   ├── security/
│   │   ├── continuous-security-program.md   # [C.13]
│   │   └── supply-chain-security.md         # [D.8]
│   │
│   ├── performance/
│   │   ├── slo-definition.md                # [C.14]
│   │   └── perceived-performance-standards.md # [E.1]
│   │
│   ├── analytics/
│   │   ├── conversion-event-taxonomy.md     # [C.12]
│   │   ├── peak-end-events.md               # [F.4]
│   │   └── recovery-experience-metrics.md   # [F.12]
│   │
│   ├── content/
│   │   ├── content-source-adapters.md       # [C.10]
│   │   ├── editorial-workflow.md            # [D.3]
│   │   └── preview-security-model.md        # [D.3]
│   │
│   ├── localization/
│   │   └── i18n-rtl-guide.md                # [C.11]
│   │
│   ├── compliance/
│   │   └── industry-compliance-packs.md     # [C.17]
│   │
│   ├── marketing/
│   │   ├── experimentation-playbook.md      # [C.8]
│   │   ├── experimentation-statistical-standards.md # [D.2]
│   │   ├── personalization-rules.md         # [C.9]
│   │   ├── framing-pattern-library.md       # [F.5]
│   │   └── ethical-framing-constraints.md   # [F.5]
│   │
│   ├── accessibility/
│   │   ├── component-a11y-rubric.md         # [D.6]
│   │   └── release-a11y-gate.md             # [D.6]
│   │
│   ├── workflow/
│   │   ├── spec-driven-development.md       # [C.15]
│   │   ├── ai-agent-playbook.md             # [C.16]
│   │   ├── prfaq-template.md                # [E.5]
│   │   └── jtbd-template.md                 # [E.5]
│   │
│   ├── governance/
│   │   ├── schema-versioning-policy.md      # [D.1]
│   │   ├── schema-change-checklist.md       # [D.1]
│   │   ├── ownership-matrix.md              # [D.7]
│   │   ├── escalation-policy.md             # [D.7]
│   │   ├── mission-command-model.md         # [F.9]
│   │   └── decision-escalation-triggers.md  # [F.9]
│   │
│   ├── reliability/
│   │   ├── incident-severity-matrix.md      # [D.5]
│   │   ├── error-budget-policy.md           # [D.5]
│   │   ├── error-budget-release-policy.md   # [E.3]
│   │   ├── postmortem-template.md           # [D.5]
│   │   ├── preflight-checklists.md          # [F.1]
│   │   └── near-miss-log.md                 # [F.1]
│   │
│   ├── operations/
│   │   ├── tenant-onboarding-playbook.md    # [D.4]
│   │   ├── tenant-offboarding-playbook.md   # [D.4]
│   │   ├── tenant-quotas-and-limits.md      # [D.4]
│   │   ├── async-queue-governance.md        # [E.7]
│   │   ├── retry-timeout-policy.md          # [E.7]
│   │   ├── spc-delivery-metrics.md          # [F.8]
│   │   └── process-control-thresholds.md    # [F.8]
│   │
│   ├── observability/
│   │   └── client-slo-dashboard-spec.md     # [C.14]
│   │
│   ├── platform/
│   │   ├── golden-path-new-client.md        # [E.4]
│   │   ├── golden-path-new-feature.md       # [E.4]
│   │   └── devex-adoption-metrics.md        # [E.4]
│   │
│   ├── service-blueprints/
│   │   ├── booking-flow.md                  # [E.2]
│   │   ├── contact-flow.md                  # [E.2]
│   │   └── lead-routing-map.md              # [E.2]
│   │
│   ├── ux/
│   │   ├── progressive-conversion-patterns.md # [E.6]
│   │   ├── peak-end-journey-guidelines.md   # [F.4]
│   │   ├── participatory-personalization.md  # [F.6]
│   │   ├── wayfinding-standards.md          # [F.7]
│   │   └── service-recovery-patterns.md     # [F.12]
│   │
│   ├── strategy/
│   │   ├── cynefin-execution-model.md       # [F.2]
│   │   ├── leverage-point-scoring.md        # [F.3]
│   │   ├── portfolio-kanban-policy.md       # [F.10]
│   │   └── wip-limits-by-lane.md            # [F.10]
│   │
│   ├── knowledge/
│   │   ├── seci-inspired-knowledge-flow.md  # [F.11]
│   │   └── pattern-capture-template.md      # [F.11]
│   │
│   └── storybook/                           # [C.7] Visual regression config
│
├── .kiro/
│   └── specs/                               # [C.15] Feature spec templates
│       ├── README.md
│       └── templates/
│           ├── feature-spec-template.md
│           └── adr-template.md
│
└── .windsurf/
    └── workflows/                           # [C.16] AI-assisted delivery playbooks
        ├── implement-feature-from-spec.md
        └── refactor-with-parity-checks.md
```

---

## Key Architectural Shifts

| Dimension            | Before (1 template)                      | After (config-driven platform)                      |
| -------------------- | ---------------------------------------- | --------------------------------------------------- |
| **Business logic**   | Hardcoded in `clients/starter-template/` | Extracted to `packages/features/` (9 modules)       |
| **UI components**    | 8 primitives in `@repo/ui`               | 14 primitives + 10 marketing families (30+)         |
| **Page composition** | Direct JSX in template routes            | Config-driven via section registry + templates      |
| **Theming**          | Broken — config has no effect            | CSS vars generated from `site.config.ts` at runtime |
| **Client creation**  | Copy entire template, edit everything    | `turbo gen new-client` → edit only `site.config.ts` |
| **Industries**       | Hair salon only                          | 12 typed industries with defaults + schema.org      |
| **Content source**   | MDX files in template                    | Adapter pattern: MDX / Sanity / Storyblok           |
| **Integrations**     | 3 (analytics, hubspot, supabase)         | 15+ (email, scheduling, chat, reviews, maps)        |
| **Testing**          | 13 scattered test files                  | Pyramid + parity suite + visual regression          |
| **CI/CD**            | Basic                                    | Affected builds + remote cache + gates + changesets |
| **templates/**       | Exists (source of truth)                 | **Deleted** — all code in packages/ + clients/      |

---

## The CaCA Principle

**Configuration-as-Code Architecture:** every aspect of a client website — from theming to page composition to feature selection to SEO schema — is driven by a single, validated `site.config.ts` file.

```
site.config.ts (client intent)
      │
      ▼
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│ Theme Engine │   │ Route Engine  │   │ SEO Engine   │
│ (CSS vars)   │   │ (page assembly)│  │ (schema.org) │
└──────┬──────┘   └──────┬───────┘   └──────┬──────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────────────────────────────────────────┐
│              Next.js App Router                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Layout  │ │ Pages   │ │ API     │           │
│  │ (themed)│ │(composed)│ │(health) │           │
│  └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────┘
```

No drag-and-drop. No WYSIWYG. Just config.
Config is the fast path. Code is the escape hatch.

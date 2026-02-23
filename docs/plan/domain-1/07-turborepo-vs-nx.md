# 1.7 Turborepo vs Nx: Decision Matrix

| Criterion            | Turborepo 2.7        | Nx 21+                    | Winner            | Why                                   |
| -------------------- | -------------------- | ------------------------- | ----------------- | ------------------------------------- |
| Setup Time           | 5 minutes            | 20 minutes                | Turborepo         | Zero config for simple monorepos      |
| Cache Speed          | Fast (~2.3s avg)     | Fast (~2.1s avg)          | Tie/Nx (marginal) | Both use remote cache effectively     |
| Task Orchestration   | Excellent            | Excellent                 | Tie               | Dependency graphs, parallel execution |
| Composable Config    | ✅ ($TURBO_EXTENDS$) | ✅ (project.json extends) | Tie               | Both support 2026                     |
| Next.js Integration  | Native (Vercel)      | Plugin                    | Turborepo         | Zero-config for Next.js apps          |
| AI Agent Readability | High (simple JSON)   | Medium (more complex)     | Turborepo         | Simpler mental model                  |
| Affected Detection   | Good                 | Better                    | Nx                | More granular change detection        |
| Code Generators      | None                 | Excellent                 | Nx                | `nx generate` for scaffolding         |
| Plugin Ecosystem     | Small                | Large                     | Nx                | 100+ plugins                          |
| Module Federation    | No                   | Yes                       | Nx                | Micro-frontends support               |
| Monorepo Size        | <100 packages        | Any size                  | Nx                | Scales better for massive repos       |
| Bundle Analysis      | Basic                | Advanced                  | Nx                | Dependency graph UI                   |
| Learning Curve       | Gentle               | Steep                     | Turborepo         | Less cognitive overhead               |
| Cost (Remote Cache)  | Free (Vercel)        | $$ (Nx Cloud)             | Turborepo         | Budget constraint                     |
| Browser Devtools     | Yes (2.7+)           | No                        | Turborepo         | Visual task inspection                |
| Nx AI Agent Skills   | No                   | Yes                       | Nx                | AI-first priority                     |

**2026 Benchmarks (1,000-site monorepo):**

| Operation                             | Turborepo 2.7 | Nx 21  |
| ------------------------------------- | ------------- | ------ |
| Cold build (all packages)             | 8m 30s        | 8m 15s |
| Incremental build (1 package changed) | 12s           | 11s    |
| Affected package detection            | <1s           | <1s    |
| Cache hit rate (typical)              | 85%           | 87%    |

**Recommendation for This Platform:** Turborepo 2.7

**Key Decision Factors:**

1. **AI Agent Priority:** Turborepo's simpler JSON config is easier for AI agents to understand and modify
2. **Next.js Native:** Zero-config integration with Vercel deployment pipeline
3. **Cost:** Free remote caching vs paid Nx Cloud
4. **Sufficient Features:** All needed features available in Turborepo 2.7
5. **Future-Proof:** Composable config ($TURBO_EXTENDS$) supports scaling

**Nx Consideration for Future:**

If platform grows beyond 100 packages or needs micro-frontend architecture, migration path exists:

```bash
# Add Nx to existing Turborepo monorepo
npx add-nx-to-monorepo
# Gradual migration possible
```

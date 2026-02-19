# packages/ — Codex override

Codex: This directory overrides root AGENTS.md. See [AGENTS.md](AGENTS.md) in this folder for package-specific rules.

- Follow layer model: L0 (infra), L2 (ui, features, types, utils)
- Never import packages → clients; use public exports only
- Add file headers; run `pnpm validate-exports` after export changes
- Tests: Node env for lib/, jsdom for components

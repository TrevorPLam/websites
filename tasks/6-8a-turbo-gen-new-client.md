# 6.8a Implement turbo gen new-client (Plop)

## Metadata

- **Task ID**: 6-8a-turbo-gen-new-client
- **Owner**: AGENT
- **Priority / Severity**: P2
- **Target Release**: TBD
- **Related Epics / ADRs**: THEGOAL [5.1], CLI tooling
- **Reviewers / Stakeholders**: @agent
- **Upstream Tasks**: 5.1, 6.3
- **Downstream Tasks**: create-client, developer workflow

## Context

Implement Plop-based scaffolding so `turbo gen new-client` (or equivalent) creates a new client by copying starter-template and prompting for name, industry, etc. Currently turbo/generators/config.ts is a stub.

## Dependencies

- **Upstream Task**: 5.1 – required – starter-template exists
- **Upstream Task**: 6.3 – templates/ removed

## Cross-Task Dependencies & Sequencing

- **Upstream**: 5.1, 6.3
- **Parallel Work**: 6-8b (create-client)
- **Downstream**: Golden path for new clients

## Research

- **Primary topics**: [R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding).
- **[2026-02] Plop 3.x**: `setGenerator(name, { description, prompts, actions })`; prompts collect name/industry; actions copy from starter-template and transform package.json and site.config.ts.
- **[2026-02] Turborepo**: Wire via root script e.g. `"gen": "plop --plopfile turbo/generators/config.ts"` or `turbo gen new-client`; source: clients/starter-template; run `pnpm validate-client clients/<name>/` after creation.
- **References**: [RESEARCH-INVENTORY.md – R-CLI](RESEARCH-INVENTORY.md#r-cli-cli-tooling-generators-scaffolding), [turbo/generators/config.ts](../turbo/generators/config.ts), [THEGOAL.md](../THEGOAL.md).

## Related Files

- `turbo/generators/config.ts` – modify – Plop config
- `turbo.json` – modify – Wire gen command if needed
- `clients/starter-template/` – reference – Source template

## Acceptance Criteria

- [ ] `turbo gen new-client` (or `pnpm gen new-client`) runs interactively
- [ ] Prompts for client name, industry (optional)
- [ ] Creates clients/<name>/ by copying starter-template
- [ ] Updates package.json name to @clients/<name>
- [ ] Updates site.config.ts id and name
- [ ] New client passes validate-client

## Technical Constraints

- Use Plop or similar; integrate with Turbo/pnpm
- No hardcoded industry logic; config-driven

## Implementation Plan

- [ ] Implement Plop config for new-client generator
- [ ] Wire to pnpm/turbo
- [ ] Test with sample client creation

## Sample code / examples

- **Plop generator** (turbo/generators/config.ts): Implement setGenerator for `new-client` with prompts for name and optional industry; actions copy clients/starter-template to clients/{{name}}/ and update package.json name to `@clients/{{name}}`, site.config.ts id/name.
  ```javascript
  export default function (plop) {
    plop.setGenerator('new-client', {
      description: 'Scaffold a new client from starter-template',
      prompts: [
        { type: 'input', name: 'name', message: 'Client name (kebab-case):' },
        { type: 'input', name: 'industry', message: 'Industry (optional):' },
      ],
      actions: [
        // Copy starter-template to clients/{{name}}/; transform package.json, site.config.ts
      ],
    });
  }
  ```
- Root package.json: `"gen": "plop --plopfile turbo/generators/config.ts"`. After generation run `pnpm validate-client clients/<name>/`.

## Testing Requirements

- Create a test client; run `pnpm validate-client clients/<test>/`; delete test client

## Execution notes

- **Related files — current state:** `turbo/generators/config.ts` — exists as stub (default export with TODO). `turbo.json` — no gen pipeline yet. `clients/starter-template/` — exists; use as copy source.
- **Potential issues / considerations:** Plop API is CommonJS; ensure `package.json` name and `site.config.ts` id/name are transformed; run `pnpm validate-client clients/<name>/` after generation; no hardcoded industry logic.
- **Verification:** Create a test client, run `pnpm validate-client clients/<name>/`, delete test client.

## Definition of Done

- [ ] Code reviewed and approved
- [ ] Generator works end-to-end
- [ ] Documentation updated

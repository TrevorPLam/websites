---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-004
title: 'Schema migration safety with down migrations'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-6-004-schema-migration-safety
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-004 · Schema migration safety with down migrations

## Objective

Implement schema migration safety following section 6.6 specification with up/down migrations, migration runner, safety checklist, and automated rollback capabilities for multi-tenant database schema changes.

---

## Context

**Codebase area:** Database schema management — Migration system implementation

**Related files:** Supabase migrations, database schema, type generation

**Dependencies:** Supabase CLI, existing database schema, migration infrastructure

**Prior work:** Basic migration system exists but lacks comprehensive safety measures and down migrations

**Constraints:** Must follow section 6.6 specification with proper migration structure and rollback capabilities

---

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Database  | Supabase Postgres with migration system |
| Migration | Supabase CLI with up/down migrations    |
| Safety    | Automated rollback and validation       |
| Types     | TypeScript type generation from schema  |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement schema migration safety following section 6.6 specification
- [ ] **[Agent]** Create migration template with up/down migrations
- [ ] **[Agent]** Add migration runner with safety checks
- [ ] **[Agent]** Implement automated rollback capabilities
- [ ] **[Agent]** Add migration safety checklist
- [ ] **[Agent]** Create type generation pipeline
- [ ] **[Agent]** Test migration and rollback scenarios
- [ ] **[Human]** Verify migration safety follows section 6.6 specification exactly

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 6.6 specification** — Extract migration safety requirements
- [ ] **[Agent]** **Create migration template** — Implement up/down migration structure
- [ ] **[Agent]** **Add migration runner** — Create safe migration execution
- [ ] **[Agent]** **Implement rollback system** — Add automated rollback capabilities
- [ ] **[Agent]** **Add safety checklist** — Create migration validation rules
- [ ] **[Agent]** **Create type generation** — Add TypeScript type generation
- [ ] **[Agent]** **Test scenarios** — Verify migration and rollback work correctly

> ⚠️ **Agent Question**: Ask human before proceeding if any existing migrations need restructuring to meet safety requirements.

---

## Commands

```bash
# Test migration runner
pnpm migration:up
pnpm migration:down
pnpm migration:status

# Test migration safety
pnpm migration:validate
pnpm migration:dry-run

# Test type generation
pnpm migration:generate-types

# Test rollback scenario
pnpm migration:rollback 0002_add_lead_attribution
```

---

## Code Style

```typescript
// ✅ Correct — Schema migration safety following section 6.6
// ============================================================================
// MIGRATION TEMPLATE
// ============================================================================

// supabase/migrations/0002_add_lead_attribution.sql
/*
-- ============================================================================
-- Migration: 0002_add_lead_attribution
-- Description: Add UTM attribution fields and first/last touch tracking to leads
-- Author: Claude Code
-- Date: 2026-02-23
-- Depends: 0001_initial_schema
-- ============================================================================

-- UP MIGRATION
-- ============================================================================

-- Add first-touch attribution columns (UTM parameters captured on first visit)
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS utm_source_first    TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium_first    TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign_first  TEXT,
  ADD COLUMN IF NOT EXISTS utm_content_first   TEXT,
  ADD COLUMN IF NOT EXISTS utm_term_first      TEXT,
  ADD COLUMN IF NOT EXISTS first_touch_at      TIMESTAMPTZ,

  -- Last-touch attribution (UTM parameters at time of form submission)
  ADD COLUMN IF NOT EXISTS utm_source_last     TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium_last     TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign_last   TEXT,
  ADD COLUMN IF NOT EXISTS utm_content_last    TEXT,
  ADD COLUMN IF NOT EXISTS utm_term_last       TEXT,
  ADD COLUMN IF NOT EXISTS last_touch_at       TIMESTAMPTZ,

  -- Referrer
  ADD COLUMN IF NOT EXISTS referrer_url        TEXT,
  ADD COLUMN IF NOT EXISTS landing_page        TEXT;

-- Index for attribution reporting
CREATE INDEX IF NOT EXISTS idx_leads_utm_source_first
  ON leads (tenant_id, utm_source_first);

CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign_first
  ON leads (tenant_id, utm_campaign_first);

-- Backfill existing leads: copy utm_source → utm_source_first
UPDATE leads
SET
  utm_source_first   = utm_source,
  utm_medium_first   = utm_medium,
  utm_campaign_first = utm_campaign,
  utm_source_last    = utm_source,
  utm_medium_last    = utm_medium,
  utm_campaign_last  = utm_campaign,
  first_touch_at     = created_at,
  last_touch_at      = created_at
WHERE utm_source IS NOT NULL
  AND utm_source_first IS NULL;

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

ALTER TABLE leads
  DROP COLUMN IF EXISTS utm_source_first,
  DROP COLUMN IF EXISTS utm_medium_first,
  DROP COLUMN IF EXISTS utm_campaign_first,
  DROP COLUMN IF EXISTS utm_content_first,
  DROP COLUMN IF EXISTS utm_term_first,
  DROP COLUMN IF EXISTS first_touch_at,
  DROP COLUMN IF EXISTS utm_source_last,
  DROP COLUMN IF EXISTS utm_medium_last,
  DROP COLUMN IF EXISTS utm_campaign_last,
  DROP COLUMN IF EXISTS utm_content_last,
  DROP COLUMN IF EXISTS utm_term_last,
  DROP COLUMN IF EXISTS last_touch_at,
  DROP COLUMN IF EXISTS referrer_url,
  DROP COLUMN IF EXISTS landing_page;

DROP INDEX IF EXISTS idx_leads_utm_source_first;
DROP INDEX IF EXISTS idx_leads_utm_campaign_first;
*/

// ============================================================================
// MIGRATION RUNNER
// ============================================================================

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Migration {
  id: string;
  filename: string;
  up: string;
  down: string;
  description: string;
  depends: string[];
}

interface MigrationStatus {
  applied: string[];
  pending: string[];
  failed: string[];
}

class MigrationRunner {
  private migrationsPath: string;
  private appliedMigrationsPath: string;

  constructor(migrationsPath: string = 'supabase/migrations') {
    this.migrationsPath = migrationsPath;
    this.appliedMigrationsPath = join(migrationsPath, '.applied');
  }

  // ============================================================================
  // MIGRATION DISCOVERY
  // ============================================================================

  private getMigrations(): Migration[] {
    const migrationFiles = execSync(`ls -1 ${this.migrationsPath}/*.sql`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .sort();

    return migrationFiles.map((filename) => {
      const content = readFileSync(filename, 'utf8');
      const id = filename.split('/').pop()?.replace('.sql', '') || '';

      // Parse migration metadata from comments
      const description = this.extractMetadata(content, 'Description:');
      const depends = this.extractDepends(content);

      return {
        id,
        filename,
        up: this.extractSection(content, 'UP MIGRATION'),
        down: this.extractSection(content, 'DOWN MIGRATION'),
        description,
        depends,
      };
    });
  }

  private extractMetadata(content: string, key: string): string {
    const match = content.match(new RegExp(`-- ${key}\\s*(.+)`));
    return match?.[1]?.trim() || '';
  }

  private extractDepends(content: string): string[] {
    const dependsLine = this.extractMetadata(content, 'Depends:');
    return dependsLine ? dependsLine.split(',').map((d) => d.trim()) : [];
  }

  private extractSection(content: string, sectionName: string): string {
    const startMarker = `-- ${sectionName}`;
    const endMarker = '-- DOWN';

    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return '';

    const start = startIndex + startMarker.length;
    const end = content.indexOf(endMarker, start);

    return content.slice(start, end).trim();
  }

  // ============================================================================
  // MIGRATION STATUS
  // ============================================================================

  async getStatus(): Promise<MigrationStatus> {
    const applied = this.getAppliedMigrations();
    const all = this.getMigrations();
    const appliedIds = new Set(applied);

    return {
      applied,
      pending: all.filter((m) => !appliedIds.has(m.id)).map((m) => m.id),
      failed: [], // Would be populated from migration failure logs
    };
  }

  private getAppliedMigrations(): string[] {
    if (!existsSync(this.appliedMigrationsPath)) {
      return [];
    }

    return readFileSync(this.appliedMigrationsPath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split(':')[0]); // Extract migration ID
  }

  // ============================================================================
  // MIGRATION VALIDATION
  // ============================================================================

  async validate(): Promise<{ valid: boolean; errors: string[] }> {
    const migrations = this.getMigrations();
    const status = await this.getStatus();
    const errors: string[] = [];

    // Check for duplicate IDs
    const ids = migrations.map((m) => m.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate migration IDs: ${duplicateIds.join(', ')}`);
    }

    // Check dependencies
    for (const migration of migrations) {
      for (const dep of migration.depends) {
        if (!ids.includes(dep)) {
          errors.push(`Migration ${migration.id} depends on non-existent migration ${dep}`);
        }
      }
    }

    // Check for circular dependencies
    const circularDeps = this.detectCircularDependencies(migrations);
    if (circularDeps.length > 0) {
      errors.push(`Circular dependencies detected: ${circularDeps.join(' -> ')}`);
    }

    // Check if down migration exists for each up migration
    for (const migration of migrations) {
      if (!migration.down) {
        errors.push(`Migration ${migration.id} missing down migration`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private detectCircularDependencies(migrations: Migration[]): string[] {
    // Simple circular dependency detection
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function hasCircularDeps(migrationId: string, path: string[]): string[] {
      if (recursionStack.has(migrationId)) {
        return [...path, migrationId];
      }

      if (visited.has(migrationId)) {
        return [];
      }

      visited.add(migrationId);
      recursionStack.add(migrationId);

      const migration = migrations.find((m) => m.id === migrationId);
      if (!migration) return [];

      for (const dep of migration.depends) {
        const circular = hasCircularDeps(dep, [...path, migrationId]);
        if (circular.length > 0) return circular;
      }

      recursionStack.delete(migrationId);
      return [];
    }

    for (const migration of migrations) {
      const circular = hasCircularDeps(migration.id, []);
      if (circular.length > 0) return circular;
    }

    return [];
  }

  // ============================================================================
  // MIGRATION EXECUTION
  // ============================================================================

  async up(targetMigration?: string): Promise<void> {
    const validation = await this.validate();
    if (!validation.valid) {
      throw new Error(`Migration validation failed:\n${validation.errors.join('\n')}`);
    }

    const status = await this.getStatus();
    const migrations = this.getMigrations();

    const pendingMigrations = migrations.filter(
      (m) => status.pending.includes(m.id) && (!targetMigration || m.id <= targetMigration)
    );

    for (const migration of pendingMigrations) {
      console.log(`Applying migration ${migration.id}: ${migration.description}`);

      try {
        // Apply up migration
        execSync(`supabase db push --linked`, { encoding: 'utf8' });

        // Record applied migration
        this.recordAppliedMigration(migration.id);

        console.log(`✅ Migration ${migration.id} applied successfully`);
      } catch (error) {
        console.error(`❌ Migration ${migration.id} failed:`, error);
        throw error;
      }
    }

    // Generate TypeScript types after successful migration
    this.generateTypes();
  }

  async down(targetMigration: string): Promise<void> {
    const status = await this.getStatus();
    const migrations = this.getMigrations();

    // Find migrations to rollback (in reverse order)
    const migrationsToRollback = migrations
      .filter((m) => status.applied.includes(m.id) && m.id >= targetMigration)
      .reverse();

    for (const migration of migrationsToRollback) {
      console.log(`Rolling back migration ${migration.id}: ${migration.description}`);

      try {
        // Apply down migration
        if (migration.down) {
          execSync(`psql $SUPABASE_DIRECT_URL -c "${migration.down}"`, { encoding: 'utf8' });
        }

        // Remove from applied migrations
        this.removeAppliedMigration(migration.id);

        console.log(`✅ Migration ${migration.id} rolled back successfully`);
      } catch (error) {
        console.error(`❌ Migration ${migration.id} rollback failed:`, error);
        throw error;
      }
    }

    // Generate TypeScript types after rollback
    this.generateTypes();
  }

  // ============================================================================
  // MIGRATION TRACKING
  // ============================================================================

  private recordAppliedMigration(migrationId: string): void {
    const timestamp = new Date().toISOString();
    const line = `${migrationId}:${timestamp}\n`;

    if (existsSync(this.appliedMigrationsPath)) {
      const content = readFileSync(this.appliedMigrationsPath, 'utf8');
      writeFileSync(this.appliedMigrationsPath, content + line);
    } else {
      writeFileSync(this.appliedMigrationsPath, line);
    }
  }

  private removeAppliedMigration(migrationId: string): void {
    if (!existsSync(this.appliedMigrationsPath)) return;

    const content = readFileSync(this.appliedMigrationsPath, 'utf8');
    const lines = content.split('\n').filter((line) => !line.startsWith(migrationId + ':'));
    writeFileSync(this.appliedMigrationsPath, lines.join('\n'));
  }

  // ============================================================================
  // TYPE GENERATION
  // ============================================================================

  private generateTypes(): void {
    try {
      console.log('Generating TypeScript types from schema...');
      execSync('supabase gen types typescript --linked > packages/integrations/supabase/types.ts', {
        encoding: 'utf8',
      });
      console.log('✅ TypeScript types generated successfully');
    } catch (error) {
      console.error('❌ Failed to generate TypeScript types:', error);
      throw error;
    }
  }

  // ============================================================================
  // DRY RUN
  // ============================================================================

  async dryRun(targetMigration?: string): Promise<{ migrations: string[]; sql: string[] }> {
    const status = await this.getStatus();
    const migrations = this.getMigrations();

    const pendingMigrations = migrations.filter(
      (m) => status.pending.includes(m.id) && (!targetMigration || m.id <= targetMigration)
    );

    return {
      migrations: pendingMigrations.map((m) => m.id),
      sql: pendingMigrations.map((m) => m.up),
    };
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

const runner = new MigrationRunner();

async function main() {
  const command = process.argv[2];
  const target = process.argv[3];

  try {
    switch (command) {
      case 'up':
        await runner.up(target);
        break;
      case 'down':
        if (!target) {
          console.error('Target migration ID required for down migration');
          process.exit(1);
        }
        await runner.down(target);
        break;
      case 'status':
        const status = await runner.getStatus();
        console.log('Migration Status:');
        console.log('Applied:', status.applied);
        console.log('Pending:', status.pending);
        console.log('Failed:', status.failed);
        break;
      case 'validate':
        const validation = await runner.validate();
        if (validation.valid) {
          console.log('✅ All migrations are valid');
        } else {
          console.error('❌ Migration validation failed:');
          validation.errors.forEach((error) => console.error(`  - ${error}`));
          process.exit(1);
        }
        break;
      case 'dry-run':
        const dryRun = await runner.dryRun(target);
        console.log('Dry run - migrations to apply:');
        dryRun.migrations.forEach((migration, index) => {
          console.log(`${index + 1}. ${migration}`);
        });
        break;
      default:
        console.error('Unknown command. Available: up, down, status, validate, dry-run');
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { MigrationRunner };
```

**Migration safety principles:**

- **Up/Down migrations**: Every migration must have both up and down versions
- **Dependency tracking**: Migrations can depend on previous migrations
- **Validation**: Check for circular dependencies and missing down migrations
- **Rollback capability**: Ability to rollback to any previous migration
- **Type generation**: Automatically generate TypeScript types from schema
- **Dry run**: Preview migrations before applying them
- **Status tracking**: Track which migrations have been applied

---

## Boundaries

| Tier             | Scope                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 6.6 specification; implement up/down migrations; add validation; include rollback capability; generate types |
| ⚠️ **Ask first** | Changing existing migration structure; modifying database schema; updating type generation                                  |
| 🚫 **Never**     | Apply migrations without validation; skip down migrations; ignore dependency tracking; break type generation                |

---

## Success Verification

- [ ] **[Agent]** Test migration runner — Up migrations apply correctly
- [ ] **[Agent]** Verify rollback capability — Down migrations work properly
- [ ] **[Agent]** Test validation — Invalid migrations are caught
- [ ] **[Agent]** Verify dependency tracking — Dependencies enforced correctly
- [ ] **[Agent]** Test type generation — TypeScript types generated from schema
- [ ] **[Agent]** Test dry run — Preview works without applying changes
- [ ] **[Human]** Test with real schema changes — Migration system works in production
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **Migration failures**: Handle partial migration failures and cleanup
- **Circular dependencies**: Detect and prevent circular dependency issues
- **Data loss**: Ensure down migrations preserve data or handle loss gracefully
- **Type generation**: Handle type generation failures gracefully
- **Concurrent migrations**: Prevent multiple migration runs simultaneously
- **Schema drift**: Detect and handle schema drift between environments

---

## Out of Scope

- Connection pooling configuration (handled in separate task)
- ElectricSQL sync patterns (handled in separate task)
- PGlite WASM patterns (handled in separate task)
- Database schema design (handled in separate domain)

---

## References

- [Section 6.6 Schema Migration Safety](docs/plan/domain-6/6.6-schema-migration-safety.md)
- [Section 6.1 Philosophy](docs/plan/domain-6/6.1-philosophy.md)
- [Supabase Migrations Documentation](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL Migration Best Practices](https://www.postgresql.org/docs/current/sql-createtable.html)
- [Database Schema Versioning](https://flywaydb.org/documentation/concepts/migrations)

---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-6-007
title: 'Implement automated backup and recovery system'
status: pending # pending | in-progress | blocked | review | done
priority: high # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: 'codex' # agent or human responsible
branch: feat/DOMAIN-6-007-backup-recovery-automation
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-6-007 · Implement automated backup and recovery system

## Objective

Implement comprehensive automated backup and recovery system with scheduled backups, point-in-time recovery, backup verification, disaster recovery procedures, and backup monitoring for the marketing websites platform.

## Context

**Documentation Reference:**

- Connection Pooling Configuration: `docs/plan/domain-6/6.2-connection-pooling-configuration.md` ✅ **COMPLETED**
- Database Architecture: `docs/plan/domain-6/6.1-philosophy.md` ✅ **COMPLETED**
- Schema Migration Safety: `docs/plan/domain-6/6.6-schema-migration-safety.md` ✅ **COMPLETED**

**Current Status:** Basic database exists. Missing automated backup and recovery system.

**Codebase area:** `packages/database/src/backup-recovery.ts` — Backup and recovery automation

**Related files:** `packages/database/src/client.ts`, `packages/database/src/health-monitor.ts`, backup scripts

**Dependencies:** Supabase backup system, Upstash QStash for scheduling, monitoring dashboard

**Prior work:** Basic connection pooling and health monitoring implemented

**Constraints:** Must not impact database performance; backups must be reliable

**2026 Standards Compliance:**

- Automated daily backups with point-in-time recovery
- Backup verification and integrity checking
- Multi-region backup replication
- Disaster recovery testing automation
- Backup monitoring and alerting

## Tech Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| Backup System     | Supabase automated backups            |
| Scheduling        | Upstash QStash for backup scheduling  |
| Recovery          | Point-in-time recovery procedures     |
| Monitoring        | Backup status monitoring and alerting |
| Verification      | Backup integrity checking             |
| Disaster Recovery | Automated disaster recovery testing   |

## Acceptance Criteria

- [ ] **[Agent]** Implement automated daily backup scheduling
- [ ] **[Agent]** Create point-in-time recovery procedures
- [ ] **[Agent]** Add backup verification and integrity checking
- [ ] **[Agent]** Implement backup monitoring and alerting
- [ ] **[Agent]** Create disaster recovery automation
- [ ] **[Agent]** Add backup retention policies
- [ ] **[Agent]** Implement backup restoration testing
- [ ] **[Agent]** Create backup status dashboard
- [ ] **[Agent]** Add backup performance monitoring
- [ ] **[Agent]** Create backup and recovery documentation
- [ ] **[Agent]** Implement comprehensive test suite
- [ ] **[Human]** Verify backup and recovery procedures work

## Implementation Plan

- [ ] **[Agent]** **Create backup scheduler** — Implement automated backup scheduling
- [ ] **[Agent]** **Add backup verification** — Implement integrity checking
- [ ] **[Agent]** **Create recovery procedures** — Implement point-in-time recovery
- [ ] **[Agent]** **Add monitoring system** — Implement backup status monitoring
- [ ] **[Agent]** **Implement disaster recovery** — Create automated disaster recovery
- [ ] **[Agent]** **Create retention policies** — Implement backup lifecycle management
- [ ] **[Agent]** **Add restoration testing** — Implement automated restoration tests
- [ ] **[Agent]** **Build backup dashboard** — Create backup status visualization
- [ ] **[Agent]** **Add documentation** — Document backup and recovery procedures
- [ ] **[Agent]** **Create comprehensive tests** — Test all backup scenarios
- [ ] **[Human]** **Validate backup reliability** — Verify backup and recovery work

> ⚠️ **Agent Question**: Ask human before proceeding if backup scheduling affects production.

## Commands

```bash
# Test backup scheduling
pnpm test:backup-scheduler

# Manual backup creation
pnpm backup:create

# Backup verification
pnpm backup:verify

# Recovery test
pnpm backup:test-recovery

# View backup dashboard
pnpm dev
```

## Code Style

```typescript
// ✅ Correct — Backup and recovery automation implementation
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { tinybird } from '@repo/analytics/tinybird';

// ============================================================================
// BACKUP AND RECOVERY TYPES
// ============================================================================

export interface BackupConfig {
  schedule: string; // cron expression
  retention: number; // days
  regions: string[];
  encryption: boolean;
  compression: boolean;
}

export interface BackupJob {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  size?: number;
  location: string;
  checksum?: string;
  error?: string;
}

export interface RecoveryPoint {
  timestamp: string;
  backupId: string;
  type: 'full' | 'incremental' | 'differential';
  location: string;
  size: number;
  checksum: string;
}

export interface BackupVerification {
  backupId: string;
  status: 'verified' | 'failed';
  checksum: string;
  size: number;
  timestamp: string;
  error?: string;
}

// ============================================================================
// BACKUP AND RECOVERY MANAGER
// ============================================================================

export class BackupRecoveryManager {
  private supabase: ReturnType<typeof createClient>;
  private redis: Redis;
  private config: BackupConfig;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.redis = Redis.fromEnv();
    this.config = {
      schedule: '0 2 * * *', // Daily at 2 AM
      retention: 30, // 30 days
      regions: ['us-east-1', 'eu-west-1'],
      encryption: true,
      compression: true,
    };
  }

  async scheduleBackups(): Promise<void> {
    // Schedule daily backups using QStash
    await fetch('https://q.stash.upstash.com/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.UPSTASH_QSTASH_TOKEN}`,
      },
      body: JSON.stringify({
        cron: this.config.schedule,
        destination: `${process.env.NEXT_PUBLIC_APP_URL}/api/backup/create`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BACKUP_API_TOKEN}`,
        },
      }),
    });
  }

  async createBackup(type: 'full' | 'incremental' | 'differential' = 'full'): Promise<BackupJob> {
    const backupJob: BackupJob = {
      id: crypto.randomUUID(),
      type,
      status: 'pending',
      startTime: new Date().toISOString(),
      location: '',
    };

    try {
      // Update backup job status
      await this.updateBackupJob(backupJob);

      // Create backup using Supabase
      const { data } = await this.supabase.rpc('create_backup', {
        backup_type: type,
        encryption: this.config.encryption,
        compression: this.config.compression,
      });

      backupJob.status = 'running';
      backupJob.location = data.backup_location;
      await this.updateBackupJob(backupJob);

      // Wait for backup completion
      const backupResult = await this.waitForBackupCompletion(backupJob.id);

      backupJob.status = 'completed';
      backupJob.endTime = backupResult.endTime;
      backupJob.size = backupResult.size;
      backupJob.checksum = backupResult.checksum;

      await this.updateBackupJob(backupJob);

      // Verify backup integrity
      await this.verifyBackup(backupJob.id);

      // Store backup metadata
      await this.storeBackupMetadata(backupJob);

      return backupJob;
    } catch (error) {
      backupJob.status = 'failed';
      backupJob.endTime = new Date().toISOString();
      backupJob.error = error instanceof Error ? error.message : 'Unknown error';

      await this.updateBackupJob(backupJob);
      throw error;
    }
  }

  async verifyBackup(backupId: string): Promise<BackupVerification> {
    const backupJob = await this.getBackupJob(backupId);

    if (!backupJob) {
      throw new Error(`Backup job ${backupId} not found`);
    }

    try {
      // Verify backup integrity
      const { data } = await this.supabase.rpc('verify_backup', {
        backup_location: backupJob.location,
        expected_checksum: backupJob.checksum,
      });

      const verification: BackupVerification = {
        backupId,
        status: data.verified ? 'verified' : 'failed',
        checksum: data.actual_checksum,
        size: data.size,
        timestamp: new Date().toISOString(),
      };

      // Store verification result
      await this.storeVerificationResult(verification);

      return verification;
    } catch (error) {
      const verification: BackupVerification = {
        backupId,
        status: 'failed',
        checksum: '',
        size: 0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await this.storeVerificationResult(verification);
      throw error;
    }
  }

  async getRecoveryPoints(): Promise<RecoveryPoint[]> {
    const { data } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .eq('status', 'completed')
      .order('start_time', { ascending: false })
      .limit(this.config.retention);

    return (
      data?.map((job) => ({
        timestamp: job.start_time,
        backupId: job.id,
        type: job.type,
        location: job.location,
        size: job.size,
        checksum: job.checksum,
      })) || []
    );
  }

  async restoreToPointInTime(timestamp: string): Promise<void> {
    // Find the closest backup to the specified timestamp
    const recoveryPoints = await this.getRecoveryPoints();
    const targetBackup = recoveryPoints.find(
      (point) => new Date(point.timestamp) <= new Date(timestamp)
    );

    if (!targetBackup) {
      throw new Error(`No backup found for timestamp ${timestamp}`);
    }

    try {
      // Create a test environment for restoration
      const testEnvironment = await this.createTestEnvironment();

      // Restore backup to test environment
      await this.supabase.rpc('restore_backup', {
        backup_location: targetBackup.location,
        target_environment: testEnvironment,
      });

      // Verify restoration
      const verification = await this.verifyRestoration(testEnvironment);

      if (!verification.success) {
        throw new Error(`Restoration verification failed: ${verification.error}`);
      }

      // Clean up test environment
      await this.cleanupTestEnvironment(testEnvironment);
    } catch (error) {
      throw new Error(`Point-in-time recovery failed: ${error}`);
    }
  }

  async performDisasterRecoveryTest(): Promise<void> {
    const testId = crypto.randomUUID();

    try {
      // Create isolated test environment
      const testEnvironment = await this.createTestEnvironment();

      // Perform full backup and restore cycle
      const backup = await this.createBackup('full');
      await this.verifyBackup(backup.id);

      // Restore to test environment
      await this.supabase.rpc('restore_backup', {
        backup_location: backup.location,
        target_environment: testEnvironment,
      });

      // Verify data integrity
      const verification = await this.verifyRestoration(testEnvironment);

      if (!verification.success) {
        throw new Error(`Disaster recovery test failed: ${verification.error}`);
      }

      // Store test results
      await this.storeDisasterRecoveryTestResult({
        testId,
        status: 'passed',
        timestamp: new Date().toISOString(),
        backupId: backup.id,
        verification,
      });

      // Clean up test environment
      await this.cleanupTestEnvironment(testEnvironment);
    } catch (error) {
      await this.storeDisasterRecoveryTestResult({
        testId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention);

    // Delete old backup jobs
    await this.supabase.from('backup_jobs').delete().lt('start_time', cutoffDate.toISOString());

    // Delete old backup files
    const oldBackups = await this.supabase
      .from('backup_jobs')
      .select('location')
      .lt('start_time', cutoffDate.toISOString());

    for (const backup of oldBackups || []) {
      await this.supabase.rpc('delete_backup_file', {
        backup_location: backup.location,
      });
    }
  }

  async getBackupStatus(): Promise<BackupJob[]> {
    const { data } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(10);

    return data || [];
  }

  // Helper methods
  private async updateBackupJob(backupJob: BackupJob): Promise<void> {
    await this.supabase.from('backup_jobs').upsert({
      id: backupJob.id,
      type: backupJob.type,
      status: backupJob.status,
      start_time: backupJob.startTime,
      end_time: backupJob.endTime,
      size: backupJob.size,
      location: backupJob.location,
      checksum: backupJob.checksum,
      error: backupJob.error,
    });
  }

  private async waitForBackupCompletion(backupId: string): Promise<any> {
    // Poll for backup completion
    let attempts = 0;
    const maxAttempts = 60; // 1 hour timeout

    while (attempts < maxAttempts) {
      const { data } = await this.supabase
        .from('backup_jobs')
        .select('status, end_time, size, checksum')
        .eq('id', backupId)
        .single();

      if (data?.status === 'completed') {
        return data;
      }

      if (data?.status === 'failed') {
        throw new Error(`Backup failed: ${data.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
      attempts++;
    }

    throw new Error('Backup completion timeout');
  }

  private async storeBackupMetadata(backupJob: BackupJob): Promise<void> {
    await tinybird.insert('backup_metadata', [
      {
        backup_id: backupJob.id,
        type: backupJob.type,
        status: backupJob.status,
        start_time: backupJob.startTime,
        end_time: backupJob.endTime,
        size: backupJob.size,
        location: backupJob.location,
      },
    ]);
  }

  private async storeVerificationResult(verification: BackupVerification): Promise<void> {
    await tinybird.insert('backup_verifications', [
      {
        backup_id: verification.backupId,
        status: verification.status,
        checksum: verification.checksum,
        size: verification.size,
        timestamp: verification.timestamp,
      },
    ]);
  }

  private async createTestEnvironment(): Promise<string> {
    const testId = crypto.randomUUID();
    await this.supabase.rpc('create_test_environment', {
      environment_id: testId,
    });
    return testId;
  }

  private async cleanupTestEnvironment(environmentId: string): Promise<void> {
    await this.supabase.rpc('cleanup_test_environment', {
      environment_id: environmentId,
    });
  }

  private async verifyRestoration(environmentId: string): Promise<any> {
    return await this.supabase.rpc('verify_restoration', {
      environment_id: environmentId,
    });
  }

  private async storeDisasterRecoveryTestResult(result: any): Promise<void> {
    await tinybird.insert('disaster_recovery_tests', [result]);
  }

  private async getBackupJob(backupId: string): Promise<BackupJob | null> {
    const { data } = await this.supabase
      .from('backup_jobs')
      .select('*')
      .eq('id', backupId)
      .single();

    return data;
  }
}

// ============================================================================
// BACKUP AND RECOVERY MANAGER INSTANCE
// ============================================================================

export const backupManager = new BackupRecoveryManager();

// ============================================================================
// API ENDPOINTS
// ============================================================================

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'create':
        const type =
          (searchParams.get('type') as 'full' | 'incremental' | 'differential') || 'full';
        const backup = await backupManager.createBackup(type);
        return Response.json({ status: 'ok', data: backup });

      case 'verify':
        const backupId = searchParams.get('backupId');
        if (!backupId) {
          return Response.json({ error: 'Backup ID required' }, { status: 400 });
        }
        const verification = await backupManager.verifyBackup(backupId);
        return Response.json({ status: 'ok', data: verification });

      case 'restore':
        const timestamp = searchParams.get('timestamp');
        if (!timestamp) {
          return Response.json({ error: 'Timestamp required' }, { status: 400 });
        }
        await backupManager.restoreToPointInTime(timestamp);
        return Response.json({ status: 'ok', message: 'Restore initiated' });

      case 'disaster-test':
        await backupManager.performDisasterRecoveryTest();
        return Response.json({ status: 'ok', message: 'Disaster recovery test completed' });

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Backup and recovery operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await backupManager.getBackupStatus();
    const recoveryPoints = await backupManager.getRecoveryPoints();

    return Response.json({
      status: 'ok',
      data: {
        backupStatus: status,
        recoveryPoints,
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: 'Failed to get backup status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

**Backup and recovery principles:**

- Automated scheduling reduces human error
- Point-in-time recovery enables flexible restoration
- Backup verification ensures data integrity
- Disaster recovery testing validates procedures
- Multi-region storage provides redundancy

## Boundaries

| Tier             | Scope                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Schedule automated backups; verify backup integrity; test recovery procedures; monitor backup status             |
| ⚠️ **Ask first** | Changing backup schedule; modifying retention policies; altering recovery procedures; changing backup locations  |
| 🚫 **Never**     | Skip backup verification; ignore backup failures; modify production data without backup; bypass recovery testing |

## Success Verification

- [ ] **[Agent]** Test backup scheduling — automated backups created
- [ ] **[Agent]** Test backup creation — backups created successfully
- [ ] **[Agent]** Test backup verification — integrity checks pass
- [ ] **[Agent]** Test point-in-time recovery — restoration works
- [ ] **[Agent]** Test disaster recovery — automated tests pass
- [ ] **[Agent]** Test backup monitoring — status tracking works
- [ ] **[Agent]** Test cleanup procedures — old backups removed
- [ ] **[Agent]** Test API endpoints — all endpoints responding
- [ ] **[Agent]** Run performance tests — backup overhead < 5%
- [ ] **[Human]** Validate recovery procedures — data restored correctly
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

## Edge Cases & Gotchas

- **Backup Size**: Large databases may require incremental backups
- **Network Latency**: Multi-region backups may have latency issues
- **Storage Costs**: Monitor backup storage costs across regions
- **Recovery Time**: Point-in-time recovery may take time for large databases
- **Backup Encryption**: Ensure encryption keys are properly managed
- **Test Environment**: Isolated test environments must not affect production

## Out of Scope

- Application-level backup (code, assets)
- Database server configuration backup
- Network infrastructure backup
- User data export features
- Real-time replication setup

## References

- [Supabase Backup Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)
- [Database Recovery Procedures](https://www.postgresql.org/docs/current/recovery.html)
- [Disaster Recovery Planning](https://www.postgresql.org/docs/current/high-availability.html)
- [Backup Verification Techniques](https://www.postgresql.org/docs/current/continuous-archiving.html)

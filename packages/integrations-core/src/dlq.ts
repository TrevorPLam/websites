/**
 * @file packages/integrations-core/src/dlq.ts
 * @summary Dead Letter Queue for failed integration requests
 * @see tasks/infrastructure-3-integration-resilience.md
 *
 * Purpose: Stores failed requests after max retries for manual review or
 *          automatic reprocessing, preventing data loss.
 *
 * Exports / Entry: addToDLQ, getDLQEntries, processDLQEntry
 * Used by: ResilientHttpClient, integration packages
 *
 * Invariants:
 * - DLQ entries include full request context
 * - Entries can be reprocessed or manually reviewed
 * - Storage is in-memory (use Redis/Postgres for production)
 *
 * Status: @public
 */

export interface DLQEntry {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  error: string;
  timestamp: string;
  retryCount: number;
  integration: string;
}

// In-memory DLQ (use Redis or Postgres for production)
const dlqStore: DLQEntry[] = [];

/**
 * Adds a failed request to the Dead Letter Queue
 *
 * @param entry - DLQ entry with request and error details
 * @returns Entry ID
 */
export async function addToDLQ(entry: Omit<DLQEntry, 'id' | 'timestamp'>): Promise<string> {
  const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const dlqEntry: DLQEntry = {
    ...entry,
    id,
    timestamp: new Date().toISOString(),
  };

  dlqStore.push(dlqEntry);

  // TODO: In production, store in Redis or Postgres
  // await redis.lpush('dlq', JSON.stringify(dlqEntry));

  return id;
}

/**
 * Gets DLQ entries (optionally filtered by integration)
 *
 * @param integration - Optional integration name filter
 * @returns Array of DLQ entries
 */
export async function getDLQEntries(integration?: string): Promise<DLQEntry[]> {
  if (integration) {
    return dlqStore.filter((entry) => entry.integration === integration);
  }
  return [...dlqStore];
}

/**
 * Processes a DLQ entry (removes from queue after processing)
 *
 * @param entryId - ID of DLQ entry to process
 * @returns Processed entry or null if not found
 */
export async function processDLQEntry(entryId: string): Promise<DLQEntry | null> {
  const index = dlqStore.findIndex((entry) => entry.id === entryId);
  if (index === -1) {
    return null;
  }

  const entry = dlqStore[index];
  dlqStore.splice(index, 1);

  return entry;
}

/**
 * Clears all DLQ entries (use with caution)
 */
export async function clearDLQ(): Promise<void> {
  dlqStore.length = 0;
}

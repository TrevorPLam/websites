/**
 * @file packages/infrastructure/experiments/feature-flags.ts
 * @summary Deterministic feature flag evaluation with kill-switch support.
 * @description Evaluates feature flags for a given tenant/user context using
 *   a deterministic hash so the same user always gets the same experience.
 *   Supports:
 *   - Boolean flags (on/off)
 *   - Percentage rollouts (0–100)
 *   - Kill-switches that override all rules and force a specific state
 *   - Tenant-specific overrides
 *
 *   Flag definitions are stored in-memory (e.g. loaded from Edge Config at
 *   startup) and evaluated without any I/O, making this safe for Edge Runtime.
 *
 * @security Flag evaluation never exposes internal flag configurations to
 *   clients; only the resolved boolean/string value is returned.
 * @requirements TASK-011, TASK-AI-004-REV
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single feature flag rule. */
export interface FeatureFlag {
  /** Unique flag identifier, e.g. `"ab-testing-v2"`. */
  id: string;
  /** Human-readable description. */
  description?: string;
  /** Global default state when no other rule matches. */
  defaultEnabled: boolean;
  /**
   * Percentage of users (0–100) to enable this flag for, based on a hash of
   * `userId + flagId`. Only applies when `defaultEnabled` is `false`.
   */
  rolloutPercentage?: number;
  /**
   * Tenant-specific overrides. Takes precedence over rollout percentage.
   * Key: tenantId, Value: enabled state.
   */
  tenantOverrides?: Record<string, boolean>;
  /**
   * Kill-switch: when set, overrides ALL other rules and forces this state.
   * Use to immediately disable a flag in production without a deployment.
   */
  killSwitch?: boolean;
}

export interface FlagContext {
  /** User or session identifier used for deterministic rollout hashing. */
  userId: string;
  /** Tenant identifier for tenant-specific overrides. */
  tenantId: string;
}

export interface FlagEvaluationResult {
  enabled: boolean;
  /** How the decision was reached. */
  reason: 'kill-switch' | 'tenant-override' | 'rollout' | 'default';
}

// ─── Internal hash ───────────────────────────────────────────────────────────

/**
 * Deterministic FNV-1a 32-bit hash returning a bucket in [0, 100).
 * Pure JS — no crypto module needed, Edge-compatible.
 */
function hashToBucket(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // force unsigned 32-bit
  }
  return hash % 100;
}

// ─── FlagRegistry ────────────────────────────────────────────────────────────

/**
 * In-memory feature flag registry with deterministic evaluation.
 * Load flag definitions from Edge Config or environment at startup.
 */
export class FlagRegistry {
  private readonly flags = new Map<string, FeatureFlag>();

  /** Register or replace a flag definition. */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.id, flag);
  }

  /** Register multiple flags at once. */
  registerAll(flags: FeatureFlag[]): void {
    for (const flag of flags) {
      this.register(flag);
    }
  }

  /**
   * Evaluate a flag for a given context.
   *
   * @returns The resolved enabled state and the reason for the decision.
   *          Returns `{ enabled: false, reason: 'default' }` for unknown flags.
   */
  evaluate(flagId: string, context: FlagContext): FlagEvaluationResult {
    const flag = this.flags.get(flagId);

    if (!flag) {
      return { enabled: false, reason: 'default' };
    }

    // 1. Kill-switch always wins
    if (flag.killSwitch !== undefined) {
      return { enabled: flag.killSwitch, reason: 'kill-switch' };
    }

    // 2. Tenant-specific override
    const tenantOverride = flag.tenantOverrides?.[context.tenantId];
    if (tenantOverride !== undefined) {
      return { enabled: tenantOverride, reason: 'tenant-override' };
    }

    // 3. Percentage rollout
    if (!flag.defaultEnabled && flag.rolloutPercentage !== undefined) {
      const bucket = hashToBucket(`${context.userId}:${flagId}`);
      const enabled = bucket < flag.rolloutPercentage;
      return { enabled, reason: 'rollout' };
    }

    // 4. Global default
    return { enabled: flag.defaultEnabled, reason: 'default' };
  }

  /** Check whether a flag is enabled (convenience wrapper). */
  isEnabled(flagId: string, context: FlagContext): boolean {
    return this.evaluate(flagId, context).enabled;
  }

  /** Return all registered flag IDs. */
  listFlags(): string[] {
    return [...this.flags.keys()];
  }
}

// ─── Singleton registry ───────────────────────────────────────────────────────

const globalRegistry = new FlagRegistry();

/**
 * Evaluate a feature flag against the global singleton registry.
 *
 * @example
 * ```ts
 * evaluateFlag('ab-testing-v2', { userId: 'user_123', tenantId: 'tenant_xyz' });
 * ```
 */
export function evaluateFlag(flagId: string, context: FlagContext): FlagEvaluationResult {
  return globalRegistry.evaluate(flagId, context);
}

/** Register flags into the global singleton registry. */
export function registerFlags(flags: FeatureFlag[]): void {
  globalRegistry.registerAll(flags);
}

export { globalRegistry };

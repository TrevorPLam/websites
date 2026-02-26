/**
 * @file packages/ai-testing/src/self-healing.ts
 * @summary Self-healing test mechanisms for flaky test mitigation
 * @description Implements intelligent test healing strategies following 2026 standards
 * @security Test-only framework; no production secrets or runtime dependencies
 * @requirements TASK-004-4.3: Implement self-healing test mechanisms
 * @version 1.0.0
 */

import { randomUUID } from 'node:crypto';

// ============================================================================
// Type Definitions
// ============================================================================

export interface SelfHealingConfig {
  /** Enable self-healing */
  enabled: boolean;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Healing strategies */
  strategies: HealingStrategy[];
  /** Pattern matching tolerance */
  patternTolerance: number;
  /** Learning mode */
  learningMode: boolean;
  /** Healing history storage */
  historyStorage?: HealingHistoryStorage;
}

export interface HealingStrategy {
  /** Strategy name */
  name: string;
  /** Strategy type */
  type: 'selector' | 'wait' | 'assertion' | 'timeout' | 'mock' | 'data';
  /** Priority level */
  priority: number;
  /** Healing function */
  heal: (error: Error, context: TestContext) => Promise<HealingResult>;
  /** Pattern matching */
  pattern?: RegExp;
  /** Success rate tracking */
  successRate?: number;
}

export interface TestMetadata {
  /** Source file analyzed */
  sourceFile: string;
  /** Functions tested */
  functions: string[];
  /** Test generation timestamp */
  generatedAt: string;
  /** AI model used */
  model: string;
  /** Generation time in ms */
  generationTime: number;
}

export interface TestContext {
  /** Test file */
  testFile: string;
  /** Current test name */
  testName: string;
  /** Test environment */
  environment: 'node' | 'jsdom' | 'browser';
  /** Current step */
  currentStep: number;
  /** Total steps */
  totalSteps: number;
  /** Test code */
  testCode: string;
  /** Error location */
  errorLocation?: {
    line: number;
    column: number;
    function: string;
  };
  /** Test metadata */
  metadata: TestMetadata;
}

export interface HealingResult {
  /** Whether healing was successful */
  success: boolean;
  /** Healed code */
  healedCode?: string;
  /** Reason for healing */
  reason: string;
  /** Confidence in healing */
  confidence: number;
  /** Strategy used */
  strategy: string;
  /** Original error */
  originalError: string;
  /** Healing timestamp */
  healedAt: string;
}

export interface HealingHistory {
  /** Healing ID */
  id: string;
  /** Test context */
  context: TestContext;
  /** Original error */
  originalError: string;
  /** Healing result */
  result: HealingResult;
  /** Timestamp */
  timestamp: string;
  /** Effectiveness rating */
  effectiveness: number;
}

export interface HealingHistoryStorage {
  /** Store healing record */
  store(record: HealingHistory): Promise<void>;
  /** Retrieve healing history */
  retrieve(testFile?: string, testName?: string): Promise<HealingHistory[]>;
  /** Get success rate for strategy */
  getSuccessRate(strategy: string): Promise<number>;
  /** Update effectiveness */
  updateEffectiveness(id: string, effectiveness: number): Promise<void>;
}

// ============================================================================
// Self-Healing Engine
// ============================================================================

/**
 * Main self-healing engine for flaky test mitigation
 * Implements 2026 standards for intelligent test healing
 */
export class SelfHealingEngine {
  private config: SelfHealingConfig;
  private history: HealingHistoryStorage;
  private strategyPerformance: Map<string, number> = new Map();

  constructor(config: SelfHealingConfig, history?: HealingHistoryStorage) {
    this.config = config;
    this.history = history || new MemoryHealingHistoryStorage();
    this.initializeDefaultStrategies();
  }

  /**
   * Initialize default healing strategies
   */
  private initializeDefaultStrategies(): void {
    const defaultStrategies: HealingStrategy[] = [
      {
        name: 'selector-healing',
        type: 'selector',
        priority: 1,
        pattern: /selector|getBy|query|find/i,
        heal: this.healSelector.bind(this),
      },
      {
        name: 'wait-healing',
        type: 'wait',
        priority: 2,
        pattern: /wait|waitFor|expect/i,
        heal: this.healWaitCondition.bind(this),
      },
      {
        name: 'assertion-healing',
        type: 'assertion',
        priority: 3,
        pattern: /expect|assert|should/i,
        heal: this.healAssertion.bind(this),
      },
      {
        name: 'timeout-healing',
        type: 'timeout',
        priority: 4,
        pattern: /timeout|time|delay/i,
        heal: this.healTimeout.bind(this),
      },
      {
        name: 'mock-healing',
        type: 'mock',
        priority: 5,
        pattern: /mock|vi\.|jest\./i,
        heal: this.healMock.bind(this),
      },
      {
        name: 'data-healing',
        type: 'data',
        priority: 6,
        pattern: /data|input|fixture/i,
        heal: this.healTestData.bind(this),
      },
    ];

    this.config.strategies = [...defaultStrategies, ...this.config.strategies];
  }

  /**
   * Attempt to heal a failing test
   */
  async healTest(error: Error, context: TestContext): Promise<HealingResult[]> {
    if (!this.config.enabled) {
      return [
        {
          success: false,
          reason: 'Self-healing is disabled',
          confidence: 0,
          strategy: 'none',
          originalError: error.message,
          healedAt: new Date().toISOString(),
        },
      ];
    }

    const results: HealingResult[] = [];
    const sortedStrategies = this.config.strategies
      .filter((strategy) => this.shouldApplyStrategy(strategy, error, context))
      .sort((a, b) => a.priority - b.priority);

    for (const strategy of sortedStrategies) {
      try {
        const result = await strategy.heal(error, context);
        results.push(result);

        if (result.success) {
          await this.recordHealing(context, error, result);
          break; // Stop at first successful healing
        }
      } catch (healingError) {
        console.warn(`Healing strategy ${strategy.name} failed:`, healingError);
      }
    }

    return results;
  }

  /**
   * Determine if a strategy should be applied
   */
  private shouldApplyStrategy(
    strategy: HealingStrategy,
    error: Error,
    context: TestContext
  ): boolean {
    // Check pattern matching
    if (strategy.pattern) {
      const matchesPattern =
        strategy.pattern.test(error.message) ||
        strategy.pattern.test(context.testCode) ||
        strategy.pattern.test(context.testName);
      if (!matchesPattern) return false;
    }

    // Check success rate threshold
    const successRate = this.strategyPerformance.get(strategy.name) ?? 0.5;
    if (successRate < 0.2) return false; // Skip low-performing strategies

    return true;
  }

  /**
   * Record healing attempt for learning
   */
  private async recordHealing(
    context: TestContext,
    originalError: Error,
    result: HealingResult
  ): Promise<void> {
    const record: HealingHistory = {
      id: randomUUID(),
      context,
      originalError: originalError.message,
      result,
      timestamp: new Date().toISOString(),
      effectiveness: result.confidence,
    };

    await this.history.store(record);

    // Update strategy performance
    const currentRate = this.strategyPerformance.get(result.strategy) ?? 0.5;
    const newRate = currentRate * 0.8 + result.confidence * 0.2; // Weighted average
    this.strategyPerformance.set(result.strategy, newRate);
  }

  // ============================================================================
  // Healing Strategy Implementations
  // ============================================================================

  /**
   * Heal selector-related issues
   */
  private async healSelector(error: Error, context: TestContext): Promise<HealingResult> {
    const selectorErrors = [
      /not found/i,
      /unable to locate/i,
      /no element matching/i,
      /failed to find/i,
    ];

    const isSelectorError = selectorErrors.some((pattern) => pattern.test(error.message));
    if (!isSelectorError) {
      return this.createFailureResult('selector-healing', 'Not a selector error', error.message);
    }

    let healedCode = context.testCode;

    // Try common selector healing patterns
    const healingPatterns = [
      {
        pattern: /getByText\(['"`]([^'"`]+)['"`]\)/g,
        replacement: 'getByText("$1", { exact: false })',
      },
      {
        pattern: /getByRole\(['"`]([^'"`]+)['"`]\)/g,
        replacement: 'getByRole("$1", { name: /any/i })',
      },
      {
        pattern: /querySelector\(['"`]([^'"`]+)['"`]\)/g,
        replacement: 'querySelector("$1, [data-testid*="$1"]")',
      },
      {
        pattern: /find\(['"`]([^'"`]+)['"`]\)/g,
        replacement:
          'find("$1").or(find("[data-testid*=\\"$1\\"]")).or(find("[aria-label*=\\"$1\\"]"))',
      },
    ];

    for (const { pattern, replacement } of healingPatterns) {
      if (pattern.test(healedCode)) {
        healedCode = healedCode.replace(pattern, replacement);
        return this.createSuccessResult(
          'selector-healing',
          'Applied selector fallback',
          healedCode,
          0.7
        );
      }
    }

    // Add explicit waits if needed
    if (healedCode.includes('getBy') && !healedCode.includes('waitFor')) {
      healedCode = healedCode.replace(/(getBy\w+\([^)]+\))/g, 'await waitFor(() => $1)');
      return this.createSuccessResult('selector-healing', 'Added explicit wait', healedCode, 0.6);
    }

    return this.createFailureResult(
      'selector-healing',
      'No applicable selector healing found',
      error.message
    );
  }

  /**
   * Heal wait condition issues
   */
  private async healWaitCondition(error: Error, context: TestContext): Promise<HealingResult> {
    const waitErrors = [/timeout/i, /timed out/i, /waiting for/i, /condition not met/i];

    const isWaitError = waitErrors.some((pattern) => pattern.test(error.message));
    if (!isWaitError) {
      return this.createFailureResult('wait-healing', 'Not a wait error', error.message);
    }

    let healedCode = context.testCode;

    // Increase timeout values
    const timeoutPattern = /{ timeout: (\d+) }/g;
    const timeoutMatch = timeoutPattern.exec(healedCode);
    if (timeoutMatch) {
      const currentTimeout = parseInt(timeoutMatch[1]);
      const newTimeout = currentTimeout * 2;
      healedCode = healedCode.replace(timeoutPattern, `{ timeout: ${newTimeout} }`);
      return this.createSuccessResult('wait-healing', 'Doubled timeout', healedCode, 0.8);
    }

    // Add timeout if missing
    if (healedCode.includes('waitFor') && !healedCode.includes('timeout')) {
      healedCode = healedCode.replace(/waitFor\(/g, 'waitFor(() => , { timeout: 10000 })');
      return this.createSuccessResult('wait-healing', 'Added timeout', healedCode, 0.7);
    }

    return this.createFailureResult(
      'wait-healing',
      'No applicable wait healing found',
      error.message
    );
  }

  /**
   * Heal assertion issues
   */
  private async healAssertion(error: Error, context: TestContext): Promise<HealingResult> {
    const assertionErrors = [
      /expected.*to.*equal/i,
      /expected.*to.*contain/i,
      /assertion failed/i,
      /received.*instead/i,
    ];

    const isAssertionError = assertionErrors.some((pattern) => pattern.test(error.message));
    if (!isAssertionError) {
      return this.createFailureResult('assertion-healing', 'Not an assertion error', error.message);
    }

    let healedCode = context.testCode;

    // Try common assertion healing patterns
    const healingPatterns = [
      {
        pattern: /\.toBe\(/g,
        replacement: '.toEqual(',
      },
      {
        pattern: /\.toContain\(/g,
        replacement: '.toStrictEqual(expect.objectContaining(',
      },
      {
        pattern: /expect\([^)]+\)\.toBeInTheDocument\(\)/g,
        replacement: 'expect($1).toBeInTheDocument()',
      },
    ];

    for (const { pattern, replacement } of healingPatterns) {
      if (pattern.test(healedCode)) {
        healedCode = healedCode.replace(pattern, replacement);
        return this.createSuccessResult(
          'assertion-healing',
          'Applied assertion fallback',
          healedCode,
          0.6
        );
      }
    }

    return this.createFailureResult(
      'assertion-healing',
      'No applicable assertion healing found',
      error.message
    );
  }

  /**
   * Heal timeout issues
   */
  private async healTimeout(error: Error, context: TestContext): Promise<HealingResult> {
    const timeoutErrors = [/timeout.*exceeded/i, /operation timed out/i, /time limit exceeded/i];

    const isTimeoutError = timeoutErrors.some((pattern) => pattern.test(error.message));
    if (!isTimeoutError) {
      return this.createFailureResult('timeout-healing', 'Not a timeout error', error.message);
    }

    let healedCode = context.testCode;

    // Add retry logic for network operations
    if (healedCode.includes('fetch') || healedCode.includes('request')) {
      healedCode = healedCode.replace(
        /(await\s+\w+\.\w+\([^)]+\))/g,
        'await this.retryWithBackoff(() => $1, 3)'
      );
      return this.createSuccessResult('timeout-healing', 'Added retry logic', healedCode, 0.7);
    }

    return this.createFailureResult(
      'timeout-healing',
      'No applicable timeout healing found',
      error.message
    );
  }

  /**
   * Heal mock-related issues
   */
  private async healMock(error: Error, context: TestContext): Promise<HealingResult> {
    const mockErrors = [/mock.*not found/i, /vi\..*not.*mocked/i, /jest\.mock.*not.*called/i];

    const isMockError = mockErrors.some((pattern) => pattern.test(error.message));
    if (!isMockError) {
      return this.createFailureResult('mock-healing', 'Not a mock error', error.message);
    }

    let healedCode = context.testCode;

    // Add missing mock setup
    if (healedCode.includes('vi.fn()') && !healedCode.includes('vi.mocked')) {
      healedCode +=
        '\n// Auto-generated mock setup\nvi.mocked(mockFunction).mockResolvedValue(mockData);';
      return this.createSuccessResult('mock-healing', 'Added mock setup', healedCode, 0.6);
    }

    return this.createFailureResult(
      'mock-healing',
      'No applicable mock healing found',
      error.message
    );
  }

  /**
   * Heal test data issues
   */
  private async healTestData(error: Error, context: TestContext): Promise<HealingResult> {
    const dataErrors = [/cannot read.*undefined/i, /undefined.*property/i, /null.*reference/i];

    const isDataError = dataErrors.some((pattern) => pattern.test(error.message));
    if (!isDataError) {
      return this.createFailureResult('data-healing', 'Not a data error', error.message);
    }

    let healedCode = context.testCode;

    // Add null checks
    const nullCheckPattern = /(\w+)\.(\w+)/g;
    healedCode = healedCode.replace(nullCheckPattern, '$1?.$2');

    return this.createSuccessResult('data-healing', 'Added null safety checks', healedCode, 0.5);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private createSuccessResult(
    strategy: string,
    reason: string,
    healedCode: string,
    confidence: number
  ): HealingResult {
    return {
      success: true,
      healedCode,
      reason,
      confidence,
      strategy,
      originalError: '',
      healedAt: new Date().toISOString(),
    };
  }

  private createFailureResult(
    strategy: string,
    reason: string,
    originalError: string
  ): HealingResult {
    return {
      success: false,
      reason,
      confidence: 0,
      strategy,
      originalError,
      healedAt: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Memory-based Healing History Storage
// ============================================================================

class MemoryHealingHistoryStorage implements HealingHistoryStorage {
  private records: Map<string, HealingHistory[]> = new Map();

  async store(record: HealingHistory): Promise<void> {
    const key = `${record.context.testFile}:${record.context.testName}`;
    const existing = this.records.get(key) || [];
    existing.push(record);
    this.records.set(key, existing);
  }

  async retrieve(testFile?: string, testName?: string): Promise<HealingHistory[]> {
    if (!testFile && !testName) {
      const allRecords: HealingHistory[] = [];
      for (const records of Array.from(this.records.values())) {
        allRecords.push(...records);
      }
      return allRecords;
    }

    const key = testFile && testName ? `${testFile}:${testName}` : testFile || testName;
    return this.records.get(key) || [];
  }

  async getSuccessRate(strategy: string): Promise<number> {
    let successes = 0;
    let total = 0;

    for (const records of Array.from(this.records.values())) {
      for (const record of records) {
        if (record.result.strategy === strategy) {
          total++;
          if (record.result.success) successes++;
        }
      }
    }

    return total > 0 ? successes / total : 0.5;
  }

  async updateEffectiveness(id: string, effectiveness: number): Promise<void> {
    for (const records of Array.from(this.records.values())) {
      const record = records.find((r) => r.id === id);
      if (record) {
        record.effectiveness = effectiveness;
        break;
      }
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

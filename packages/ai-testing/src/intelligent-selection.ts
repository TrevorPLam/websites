/**
 * @file packages/ai-testing/src/intelligent-selection.ts
 * @summary Intelligent test selection based on code changes and impact analysis
 * @description Implements smart test selection algorithms following 2026 standards
 * @security Test-only framework; no production secrets or runtime dependencies
 * @requirements TASK-004-4.4: Add intelligent test selection based on code changes
 * @version 1.0.0
 */

import { readFile } from 'node:fs/promises';

// ============================================================================
// Type Definitions
// ============================================================================

export interface IntelligentSelectionConfig {
  /** Enable intelligent selection */
  enabled: boolean;
  /** Impact analysis weights */
  weights: ImpactWeights;
  /** Selection strategy */
  strategy: 'coverage' | 'impact' | 'risk' | 'hybrid';
  /** Maximum tests to run */
  maxTests: number;
  /** Cache duration in minutes */
  cacheDuration: number;
  /** Minimum confidence threshold */
  confidenceThreshold: number;
}

export interface ImpactWeights {
  /** Weight for code changes */
  codeChange: number;
  /** Weight for dependency changes */
  dependencyChange: number;
  /** Weight for test failure history */
  failureHistory: number;
  /** Weight for criticality */
  criticality: number;
  /** Weight for test complexity */
  complexity: number;
  /** Weight for execution time */
  executionTime: number;
}

export interface CodeChange {
  /** File path */
  filePath: string;
  /** Change type */
  changeType: 'added' | 'modified' | 'deleted' | 'moved';
  /** Lines added */
  linesAdded: number;
  /** Lines removed */
  linesRemoved: number;
  /** Functions affected */
  functionsAffected: string[];
  /** Dependencies changed */
  dependenciesChanged: string[];
  /** Change timestamp */
  timestamp: string;
}

export interface TestImpact {
  /** Test file path */
  testFile: string;
  /** Impact score */
  impactScore: number;
  /** Confidence level */
  confidence: number;
  /** Reasons for selection */
  reasons: string[];
  /** Estimated execution time */
  estimatedTime: number;
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Dependencies affected */
  dependencies: string[];
}

export interface TestSelectionResult {
  /** Selected tests */
  selectedTests: TestImpact[];
  /** Skipped tests */
  skippedTests: string[];
  /** Total impact score */
  totalImpact: number;
  /** Estimated execution time */
  estimatedTime: number;
  /** Selection strategy used */
  strategy: string;
  /** Selection timestamp */
  timestamp: string;
  /** Cache hit */
  cacheHit: boolean;
}

export interface TestMetadata {
  /** Test file path */
  filePath: string;
  /** Test name */
  testName: string;
  /** Source files covered */
  sourceFiles: string[];
  /** Functions tested */
  functions: string[];
  /** Execution time in ms */
  executionTime: number;
  /** Failure rate */
  failureRate: number;
  /** Last run timestamp */
  lastRun: string;
  /** Coverage percentage */
  coverage: number;
  /** Criticality level */
  criticality: 'low' | 'medium' | 'high' | 'critical';
  /** Dependencies */
  dependencies: string[];
  /** Tags */
  tags: string[];
}

// ============================================================================
// Intelligent Test Selection Engine
// ============================================================================

/**
 * Main intelligent test selection engine
 * Implements 2026 standards for smart test selection
 */
export class IntelligentTestSelection {
  private config: IntelligentSelectionConfig;
  private testMetadata: Map<string, TestMetadata> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private selectionCache: Map<string, TestSelectionResult> = new Map();

  constructor(config: IntelligentSelectionConfig) {
    this.config = config;
    this.initializeDefaultWeights();
  }

  /**
   * Initialize default impact weights
   */
  private initializeDefaultWeights(): void {
    this.config.weights = {
      codeChange: 0.4,
      dependencyChange: 0.3,
      failureHistory: 0.2,
      criticality: 0.1,
      complexity: 0.05,
      executionTime: 0.05,
    };
  }

  /**
   * Select tests to run based on code changes
   */
  async selectTests(changes: CodeChange[]): Promise<TestSelectionResult> {
    if (!this.config.enabled) {
      return this.createFallbackResult(changes);
    }

    const cacheKey = this.generateCacheKey(changes);
    const cached = this.selectionCache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return { ...cached, cacheHit: true };
    }

    const startTime = Date.now();

    // Analyze impact of changes
    const impacts = await this.analyzeImpact(changes);

    // Apply selection strategy
    const selectedTests = this.applySelectionStrategy(impacts);

    // Limit to maximum tests
    const limitedTests = this.limitTests(selectedTests);

    const result: TestSelectionResult = {
      selectedTests: limitedTests,
      skippedTests: this.getSkippedTests(impacts, limitedTests),
      totalImpact: this.calculateTotalImpact(limitedTests),
      estimatedTime: this.calculateEstimatedTime(limitedTests),
      strategy: this.config.strategy,
      timestamp: new Date().toISOString(),
      cacheHit: false,
    };

    // Cache the result
    this.selectionCache.set(cacheKey, result);

    return result;
  }

  /**
   * Analyze impact of code changes on tests
   */
  private async analyzeImpact(changes: CodeChange[]): Promise<TestImpact[]> {
    const impacts: TestImpact[] = [];

    for (const testMetadata of Array.from(this.testMetadata.values())) {
      const impact = await this.calculateTestImpact(testMetadata, changes);
      if (impact.impactScore > 0) {
        impacts.push(impact);
      }
    }

    return impacts.sort((a, b) => b.impactScore - a.impactScore);
  }

  /**
   * Calculate impact for a specific test
   */
  private async calculateTestImpact(
    testMetadata: TestMetadata,
    changes: CodeChange[]
  ): Promise<TestImpact> {
    let impactScore = 0;
    const reasons: string[] = [];
    const dependencies: string[] = [];

    // Direct file changes
    for (const change of changes) {
      if (testMetadata.sourceFiles.includes(change.filePath)) {
        const directImpact = this.calculateDirectImpact(change, testMetadata);
        impactScore += directImpact.score;
        reasons.push(...directImpact.reasons);
      }
    }

    // Dependency changes
    for (const change of changes) {
      if (this.hasDependencyImpact(testMetadata, change)) {
        const depImpact = this.calculateDependencyImpact(change, testMetadata);
        impactScore += depImpact.score;
        reasons.push(...depImpact.reasons);
        if (!dependencies.includes(change.filePath)) {
          dependencies.push(change.filePath);
        }
      }
    }

    // Failure history adjustment
    const failureAdjustment = this.calculateFailureAdjustment(testMetadata);
    impactScore += failureAdjustment.score;
    reasons.push(...failureAdjustment.reasons);

    // Criticality adjustment
    const criticalityAdjustment = this.calculateCriticalityAdjustment(testMetadata);
    impactScore += criticalityAdjustment.score;
    reasons.push(...criticalityAdjustment.reasons);

    // Calculate confidence
    const confidence = this.calculateConfidence(testMetadata, changes);

    // Determine risk level
    const riskLevel = this.determineRiskLevel(impactScore, testMetadata);

    return {
      testFile: testMetadata.filePath,
      impactScore,
      confidence,
      reasons: reasons.filter((reason, index) => reasons.indexOf(reason) === index), // Remove duplicates
      estimatedTime: testMetadata.executionTime,
      riskLevel,
      dependencies,
    };
  }

  /**
   * Calculate direct impact of file change
   */
  private calculateDirectImpact(
    change: CodeChange,
    testMetadata: TestMetadata
  ): {
    score: number;
    reasons: string[];
  } {
    const score = 0;
    const reasons: string[] = [];

    // Base impact for direct changes
    const baseScore = this.config.weights.codeChange;

    // Adjust based on change type
    switch (change.changeType) {
      case 'added':
        reasons.push(`Source file added: ${change.filePath}`);
        break;
      case 'modified':
        reasons.push(
          `Source file modified: ${change.filePath} (${change.linesAdded} lines added, ${change.linesRemoved} removed)`
        );
        break;
      case 'deleted':
        reasons.push(`Source file deleted: ${change.filePath} - high impact`);
        break;
      case 'moved':
        reasons.push(`Source file moved: ${change.filePath}`);
        break;
    }

    // Adjust based on lines changed
    const lineImpact = Math.min((change.linesAdded + change.linesRemoved) / 100, 1);

    return {
      score: baseScore * (1 + lineImpact),
      reasons,
    };
  }

  /**
   * Calculate dependency impact
   */
  private calculateDependencyImpact(
    change: CodeChange,
    testMetadata: TestMetadata
  ): {
    score: number;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Check if changed file is a dependency
    if (testMetadata.dependencies.includes(change.filePath)) {
      reasons.push(`Dependency changed: ${change.filePath}`);

      // Higher impact for critical dependencies
      const isCritical = testMetadata.dependencies.some(
        (dep) => dep.includes('core') || dep.includes('infrastructure') || dep.includes('security')
      );

      return {
        score: this.config.weights.dependencyChange * (isCritical ? 1.5 : 1),
        reasons,
      };
    }

    return { score: 0, reasons: [] };
  }

  /**
   * Calculate failure history adjustment
   */
  private calculateFailureAdjustment(testMetadata: TestMetadata): {
    score: number;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (testMetadata.failureRate > 0.1) {
      reasons.push(`High failure rate: ${(testMetadata.failureRate * 100).toFixed(1)}%`);
      return {
        score: this.config.weights.failureHistory * testMetadata.failureRate,
        reasons,
      };
    }

    return { score: 0, reasons: [] };
  }

  /**
   * Calculate criticality adjustment
   */
  private calculateCriticalityAdjustment(testMetadata: TestMetadata): {
    score: number;
    reasons: string[];
  } {
    const reasons: string[] = [];

    const criticalityScores = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      critical: 2.0,
    };

    const score = this.config.weights.criticality * criticalityScores[testMetadata.criticality];

    if (testMetadata.criticality === 'critical') {
      reasons.push('Critical test - always run');
    } else if (testMetadata.criticality === 'high') {
      reasons.push('High priority test');
    }

    return { score, reasons };
  }

  /**
   * Apply selection strategy
   */
  private applySelectionStrategy(impacts: TestImpact[]): TestImpact[] {
    switch (this.config.strategy) {
      case 'coverage':
        return this.applyCoverageStrategy(impacts);
      case 'impact':
        return this.applyImpactStrategy(impacts);
      case 'risk':
        return this.applyRiskStrategy(impacts);
      case 'hybrid':
        return this.applyHybridStrategy(impacts);
      default:
        return impacts;
    }
  }

  /**
   * Coverage-based selection strategy
   */
  private applyCoverageStrategy(impacts: TestImpact[]): TestImpact[] {
    // Prioritize tests with high coverage impact
    return impacts.filter((impact) => impact.confidence >= this.config.confidenceThreshold);
  }

  /**
   * Impact-based selection strategy
   */
  private applyImpactStrategy(impacts: TestImpact[]): TestImpact[] {
    // Prioritize tests with highest impact scores
    return impacts.filter((impact) => impact.impactScore > 0.1);
  }

  /**
   * Risk-based selection strategy
   */
  private applyRiskStrategy(impacts: TestImpact[]): TestImpact[] {
    // Prioritize high-risk tests
    const riskPriority = { critical: 4, high: 3, medium: 2, low: 1 };

    return impacts
      .filter((impact) => riskPriority[impact.riskLevel] >= 2)
      .sort((a, b) => riskPriority[b.riskLevel] - riskPriority[a.riskLevel]);
  }

  /**
   * Hybrid selection strategy
   */
  private applyHybridStrategy(impacts: TestImpact[]): TestImpact[] {
    // Combine multiple factors
    return impacts
      .map((impact) => ({
        ...impact,
        impactScore:
          impact.impactScore * impact.confidence * this.getRiskMultiplier(impact.riskLevel),
      }))
      .filter((impact) => impact.impactScore > 0.05);
  }

  /**
   * Limit tests to maximum configured
   */
  private limitTests(tests: TestImpact[]): TestImpact[] {
    if (tests.length <= this.config.maxTests) {
      return tests;
    }

    // Take top tests by impact score
    return tests.slice(0, this.config.maxTests);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private hasDependencyImpact(testMetadata: TestMetadata, change: CodeChange): boolean {
    return (
      testMetadata.dependencies.includes(change.filePath) ||
      this.dependencyGraph.get(change.filePath)?.has(testMetadata.filePath) ||
      false
    );
  }

  private calculateConfidence(testMetadata: TestMetadata, changes: CodeChange[]): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence for recent test runs
    const daysSinceLastRun = this.getDaysSince(testMetadata.lastRun);
    if (daysSinceLastRun < 7) confidence += 0.2;
    else if (daysSinceLastRun > 30) confidence -= 0.2;

    // Higher confidence for well-covered tests
    if (testMetadata.coverage > 0.8) confidence += 0.1;
    else if (testMetadata.coverage < 0.5) confidence -= 0.1;

    // Higher confidence for stable tests
    if (testMetadata.failureRate < 0.05) confidence += 0.1;
    else if (testMetadata.failureRate > 0.2) confidence -= 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  private determineRiskLevel(
    impactScore: number,
    testMetadata: TestMetadata
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (testMetadata.criticality === 'critical' || impactScore > 0.8) return 'critical';
    if (testMetadata.criticality === 'high' || impactScore > 0.6) return 'high';
    if (impactScore > 0.3) return 'medium';
    return 'low';
  }

  private getRiskMultiplier(riskLevel: string): number {
    const multipliers: Record<string, number> = {
      critical: 2.0,
      high: 1.5,
      medium: 1.0,
      low: 0.5,
    };
    return multipliers[riskLevel] || 1.0;
  }

  private getDaysSince(timestamp: string): number {
    const now = new Date();
    const past = new Date(timestamp);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getSkippedTests(allImpacts: TestImpact[], selectedTests: TestImpact[]): string[] {
    const selectedFiles = new Set(selectedTests.map((t) => t.testFile));
    return allImpacts
      .filter((impact) => !selectedFiles.has(impact.testFile))
      .map((impact) => impact.testFile);
  }

  private calculateTotalImpact(tests: TestImpact[]): number {
    return tests.reduce((sum, test) => sum + test.impactScore, 0);
  }

  private calculateEstimatedTime(tests: TestImpact[]): number {
    return tests.reduce((sum, test) => sum + test.estimatedTime, 0);
  }

  private generateCacheKey(changes: CodeChange[]): string {
    const changeHash = changes
      .map((c) => `${c.filePath}:${c.changeType}:${c.linesAdded}:${c.linesRemoved}`)
      .sort()
      .join('|');

    return require('crypto').createHash('md5').update(changeHash).digest('hex');
  }

  private isCacheValid(result: TestSelectionResult): boolean {
    const cacheAge = this.getDaysSince(result.timestamp);
    return cacheAge < this.config.cacheDuration / 60 / 24; // Convert minutes to days
  }

  private createFallbackResult(changes: CodeChange[]): TestSelectionResult {
    return {
      selectedTests: [],
      skippedTests: [],
      totalImpact: 0,
      estimatedTime: 0,
      strategy: 'fallback',
      timestamp: new Date().toISOString(),
      cacheHit: false,
    };
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  async loadTestMetadata(testFiles: string[]): Promise<void> {
    for (const testFile of testFiles) {
      try {
        const metadata = await this.extractTestMetadata(testFile);
        this.testMetadata.set(testFile, metadata);
      } catch (error) {
        console.warn(`Failed to load metadata for ${testFile}:`, error);
      }
    }
  }

  /**
   * Extract metadata from test file
   */
  private async extractTestMetadata(testFile: string): Promise<TestMetadata> {
    const content = await readFile(testFile, 'utf-8');

    // Simple metadata extraction - in production, use AST parsing
    const metadata: TestMetadata = {
      filePath: testFile,
      testName: this.extractTestName(content),
      sourceFiles: this.extractSourceFiles(content),
      functions: this.extractTestedFunctions(content),
      executionTime: 1000, // Default 1s
      failureRate: 0.05, // Default 5%
      lastRun: new Date().toISOString(),
      coverage: 0.8, // Default 80%
      criticality: 'medium',
      dependencies: this.extractDependencies(content),
      tags: this.extractTags(content),
    };

    return metadata;
  }

  private extractTestName(content: string): string {
    const match = content.match(/describe\(['"`]([^'"`]+)['"`]/);
    return match ? match[1] : 'Unknown Test';
  }

  private extractSourceFiles(content: string): string[] {
    const imports = content.match(/import.*from\s+['"`]([^'"`]+)['"`]/g) || [];
    return imports.map((imp) => {
      const match = imp.match(/from\s+['"`]([^'"`]+)['"`]/);
      return match ? match[1] : '';
    }).filter(Boolean);
  }

  private extractTestedFunctions(content: string): string[] {
    const functions: string[] = [];
    const matches = content.match(/(?:it|test)\(['"`]([^'"`]+)['"`]/g) || [];

    for (const match of matches) {
      const testName = match.match(/['"`]([^'"`]+)['"`]/);
      if (testName) {
        functions.push(testName[1]);
      }
    }

    return functions;
  }

  private extractDependencies(content: string): string[] {
    // Extract @repo dependencies
    const repoImports = content.match(/from\s+['"`]@repo\/([^'"`]+)['"`]/g) || [];
    return repoImports.map((imp) => {
      const match = imp.match(/@repo\/([^'"`]+)/);
      return match ? match[1] : '';
    }).filter(Boolean);
  }

  private extractTags(content: string): string[] {
    const tags: string[] = [];
    const tagMatches = content.match(/@(\w+)/g) || [];
    tags.push(...tagMatches.map((tag) => tag.substring(1)));

    return tags;
  }

// ============================================================================
// Exports
// ============================================================================

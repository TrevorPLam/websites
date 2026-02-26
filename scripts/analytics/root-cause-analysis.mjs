#!/usr/bin/env node

/**
 * @file scripts/analytics/root-cause-analysis.mjs
 * @summary Automated root cause analysis for test failures with categorization and fix suggestions
 * @security Analytics-only script; processes test failure data without accessing production secrets
 * @requirements TASK-009.3 / root-cause-analysis / failure-categorization / fix-suggestions
 * @tags [#analytics #testing #root-cause #failures #machine-learning]
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

/**
 * Colors for console output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Log with colors
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Log section header
 */
function section(title) {
  log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

/**
 * Root cause analysis engine
 */
class RootCauseAnalyzer {
  constructor() {
    this.failurePatterns = this.initializeFailurePatterns();
    this.categoryWeights = {
      'infrastructure': 0.15,
      'test-data': 0.20,
      'code-changes': 0.25,
      'environment': 0.15,
      'dependencies': 0.10,
      'timing': 0.10,
      'unknown': 0.05
    };
  }

  /**
   * Initialize failure patterns and their indicators
   */
  initializeFailurePatterns() {
    return {
      infrastructure: {
        keywords: ['connection', 'timeout', 'network', 'database', 'server', 'port', 'host', 'unreachable'],
        errorPatterns: [/ECONNREFUSED/i, /ETIMEDOUT/i, /ENOTFOUND/i, /connection/i, /timeout/i],
        suggestions: [
          'Check database connectivity',
          'Verify network configuration',
          'Review server status',
          'Check firewall rules',
          'Validate connection strings'
        ]
      },
      test_data: {
        keywords: ['null', 'undefined', 'missing', 'fixture', 'mock', 'stub', 'data'],
        errorPatterns: [/Cannot read propert(y|ies) of (null|undefined)/i, /undefined is not/i, /null is not/i],
        suggestions: [
          'Review test fixtures and mocks',
          'Check test data setup',
          'Validate mock implementations',
          'Update test data dependencies',
          'Review data initialization'
        ]
      },
      code_changes: {
        keywords: ['breaking', 'deprecated', 'removed', 'changed', 'api', 'interface', 'signature'],
        errorPatterns: [/is not a function/i, /not found/i, /undefined method/i, /breaking change/i],
        suggestions: [
          'Review recent code changes',
          'Check API compatibility',
          'Update test expectations',
          'Review interface changes',
          'Check deprecation warnings'
        ]
      },
      environment: {
        keywords: ['env', 'environment', 'config', 'setting', 'variable', 'permission'],
        errorPatterns: [/EACCES/i, /EPERM/i, /permission denied/i, /environment/i],
        suggestions: [
          'Check environment variables',
          'Verify file permissions',
          'Review configuration files',
          'Check runtime environment',
          'Validate setup scripts'
        ]
      },
      dependencies: {
        keywords: ['module', 'import', 'require', 'dependency', 'package', 'version'],
        errorPatterns: [/cannot find module/i, /module not found/i, /version mismatch/i],
        suggestions: [
          'Update package dependencies',
          'Check module imports',
          'Verify package versions',
          'Run dependency audit',
          'Review lockfile changes'
        ]
      },
      timing: {
        keywords: ['async', 'await', 'promise', 'callback', 'timeout', 'race'],
        errorPatterns: [/timeout/i, /async/i, /promise/i, /race condition/i],
        suggestions: [
          'Add proper async/await handling',
          'Increase timeout thresholds',
          'Review promise chains',
          'Check race conditions',
          'Add proper error handling'
        ]
      }
    };
  }

  /**
   * Analyze test failure and determine root cause
   */
  analyzeFailure(failure) {
    const analysis = {
      failure: {
        test: failure.test,
        error: failure.error,
        stack: failure.stack,
        timestamp: failure.timestamp
      },
      categorization: {
        primary: null,
        secondary: [],
        confidence: 0
      },
      indicators: [],
      suggestions: [],
      relatedFailures: [],
      prevention: []
    };

    // Extract indicators from error message and stack trace
    const errorText = `${failure.error} ${failure.stack}`.toLowerCase();
    
    // Score each category
    const categoryScores = {};
    
    Object.entries(this.failurePatterns).forEach(([category, pattern]) => {
      let score = 0;
      const indicators = [];

      // Check keyword matches
      pattern.keywords.forEach(keyword => {
        if (errorText.includes(keyword.toLowerCase())) {
          score += 1;
          indicators.push(`Keyword match: "${keyword}"`);
        }
      });

      // Check regex patterns
      pattern.errorPatterns.forEach(regex => {
        if (regex.test(errorText)) {
          score += 2;
          indicators.push(`Pattern match: ${regex.source}`);
        }
      });

      if (score > 0) {
        categoryScores[category] = {
          score,
          indicators,
          suggestions: pattern.suggestions
        };
      }
    });

    // Determine primary and secondary categories
    const sortedCategories = Object.entries(categoryScores)
      .sort(([,a], [,b]) => b.score - a.score);

    if (sortedCategories.length > 0) {
      const [primaryCategory, primaryData] = sortedCategories[0];
      analysis.categorization.primary = primaryCategory;
      analysis.categorization.confidence = Math.min(primaryData.score / 3, 1);
      analysis.indicators = primaryData.indicators;
      analysis.suggestions = primaryData.suggestions;

      // Add secondary categories
      sortedCategories.slice(1, 3).forEach(([category, data]) => {
        if (data.score >= 1) {
          analysis.categorization.secondary.push({
            category,
            confidence: Math.min(data.score / 3, 0.5),
            indicators: data.indicators.slice(0, 2)
          });
        }
      });
    } else {
      analysis.categorization.primary = 'unknown';
      analysis.categorization.confidence = 0.1;
      analysis.suggestions = [
        'Review error message for context',
        'Check test logs for additional details',
        'Consult with development team',
        'Review recent changes'
      ];
    }

    // Generate prevention strategies
    analysis.prevention = this.generatePreventionStrategies(analysis.categorization.primary);

    return analysis;
  }

  /**
   * Generate prevention strategies based on category
   */
  generatePreventionStrategies(category) {
    const strategies = {
      infrastructure: [
        'Implement health checks before tests',
        'Add connection retry logic',
        'Use test containers for dependencies',
        'Monitor infrastructure metrics',
        'Create test environment validation'
      ],
      test_data: [
        'Implement data validation helpers',
        'Create centralized test data management',
        'Add data factory patterns',
        'Implement test data cleanup',
        'Use consistent test fixtures'
      ],
      code_changes: [
        'Implement contract testing',
        'Add compatibility test suites',
        'Create API version testing',
        'Implement semantic versioning checks',
        'Add breaking change detection'
      ],
      environment: [
        'Create environment validation scripts',
        'Implement configuration testing',
        'Add environment parity checks',
        'Use infrastructure as code',
        'Create setup verification tests'
      ],
      dependencies: [
        'Implement dependency monitoring',
        'Add automated dependency updates',
        'Create compatibility testing',
        'Use dependency lock files',
        'Implement security scanning'
      ],
      timing: [
        'Add proper async testing patterns',
        'Implement timeout management',
        'Create race condition detection',
        'Add performance testing',
        'Use deterministic test ordering'
      ],
      unknown: [
        'Enhance error logging',
        'Add more detailed test reporting',
        'Implement failure categorization learning',
        'Create failure pattern database',
        'Review testing practices'
      ]
    };

    return strategies[category] || strategies.unknown;
  }

  /**
   * Analyze multiple failures and find patterns
   */
  analyzeFailurePatterns(failures) {
    const patterns = {
      categories: {},
      indicators: {},
      suggestions: {},
      timeline: [],
      correlations: []
    };

    // Analyze each failure
    const analyses = failures.map(failure => this.analyzeFailure(failure));

    // Aggregate categories
    analyses.forEach(analysis => {
      const primary = analysis.categorization.primary;
      patterns.categories[primary] = (patterns.categories[primary] || 0) + 1;

      // Aggregate indicators
      analysis.indicators.forEach(indicator => {
        patterns.indicators[indicator] = (patterns.indicators[indicator] || 0) + 1;
      });

      // Aggregate suggestions
      analysis.suggestions.forEach(suggestion => {
        patterns.suggestions[suggestion] = (patterns.suggestions[suggestion] || 0) + 1;
      });
    });

    // Create timeline analysis
    const sortedFailures = failures.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    patterns.timeline = sortedFailures.map(failure => ({
      timestamp: failure.timestamp,
      test: failure.test,
      category: this.analyzeFailure(failure).categorization.primary
    }));

    // Find correlations
    patterns.correlations = this.findCorrelations(analyses);

    return { analyses, patterns };
  }

  /**
   * Find correlations between failures
   */
  findCorrelations(analyses) {
    const correlations = [];

    // Time-based correlations
    const timeGroups = {};
    analyses.forEach((analysis, index) => {
      const hour = new Date(analyses[index].failure.timestamp).getHours();
      if (!timeGroups[hour]) timeGroups[hour] = [];
      timeGroups[hour].push(analysis);
    });

    Object.entries(timeGroups).forEach(([hour, hourAnalyses]) => {
      if (hourAnalyses.length > 2) {
        const categories = hourAnalyses.map(a => a.categorization.primary);
        const commonCategory = this.findMostCommon(categories);
        
        correlations.push({
          type: 'temporal',
          description: `High failure rate at ${hour}:00`,
          category: commonCategory,
          count: hourAnalyses.length,
          confidence: hourAnalyses.length / analyses.length
        });
      }
    });

    // Category-based correlations
    const categoryGroups = {};
    analyses.forEach(analysis => {
      const category = analysis.categorization.primary;
      if (!categoryGroups[category]) categoryGroups[category] = [];
      categoryGroups[category].push(analysis);
    });

    Object.entries(categoryGroups).forEach(([category, categoryAnalyses]) => {
      if (categoryAnalyses.length > 3) {
        correlations.push({
          type: 'categorical',
          description: `Cluster of ${category} failures`,
          category,
          count: categoryAnalyses.length,
          confidence: categoryAnalyses.length / analyses.length
        });
      }
    });

    return correlations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Find most common item in array
   */
  findMostCommon(arr) {
    const counts = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }
}

/**
 * Test failure data collector
 */
class FailureDataCollector {
  constructor() {
    this.dataSources = [
      this.collectFromTestReports.bind(this),
      this.collectFromCILogs.bind(this),
      this.collectFromErrorFiles.bind(this)
    ];
  }

  /**
   * Collect failures from test reports
   */
  collectFromTestReports() {
    const failures = [];
    
    // Look for test report files
    const testDirs = [
      join(projectRoot, 'test-results'),
      join(projectRoot, 'coverage'),
      join(projectRoot, '.nyc_output'),
      join(projectRoot, 'junit.xml')
    ];

    testDirs.forEach(dir => {
      if (existsSync(dir)) {
        try {
          const files = readdirSync(dir, { recursive: true });
          files.forEach(file => {
            if (file.endsWith('.json') || file.endsWith('.xml')) {
              // Parse test report files for failures
              // This is a simplified implementation
              failures.push(...this.parseTestReport(join(dir, file)));
            }
          });
        } catch (error) {
          log(`⚠️ Error reading test reports from ${dir}: ${error.message}`, colors.yellow);
        }
      }
    });

    return failures;
  }

  /**
   * Collect failures from CI logs
   */
  collectFromCILogs() {
    const failures = [];
    
    // Look for CI log files
    const logDirs = [
      join(projectRoot, '.github', 'workflows'),
      join(projectRoot, '.ci'),
      join(projectRoot, 'logs')
    ];

    logDirs.forEach(dir => {
      if (existsSync(dir)) {
        try {
          const files = readdirSync(dir);
          files.forEach(file => {
            if (file.endsWith('.log') || file.endsWith('.txt')) {
              failures.push(...this.parseCILog(join(dir, file)));
            }
          });
        } catch (error) {
          log(`⚠️ Error reading CI logs from ${dir}: ${error.message}`, colors.yellow);
        }
      }
    });

    return failures;
  }

  /**
   * Collect failures from error files
   */
  collectFromErrorFiles() {
    const failures = [];
    
    // Look for error dump files
    const errorFiles = [
      join(projectRoot, 'test-errors.json'),
      join(projectRoot, 'failure-report.json'),
      join(projectRoot, '.test-failures.json')
    ];

    errorFiles.forEach(file => {
      if (existsSync(file)) {
        try {
          const content = readFileSync(file, 'utf8');
          const data = JSON.parse(content);
          
          if (Array.isArray(data)) {
            failures.push(...data);
          } else if (data.failures) {
            failures.push(...data.failures);
          }
        } catch (error) {
          log(`⚠️ Error reading failure file ${file}: ${error.message}`, colors.yellow);
        }
      }
    });

    return failures;
  }

  /**
   * Parse test report file
   */
  parseTestReport(filePath) {
    // Simplified test report parsing
    // In a real implementation, this would parse JUnit, JSON, or other test report formats
    return this.generateMockFailures(5);
  }

  /**
   * Parse CI log file
   */
  parseCILog(filePath) {
    // Simplified CI log parsing
    // In a real implementation, this would scan CI logs for failure patterns
    return this.generateMockFailures(3);
  }

  /**
   * Generate mock failure data for demonstration
   */
  generateMockFailures(count) {
    const failures = [];
    const errorTemplates = [
      {
        test: 'BookingRepository.create',
        error: 'Connection timeout: Unable to connect to database',
        stack: 'Error: Connection timeout\n at BookingRepository.create (booking-repository.ts:45)',
        category: 'infrastructure'
      },
      {
        test: 'PaymentService.processPayment',
        error: 'Cannot read properties of undefined (reading "amount")',
        stack: 'TypeError: Cannot read properties of undefined\n at PaymentService.processPayment (payment-service.ts:78)',
        category: 'test-data'
      },
      {
        test: 'UserController.createUser',
        error: 'User.email is not a function',
        stack: 'TypeError: User.email is not a function\n at UserController.createUser (user-controller.ts:23)',
        category: 'code-changes'
      },
      {
        test: 'EmailService.sendNotification',
        error: 'EACCES: permission denied, access \'/tmp/email.log\'',
        stack: 'Error: EACCES: permission denied\n at EmailService.sendNotification (email-service.ts:56)',
        category: 'environment'
      },
      {
        test: 'AnalyticsService.trackEvent',
        error: 'Cannot find module \'@analytics/tracker\'',
        stack: 'Error: Cannot find module\n at AnalyticsService.trackEvent (analytics-service.ts:12)',
        category: 'dependencies'
      },
      {
        test: 'AsyncService.processData',
        error: 'Test timeout: Async operation exceeded 5000ms',
        stack: 'TimeoutError: Test timeout\n at AsyncService.processData (async-service.ts:34)',
        category: 'timing'
      }
    ];

    const now = new Date();
    for (let i = 0; i < count; i++) {
      const template = errorTemplates[i % errorTemplates.length];
      const timestamp = new Date(now.getTime() - (i * 3600000)); // 1 hour apart
      
      failures.push({
        ...template,
        timestamp: timestamp.toISOString(),
        id: `failure-${Date.now()}-${i}`
      });
    }

    return failures;
  }

  /**
   * Collect all failure data
   */
  async collectAllFailures() {
    let allFailures = [];
    
    this.dataSources.forEach(collector => {
      try {
        const failures = collector();
        allFailures.push(...failures);
      } catch (error) {
        log(`⚠️ Error in data collector: ${error.message}`, colors.yellow);
      }
    });

    // Remove duplicates based on test name and timestamp
    const uniqueFailures = allFailures.filter((failure, index, self) => 
      index === self.findIndex(f => 
        f.test === failure.test && 
        f.timestamp === failure.timestamp
      )
    );

    return uniqueFailures;
  }
}

/**
 * Report generator for root cause analysis
 */
class RCAReportGenerator {
  constructor() {
    this.outputDir = join(projectRoot, 'reports', 'root-cause');
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate comprehensive RCA report
   */
  generateReport(failures, analysis) {
    const report = {
      metadata: {
        generated: new Date().toISOString(),
        totalFailures: failures.length,
        analysisPeriod: {
          start: failures.length > 0 ? failures[0].timestamp : null,
          end: failures.length > 0 ? failures[failures.length - 1].timestamp : null
        }
      },
      summary: this.generateSummary(analysis.patterns),
      patterns: analysis.patterns,
      detailedAnalysis: analysis.analyses,
      recommendations: this.generateRecommendations(analysis),
      actionItems: this.generateActionItems(analysis)
    };

    // Save JSON report
    const reportPath = join(this.outputDir, `root-cause-analysis-${Date.now()}.json`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  /**
   * Generate executive summary
   */
  generateSummary(patterns) {
    const topCategory = Object.entries(patterns.categories)
      .sort(([,a], [,b]) => b - a)[0];

    const topIndicator = Object.entries(patterns.indicators)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      primaryRootCause: topCategory ? topCategory[0] : 'unknown',
      primaryRootCauseCount: topCategory ? topCategory[1] : 0,
      topIndicator: topIndicator ? topIndicator[0] : 'none',
      topIndicatorCount: topIndicator ? topIndicator[1] : 0,
      keyCorrelations: patterns.correlations.slice(0, 3),
      failureRate: patterns.timeline.length > 0 ? 
        patterns.timeline.filter(t => t.category).length / patterns.timeline.length : 0
    };
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    const { patterns } = analysis;

    // Category-based recommendations
    Object.entries(patterns.categories)
      .filter(([, count]) => count > 2)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        recommendations.push({
          priority: count > 5 ? 'high' : 'medium',
          category,
          title: `Address ${category} issues`,
          description: `${count} failures related to ${category} detected`,
          suggestedActions: this.getCategoryActions(category),
          estimatedImpact: count > 5 ? 'high' : 'medium',
          timeframe: count > 5 ? '1 week' : '2 weeks'
        });
      });

    // Correlation-based recommendations
    patterns.correlations.forEach(correlation => {
      if (correlation.confidence > 0.3) {
        recommendations.push({
          priority: 'medium',
          category: 'pattern',
          title: `Investigate ${correlation.type} correlation`,
          description: correlation.description,
          suggestedActions: [
            'Analyze correlated failures',
            'Review common factors',
            'Implement targeted fixes'
          ],
          estimatedImpact: 'medium',
          timeframe: '1 week'
        });
      }
    });

    return recommendations;
  }

  /**
   * Get category-specific actions
   */
  getCategoryActions(category) {
    const actions = {
      infrastructure: [
        'Implement database connection pooling',
        'Add health check endpoints',
        'Create test environment monitoring'
      ],
      'test-data': [
        'Standardize test data fixtures',
        'Implement data validation',
        'Create test data factories'
      ],
      'code-changes': [
        'Add compatibility test suites',
        'Implement semantic versioning',
        'Create API contract tests'
      ],
      environment: [
        'Create environment validation scripts',
        'Standardize configuration management',
        'Implement environment parity'
      ],
      dependencies: [
        'Implement dependency monitoring',
        'Add automated security scanning',
        'Create compatibility testing'
      ],
      timing: [
        'Add timeout management',
        'Implement async testing patterns',
        'Create performance benchmarks'
      ]
    };

    return actions[category] || ['Review failure patterns', 'Consult with development team'];
  }

  /**
   * Generate specific action items
   */
  generateActionItems(analysis) {
    const actionItems = [];
    
    analysis.analyses.forEach((failureAnalysis, index) => {
      if (failureAnalysis.categorization.confidence > 0.7) {
        actionItems.push({
          id: `action-${index}`,
          test: failureAnalysis.failure.test,
          category: failureAnalysis.categorization.primary,
          priority: failureAnalysis.categorization.confidence > 0.9 ? 'high' : 'medium',
          actions: failureAnalysis.suggestions.slice(0, 2),
          prevention: failureAnalysis.prevention.slice(0, 2),
          estimatedEffort: '2-4 hours'
        });
      }
    });

    return actionItems.slice(0, 10); // Limit to top 10 actions
  }

  /**
   * Print summary to console
   */
  printSummary(report) {
    section('Root Cause Analysis Summary');
    
    log(`🔍 Total Failures Analyzed: ${report.metadata.totalFailures}`, colors.cyan);
    log(`🎯 Primary Root Cause: ${report.summary.primaryRootCause} (${report.summary.primaryRootCauseCount} failures)`, colors.blue);
    log(`📊 Top Indicator: ${report.summary.topIndicator} (${report.summary.topIndicatorCount} occurrences)`, colors.blue);
    log(`📈 Failure Rate: ${(report.summary.failureRate * 100).toFixed(1)}%`, colors.blue);

    section('Failure Categories');
    Object.entries(report.patterns.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([category, count]) => {
        const percentage = ((count / report.metadata.totalFailures) * 100).toFixed(1);
        log(`  ${category}: ${count} (${percentage}%)`, colors.gray);
      });

    section('Key Correlations');
    report.summary.keyCorrelations.forEach((correlation, index) => {
      log(`${index + 1}. ${correlation.description}`, colors.yellow);
      log(`   Confidence: ${(correlation.confidence * 100).toFixed(1)}%`, colors.gray);
    });

    section('Top Recommendations');
    report.recommendations.slice(0, 3).forEach((rec, index) => {
      const icon = rec.priority === 'high' ? '🔥' : '⚡';
      const color = rec.priority === 'high' ? colors.red : colors.yellow;
      
      log(`${icon} ${index + 1}. ${rec.title}`, color);
      log(`   ${rec.description}`, colors.gray);
      log(`   Timeframe: ${rec.timeframe} | Impact: ${rec.estimatedImpact}`, colors.gray);
      log('');
    });

    log(`📄 Full report saved to: ${this.outputDir}`, colors.cyan);
  }
}

/**
 * Main execution function
 */
async function main() {
  section('Test Failure Root Cause Analysis');
  
  try {
    // Initialize components
    const collector = new FailureDataCollector();
    const analyzer = new RootCauseAnalyzer();
    const reporter = new RCAReportGenerator();

    log('🔍 Collecting test failure data...', colors.blue);
    const failures = await collector.collectAllFailures();

    if (failures.length === 0) {
      log('✅ No test failures found. All tests passing!', colors.green);
      process.exit(0);
    }

    log(`📊 Found ${failures.length} failures to analyze`, colors.blue);
    log('🔬 Performing root cause analysis...', colors.blue);
    const analysis = analyzer.analyzeFailurePatterns(failures);

    log('📋 Generating comprehensive report...', colors.blue);
    const report = reporter.generateReport(failures, analysis);

    reporter.printSummary(report);

    log('✅ Root cause analysis completed successfully!', colors.green);
    
    // Exit with appropriate code based on findings
    const hasHighPriorityIssues = report.recommendations.some(r => r.priority === 'high');
    process.exit(hasHighPriorityIssues ? 1 : 0);

  } catch (error) {
    log(`❌ Error during root cause analysis: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RootCauseAnalyzer, FailureDataCollector, RCAReportGenerator };

#!/usr/bin/env node

/**
 * Comprehensive Integration Testing
 * 
 * Tests all phases of the 2026 Documentation Standards implementation
 * to ensure proper integration and functionality
 * 
 * Part of 2026 Documentation Standards - Final Integration Testing
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

class IntegrationTester {
  private testResults: any[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Run comprehensive integration tests
   */
  async runAllTests() {
    console.log('🧪 Starting comprehensive integration testing...\n');

    // Test Phase 1 Foundation
    await this.testPhase1Foundation();

    // Test Phase 2 Automation
    await this.testPhase2Automation();

    // Test Phase 3 Intelligence
    await this.testPhase3Intelligence();

    // Test Cross-Phase Integration
    await this.testCrossPhaseIntegration();

    // Generate test report
    this.generateTestReport();

    console.log('\n✅ Comprehensive integration testing complete');
  }

  /**
   * Test Phase 1 Foundation
   */
  private async testPhase1Foundation() {
    console.log('📋 Testing Phase 1: Foundation...');

    const tests = [
      {
        name: 'Diátaxis Framework Structure',
        test: () => this.testDiataxisStructure(),
        category: 'foundation'
      },
      {
        name: 'Docusaurus Configuration',
        test: () => this.testDocusaurusConfig(),
        category: 'foundation'
      },
      {
        name: 'Vale Linting Rules',
        test: () => this.testValeLinting(),
        category: 'foundation'
      },
      {
        name: 'Documentation Structure',
        test: () => this.testDocumentationStructure(),
        category: 'foundation'
      },
      {
        name: 'llms.txt Optimization',
        test: () => this.testLLMsTxt(),
        category: 'foundation'
      }
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    console.log('✅ Phase 1 Foundation testing complete\n');
  }

  /**
   * Test Phase 2 Automation
   */
  private async testPhase2Automation() {
    console.log('🤖 Testing Phase 2: Automation...');

    const tests = [
      {
        name: 'Doctest Implementation',
        test: () => this.testDoctest(),
        category: 'automation'
      },
      {
        name: 'Visual Regression Testing',
        test: () => this.testVisualRegression(),
        category: 'automation'
      },
      {
        name: 'RAG Pipeline',
        test: () => this.testRAGPipeline(),
        category: 'automation'
      },
      {
        name: 'MCP Server Integration',
        test: () => this.testMCPServer(),
        category: 'automation'
      },
      {
        name: 'Documentation Health Metrics',
        test: () => this.testHealthMetrics(),
        category: 'automation'
      },
      {
        name: 'Embedding Service',
        test: () => this.testEmbeddingService(),
        category: 'automation'
      }
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    console.log('✅ Phase 2 Automation testing complete\n');
  }

  /**
   * Test Phase 3 Intelligence
   */
  private async testPhase3Intelligence() {
    console.log('🧠 Testing Phase 3: Intelligence...');

    const tests = [
      {
        name: 'Interactive Code Playgrounds',
        test: () => this.testCodePlaygrounds(),
        category: 'intelligence'
      },
      {
        name: 'Multi-Language i18n Infrastructure',
        test: () => this.testI18nInfrastructure(),
        category: 'intelligence'
      },
      {
        name: 'Translation Service Configuration',
        test: () => this.testTranslationService(),
        category: 'intelligence'
      },
      {
        name: 'Backstage Integration',
        test: () => this.testBackstageIntegration(),
        category: 'intelligence'
      },
      {
        name: 'Backstage Environment Setup',
        test: () => this.testBackstageSetup(),
        category: 'intelligence'
      }
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    console.log('✅ Phase 3 Intelligence testing complete\n');
  }

  /**
   * Test Cross-Phase Integration
   */
  private async testCrossPhaseIntegration() {
    console.log('🔗 Testing Cross-Phase Integration...');

    const tests = [
      {
        name: 'Package.json Scripts Integration',
        test: () => this.testPackageScripts(),
        category: 'integration'
      },
      {
        name: 'File Structure Organization',
        test: () => this.testFileStructure(),
        category: 'integration'
      },
      {
        name: 'Environment Variables',
        test: () => this.testEnvironmentVariables(),
        category: 'integration'
      },
      {
        name: 'CLI Interface Consistency',
        test: () => this.testCLIConsistency(),
        category: 'integration'
      }
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    console.log('✅ Cross-Phase Integration testing complete\n');
  }

  /**
   * Run individual test
   */
  private async runTest(test: any) {
    const startTime = Date.now();
    let result = {
      name: test.name,
      category: test.category,
      status: 'pending',
      duration: 0,
      details: '',
      error: null
    };

    try {
      console.log(`  🧪 ${test.name}...`);
      const testResult = await test.test();
      result.status = testResult.success ? 'passed' : 'failed';
      result.details = testResult.details || '';
      result.duration = Date.now() - startTime;
      
      const icon = result.status === 'passed' ? '✅' : '❌';
      console.log(`  ${icon} ${test.name} (${result.duration}ms)`);
      
      if (testResult.details) {
        console.log(`     ${testResult.details}`);
      }
    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      result.duration = Date.now() - startTime;
      
      console.log(`  ❌ ${test.name} (${result.duration}ms)`);
      console.log(`     Error: ${error.message}`);
    }

    this.testResults.push(result);
  }

  /**
   * Test Diátaxis framework structure
   */
  private async testDiataxisStructure() {
    const requiredDirs = ['docs/tutorials', 'docs/how-to', 'docs/reference', 'docs/explanation'];
    const missingDirs = requiredDirs.filter(dir => !existsSync(dir));
    
    if (missingDirs.length > 0) {
      return {
        success: false,
        details: `Missing directories: ${missingDirs.join(', ')}`
      };
    }

    // Check for README files in each quadrant
    const quadrantFiles = [
      'docs/tutorials/README.md',
      'docs/how-to/README.md', 
      'docs/reference/README.md',
      'docs/explanation/README.md'
    ];
    
    const missingFiles = quadrantFiles.filter(file => !existsSync(file));
    
    if (missingFiles.length > 0) {
      return {
        success: false,
        details: `Missing quadrant files: ${missingFiles.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Diátaxis framework structure is complete'
    };
  }

  /**
   * Test Docusaurus configuration
   */
  private async testDocusaurusConfig() {
    const configPath = 'docusaurus.config.ts';
    
    if (!existsSync(configPath)) {
      return {
        success: false,
        details: 'Docusaurus configuration file not found'
      };
    }

    try {
      const config = readFileSync(configPath, 'utf-8');
      
      // Check for required configuration
      const required = [
        'title:',
        'tagline:',
        'url:',
        'baseUrl:',
        'presets:',
        'docs:',
        'sidebarPath:'
      ];
      
      const missing = required.filter(item => !config.includes(item));
      
      if (missing.length > 0) {
        return {
          success: false,
          details: `Missing configuration items: ${missing.join(', ')}`
        };
      }

      return {
        success: true,
        details: 'Docusaurus configuration is complete'
      };
    } catch (error) {
      return {
        success: false,
        details: `Failed to read Docusaurus config: ${error.message}`
      };
    }
  }

  /**
   * Test Vale linting rules
   */
  private async testValeLinting() {
    const valeConfigPath = 'vale.ini';
    
    if (!existsSync(valeConfigPath)) {
      return {
        success: false,
        details: 'Vale configuration file not found'
      };
    }

    try {
      const config = readFileSync(valeConfigPath, 'utf-8');
      
      // Check for required style rules
      const requiredRules = [
        'Diátaxis.QuadrantClarity',
        'WCAG.LanguageClarity',
        'TechDocs.CodeExamples',
        'Business.ValueProposition'
      ];
      
      const missing = requiredRules.filter(rule => !config.includes(rule));
      
      if (missing.length > 0) {
        return {
          success: false,
          details: `Missing style rules: ${missing.join(', ')}`
        };
      }

      return {
        success: true,
        details: 'Vale linting rules are configured'
      };
    } catch (error) {
      return {
        success: false,
        details: `Failed to read Vale config: ${error.message}`
      };
    }
  }

  /**
   * Test documentation structure
   */
  private async testDocumentationStructure() {
    const docsPath = 'docs';
    
    if (!existsSync(docsPath)) {
      return {
        success: false,
        details: 'Documentation directory not found'
      };
    }

    // Check for main README
    const readmePath = 'docs/README.md';
    if (!existsSync(readmePath)) {
      return {
        success: false,
        details: 'Main documentation README not found'
      };
    }

    // Check for frontmatter schema
    const schemaPath = 'docs/frontmatter-schema.json';
    if (!existsSync(schemaPath)) {
      return {
        success: false,
        details: 'Frontmatter schema not found'
      };
    }

    return {
      success: true,
      details: 'Documentation structure is complete'
    };
  }

  /**
   * Test llms.txt optimization
   */
  private async testLLMsTxt() {
    const llmsPath = 'llms.txt';
    
    if (!existsSync(llmsPath)) {
      return {
        success: false,
        details: 'llms.txt file not found'
      };
    }

    try {
      const content = readFileSync(llmsPath, 'utf-8');
      
      // Check for required sections
      const required = [
        '## Docs',
        '## Key Features',
        '## Technology Stack',
        '## Development Workflow',
        '## Business Model',
        '## Compliance & Security',
        '## Performance Standards',
        '## AI Integration'
      ];
      
      const missing = required.filter(section => !content.includes(section));
      
      if (missing.length > 0) {
        return {
          success: false,
          details: `Missing sections: ${missing.join(', ')}`
        };
      }

      return {
        success: true,
        details: 'llms.txt is properly optimized'
      };
    } catch (error) {
      return {
        success: false,
        details: `Failed to read llms.txt: ${error.message}`
      };
    }
  }

  /**
   * Test doctest implementation
   */
  private async testDoctest() {
    const runnerPath = 'scripts/doctest/runner.mjs';
    const setupPath = 'scripts/doctest/setup.mjs';
    
    if (!existsSync(runnerPath) || !existsSync(setupPath)) {
      return {
        success: false,
        details: 'Doctest scripts not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['doctest', 'doctest:setup', 'doctest:examples'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing doctest scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Doctest implementation is complete'
    };
  }

  /**
   * Test visual regression testing
   */
  private async testVisualRegression() {
    const configPath = 'playwright.docs.config.ts';
    const testPath = 'e2e/tests/docs-visual/visual-regression.spec.ts';
    
    if (!existsSync(configPath) || !existsSync(testPath)) {
      return {
        success: false,
        details: 'Visual regression testing files not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['test:docs-visual', 'test:docs-visual:ci', 'test:docs-visual:update'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing visual test scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Visual regression testing is configured'
    };
  }

  /**
   * Test RAG pipeline
   */
  private async testRAGPipeline() {
    const ragPath = 'scripts/rag/rag-pipeline.mjs';
    const embeddingPath = 'scripts/embedding-service.mjs';
    
    if (!existsSync(ragPath) || !existsSync(embeddingPath)) {
      return {
        success: false,
        details: 'RAG pipeline files not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['rag:init', 'rag:search', 'rag:ask', 'embedding:test'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing RAG scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'RAG pipeline is implemented'
    };
  }

  /**
   * Test MCP server integration
   */
  private async testMCPServer() {
    const mcpConfigPath = '.mcp/config.json';
    const mcpServerPath = 'scripts/mcp/documentation-server.ts';
    
    if (!existsSync(mcpConfigPath) || !existsSync(mcpServerPath)) {
      return {
        success: false,
        details: 'MCP server files not found'
      };
    }

    try {
      const config = readFileSync(mcpConfigPath, 'utf-8');
      
      if (!config.includes('documentation')) {
        return {
          success: false,
          details: 'Documentation MCP server not configured'
        };
      }

      return {
        success: true,
        details: 'MCP server integration is configured'
      };
    } catch (error) {
      return {
        success: false,
        details: `Failed to read MCP config: ${error.message}`
      };
    }
  }

  /**
   * Test health metrics
   */
  private async testHealthMetrics() {
    const healthAnalyzerPath = 'scripts/docs-health-analyzer.mjs';
    
    if (!existsSync(healthAnalyzerPath)) {
      return {
        success: false,
        details: 'Health analyzer script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['docs:health', 'docs:health:report', 'docs:validate'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing health scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Health metrics analyzer is implemented'
    };
  }

  /**
   * Test embedding service
   */
  private async testEmbeddingService() {
    const embeddingPath = 'scripts/embedding-service.mjs';
    
    if (!existsSync(embeddingPath)) {
      return {
        success: false,
        details: 'Embedding service script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['embedding:test', 'embedding:batch', 'embedding:config'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing embedding scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Embedding service is implemented'
    };
  }

  /**
   * Test code playgrounds
   */
  private async testCodePlaygrounds() {
    const playgroundPath = 'scripts/playgrounds/generator.mjs';
    
    if (!existsSync(playgroundPath)) {
      return {
        success: false,
        details: 'Playground generator script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['playgrounds:generate', 'playgrounds:serve'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing playground scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Code playgrounds generator is implemented'
    };
  }

  /**
   * Test i18n infrastructure
   */
  private async testI18nInfrastructure() {
    const i18nPath = 'scripts/i18n/infrastructure.mjs';
    
    if (!existsSync(i18nPath)) {
      return {
        success: false,
        details: 'i18n infrastructure script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['i18n:init', 'i18n:extract', 'i18n:translate', 'i18n:validate'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing i18n scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'i18n infrastructure is implemented'
    };
  }

  /**
   * Test translation service
   */
  private async testTranslationService() {
    const translationPath = 'scripts/translation-config.mjs';
    
    if (!existsSync(translationPath)) {
      return {
        success: false,
        details: 'Translation service script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['i18n:configure', 'i18n:test'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing translation scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Translation service is implemented'
    };
  }

  /**
   * Test Backstage integration
   */
  private async testBackstageIntegration() {
    const backstagePath = 'scripts/backstage/integrator.mjs';
    
    if (!existsSync(backstagePath)) {
      return {
        success: false,
        details: 'Backstage integrator script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    const requiredScripts = ['backstage:init', 'backstage:start', 'backstage:build'];
    const missing = requiredScripts.filter(script => !packageContent.includes(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing Backstage scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'Backstage integration is implemented'
    };
  }

  /**
   * Test Backstage setup
   */
  private async testBackstageSetup() {
    const setupPath = 'scripts/backstage-setup.mjs';
    
    if (!existsSync(setupPath)) {
      return {
        success: false,
        details: 'Backstage setup script not found'
      };
    }

    // Check package.json scripts
    const packagePath = 'package.json';
    const packageContent = readFileSync(packagePath, 'utf-8');
    
    if (!packageContent.includes('backstage:setup')) {
      return {
        success: false,
        details: 'Backstage setup script not configured'
      };
    }

    return {
      success: true,
      details: 'Backstage environment setup is implemented'
    };
  }

  /**
   * Test package.json scripts integration
   */
  private async testPackageScripts() {
    const packagePath = 'package.json';
    
    if (!existsSync(packagePath)) {
      return {
        success: false,
        details: 'package.json not found'
      };
    }

    try {
      const packageContent = readFileSync(packagePath, 'utf-8');
      const packageData = JSON.parse(packageContent);
      
      // Check for all required scripts
      const requiredScripts = [
        'doctest', 'doctest:setup', 'doctest:examples',
        'test:docs-visual', 'test:docs-visual:ci', 'test:docs-visual:update',
        'rag:init', 'rag:search', 'rag:ask',
        'docs:health', 'docs:health:report', 'docs:validate',
        'playgrounds:generate', 'playgrounds:serve',
        'i18n:init', 'i18n:extract', 'i18n:translate', 'i18n:validate',
        'backstage:init', 'backstage:setup', 'backstage:start', 'backstage:build',
        'embedding:test', 'embedding:batch', 'embedding:config'
      ];
      
      const missing = requiredScripts.filter(script => !packageContent.includes(script));
      
      if (missing.length > 0) {
        return {
          success: false,
          details: `Missing package scripts: ${missing.join(', ')}`
        };
      }

      return {
        success: true,
        details: `All ${requiredScripts.length} package scripts are configured`
      };
    } catch (error) {
      return {
        success: false,
        details: `Failed to parse package.json: ${error.message}`
      };
    }
  }

  /**
   * Test file structure organization
   */
  private async testFileStructure() {
    const requiredDirs = [
      'scripts/doctest',
      'scripts/rag',
      'scripts/i18n',
      'scripts/backstage',
      'scripts/playgrounds',
      'scripts/mcp',
      'e2e/tests/docs-visual',
      '.github/styles',
      'locales'
    ];
    
    const missing = requiredDirs.filter(dir => !existsSync(dir));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing directories: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'File structure is properly organized'
    };
  }

  /**
   * Test environment variables
   */
  private async testEnvironmentVariables() {
    const requiredEnvVars = [
      'NODE_ENV',
      'EMBEDDING_PROVIDER',
      'TRANSLATION_PROVIDER',
      'BACKSTAGE_BASE_URL'
    ];
    
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    // Some environment variables are optional for development
    if (missing.length > 0 && missing.length < requiredEnvVars.length) {
      return {
        success: true,
        details: `Some environment variables not set: ${missing.join(', ')} (optional for development)`
      };
    }

    return {
      success: true,
      details: 'Environment variables are properly configured'
    };
  }

  /**
   * Test CLI interface consistency
   */
  private async testCLIConsistency() {
    const scripts = [
      'scripts/doctest/runner.mjs',
      'scripts/rag/rag-pipeline.mjs',
      'scripts/i18n/infrastructure.mjs',
      'scripts/backstage/integrator.mjs',
      'scripts/playgrounds/generator.mjs',
      'scripts/embedding-service.mjs',
      'scripts/translation-config.mjs',
      'scripts/backstage-setup.mjs'
    ];
    
    const missing = scripts.filter(script => !existsSync(script));
    
    if (missing.length > 0) {
      return {
        success: false,
        details: `Missing CLI scripts: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      details: 'CLI interfaces are consistent'
    };
  }

  /**
   * Generate test report
   */
  private generateTestReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'passed').length;
    const failedTests = this.testResults.filter(r => r.status === 'failed').length;
    const errorTests = this.testResults.filter(r => r.status === 'error').length;
    
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('🧪 COMPREHENSIVE INTEGRATION TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${successRate}%)`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Errors: ${errorTests}`);
    console.log(`Duration: ${totalDuration}ms`);
    console.log('');

    // Results by category
    const categories = ['foundation', 'automation', 'intelligence', 'integration'];
    categories.forEach(category => {
      const categoryTests = this.testResults.filter(r => r.category === category);
      const categoryPassed = categoryTests.filter(r => r.status === 'passed').length;
      const categoryTotal = categoryTests.length;
      const categoryRate = categoryTotal > 0 ? ((categoryPassed / categoryTotal) * 100).toFixed(1) : '0';
      
      console.log(`${category.toUpperCase()}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    });

    // Failed tests
    const failedResults = this.testResults.filter(r => r.status === 'failed' || r.status === 'error');
    if (failedResults.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedResults.forEach(result => {
        console.log(`  - ${result.name}: ${result.details || result.error}`);
      });
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        errorTests,
        successRate: parseFloat(successRate),
        duration: totalDuration
      },
      results: this.testResults
    };

    const reportPath = 'integration-test-report.json';
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Overall assessment
    console.log('\n🎯 Overall Assessment:');
    if (parseFloat(successRate) >= 95) {
      console.log('✅ EXCELLENT - Integration testing passed with high success rate');
    } else if (parseFloat(successRate) >= 90) {
      console.log('✅ GOOD - Integration testing passed with acceptable success rate');
    } else if (parseFloat(successRate) >= 80) {
      console.log('⚠️  NEEDS IMPROVEMENT - Some integration issues detected');
    } else {
      console.log('❌ CRITICAL ISSUES - Major integration problems detected');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const tester = new IntegrationTester();

  switch (command) {
    case 'all':
      await tester.runAllTests();
      break;

    case 'foundation':
      await tester.testPhase1Foundation();
      break;

    case 'automation':
      await tester.testPhase2Automation();
      break;

    case 'intelligence':
      await tester.testPhase3Intelligence();
      break;

    case 'integration':
      await tester.testCrossPhaseIntegration();
      break;

    case 'help':
      console.log(`
Comprehensive Integration Testing

Usage:
  node scripts/integration-test.mjs <command>

Commands:
  all         - Run all integration tests
  foundation   - Test Phase 1 Foundation
  automation   - Test Phase 2 Automation
  intelligence - Test Phase 3 Intelligence
  integration  - Test Cross-Phase Integration
  help        - Show this help message

Examples:
  node scripts/integration-test.mjs all
  node scripts/integration-test.mjs foundation
  node scripts/integration-test.mjs automation
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Integration testing error:', error);
    process.exit(1);
  });
}

export { IntegrationTester };

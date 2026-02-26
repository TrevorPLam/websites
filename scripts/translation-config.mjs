#!/usr/bin/env node

/**
 * Translation Service Configuration
 * 
 * Sets up and configures translation services for internationalization
 * with Crowdin, Lokalise, or other translation platforms
 * 
 * Part of 2026 Documentation Standards - Phase 3 Intelligence Enhancement
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

class TranslationServiceConfigurator {
  private configPath: string;
  private config: any;

  constructor(configPath: string = 'locales/translation-config.json') {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  /**
   * Load existing configuration or create default
   */
  private loadConfig() {
    if (existsSync(this.configPath)) {
      try {
        return JSON.parse(readFileSync(this.configPath, 'utf-8'));
      } catch (error) {
        console.error('Failed to load translation config:', error);
        return this.createDefaultConfig();
      }
    }
    return this.createDefaultConfig();
  }

  /**
   * Create default configuration
   */
  private createDefaultConfig() {
    return {
      version: '1.0.0',
      provider: process.env.TRANSLATION_PROVIDER || 'crowdin',
      projectId: process.env.TRANSLATION_PROJECT_ID || '',
      apiKey: process.env.TRANSLATION_API_KEY || '',
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr', 'de', 'ja', 'zh-CN', 'zh-TW', 'ko', 'pt-BR', 'ar', 'hi', 'ru'],
      autoTranslate: false,
      translationMemory: true,
      glossary: true,
      qualityAssurance: true,
      workflows: {
        preTranslation: {
          enabled: true,
          machineTranslation: true,
          translationMemory: true,
          glossary: true
        },
        postTranslation: {
          enabled: true,
          proofreading: true,
          qualityCheck: true,
          approval: true
        }
      },
      notifications: {
        email: process.env.TRANSLATION_EMAIL || '',
        webhook: process.env.TRANSLATION_WEBHOOK || '',
        slack: process.env.TRANSLATION_SLACK_WEBHOOK || ''
      },
      api: {
        baseUrl: '',
        timeout: 30000,
        retries: 3
      }
    };
  }

  /**
   * Configure Crowdin integration
   */
  configureCrowdin(options: {
    projectId?: string;
    apiKey?: string;
    organization?: string;
  }) {
    this.config.provider = 'crowdin';
    this.config.projectId = options.projectId || process.env.CROWDIN_PROJECT_ID;
    this.config.apiKey = options.apiKey || process.env.CROWDIN_API_KEY;
    this.config.organization = options.organization || process.env.CROWDIN_ORGANIZATION;
    this.config.api.baseUrl = this.config.organization 
      ? `https://${this.config.organization}.api.crowdin.com`
      : 'https://api.crowdin.com';
    
    return this.saveConfig();
  }

  /**
   * Configure Lokalise integration
   */
  configureLokalise(options: {
    projectId?: string;
    apiKey?: string;
    team?: string;
  }) {
    this.config.provider = 'lokalise';
    this.config.projectId = options.projectId || process.env.LOKALISE_PROJECT_ID;
    this.config.apiKey = options.apiKey || process.env.LOKALISE_API_KEY;
    this.config.team = options.team || process.env.LOKALISE_TEAM;
    this.config.api.baseUrl = 'https://api.lokalise.com/v2';
    
    return this.saveConfig();
  }

  /**
   * Configure Phrase integration
   */
  configurePhrase(options: {
    projectId?: string;
    apiKey?: string;
    organization?: string;
  }) {
    this.config.provider = 'phrase';
    this.config.projectId = options.projectId || process.env.PHRASE_PROJECT_ID;
    this.config.apiKey = options.apiKey || process.env.PHRASE_API_KEY;
    this.config.organization = options.organization || process.env.PHRASE_ORGANIZATION;
    this.config.api.baseUrl = 'https://api.phrase.com/v2';
    
    return this.saveConfig();
  }

  /**
   * Test connection to translation service
   */
  async testConnection() {
    if (!this.config.apiKey || !this.config.projectId) {
      throw new Error('API key and project ID are required');
    }

    console.log(`🔍 Testing connection to ${this.config.provider}...`);

    switch (this.config.provider) {
      case 'crowdin':
        return await this.testCrowdinConnection();
      case 'lokalise':
        return await this.testLokaliseConnection();
      case 'phrase':
        return await this.testPhraseConnection();
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  /**
   * Test Crowdin connection
   */
  private async testCrowdinConnection() {
    try {
      const response = await fetch(`${this.config.api.baseUrl}/api/v2/projects/${this.config.projectId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const project = await response.json();
      console.log(`✅ Connected to Crowdin project: ${project.data.name}`);
      return true;
    } catch (error) {
      console.error('❌ Crowdin connection failed:', error.message);
      return false;
    }
  }

  /**
   * Test Lokalise connection
   */
  private async testLokaliseConnection() {
    try {
      const response = await fetch(`${this.config.api.baseUrl}/projects/${this.config.projectId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const project = await response.json();
      console.log(`✅ Connected to Lokalise project: ${project.name}`);
      return true;
    } catch (error) {
      console.error('❌ Lokalise connection failed:', error.message);
      return false;
    }
  }

  /**
   * Test Phrase connection
   */
  private async testPhraseConnection() {
    try {
      const response = await fetch(`${this.config.api.baseUrl}/projects/${this.config.projectId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const project = await response.json();
      console.log(`✅ Connected to Phrase project: ${project.name}`);
      return true;
    } catch (error) {
      console.error('❌ Phrase connection failed:', error.message);
      return false;
    }
  }

  /**
   * Upload source files
   */
  async uploadSourceFiles(files: string[]) {
    console.log(`📤 Uploading ${files.length} source files to ${this.config.provider}...`);

    for (const file of files) {
      try {
        await this.uploadFile(file);
        console.log(`✅ Uploaded: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file}:`, error.message);
      }
    }

    console.log('📤 Source file upload complete');
  }

  /**
   * Upload single file
   */
  private async uploadFile(filePath: string) {
    // Mock implementation - in production, use actual API calls
    console.log(`📤 Uploading ${filePath} to ${this.config.provider}...`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make actual API calls to upload files
    return true;
  }

  /**
   * Download translations
   */
  async downloadTranslations(targetLanguages?: string[]) {
    const languages = targetLanguages || this.config.targetLanguages;
    console.log(`📥 Downloading translations for ${languages.length} languages...`);

    for (const lang of languages) {
      try {
        await this.downloadLanguageTranslations(lang);
        console.log(`✅ Downloaded: ${lang}`);
      } catch (error) {
        console.error(`❌ Failed to download ${lang}:`, error.message);
      }
    }

    console.log('📥 Translation download complete');
  }

  /**
   * Download translations for specific language
   */
  private async downloadLanguageTranslations(language: string) {
    // Mock implementation - in production, use actual API calls
    console.log(`📥 Downloading ${language} translations from ${this.config.provider}...`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make actual API calls to download translations
    return true;
  }

  /**
   * Get project statistics
   */
  async getProjectStats() {
    console.log(`📊 Getting project statistics from ${this.config.provider}...`);

    // Mock implementation
    const stats = {
      totalWords: 15000,
      translatedWords: 8500,
      approvedWords: 7200,
      languages: this.config.targetLanguages.length,
      completion: 57,
      lastUpdated: new Date().toISOString()
    };

    console.log(`📊 Project Statistics:`);
    console.log(`  Total words: ${stats.totalWords.toLocaleString()}`);
    console.log(`  Translated: ${stats.translatedWords.toLocaleString()} (${stats.completion}%)`);
    console.log(`  Approved: ${stats.approvedWords.toLocaleString()}`);
    console.log(`  Languages: ${stats.languages}`);
    console.log(`  Last updated: ${new Date(stats.lastUpdated).toLocaleDateString()}`);

    return stats;
  }

  /**
   * Save configuration
   */
  private saveConfig() {
    const configDir = join(this.configPath, '..');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    console.log(`✅ Translation configuration saved to ${this.configPath}`);
    return this.config;
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Check if service is configured
   */
  isConfigured() {
    return !!(this.config.apiKey && this.config.projectId);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const provider = args[1];

  const configurator = new TranslationServiceConfigurator();

  switch (command) {
    case 'configure':
      console.log('⚙️ Configuring translation service...');
      
      switch (provider) {
        case 'crowdin':
          await configurator.configureCrowdin({});
          break;
        case 'lokalise':
          await configurator.configureLokalise({});
          break;
        case 'phrase':
          await configurator.configurePhrase({});
          break;
        default:
          console.error('Supported providers: crowdin, lokalise, phrase');
          process.exit(1);
      }
      break;

    case 'test':
      console.log('🧪 Testing translation service connection...');
      
      if (!configurator.isConfigured()) {
        console.log('❌ Translation service not configured');
        console.log('Please run: node scripts/translation-config.mjs configure <provider>');
        process.exit(1);
      }

      const connected = await configurator.testConnection();
      if (connected) {
        console.log('✅ Translation service connection successful');
      } else {
        console.log('❌ Translation service connection failed');
        process.exit(1);
      }
      break;

    case 'stats':
      console.log('📊 Getting project statistics...');
      
      if (!configurator.isConfigured()) {
        console.log('❌ Translation service not configured');
        process.exit(1);
      }

      await configurator.getProjectStats();
      break;

    case 'config':
      console.log('⚙️ Current configuration:');
      console.log(JSON.stringify(configurator.getConfig(), null, 2));
      break;

    case 'help':
      console.log(`
Translation Service Configuration

Usage:
  node scripts/translation-config.mjs <command> [provider]

Commands:
  configure <provider>  - Configure translation service (crowdin|lokalise|phrase)
  test                 - Test connection to translation service
  stats                - Get project statistics
  config               - Show current configuration
  help                 - Show this help message

Environment Variables:
  CROWDIN_PROJECT_ID   - Crowdin project ID
  CROWDIN_API_KEY      - Crowdin API key
  CROWDIN_ORGANIZATION - Crowdin organization (optional)
  LOKALISE_PROJECT_ID  - Lokalise project ID
  LOKALISE_API_KEY     - Lokalise API key
  PHRASE_PROJECT_ID    - Phrase project ID
  PHRASE_API_KEY       - Phrase API key

Examples:
  # Configure Crowdin
  CROWDIN_PROJECT_ID=123 CROWDIN_API_KEY=your_key node scripts/translation-config.mjs configure crowdin

  # Test connection
  node scripts/translation-config.mjs test

  # Get statistics
  node scripts/translation-config.mjs stats
      `);
      break;

    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Translation configuration error:', error);
    process.exit(1);
  });
}

export { TranslationServiceConfigurator };

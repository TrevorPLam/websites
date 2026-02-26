#!/usr/bin/env node

/**
 * Internationalization (i18n) Infrastructure Setup
 * 
 * Sets up comprehensive multi-language support for documentation
 * with automated translation, locale management, and cultural adaptation
 * 
 * Part of 2026 Documentation Standards - Phase 3 Intelligence
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';

interface LocaleConfig {
  code: string;
  name: string;
  region: string;
  rtl: boolean;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  fallback: string;
}

interface TranslationEntry {
  key: string;
  value: string;
  context?: string;
  plural?: boolean;
  gender?: string;
}

interface TranslationFile {
  locale: string;
  namespace: string;
  translations: Record<string, TranslationEntry>;
  metadata: {
    version: string;
    lastModified: string;
    completeness: number;
    translatedBy?: string;
    reviewed?: boolean;
  };
}

class I18nInfrastructure {
  private docsDir: string;
  private localesDir: string;
  private supportedLocales: LocaleConfig[] = [];
  private translationFiles: Map<string, TranslationFile> = new Map();

  constructor(docsDir: string = 'docs', localesDir: string = 'locales') {
    this.docsDir = docsDir;
    this.localesDir = localesDir;
  }

  /**
   * Initialize i18n infrastructure
   */
  async initialize(): Promise<void> {
    console.log('🌍 Setting up internationalization infrastructure...\n');

    // Create locales directory
    if (!existsSync(this.localesDir)) {
      mkdirSync(this.localesDir, { recursive: true });
    }

    // Setup supported locales
    await this.setupSupportedLocales();

    // Extract translatable content
    await this.extractTranslatableContent();

    // Generate translation files
    await this.generateTranslationFiles();

    // Create locale-specific documentation structure
    await this.createLocaleStructure();

    // Setup automated translation pipeline
    await this.setupTranslationPipeline();

    console.log('✅ Internationalization infrastructure ready');
  }

  /**
   * Setup supported locales
   */
  private async setupSupportedLocales(): Promise<void> {
    this.supportedLocales = [
      {
        code: 'en',
        name: 'English',
        region: 'US',
        rtl: false,
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
        currency: 'USD',
        fallback: '',
      },
      {
        code: 'es',
        name: 'Español',
        region: 'ES',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'es-ES',
        currency: 'EUR',
        fallback: 'en',
      },
      {
        code: 'fr',
        name: 'Français',
        region: 'FR',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'fr-FR',
        currency: 'EUR',
        fallback: 'en',
      },
      {
        code: 'de',
        name: 'Deutsch',
        region: 'DE',
        rtl: false,
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'de-DE',
        currency: 'EUR',
        fallback: 'en',
      },
      {
        code: 'ja',
        name: '日本語',
        region: 'JP',
        rtl: false,
        dateFormat: 'YYYY/MM/DD',
        numberFormat: 'ja-JP',
        currency: 'JPY',
        fallback: 'en',
      },
      {
        code: 'zh-CN',
        name: '简体中文',
        region: 'CN',
        rtl: false,
        dateFormat: 'YYYY/MM/DD',
        numberFormat: 'zh-CN',
        currency: 'CNY',
        fallback: 'en',
      },
      {
        code: 'zh-TW',
        name: '繁體中文',
        region: 'TW',
        rtl: false,
        dateFormat: 'YYYY/MM/DD',
        numberFormat: 'zh-TW',
        currency: 'TWD',
        fallback: 'en',
      },
      {
        code: 'ko',
        name: '한국어',
        region: 'KR',
        rtl: false,
        dateFormat: 'YYYY. MM. DD.',
        numberFormat: 'ko-KR',
        currency: 'KRW',
        fallback: 'en',
      },
      {
        code: 'pt-BR',
        name: 'Português',
        region: 'BR',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'pt-BR',
        currency: 'BRL',
        fallback: 'en',
      },
      {
        code: 'ar',
        name: 'العربية',
        region: 'SA',
        rtl: true,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'ar-SA',
        currency: 'SAR',
        fallback: 'en',
      },
      {
        code: 'hi',
        name: 'हिन्दी',
        region: 'IN',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'hi-IN',
        currency: 'INR',
        fallback: 'en',
      },
      {
        code: 'ru',
        name: 'Русский',
        region: 'RU',
        rtl: false,
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'ru-RU',
        currency: 'RUB',
        fallback: 'en',
      },
    ];

    // Save locale configuration
    const configPath = join(this.localesDir, 'locales.json');
    writeFileSync(configPath, JSON.stringify(this.supportedLocales, null, 2));
    console.log(`📋 Configured ${this.supportedLocales.length} locales`);
  }

  /**
   * Extract translatable content from documentation
   */
  private async extractTranslatableContent(): Promise<void> {
    console.log('📝 Extracting translatable content...');

    const files = await glob(`${this.docsDir}/**/*.md`);
    const extractedContent: Record<string, any> = {};

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const relativePath = file.replace(this.docsDir + '/', '');
      
      // Extract content for translation
      const extracted = this.extractContentForTranslation(content, relativePath);
      extractedContent[relativePath] = extracted;
    }

    // Save extracted content
    const extractedPath = join(this.localesDir, 'extracted.json');
    writeFileSync(extractedPath, JSON.stringify(extractedContent, null, 2));
    console.log(`📄 Extracted content from ${files.length} files`);
  }

  /**
   * Extract content that needs translation
   */
  private extractContentForTranslation(content: string, filePath: string): any {
    const lines = content.split('\n');
    const extracted = {
      headings: [] as string[],
      paragraphs: [] as string[],
      lists: [] as string[],
      tables: [] as string[],
      codeComments: [] as string[],
      metadata: {} as Record<string, string>,
    };

    let inCodeBlock = false;
    let inFrontMatter = false;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Handle front matter
      if (line === '---') {
        if (!inFrontMatter) {
          inFrontMatter = true;
          continue;
        } else {
          inFrontMatter = false;
          continue;
        }
      }

      if (inFrontMatter) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          extracted.metadata[key.trim()] = valueParts.join(':').trim();
        }
        continue;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        // Extract code comments for translation
        if (line.startsWith('//') || line.startsWith('#') || line.startsWith('/*')) {
          extracted.codeComments.push(line);
        }
        continue;
      }

      // Extract headings
      if (line.startsWith('#')) {
        const heading = line.replace(/^#+\s*/, '').trim();
        if (heading) {
          extracted.headings.push(heading);
        }
        continue;
      }

      // Extract paragraphs (non-empty lines that aren't headings or lists)
      if (line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*') && !line.startsWith('1.') && !line.startsWith('|')) {
        extracted.paragraphs.push(line);
        continue;
      }

      // Extract list items
      if (line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
        const listItem = line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        if (listItem) {
          extracted.lists.push(listItem);
        }
        continue;
      }

      // Extract table rows (simplified)
      if (line.startsWith('|')) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 1) {
          extracted.tables.push(...cells);
        }
        continue;
      }
    }

    return extracted;
  }

  /**
   * Generate translation files for each locale
   */
  private async generateTranslationFiles(): Promise<void> {
    console.log('🔄 Generating translation files...');

    for (const locale of this.supportedLocales) {
      await this.generateLocaleTranslations(locale);
    }

    console.log(`📁 Generated translation files for ${this.supportedLocales.length} locales`);
  }

  /**
   * Generate translations for a specific locale
   */
  private async generateLocaleTranslations(locale: LocaleConfig): Promise<void> {
    const localeDir = join(this.localesDir, locale.code);
    if (!existsSync(localeDir)) {
      mkdirSync(localeDir, { recursive: true });
    }

    // Read extracted content
    const extractedPath = join(this.localesDir, 'extracted.json');
    const extractedContent = JSON.parse(readFileSync(extractedPath, 'utf-8'));

    // Generate translation files
    for (const [filePath, content] of Object.entries(extractedContent)) {
      const namespace = filePath.replace(/\.md$/, '').replace(/[\/\\]/g, '.');
      const translationFile = await this.createTranslationFile(locale, namespace, content);
      
      const translationPath = join(localeDir, `${namespace}.json`);
      writeFileSync(translationPath, JSON.stringify(translationFile, null, 2));
    }
  }

  /**
   * Create translation file for a namespace
   */
  private async createTranslationFile(locale: LocaleConfig, namespace: string, content: any): Promise<TranslationFile> {
    const translations: Record<string, TranslationEntry> = {};

    // Process headings
    content.headings.forEach((heading: string, index: number) => {
      translations[`heading_${index}`] = {
        key: `heading_${index}`,
        value: locale.code === 'en' ? heading : '', // Empty for non-English, to be translated
        context: 'heading',
      };
    });

    // Process paragraphs
    content.paragraphs.forEach((paragraph: string, index: number) => {
      translations[`paragraph_${index}`] = {
        key: `paragraph_${index}`,
        value: locale.code === 'en' ? paragraph : '',
        context: 'paragraph',
      };
    });

    // Process lists
    content.lists.forEach((listItem: string, index: number) => {
      translations[`list_${index}`] = {
        key: `list_${index}`,
        value: locale.code === 'en' ? listItem : '',
        context: 'list',
      };
    });

    // Process tables
    content.tables.forEach((cell: string, index: number) => {
      translations[`table_${index}`] = {
        key: `table_${index}`,
        value: locale.code === 'en' ? cell : '',
        context: 'table',
      };
    });

    // Process code comments
    content.codeComments.forEach((comment: string, index: number) => {
      translations[`comment_${index}`] = {
        key: `comment_${index}`,
        value: locale.code === 'en' ? comment : '',
        context: 'code_comment',
      };
    });

    return {
      locale: locale.code,
      namespace,
      translations,
      metadata: {
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        completeness: locale.code === 'en' ? 1.0 : 0.0, // English is 100% complete
        reviewed: locale.code === 'en',
      },
    };
  }

  /**
   * Create locale-specific documentation structure
   */
  private async createLocaleStructure(): Promise<void> {
    console.log('🏗️ Creating locale-specific documentation structure...');

    for (const locale of this.supportedLocales) {
      if (locale.code === 'en') continue; // Skip English as it's the source

      await this.createLocaleDocs(locale);
    }

    console.log(`📂 Created documentation structure for ${this.supportedLocales.length - 1} locales`);
  }

  /**
   * Create documentation structure for a specific locale
   */
  private async createLocaleDocs(locale: LocaleConfig): Promise<void> {
    const localeDocsDir = join(this.docsDir, locale.code);
    if (!existsSync(localeDocsDir)) {
      mkdirSync(localeDocsDir, { recursive: true });
    }

    // Create locale-specific README
    const readmeContent = this.generateLocaleReadme(locale);
    const readmePath = join(localeDocsDir, 'README.md');
    writeFileSync(readmePath, readmeContent);

    // Copy directory structure from English docs
    const englishDocsDir = this.docsDir;
    const subdirs = ['tutorials', 'how-to', 'reference', 'explanation'];
    
    for (const subdir of subdirs) {
      const sourceDir = join(englishDocsDir, subdir);
      const targetDir = join(localeDocsDir, subdir);
      
      if (existsSync(sourceDir)) {
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }
        
        // Create placeholder files for translated content
        const files = await glob(`${sourceDir}/*.md`);
        for (const file of files) {
          const fileName = file.split('/').pop();
          const placeholderPath = join(targetDir, fileName);
          
          if (!existsSync(placeholderPath)) {
            const placeholder = this.generatePlaceholderFile(locale, fileName);
            writeFileSync(placeholderPath, placeholder);
          }
        }
      }
    }
  }

  /**
   * Generate locale-specific README
   */
  private generateLocaleReadme(locale: LocaleConfig): string {
    return `# ${locale.name} Documentation

This directory contains the ${locale.name} translation of the documentation.

## 🌍 Locale Information

- **Language**: ${locale.name}
- **Locale Code**: ${locale.code}
- **Region**: ${locale.region}
- **Text Direction**: ${locale.rtl ? 'RTL' : 'LTR'}
- **Fallback Language**: ${locale.fallback || 'None'}

## 📝 Translation Status

This documentation is currently being translated. The completeness status is tracked in the translation files.

## 🚀 Getting Started

1. Navigate to the section you're interested in:
   - [Tutorials](./tutorials/)
   - [How-To Guides](./how-to/)
   - [Reference](./reference/)
   - [Explanations](./explanation/)

2. Each markdown file contains translation keys that correspond to the English source content.

## 📋 Translation Guidelines

- Maintain the same structure as the English documentation
- Preserve code examples and technical terms
- Adapt cultural references where appropriate
- Follow the established tone and style

## 🔗 Related Links

- [English Documentation](../README.md)
- [Translation Guide](../TRANSLATION_GUIDE.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

*This documentation is part of the 2026 Documentation Standards implementation with comprehensive internationalization support.*`;
  }

  /**
   * Generate placeholder file for translation
   */
  private generatePlaceholderFile(locale: LocaleConfig, fileName: string): string {
    return `# ${fileName.replace('.md', '')} (${locale.name})

> 📝 **Translation in Progress**
> 
> This page is a placeholder for the ${locale.name} translation of \`${fileName}\`.
> The translation keys and structure are ready for translation.

## 🔄 Translation Status

- **Completeness**: 0%
- **Last Updated**: ${new Date().toISOString()}
- **Translator**: Not assigned
- **Reviewer**: Not assigned

## 📝 Translation Instructions

1. Refer to the English source: [\`${fileName}\`](../../../${fileName})
2. Update the translation file in \`locales/${locale.code}/\`
3. Replace this placeholder with the translated content
4. Update the status above

## 🔗 Source Content

The English source content is available in the main documentation directory.

---

*This placeholder will be replaced with the actual translated content.*`;
  }

  /**
   * Setup automated translation pipeline
   */
  private async setupTranslationPipeline(): Promise<void> {
    console.log('🤖 Setting up automated translation pipeline...');

    // Create translation pipeline configuration
    const pipelineConfig = {
      version: '1.0.0',
      sourceLocale: 'en',
      targetLocales: this.supportedLocales.filter(l => l.code !== 'en').map(l => l.code),
      services: {
        machine: {
          provider: 'google-translate', // or 'deepl', 'azure-translator'
          apiKey: process.env.TRANSLATION_API_KEY,
          enabled: true,
        },
        human: {
          platform: 'crowdin', // or 'lokalise', 'phrase'
          projectId: process.env.CROWDIN_PROJECT_ID,
          enabled: false, // Enable when configured
        },
      },
      automation: {
        autoExtract: true,
        autoTranslate: false, // Enable with caution
        autoReview: false,
        notifications: true,
      },
      quality: {
        minCompleteness: 0.8,
        requireReview: true,
        checkConsistency: true,
        validateLinks: true,
      },
    };

    const pipelinePath = join(this.localesDir, 'pipeline.json');
    writeFileSync(pipelinePath, JSON.stringify(pipelineConfig, null, 2));

    // Create translation scripts
    await this.createTranslationScripts();

    console.log('✅ Translation pipeline configured');
  }

  /**
   * Create translation automation scripts
   */
  private async createTranslationScripts(): Promise<void> {
    const scriptsDir = join(this.localesDir, 'scripts');
    if (!existsSync(scriptsDir)) {
      mkdirSync(scriptsDir, { recursive: true });
    }

    // Extract script
    const extractScript = `#!/usr/bin/env node
/**
 * Extract translatable content from documentation
 */

import { I18nInfrastructure } from '../index.mjs';

const i18n = new I18nInfrastructure();
await i18n.extractTranslatableContent();
console.log('✅ Content extraction complete');
`;

    writeFileSync(join(scriptsDir, 'extract.mjs'), extractScript);

    // Translate script
    const translateScript = `#!/usr/bin/env node
/**
 * Automated translation using machine translation
 */

import { I18nInfrastructure } from '../index.mjs';

const i18n = new I18nInfrastructure();
await i18n.autoTranslate();
console.log('✅ Automated translation complete');
`;

    writeFileSync(join(scriptsDir, 'translate.mjs'), translateScript);

    // Validate script
    const validateScript = `#!/usr/bin/env node
/**
 * Validate translations for completeness and quality
 */

import { I18nInfrastructure } from '../index.mjs';

const i18n = new I18nInfrastructure();
await i18n.validateTranslations();
console.log('✅ Translation validation complete');
`;

    writeFileSync(join(scriptsDir, 'validate.mjs'), validateScript);
  }

  /**
   * Generate comprehensive i18n configuration
   */
  async generateConfig(): Promise<void> {
    const config = {
      defaultLocale: 'en',
      locales: this.supportedLocales,
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
      react: {
        useSuspense: true,
      },
      detection: {
        order: ['path', 'cookie', 'navigator'],
        caches: ['cookie'],
      },
      backend: {
        loadPath: join(this.localesDir, '{{lng}}/{{ns}}.json'),
      },
      serialization: {
        keySeparator: '.',
        namespaceSeparator: ':',
      },
    };

    const configPath = join(this.localesDir, 'i18n.config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`⚙️ Generated i18n configuration: ${configPath}`);
  }

  /**
   * Print summary
   */
  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🌍 INTERNATIONALIZATION INFRASTRUCTURE SUMMARY');
    console.log('='.repeat(60));
    console.log(`📋 Supported Locales: ${this.supportedLocales.length}`);
    console.log(`📝 Translation Files: ${this.translationFiles.size}`);
    console.log(`🌐 RTL Languages: ${this.supportedLocales.filter(l => l.rtl).length}`);
    
    console.log('\n📊 Locale Coverage:');
    this.supportedLocales.forEach(locale => {
      const flag = locale.rtl ? '🔄' : '➡️';
      console.log(`  ${flag} ${locale.code} - ${locale.name} (${locale.region})`);
    });
    
    console.log('\n🚀 Next Steps:');
    console.log('  1. Configure translation services (Crowdin, Lokalise, etc.)');
    console.log('  2. Set up automated translation pipeline');
    console.log('  3. Begin translation process for target locales');
    console.log('  4. Implement locale detection and routing');
    console.log('  5. Test RTL language support');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const docsDir = args[0] || 'docs';
  const localesDir = args[1] || 'locales';

  const i18n = new I18nInfrastructure(docsDir, localesDir);
  await i18n.initialize();
  await i18n.generateConfig();
  i18n.printSummary();
  
  console.log('\n🌍 Internationalization infrastructure ready!');
  console.log('📁 Output directory: ' + localesDir);
  console.log('🔗 Integration ready for documentation platform');
}

if (require.main === module) {
  main().catch(console.error);
}

export { I18nInfrastructure, LocaleConfig, TranslationFile, TranslationEntry };

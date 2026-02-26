#!/usr/bin/env node

/**
 * Interactive Code Playground Generator
 * 
 * Generates StackBlitz-powered interactive code playgrounds
 * for documentation examples and tutorials
 * 
 * Part of 2026 Documentation Standards - Phase 3 Intelligence
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';

interface PlaygroundConfig {
  title: string;
  description: string;
  template: 'javascript' | 'typescript' | 'react' | 'vue' | 'angular' | 'node';
  dependencies: Record<string, string>;
  files: Record<string, string>;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  quadrant: 'tutorials' | 'how-to' | 'reference' | 'explanation';
}

interface CodeExample {
  id: string;
  language: string;
  code: string;
  filename: string;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    dependencies: string[];
  };
}

class PlaygroundGenerator {
  private docsDir: string;
  private outputDir: string;
  private playgrounds: Map<string, PlaygroundConfig> = new Map();

  constructor(docsDir: string = 'docs', outputDir: string = 'playgrounds') {
    this.docsDir = docsDir;
    this.outputDir = outputDir;
  }

  /**
   * Scan documentation for code examples and generate playgrounds
   */
  async generatePlaygrounds(): Promise<void> {
    console.log('🎮 Generating interactive code playgrounds...\n');

    // Ensure output directory exists
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }

    // Scan for code examples
    const codeExamples = await this.scanCodeExamples();
    console.log(`📝 Found ${codeExamples.length} code examples`);

    // Generate playgrounds for each example
    for (const example of codeExamples) {
      const playground = await this.createPlayground(example);
      if (playground) {
        this.playgrounds.set(example.id, playground);
      }
    }

    // Generate playground index
    await this.generatePlaygroundIndex();

    // Generate StackBlitz embed codes
    await this.generateEmbedCodes();

    console.log(`✅ Generated ${this.playgrounds.size} interactive playgrounds`);
  }

  /**
   * Scan documentation for code examples
   */
  private async scanCodeExamples(): Promise<CodeExample[]> {
    const files = await glob(`${this.docsDir}/**/*.md`);
    const examples: CodeExample[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const fileExamples = this.extractCodeExamples(file, content);
      examples.push(...fileExamples);
    }

    return examples;
  }

  /**
   * Extract code examples from markdown file
   */
  private extractCodeExamples(filePath: string, content: string): CodeExample[] {
    const examples: CodeExample[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;
    let currentLanguage = '';
    let currentCode: string[] = [];
    let exampleIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for code block start
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          currentLanguage = line.replace('```', '').trim();
          currentCode = [];
        } else {
          // Code block end
          inCodeBlock = false;
          
          if (currentCode.length > 0) {
            const example: CodeExample = {
              id: `${filePath.replace(/[\/\\]/g, '-')}-${exampleIndex++}`,
              language: currentLanguage,
              code: currentCode.join('\n'),
              filename: this.generateFilename(currentLanguage, exampleIndex),
              metadata: this.extractExampleMetadata(content, i - currentCode.length - 1),
            };
            examples.push(example);
          }
        }
      } else if (inCodeBlock) {
        currentCode.push(line);
      }
    }

    return examples;
  }

  /**
   * Generate filename for code example
   */
  private generateFilename(language: string, index: number): string {
    const extensions: Record<string, string> = {
      'javascript': 'js',
      'typescript': 'ts',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'bash': 'sh',
      'shell': 'sh',
      'sql': 'sql',
    };

    const ext = extensions[language] || 'txt';
    return `example-${index}.${ext}`;
  }

  /**
   * Extract metadata for code example
   */
  private extractExampleMetadata(content: string, codeBlockStart: number): CodeExample['metadata'] {
    const lines = content.split('\n');
    const metadata = {
      title: 'Code Example',
      description: '',
      tags: [],
      dependencies: [],
    };

    // Look for metadata in preceding lines
    for (let i = codeBlockStart - 1; i >= Math.max(0, codeBlockStart - 10); i--) {
      const line = lines[i].trim();
      
      // Extract title from heading
      if (line.startsWith('#') && !metadata.title) {
        metadata.title = line.replace(/^#+\s*/, '').trim();
        continue;
      }

      // Extract description
      if (line.length > 20 && !line.startsWith('#') && !line.startsWith('```') && !metadata.description) {
        metadata.description = line;
        continue;
      }

      // Extract dependencies from import statements
      if (line.includes('import') || line.includes('require')) {
        const imports = line.match(/(?:import|require)\s*.*?from\s*['"]([^'"]+)['"]/);
        if (imports) {
          metadata.dependencies.push(imports[1]);
        }
      }
    }

    // Extract tags from content
    const contentLower = content.toLowerCase();
    const commonTags = ['react', 'vue', 'angular', 'node', 'typescript', 'javascript', 'api', 'database'];
    commonTags.forEach(tag => {
      if (contentLower.includes(tag)) {
        metadata.tags.push(tag);
      }
    });

    return metadata;
  }

  /**
   * Create playground configuration from code example
   */
  private async createPlayground(example: CodeExample): Promise<PlaygroundConfig | null> {
    const template = this.determineTemplate(example);
    if (!template) return null;

    const quadrant = this.determineQuadrant(example.id);
    const dependencies = this.resolveDependencies(example.metadata.dependencies, template);

    const playground: PlaygroundConfig = {
      title: example.metadata.title,
      description: example.metadata.description,
      template,
      dependencies,
      files: {
        [example.filename]: example.code,
        ...this.generateSupportFiles(template, example),
      },
      tags: example.metadata.tags,
      difficulty: this.estimateDifficulty(example),
      estimatedTime: this.estimateTime(example),
      quadrant,
    };

    return playground;
  }

  /**
   * Determine StackBlitz template from code example
   */
  private determineTemplate(example: CodeExample): PlaygroundConfig['template'] | null {
    const { language, code, metadata } = example;

    // Check for React
    if (language === 'tsx' || language === 'jsx' || 
        code.includes('import React') || 
        metadata.tags.includes('react')) {
      return 'react';
    }

    // Check for Vue
    if (metadata.tags.includes('vue') || code.includes('Vue.createApp')) {
      return 'vue';
    }

    // Check for Angular
    if (metadata.tags.includes('angular') || code.includes('@angular/core')) {
      return 'angular';
    }

    // Check for Node.js
    if (language === 'javascript' || language === 'typescript') {
      if (code.includes('require') || code.includes('import ') && !code.includes('React')) {
        return 'node';
      }
    }

    // Default templates
    if (language === 'typescript') return 'typescript';
    if (language === 'javascript') return 'javascript';

    return null;
  }

  /**
   * Determine Diátaxis quadrant from example ID
   */
  private determineQuadrant(exampleId: string): PlaygroundConfig['quadrant'] {
    if (exampleId.includes('/tutorials/')) return 'tutorials';
    if (exampleId.includes('/how-to/')) return 'how-to';
    if (exampleId.includes('/reference/')) return 'reference';
    if (exampleId.includes('/explanation/')) return 'explanation';
    return 'tutorials'; // Default
  }

  /**
   * Resolve dependencies for StackBlitz template
   */
  private resolveDependencies(userDependencies: string[], template: PlaygroundConfig['template']): Record<string, string> {
    const baseDependencies: Record<string, string> = {
      'typescript': '^5.0.0',
    };

    const templateDependencies: Record<PlaygroundConfig['template'], Record<string, string>> = {
      'javascript': {},
      'typescript': {},
      'react': {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
      },
      'vue': {
        'vue': '^3.3.0',
      },
      'angular': {
        '@angular/core': '^16.0.0',
        '@angular/platform-browser': '^16.0.0',
        '@angular/platform-browser-dynamic': '^16.0.0',
      },
      'node': {},
    };

    // Merge dependencies
    const dependencies = {
      ...baseDependencies,
      ...templateDependencies[template],
    };

    // Add user dependencies
    userDependencies.forEach(dep => {
      if (!dependencies[dep]) {
        dependencies[dep] = 'latest';
      }
    });

    return dependencies;
  }

  /**
   * Generate support files for playground
   */
  private generateSupportFiles(template: PlaygroundConfig['template'], example: CodeExample): Record<string, string> {
    const files: Record<string, string> = {};

    switch (template) {
      case 'react':
        files['index.html'] = this.generateReactHTML(example);
        files['index.tsx'] = this.generateReactEntry(example);
        break;
      
      case 'vue':
        files['index.html'] = this.generateVueHTML(example);
        files['main.js'] = this.generateVueEntry(example);
        break;
      
      case 'node':
        files['package.json'] = this.generateNodePackage(example);
        break;
      
      case 'typescript':
        files['tsconfig.json'] = this.generateTSConfig();
        break;
    }

    return files;
  }

  /**
   * Generate React HTML file
   */
  private generateReactHTML(example: CodeExample): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${example.metadata.title}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;
  }

  /**
   * Generate React entry file
   */
  private generateReactEntry(example: CodeExample): string {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './${example.filename.replace(/\.(tsx?|jsx?)$/, '')}';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);`;
  }

  /**
   * Generate Vue HTML file
   */
  private generateVueHTML(example: CodeExample): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${example.metadata.title}</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>`;
  }

  /**
   * Generate Vue entry file
   */
  private generateVueEntry(example: CodeExample): string {
    return `import { createApp } from 'vue';
import App from './${example.filename.replace(/\.(vue|js)$/, '')}';

createApp(App).mount('#app');`;
  }

  /**
   * Generate Node.js package.json
   */
  private generateNodePackage(example: CodeExample): string {
    return JSON.stringify({
      name: example.id.replace(/[^a-zA-Z0-9]/g, '-'),
      version: '1.0.0',
      description: example.metadata.description,
      main: example.filename,
      type: 'module',
      dependencies: this.resolveDependencies(example.metadata.dependencies, 'node'),
    }, null, 2);
  }

  /**
   * Generate TypeScript configuration
   */
  private generateTSConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020', 'DOM'],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
      },
      include: ['**/*'],
    }, null, 2);
  }

  /**
   * Estimate difficulty level
   */
  private estimateDifficulty(example: CodeExample): PlaygroundConfig['difficulty'] {
    const { code, metadata } = example;
    let score = 0;

    // Code complexity factors
    if (code.length > 200) score += 1;
    if (code.includes('class ') || code.includes('interface ')) score += 1;
    if (code.includes('async ') || code.includes('await ')) score += 1;
    if (code.includes('Promise') || code.includes('Observable')) score += 1;

    // Metadata factors
    if (metadata.tags.includes('advanced')) score += 2;
    if (metadata.dependencies.length > 3) score += 1;

    if (score >= 3) return 'advanced';
    if (score >= 1) return 'intermediate';
    return 'beginner';
  }

  /**
   * Estimate completion time
   */
  private estimateTime(example: CodeExample): number {
    const baseTime = 5; // 5 minutes base
    const codeComplexity = Math.min(example.code.length / 100, 10); // 1 minute per 100 chars, max 10
    const dependencyComplexity = Math.min(example.metadata.dependencies.length * 2, 5); // 2 minutes per dependency
    
    return Math.round(baseTime + codeComplexity + dependencyComplexity);
  }

  /**
   * Generate playground index
   */
  private async generatePlaygroundIndex(): Promise<void> {
    const indexData = {
      generated: new Date().toISOString(),
      total: this.playgrounds.size,
      playgrounds: Array.from(this.playgrounds.entries()).map(([id, config]) => ({
        id,
        ...config,
      })),
      byQuadrant: this.groupByQuadrant(),
      byTemplate: this.groupByTemplate(),
      byDifficulty: this.groupByDifficulty(),
    };

    const indexPath = join(this.outputDir, 'index.json');
    writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    console.log(`📚 Generated playground index: ${indexPath}`);
  }

  /**
   * Generate StackBlitz embed codes
   */
  private async generateEmbedCodes(): Promise<void> {
    const embedDir = join(this.outputDir, 'embeds');
    if (!existsSync(embedDir)) {
      mkdirSync(embedDir, { recursive: true });
    }

    for (const [id, config] of this.playgrounds) {
      const embedCode = this.generateStackBlitzEmbed(id, config);
      const embedPath = join(embedDir, `${id}.html`);
      writeFileSync(embedPath, embedCode);
    }

    console.log(`🎮 Generated ${this.playgrounds.size} embed codes`);
  }

  /**
   * Generate StackBlitz embed code
   */
  private generateStackBlitzEmbed(id: string, config: PlaygroundConfig): string {
    const stackblitzUrl = `https://stackblitz.com/edit/${id}?embed=1&theme=dark`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title} - Interactive Playground</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .playground-container {
      width: 100%;
      height: 600px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      overflow: hidden;
    }
    .playground-header {
      background: #f8f9fa;
      padding: 12px 16px;
      border-bottom: 1px solid #e1e5e9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .playground-title {
      font-weight: 600;
      color: #2d3748;
    }
    .playground-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #718096;
    }
    .difficulty-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .difficulty-beginner { background: #c6f6d5; color: #22543d; }
    .difficulty-intermediate { background: #fed7d7; color: #742a2a; }
    .difficulty-advanced { background: #e9d8fd; color: #44337a; }
    iframe {
      width: 100%;
      height: 500px;
      border: none;
    }
  </style>
</head>
<body>
  <div class="playground-container">
    <div class="playground-header">
      <div class="playground-title">${config.title}</div>
      <div class="playground-meta">
        <span class="difficulty-badge difficulty-${config.difficulty}">${config.difficulty}</span>
        <span>⏱️ ${config.estimatedTime} min</span>
        <span>🏷️ ${config.template}</span>
      </div>
    </div>
    <iframe src="${stackblitzUrl}" frameborder="0"></iframe>
  </div>
</body>
</html>`;
  }

  private groupByQuadrant(): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const config of this.playgrounds.values()) {
      groups[config.quadrant] = (groups[config.quadrant] || 0) + 1;
    }
    return groups;
  }

  private groupByTemplate(): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const config of this.playgrounds.values()) {
      groups[config.template] = (groups[config.template] || 0) + 1;
    }
    return groups;
  }

  private groupByDifficulty(): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const config of this.playgrounds.values()) {
      groups[config.difficulty] = (groups[config.difficulty] || 0) + 1;
    }
    return groups;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const docsDir = args[0] || 'docs';
  const outputDir = args[1] || 'playgrounds';

  const generator = new PlaygroundGenerator(docsDir, outputDir);
  await generator.generatePlaygrounds();
  
  console.log('\n🎮 Interactive playgrounds generated successfully!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log('🔗 Embed codes ready for documentation integration');
}

if (require.main === module) {
  main().catch(console.error);
}

export { PlaygroundGenerator, PlaygroundConfig, CodeExample };

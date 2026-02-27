import { CodeChunk, IndexingOptions } from "../types";
import * as fs from "fs";
import * as path from "path";

export class IndexingPipeline {
  async executeIndexing(options: IndexingOptions): Promise<CodeChunk[]> {
    console.log("🚀 Starting indexing pipeline...");
    
    const files = await this.discoverFiles(options.src, options.filter);
    console.log(`📁 Found ${files.length} files to process`);
    
    const chunks: CodeChunk[] = [];
    
    for (const file of files) {
      try {
        const fileChunks = await this.processFile(file);
        chunks.push(...fileChunks);
      } catch (error) {
        console.warn(`⚠️ Failed to process ${file}: ${error}`);
      }
    }
    
    console.log(`✅ Indexing complete: ${chunks.length} chunks from ${files.length} files`);
    return chunks;
  }

  private async discoverFiles(src: string, filter?: string): Promise<string[]> {
    const files: string[] = [];
    
    function walkDir(dir: string) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (![".git", "node_modules", "dist", ".next"].includes(item)) {
            walkDir(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
            if (!filter || item.includes(filter)) {
              files.push(fullPath);
            }
          }
        }
      }
    }
    
    walkDir(src);
    return files;
  }

  private async processFile(filePath: string): Promise<CodeChunk[]> {
    const content = fs.readFileSync(filePath, "utf8");
    const ext = path.extname(filePath);
    
    if ([".ts", ".tsx"].includes(ext)) {
      return await this.parseTypeScriptFile(filePath, content);
    } else {
      return await this.parseGenericFile(filePath, content);
    }
  }

  private async parseTypeScriptFile(filePath: string, content: string): Promise<CodeChunk[]> {
    const chunks: CodeChunk[] = [];
    
    const functionRegex = /(?:export\\s+)?function\\s+(\\w+)\\s*\\([^)]*\\)\\s*{/g;
    const classRegex = /(?:export\\s+)?class\\s+(\\w+)/g;
    
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];
      const startPos = match.index;
      const endPos = this.findMatchingBrace(content, startPos);
      
      if (endPos !== -1) {
        chunks.push(this.createChunk(filePath, content, startPos, endPos, "function", functionName));
      }
    }
    
    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      const startPos = match.index;
      const endPos = this.findMatchingBrace(content, startPos);
      
      if (endPos !== -1) {
        chunks.push(this.createChunk(filePath, content, startPos, endPos, "class", className));
      }
    }
    
    return chunks;
  }

  private async parseGenericFile(filePath: string, content: string): Promise<CodeChunk[]> {
    const lines = content.split("\\n");
    
    const chunk: CodeChunk = {
      id: `${filePath}:0`,
      content,
      filePath,
      startLine: 1,
      endLine: lines.length,
      type: "file",
      metadata: {
        name: path.basename(filePath, path.extname(filePath)),
        complexity: 1
      }
    };
    
    return [chunk];
  }

  private createChunk(filePath: string, content: string, startPos: number, endPos: number, type: CodeChunk["type"], name: string): CodeChunk {
    const chunkContent = content.substring(startPos, endPos);
    const startLine = this.getLineNumber(content, startPos);
    const endLine = this.getLineNumber(content, endPos);
    
    return {
      id: `${filePath}:${startPos}`,
      content: chunkContent,
      filePath,
      startLine,
      endLine,
      type,
      metadata: {
        name,
        dependencies: [],
        complexity: 1,
        description: ""
      }
    };
  }

  private findMatchingBrace(content: string, startPos: number): number {
    let braceCount = 0;
    
    for (let i = startPos; i < content.length; i++) {
      const char = content[i];
      
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          return i;
        }
      }
    }
    
    return -1;
  }

  private getLineNumber(content: string, position: number): number {
    const before = content.substring(0, position);
    return before.split("\\n").length;
  }
}

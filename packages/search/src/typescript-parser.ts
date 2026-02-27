import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { CodeChunk } from "./types";

export class TypeScriptParser {
  parseFile(filePath: string): CodeChunk[] {
    const sourceCode = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    
    const chunks: CodeChunk[] = [];
    
    ts.forEachChild(sourceFile, (node) => {
      const chunk = this.createChunk(node, filePath, sourceFile);
      if (chunk) {
        chunks.push(chunk);
      }
    });
    
    return chunks;
  }

  private createChunk(
    node: ts.Node,
    filePath: string,
    sourceFile: ts.SourceFile
  ): CodeChunk | null {
    const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    const end = ts.getLineAndCharacterOfPosition(sourceFile, node.getEnd());
    
    const chunk: CodeChunk = {
      id: \`\${filePath}:\${node.getStart(sourceFile)}\`,
      content: node.getText(sourceFile),
      filePath,
      startLine: start.line + 1,
      endLine: end.line + 1,
      type: this.getNodeType(node),
      metadata: this.extractMetadata(node, sourceFile)
    };

    return chunk;
  }

  private getNodeType(node: ts.Node): CodeChunk["type"] {
    if (ts.isFunctionDeclaration(node)) return "function";
    if (ts.isClassDeclaration(node)) return "class";
    if (ts.isInterfaceDeclaration(node)) return "interface";
    if (ts.isVariableStatement(node)) return "variable";
    if (ts.isImportDeclaration(node)) return "import";
    if (ts.isExportDeclaration(node)) return "export";
    return "function";
  }

  private extractMetadata(node: ts.Node, sourceFile: ts.SourceFile): CodeChunk["metadata"] {
    const metadata: CodeChunk["metadata"] = {};
    
    if (ts.isFunctionDeclaration(node) && node.name) {
      metadata.name = node.name.getText(sourceFile);
      metadata.parameters = node.parameters.map(p => p.name?.getText(sourceFile) || "");
      metadata.returnType = node.type?.getText(sourceFile);
      metadata.dependencies = this.extractDependencies(node, sourceFile);
    }
    
    if (ts.isClassDeclaration(node) && node.name) {
      metadata.name = node.name.getText(sourceFile);
      metadata.dependencies = this.extractDependencies(node, sourceFile);
    }
    
    if (ts.isInterfaceDeclaration(node) && node.name) {
      metadata.name = node.name.getText(sourceFile);
      metadata.dependencies = this.extractDependencies(node, sourceFile);
    }
    
    if (ts.isVariableStatement(node)) {
      metadata.name = node.declarationList.declarations[0].name?.getText(sourceFile);
      metadata.dependencies = this.extractDependencies(node, sourceFile);
    }
    
    // Calculate complexity (simplified)
    metadata.complexity = this.calculateComplexity(node);
    
    return metadata;
  }

  private extractDependencies(node: ts.Node, sourceFile: ts.SourceFile): string[] {
    const dependencies: string[] = [];
    
    const visit = (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        const text = node.getText(sourceFile);
        if (this.isLikelyDependency(text)) {
          dependencies.push(text);
        }
      }
      ts.forEachChild(node, visit);
    };
    
    visit(node);
    return [...new Set(dependencies)]; // Remove duplicates
  }

  private isLikelyDependency(identifier: string): boolean {
    // Simple heuristic for identifying dependencies
    const commonTypes = ["string", "number", "boolean", "void", "any", "unknown"];
    const commonBuiltins = ["console", "document", "window", "global"];
    
    return !commonTypes.includes(identifier) && 
           !commonBuiltins.includes(identifier) &&
           identifier.length > 2;
  }

  private calculateComplexity(node: ts.Node): number {
    let complexity = 1; // Base complexity
    
    const visit = (node: ts.Node) => {
      if (ts.isIfStatement(node) || ts.isWhileStatement(node) || ts.isForStatement(node)) {
        complexity += 1;
      }
      if (ts.isSwitchStatement(node)) {
        complexity += node.caseBlock.clauses.length;
      }
      ts.forEachChild(node, visit);
    };
    
    visit(node);
    return complexity;
  }

  parseDirectory(dirPath: string, filter?: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    const files = this.getFiles(dirPath, filter);
    
    for (const file of files) {
      try {
        const fileChunks = this.parseFile(file);
        chunks.push(...fileChunks);
      } catch (error) {
        console.warn(\`Failed to parse \${file}:\`, error);
      }
    }
    
    return chunks;
  }

  private getFiles(dirPath: string, filter?: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getFiles(fullPath, filter));
      } else if (this.isTypeScriptFile(entry.name)) {
        if (!filter || entry.name.includes(filter)) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  private isTypeScriptFile(fileName: string): boolean {
    return fileName.endsWith(".ts") || fileName.endsWith(".tsx");
  }
}

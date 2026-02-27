import { CodeChunk, IndexingOptions } from "../types";
import { IndexingPipeline } from "./indexing-pipeline";
import { EmbeddingPipeline } from "./embedding-pipeline";
import { QualityControl } from "./quality-control";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export interface FileChange {
  filePath: string;
  type: "added" | "modified" | "deleted";
  timestamp: number;
  hash?: string;
}

export interface IncrementalUpdateOptions extends IndexingOptions {
  manifestPath?: string;
  forceReindex?: boolean;
}

export class IncrementalUpdateManager {
  private manifestPath: string;
  private manifest: Map<string, { hash: string; timestamp: number }>;
  private indexingPipeline: IndexingPipeline;
  private embeddingPipeline: EmbeddingPipeline;
  private qualityControl: QualityControl;

  constructor(apiKey: string, manifestPath: string = "./data/index-manifest.json") {
    this.manifestPath = manifestPath;
    this.manifest = new Map();
    this.indexingPipeline = new IndexingPipeline();
    this.embeddingPipeline = new EmbeddingPipeline(apiKey);
    this.qualityControl = new QualityControl();
    
    this.loadManifest();
  }

  async executeIncrementalUpdate(options: IncrementalUpdateOptions): Promise<{
    chunks: CodeChunk[];
    embeddings: number[][];
    changes: FileChange[];
  }> {
    console.log("🔄 Starting incremental update...");
    
    if (options.forceReindex) {
      console.log("🔄 Force reindexing all files...");
      return await this.fullReindex(options);
    }
    
    // Detect changes
    const changes = await this.detectChanges(options.src);
    console.log(`📊 Detected ${changes.length} file changes`);
    
    if (changes.length === 0) {
      console.log("✅ No changes detected, skipping update");
      return {
        chunks: [],
        embeddings: [],
        changes: []
      };
    }
    
    // Process changes
    const result = await this.processChanges(changes, options);
    
    // Update manifest
    this.updateManifest(changes);
    this.saveManifest();
    
    console.log("✅ Incremental update complete");
    return result;
  }

  private async detectChanges(src: string): Promise<FileChange[]> {
    const changes: FileChange[] = [];
    const currentTime = Date.now();
    
    // Get all current files
    const currentFiles = await this.getAllFiles(src);
    
    // Check for new and modified files
    for (const filePath of currentFiles) {
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const stats = fs.statSync(filePath);
      const fileHash = this.calculateFileHash(filePath);
      const manifestEntry = this.manifest.get(filePath);
      
      if (!manifestEntry) {
        // New file
        changes.push({
          filePath,
          type: "added",
          timestamp: currentTime,
          hash: fileHash
        });
      } else if (manifestEntry.hash !== fileHash || stats.mtimeMs > manifestEntry.timestamp) {
        // Modified file
        changes.push({
          filePath,
          type: "modified",
          timestamp: currentTime,
          hash: fileHash
        });
      }
    }
    
    // Check for deleted files
    for (const [filePath] of this.manifest) {
      if (!currentFiles.includes(filePath) && !fs.existsSync(filePath)) {
        changes.push({
          filePath,
          type: "deleted",
          timestamp: currentTime
        });
      }
    }
    
    return changes;
  }

  private async processChanges(changes: FileChange[], options: IncrementalUpdateOptions): Promise<{
    chunks: CodeChunk[];
    embeddings: number[][];
  }> {
    const allChunks: CodeChunk[] = [];
    const allEmbeddings: number[][] = [];
    
    // Group changes by type
    const added = changes.filter(c => c.type === "added");
    const modified = changes.filter(c => c.type === "modified");
    const deleted = changes.filter(c => c.type === "deleted");
    
    console.log(`📁 Processing ${added.length} added files`);
    console.log(`✏️ Processing ${modified.length} modified files`);
    console.log(`🗑️ Processing ${deleted.length} deleted files`);
    
    // Process added and modified files
    const filesToProcess = [...added, ...modified].map(c => c.filePath);
    
    if (filesToProcess.length > 0) {
      // Index files
      const chunks = await this.indexingPipeline.executeIndexing({
        src: "", // Not used when processing specific files
        filter: undefined,
        incremental: true,
        batchSize: options.batchSize
      });
      
      // Filter chunks to only include processed files
      const relevantChunks = chunks.filter(chunk => 
        filesToProcess.includes(chunk.filePath)
      );
      
      // Quality control
      const qualityMetrics = this.qualityControl.analyzeQuality(relevantChunks);
      const filteredChunks = this.qualityControl.filterChunks(relevantChunks);
      
      // Generate embeddings
      const embeddings = await this.embeddingPipeline.generateEmbeddings(
        filteredChunks,
        options.batchSize
      );
      
      allChunks.push(...filteredChunks);
      allEmbeddings.push(...embeddings);
    }
    
    // Handle deleted files (would need to remove from vector database)
    if (deleted.length > 0) {
      console.log(`🗑️ Would remove ${deleted.length} files from index`);
      // Implementation would depend on vector database capabilities
    }
    
    return {
      chunks: allChunks,
      embeddings: allEmbeddings
    };
  }

  private async fullReindex(options: IncrementalUpdateOptions): Promise<{
    chunks: CodeChunk[];
    embeddings: number[][];
    changes: FileChange[];
  }> {
    // Clear manifest
    this.manifest.clear();
    
    // Perform full indexing
    const chunks = await this.indexingPipeline.executeIndexing(options);
    
    // Quality control
    const filteredChunks = this.qualityControl.filterChunks(chunks);
    
    // Generate embeddings
    const embeddings = await this.embeddingPipeline.generateEmbeddings(
      filteredChunks,
      options.batchSize
    );
    
    // Create change entries for all files
    const changes: FileChange[] = filteredChunks.map(chunk => ({
      filePath: chunk.filePath,
      type: "added" as const,
      timestamp: Date.now(),
      hash: this.calculateFileHash(chunk.filePath)
    }));
    
    return {
      chunks: filteredChunks,
      embeddings,
      changes
    };
  }

  private async getAllFiles(src: string): Promise<string[]> {
    const files: string[] = [];
    
    function walkDir(dir: string) {
      if (!fs.existsSync(dir)) return;
      
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
            files.push(fullPath);
          }
        }
      }
    }
    
    walkDir(src);
    return files;
  }

  private calculateFileHash(filePath: string): string {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return crypto.createHash("md5").update(content).digest("hex");
    } catch (error) {
      return "";
    }
  }

  private updateManifest(changes: FileChange[]): void {
    for (const change of changes) {
      if (change.type === "deleted") {
        this.manifest.delete(change.filePath);
      } else if (change.hash) {
        this.manifest.set(change.filePath, {
          hash: change.hash,
          timestamp: change.timestamp
        });
      }
    }
  }

  private loadManifest(): void {
    try {
      if (fs.existsSync(this.manifestPath)) {
        const data = fs.readFileSync(this.manifestPath, "utf8");
        const manifest = JSON.parse(data);
        
        for (const [filePath, entry] of Object.entries(manifest)) {
          this.manifest.set(filePath, entry as { hash: string; timestamp: number });
        }
        
        console.log(`📋 Loaded manifest with ${this.manifest.size} entries`);
      }
    } catch (error) {
      console.warn("⚠️ Failed to load manifest, starting fresh");
    }
  }

  private saveManifest(): void {
    try {
      const manifestDir = path.dirname(this.manifestPath);
      if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true });
      }
      
      const manifest = Object.fromEntries(this.manifest);
      fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log(`💾 Saved manifest with ${this.manifest.size} entries`);
    } catch (error) {
      console.error("❌ Failed to save manifest:", error);
    }
  }
}

import { execSync } from "child_process";
import { RepositorySearchService } from "../search-service";
import * as fs from "fs";
import * as path from "path";

export class IndexingProgress {
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  processedChunks: number;
  errors: string[];
  startTime: number;
  currentFile?: string;
}

export class IndexingProgressReporter {
  private progress: IndexingProgress;
  private startTime: number;

  constructor() {
    this.progress = {
      totalFiles: 0,
      processedFiles: 0,
      totalChunks: 0,
      processedChunks: 0,
      errors: [],
      startTime: Date.now()
    };
  }

  updateProgress(progress: IndexingProgress): void {
    this.progress = { ...this.progress };
  }

  printProgress(): void {
    console.log(`📊 Indexing Progress Report`);
    console.log(`📁 Total Files: ${this.progress.totalFiles}`);
    console.log(`📁 Processed: ${this.progress.processedFiles}`);
    console.log(`📊 Total Chunks: ${this.progress.totalChunks}`);
    console.log(`📁 Processed Chunks: ${this.progress.processedChunks}`);
    console.log(`📁 Errors: ${this.progress.errors.length}`);
    console.log(`📅 Duration: ${Date.now() - this.progress.startTime}ms`);
    
    if (this.progress.errors.length > 0) {
      console.log("\n⚠️ Errors:");
      this.progress.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log("\n✅ Indexing Complete!");
  }

  getProgress(): IndexingProgress {
    return {
      totalFiles: this.progress.totalFiles,
      processedFiles: this.progress.processedFiles,
      totalChunks: this.progress.totalChunks,
      processedChunks: this.progress.processedChunks,
      errors: this.progress.errors.length,
      startTime: this.progress.startTime,
      duration: Date.now() - this.progress.startTime
    };
  }
}

export class RepositoryIndexer {
  private progressReporter: IndexingProgressReporter;
  private searchService: RepositorySearchService;
  private indexingPipeline: IndexingPipeline;
  private qualityControl: QualityControl;
  private incrementalUpdateManager: IncrementalUpdateManager;

  constructor(apiKey: string) {
    this.progressReporter = new IndexingProgressReporter();
    this.searchService = new RepositorySearchService();
    this.indexingPipeline = new IndexingPipeline();
    this.qualityControl = new QualityControl();
    this.incrementalUpdateManager = new IncrementalUpdateManager(apiKey);
  }

  async analyzeRepository(options: IndexingOptions): Promise<{
    console.log("🔍 Starting repository analysis...");
    
    // Phase 1: File Discovery
    const files = await this.indexingPipeline.discoverFiles(options.src, options.filter);
    this.progressReporter.updateProgress({
      totalFiles: files.length,
      processedFiles: 0,
      totalChunks: 0,
      processedChunks: 0,
      errors: [],
      startTime: Date.now()
    });
    
    // Phase 2: Quality Analysis
    const chunks = await this.indexingPipeline.executeIndexing(options);
    const metrics = this.qualityControl.analyzeQuality(chunks);
    
    this.progressReporter.updateProgress({
      totalFiles: files.length,
      processedFiles: files.length,
      totalChunks: chunks.length,
      processedChunks: chunks.length,
      errors: this.progress.errors.length,
      startTime: this.progress.startTime
    });
    
    // Phase 3: Embedding Generation
    const embeddings = await this.embeddingPipeline.generateEmbeddings(chunks);
    
    // Phase 4: Knowledge Graph
    // This would build the knowledge graph
    
    console.log("📊 Repository Analysis Summary:");
    console.log(`📁 Total Files: ${files.length}`);
    console.log(`📊 Processed Chunks: ${chunks.length}`);
    console.log(`📊 Quality Score: ${metrics.averageQuality.toFixed(1)}/100`);
    
    return {
      chunks,
      embeddings,
      metrics,
      analysis: {
        totalFiles: files.length,
        processedFiles: files.length,
        totalChunks: chunks.length,
        averageQuality: metrics.averageQuality,
        errors: this.progress.errors.length
      }
    };
  }

  async executeFullIndexing(options: IndexingOptions): Promise<{
    console.log("🔄 Starting full repository indexing...");
    
    // Clear manifest for full reindex
    this.incrementalUpdateManager.clearManifest();
    
    // Execute full indexing
    const chunks = await this.indexingPipeline.executeIndexing(options);
    
    // Quality control
    const filteredChunks = this.qualityControl.filterChunks(chunks);
    
    // Generate embeddings
    const embeddings = await this.embeddingPipeline.generateEmbeddings(filteredChunks);
    
    // Build knowledge graph
    // This would build the knowledge graph
    
    console.log(`✅ Full indexing complete: ${filteredChunks.length} chunks indexed`);
    console.log(`📊 Generated ${embeddings.length} embeddings`);
    
    return {
      chunks: filteredChunks,
      embeddings,
      metrics: {
        totalFiles: files.length,
        processedFiles: files.length,
        totalChunks: filteredChunks.length,
        averageQuality: metrics.averageQuality,
        errors: this.progress.errors.length
      }
    };
  }

  async executeIncrementalUpdate(options: IndexingOptions): Promise<{
    console.log("🔄 Starting incremental update...");
    
    const changes = await this.incrementalUpdateManager.detectChanges(options.src);
    
    if (changes.length === 0) {
      console.log("✅ No changes detected, skipping update");
      return;
    }
    
    // Process changes
    const changedFiles = changes.filter(change => change.type !== "deleted");
    
    // Remove deleted files
    const deletedFiles = changes.filter(change => change.type === "deleted");
    for (const deletedFile of deletedFiles) {
      this.incrementalUpdateManager.removeFromManifest(deletedFile);
    }
    
    // Process added and modified files
    const addedFiles = changes.filter(change => change.type === "added" || change.type === "modified");
    const modifiedFiles = changes.filter(change => change.type === "modified");
    
    // Generate embeddings for changed files
    const changedChunks = await this.indexingPipeline.executeIndexing({
      src: options.src,
      filter: options.filter,
      incremental: true
    });
    
    // Update manifest
    this.incrementalUpdateManager.updateManifest(addedFiles, modifiedFiles);
    
    console.log(`🔄 Incremental update complete: ${added ${addedFiles.length} files`);
    
    return {
      chunks: changedChunks,
      embeddings: changedEmbeddings,
      metrics: {
        totalFiles: files.length,
        processedFiles: files.length + addedFiles.length,
        totalChunks: changedChunks.length,
        averageQuality: this.progress.averageQuality
      }
    };
  }

  printProgress(): void {
    this.progressReporter.updateProgress({
      totalFiles: this.progress.totalFiles,
      processedFiles: this.progress.processedFiles,
      totalChunks: this.progress.totalChunks,
      processedChunks: this.progress.processedChunks,
      errors: this.progress.errors.length,
      startTime: this.progress.startTime
    });
  }
}

import { CodeChunk } from "../types";

export interface QualityMetrics {
  totalChunks: number;
  validChunks: number;
  averageChunkSize: number;
  averageComplexity: number;
  duplicateChunks: number;
  emptyChunks: number;
  largeChunks: number;
  errors: string[];
}

export class QualityControl {
  private metrics: QualityMetrics;
  private thresholds = {
    minChunkSize: 10,
    maxChunkSize: 2000,
    maxComplexity: 50,
    minComplexity: 1
  };

  constructor() {
    this.metrics = {
      totalChunks: 0,
      validChunks: 0,
      averageChunkSize: 0,
      averageComplexity: 0,
      duplicateChunks: 0,
      emptyChunks: 0,
      largeChunks: 0,
      errors: []
    };
  }

  analyzeQuality(chunks: CodeChunk[]): QualityMetrics {
    console.log("🔍 Analyzing code chunk quality...");
    
    this.metrics.totalChunks = chunks.length;
    
    const contentHashes = new Map<string, number>();
    let totalSize = 0;
    let totalComplexity = 0;
    
    for (const chunk of chunks) {
      // Check for empty chunks
      if (!chunk.content || chunk.content.trim().length === 0) {
        this.metrics.emptyChunks++;
        this.metrics.errors.push(`Empty chunk: ${chunk.id}`);
        continue;
      }
      
      // Check chunk size
      const chunkSize = chunk.content.length;
      totalSize += chunkSize;
      
      if (chunkSize < this.thresholds.minChunkSize) {
        this.metrics.errors.push(`Small chunk: ${chunk.id} (${chunkSize} chars)`);
      } else if (chunkSize > this.thresholds.maxChunkSize) {
        this.metrics.largeChunks++;
        this.metrics.errors.push(`Large chunk: ${chunk.id} (${chunkSize} chars)`);
      }
      
      // Check complexity
      const complexity = chunk.metadata.complexity || 1;
      totalComplexity += complexity;
      
      if (complexity < this.thresholds.minComplexity) {
        this.metrics.errors.push(`Low complexity: ${chunk.id} (${complexity})`);
      } else if (complexity > this.thresholds.maxComplexity) {
        this.metrics.errors.push(`High complexity: ${chunk.id} (${complexity})`);
      }
      
      // Check for duplicates
      const contentHash = this.hashContent(chunk.content);
      if (contentHashes.has(contentHash)) {
        this.metrics.duplicateChunks++;
        this.metrics.errors.push(`Duplicate chunk: ${chunk.id} (similar to ${contentHashes.get(contentHash)})`);
      } else {
        contentHashes.set(contentHash, parseInt(chunk.id.split(":")[1]));
      }
      
      // Check metadata
      if (!chunk.metadata.name) {
        this.metrics.errors.push(`Missing name: ${chunk.id}`);
      }
      
      if (!chunk.type) {
        this.metrics.errors.push(`Missing type: ${chunk.id}`);
      }
      
      this.metrics.validChunks++;
    }
    
    // Calculate averages
    if (this.metrics.validChunks > 0) {
      this.metrics.averageChunkSize = totalSize / this.metrics.validChunks;
      this.metrics.averageComplexity = totalComplexity / this.metrics.validChunks;
    }
    
    this.printQualityReport();
    return this.metrics;
  }

  filterChunks(chunks: CodeChunk[]): CodeChunk[] {
    console.log("🧹 Filtering low-quality chunks...");
    
    const filteredChunks = chunks.filter(chunk => {
      // Remove empty chunks
      if (!chunk.content || chunk.content.trim().length === 0) {
        return false;
      }
      
      // Remove chunks that are too small
      if (chunk.content.length < this.thresholds.minChunkSize) {
        return false;
      }
      
      // Remove chunks that are too large
      if (chunk.content.length > this.thresholds.maxChunkSize) {
        return false;
      }
      
      // Remove chunks with invalid complexity
      const complexity = chunk.metadata.complexity || 1;
      if (complexity < this.thresholds.minComplexity || complexity > this.thresholds.maxComplexity) {
        return false;
      }
      
      return true;
    });
    
    console.log(`📊 Filtered ${chunks.length - filteredChunks.length} chunks, kept ${filteredChunks.length}`);
    return filteredChunks;
  }

  private hashContent(content: string): string {
    // Simple hash function for duplicate detection
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private printQualityReport(): void {
    console.log("📊 Quality Analysis Report");
    console.log("========================");
    console.log(`📁 Total Chunks: ${this.metrics.totalChunks}`);
    console.log(`✅ Valid Chunks: ${this.metrics.validChunks}`);
    console.log(`📏 Average Size: ${this.metrics.averageChunkSize.toFixed(1)} chars`);
    console.log(`🧠 Average Complexity: ${this.metrics.averageComplexity.toFixed(1)}`);
    console.log(`🔄 Duplicate Chunks: ${this.metrics.duplicateChunks}`);
    console.log(`📭 Empty Chunks: ${this.metrics.emptyChunks}`);
    console.log(`📦 Large Chunks: ${this.metrics.largeChunks}`);
    console.log(`❌ Errors: ${this.metrics.errors.length}`);
    
    if (this.metrics.errors.length > 0) {
      console.log("\\n🔍 Top 10 Errors:");
      this.metrics.errors.slice(0, 10).forEach(error => {
        console.log(`   - ${error}`);
      });
    }
    
    // Quality score
    const qualityScore = this.calculateQualityScore();
    console.log(`\\n📊 Quality Score: ${qualityScore.toFixed(1)}/100`);
    
    if (qualityScore >= 80) {
      console.log("✅ Excellent quality!");
    } else if (qualityScore >= 60) {
      console.log("👍 Good quality");
    } else if (qualityScore >= 40) {
      console.log("⚠️ Fair quality - consider improvements");
    } else {
      console.log("❌ Poor quality - significant improvements needed");
    }
  }

  private calculateQualityScore(): number {
    let score = 100;
    
    // Deduct for errors
    score -= Math.min(30, this.metrics.errors.length * 2);
    
    // Deduct for duplicates
    score -= Math.min(20, this.metrics.duplicateChunks * 5);
    
    // Deduct for empty chunks
    score -= Math.min(15, this.metrics.emptyChunks * 3);
    
    // Deduct for large chunks
    score -= Math.min(10, this.metrics.largeChunks * 2);
    
    // Bonus for good complexity
    if (this.metrics.averageComplexity >= 2 && this.metrics.averageComplexity <= 10) {
      score += 5;
    }
    
    // Bonus for good chunk size
    if (this.metrics.averageChunkSize >= 100 && this.metrics.averageChunkSize <= 500) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}

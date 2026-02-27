#!/usr/bin/env node

/**
 * RAG Evaluation Pipeline
 * 
 * Quarterly evaluation of RAG optimization metrics for 2026 bimodal documentation
 * Measures hit rate, retrieval quality, and semantic chunking effectiveness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RAGEvaluator {
  constructor() {
    this.metrics = {
      total_queries: 0,
      successful_retrievals: 0,
      hit_rate: 0,
      average_retrieval_time: 0,
      chunk_effectiveness: 0,
      semantic_quality_score: 0
    };
    
    this.queries = [];
    this.evaluationDate = new Date().toISOString();
  }

  async evaluateRAGPerformance(docsDirectory) {
    console.log('🔍 Starting RAG Evaluation Pipeline');
    console.log(`📅 Evaluation Date: ${this.evaluationDate}`);
    console.log(`📁 Documentation Directory: ${docsDirectory}`);
    
    // Load test queries
    const testQueries = this.loadTestQueries();
    this.metrics.total_queries = testQueries.length;
    
    console.log(`📝 Loaded ${testQueries.length} test queries`);
    
    // Process each query
    for (const query of testQueries) {
      await this.processQuery(query, docsDirectory);
    }
    
    // Calculate metrics
    this.calculateMetrics();
    
    // Generate report
    const report = this.generateReport();
    await this.saveReport(report);
    
    console.log('\n📊 RAG Evaluation Report');
    console.log('=====================================');
    console.log(`📝 Total Queries: ${this.metrics.total_queries}`);
    console.log(`✅ Successful Retrievals: ${this.metrics.successful_retrievals}`);
    console.log(`🎯 Hit Rate: ${(this.metrics.hit_rate * 100).toFixed(1)}%`);
    console.log(`⚡ Avg Retrieval Time: ${this.metrics.average_retrieval_time}ms`);
    console.log(`📊 Chunk Effectiveness: ${(this.metrics.chunk_effectiveness * 100).toFixed(1)}%`);
    console.log(`🧠 Semantic Quality Score: ${(this.metrics.semantic_quality_score * 100).toFixed(1)}%`);
    
    // Check thresholds
    this.checkThresholds();
    
    return report;
  }

  loadTestQueries() {
    // Test queries based on 2026 standards
    return [
      {
        id: 'q001',
        query: 'How do I set up multi-tenant authentication?',
        expected_chunks: 3,
        keywords: ['multi-tenant', 'authentication', 'OAuth 2.1', 'PKCE'],
        category: 'setup'
      },
      {
        id: 'q002',
        query: 'What are the Core Web Vitals targets?',
        expected_chunks: 2,
        keywords: ['Core Web Vitals', 'LCP', 'INP', 'CLS'],
        category: 'performance'
      },
      {
        id: 'q003',
        query: 'How does FSD layer isolation work?',
        expected_chunks: 4,
        keywords: ['Feature-Sliced Design', 'layer isolation', 'entities', 'features'],
        category: 'architecture'
      },
      {
        id: 'q004',
        query: 'What security patterns are implemented?',
        expected_chunks: 5,
        keywords: ['security', 'OAuth 2.1', 'RLS', 'defense-in-depth'],
        category: 'security'
      },
      {
        id: 'q005',
        query: 'How do I implement economic impact analysis?',
        expected_chunks: 3,
        keywords: ['ADR-E', 'economic impact', 'ROI', 'Chesterton Fence'],
        category: 'governance'
      },
      {
        id: 'q006',
        query: 'What are the SLSA Level 3 requirements?',
        expected_chunks: 3,
        keywords: ['SLSA', 'Level 3', 'provenance', 'verification'],
        category: 'compliance'
      },
      {
        id: 'q007',
        query: 'How do I optimize for RAG retrieval?',
        expected_chunks: 4,
        keywords: ['RAG optimization', 'chunking', 'embedding_model', 'hybrid_search'],
        category: 'ai-optimization'
      },
      {
        id: 'q008',
        query: 'What are the bimodal documentation standards?',
        expected_chunks: 4,
        keywords: ['bimodal', 'human TTV', 'AI readiness', 'semantic chunking'],
        category: 'standards'
      },
      {
        id: 'q009',
        query: 'How do I validate executable documentation?',
        expected_chunks: 2,
        keywords: ['executable', 'CI validation', 'automated testing'],
        category: 'validation'
      },
      {
        id: 'q010',
        query: 'What are the economic accountability requirements?',
        expected_chunks: 3,
        keywords: ['economic accountability', 'ADR-E', 'ROI analysis', 'velocity impact'],
        category: 'governance'
      }
    ];
  }

  async processQuery(query, docsDirectory) {
    const startTime = Date.now();
    
    console.log(`🔍 Processing query: ${query.query}`);
    
    // Simulate RAG retrieval (in real implementation, this would call the RAG system)
    const retrievalResults = this.simulateRAGRetrieval(query, docsDirectory);
    const endTime = Date.now();
    
    const retrievalTime = endTime - startTime;
    
    // Evaluate success
    const success = this.evaluateRetrieval(query, retrievalResults);
    
    this.queries.push({
      ...query,
      retrieval_time: retrievalTime,
      success: success,
      chunks_found: retrievalResults.length,
      keywords_matched: this.countKeywordMatches(query.keywords, retrievalResults)
    });
    
    if (success) {
      this.metrics.successful_retrievals++;
    }
    
    this.metrics.average_retrieval_time = 
      (this.metrics.average_retrieval_time * (this.metrics.successful_retrievals - 1) + retrievalTime) / this.metrics.successful_retrievals;
  }

  simulateRAGRetrieval(query, docsDirectory) {
    // In a real implementation, this would:
    // 1. Parse the query and extract keywords
    // 2. Search the documentation using the RAG system
    // 3. Return relevant chunks with scores
    
    // For simulation, we'll search for keyword matches in documentation files
    const results = [];
    const files = this.findMarkdownFiles(docsDirectory);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        // Skip frontmatter
        const frontmatterEnd = lines.findIndex(line => line.trim() === '---');
        if (frontmatterEnd === -1) continue;
        
        const contentAfterFrontmatter = lines.slice(frontmatterEnd + 1).join('\n');
        
        // Count keyword matches
        const matches = query.keywords.reduce((count, keyword) => {
          return count + (contentAfterFrontmatter.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0;
        }, 0);
        
        if (matches > 0) {
          results.push({
            file: file,
            score: matches / query.keywords.length,
            matches: matches,
            content: contentAfterFrontmatter.substring(0, 500) // First 500 chars for preview
          });
        }
      } catch (error) {
        console.warn(`Warning: Could not read ${file}: ${error.message}`);
      }
    }
    
    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, query.expected_chunks);
  }

  evaluateRetrieval(query, results) {
    // Success criteria:
    // 1. Found expected number of chunks
    // 2. Keywords are matched
    // 3. Results are relevant to query category
    
    const chunksFound = results.length;
    const keywordsMatched = this.countKeywordMatches(query.keywords, results);
    const expectedChunks = query.expected_chunks;
    
    return chunksFound >= expectedChunks && 
           keywordsMatched >= Math.ceil(query.keywords.length * 0.7) && 
           results.some(result => result.score > 0.5);
  }

  countKeywordMatches(keywords, results) {
    return results.reduce((count, result) => {
      const matches = keywords.filter(keyword => 
        result.content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      return count + matches;
    }, 0);
  }

  calculateMetrics() {
    this.metrics.hit_rate = this.metrics.total_queries > 0 ? 
      (this.metrics.successful_retrievals / this.metrics.total_queries) : 0;
    
    // Chunk effectiveness: average chunks found vs expected
    const totalExpectedChunks = this.queries.reduce((sum, query) => sum + query.expected_chunks, 0);
    const totalFoundChunks = this.queries.reduce((sum, query) => sum + query.chunks_found, 0);
    this.metrics.chunk_effectiveness = totalExpectedChunks > 0 ? 
      (totalFoundChunks / totalExpectedChunks) : 0;
    
    // Semantic quality: based on keyword matching and relevance scores
    this.metrics.semantic_quality_score = this.queries.reduce((sum, query) => {
      const avgScore = query.keywords_matched > 0 ? 
        query.keywords_matched / query.keywords.length : 0;
      return sum + avgScore;
    }, 0) / this.queries.length;
  }

  checkThresholds() {
    const thresholds = {
      hit_rate: 0.90,  // 90% minimum hit rate
      chunk_effectiveness: 0.85, // 85% chunk effectiveness
      semantic_quality: 0.80 // 80% semantic quality
    };
    
    let hasIssues = false;
    
    if (this.metrics.hit_rate < thresholds.hit_rate) {
      console.log(`❌ Hit rate ${this.metrics.hit_rate * 100}% below threshold ${thresholds.hit_rate * 100}%`);
      hasIssues = true;
    }
    
    if (this.metrics.chunk_effectiveness < thresholds.chunk_effectiveness) {
      console.log(`❌ Chunk effectiveness ${this.metrics.chunk_effectiveness * 100}% below threshold ${thresholds.chunk_effectiveness * 100}%`);
      hasIssues = true;
    }
    
    if (this.metrics.semantic_quality_score < thresholds.semantic_quality) {
      console.log(`❌ Semantic quality ${this.metrics.semantic_quality_score * 100}% below threshold ${thresholds.semantic_quality * 100}%`);
      hasIssues = true;
    }
    
    if (!hasIssues) {
      console.log('✅ All RAG metrics meet or exceed thresholds');
    }
  }

  generateReport() {
    return {
      evaluation_date: this.evaluation_date,
      metrics: this.metrics,
      queries: this.queries.map(q => ({
        id: q.id,
        query: q.query,
        category: q.category,
        expected_chunks: q.expected_chunks,
        chunks_found: q.chunks_found,
        keywords_matched: q.keywords_matched,
        retrieval_time: q.retrieval_time,
        success: q.success,
        score: q.score
      })),
      thresholds: {
        hit_rate: 0.90,
        chunk_effectiveness: 0.85,
        semantic_quality: 0.80
      },
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.hit_rate < 0.90) {
      recommendations.push({
        priority: 'high',
        category: 'retrieval',
        issue: 'Low hit rate',
        solution: 'Improve semantic chunking and keyword optimization'
      });
    }
    
    if (this.metrics.chunk_effectiveness < 0.85) {
      recommendations.push({
        priority: 'medium',
        category: 'chunking',
        issue: 'Poor chunk effectiveness',
        solution: 'Adjust chunk size (800-1200 tokens) and improve boundaries'
      });
    }
    
    if (this.metrics.semantic_quality_score < 0.80) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        issue: 'Low semantic quality',
        solution: 'Enhance contextual anchors and semantic relationships'
      });
    }
    
    return recommendations;
  }

  async saveReport(report) {
    const reportPath = path.join(process.cwd(), 'docs', 'reports', `rag-evaluation-${this.evaluationDate.split('T')[0]}.json`);
    
    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  findMarkdownFiles(directory) {
    const files = [];
    
    function scanDir(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const docsDirectory = args[0] || path.join(process.cwd(), 'docs');
  
  const evaluator = new RAGEvaluator();
  const report = await evaluator.evaluateRAGPerformance(docsDirectory);
  
  process.exit(0);
}

#!/usr/bin/env node

import { Command } from "commander";
import { RepositorySearchService } from "../search-service";
import { IndexingPipeline } from "./indexing-pipeline";
import { EmbeddingPipeline } from "./embedding-pipeline";
import { QualityControl } from "./quality-control";
import { IncrementalUpdateManager } from "./incremental-update";
import * as fs from "fs";

const program = new Command();

program
  .name("repo-search")
  .description("Repository search CLI")
  .version("1.0.0");

program
  .command("index")
  .description("Index repository for search")
  .option("-s, --src <path>", "Source directory to index", "./packages")
  .option("-f, --filter <glob>", "File pattern filter", "*.ts,*.tsx")
  .option("-i, --incremental", "Incremental indexing", false)
  .option("-b, --batch-size <number>", "Batch size for processing", "100")
  .option("--force", "Force full reindex", false)
  .option("--quality", "Run quality analysis", true)
  .action(async (options) => {
    console.log("🔍 Starting repository indexing...");
    console.log(`📁 Source: ${options.src}`);
    console.log(`🔍 Filter: ${options.filter}`);
    console.log(`📦 Incremental: ${options.incremental}`);
    console.log(`📊 Batch Size: ${options.batchSize}`);
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY environment variable is required");
      process.exit(1);
    }
    
    try {
      const startTime = Date.now();
      
      if (options.incremental) {
        // Incremental indexing
        const updateManager = new IncrementalUpdateManager(apiKey);
        const result = await updateManager.executeIncrementalUpdate({
          src: options.src,
          filter: options.filter,
          incremental: true,
          batchSize: parseInt(options.batchSize),
          forceReindex: options.force
        });
        
        console.log(`✅ Incremental indexing complete: ${result.chunks.length} chunks`);
      } else {
        // Full indexing
        const indexingPipeline = new IndexingPipeline();
        const chunks = await indexingPipeline.executeIndexing({
          src: options.src,
          filter: options.filter,
          incremental: false,
          batchSize: parseInt(options.batchSize)
        });
        
        // Quality control
        let filteredChunks = chunks;
        if (options.quality) {
          const qualityControl = new QualityControl();
          filteredChunks = qualityControl.filterChunks(chunks);
        }
        
        // Generate embeddings
        const embeddingPipeline = new EmbeddingPipeline(apiKey);
        const embeddings = await embeddingPipeline.generateEmbeddings(
          filteredChunks,
          parseInt(options.batchSize)
        );
        
        console.log(`✅ Full indexing complete: ${filteredChunks.length} chunks, ${embeddings.length} embeddings`);
      }
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Duration: ${duration}ms`);
    } catch (error) {
      console.error("❌ Indexing failed:", error);
      process.exit(1);
    }
  });

program
  .command("search <query>")
  .description("Search repository")
  .option("-t, --top <number>", "Number of results", "10")
  .option("-f, --filter <glob>", "File pattern filter")
  .option("-p, --packages <packages>", "Package filter (comma-separated)")
  .option("--types <types>", "Code types (comma-separated)")
  .option("--threshold <number>", "Similarity threshold", "0.5")
  .option("--context", "Include context", false)
  .action(async (query, options) => {
    console.log(`🔍 Searching for: "${query}"`);
    
    const searchService = new RepositorySearchService();
    
    try {
      const startTime = Date.now();
      const results = await searchService.search({
        query,
        filters: {
          fileTypes: options.filter ? [options.filter] : undefined,
          packages: options.packages ? options.packages.split(",") : undefined,
          types: options.types ? options.types.split(",") as any : undefined
        },
        options: {
          top: parseInt(options.top),
          threshold: parseFloat(options.threshold),
          includeContext: options.context
        }
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`📊 Found ${results.length} results in ${duration}ms`);
      console.log("");
      
      if (results.length === 0) {
        console.log("No results found. Try a different query or adjust filters.");
        return;
      }
      
      results.forEach((result, i) => {
        console.log(`${i + 1}. ${result.filePath}:${result.startLine}-${result.endLine}`);
        console.log(`   📊 Score: ${result.score.toFixed(3)}`);
        console.log(`   📝 Type: ${result.metadata.type}`);
        if (result.metadata.name) {
          console.log(`   🏷️  Name: ${result.metadata.name}`);
        }
        console.log(`   📄 Snippet:`);
        console.log(`   ${result.snippet.split("\\n").map(line => `   ${line}`).join("\\n")}`);
        console.log("");
      });
    } catch (error) {
      console.error("❌ Search failed:", error);
      process.exit(1);
    }
  });

program
  .command("quality")
  .description("Analyze code quality")
  .option("-s, --src <path>", "Source directory to analyze", "./packages")
  .option("-f, --filter <glob>", "File pattern filter", "*.ts,*.tsx")
  .action(async (options) => {
    console.log("🔍 Analyzing code quality...");
    
    try {
      const indexingPipeline = new IndexingPipeline();
      const chunks = await indexingPipeline.executeIndexing({
        src: options.src,
        filter: options.filter,
        incremental: false,
        batchSize: 100
      });
      
      const qualityControl = new QualityControl();
      const metrics = qualityControl.analyzeQuality(chunks);
      
      console.log("\\n🎯 Recommendations:");
      if (metrics.errors.length > 0) {
        console.log("- Consider fixing identified quality issues");
      }
      if (metrics.duplicateChunks > 0) {
        console.log("- Remove duplicate code to improve maintainability");
      }
      if (metrics.largeChunks > 0) {
        console.log("- Break down large chunks into smaller functions");
      }
      
    } catch (error) {
      console.error("❌ Quality analysis failed:", error);
      process.exit(1);
    }
  });

program
  .command("health")
  .description("Check system health")
  .action(async () => {
    console.log("🏥 System Health Check");
    console.log("===================");
    
    // Check environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    console.log(`✅ OpenAI API Key: ${apiKey ? "Set" : "Not set"}`);
    
    // Check directories
    const srcDir = "./packages";
    console.log(`✅ Source Directory: ${fs.existsSync(srcDir) ? "Exists" : "Not found"}`);
    
    // Try to connect to API
    try {
      const response = await fetch("http://localhost:3000/api/health");
      if (response.ok) {
        const health = await response.json();
        console.log(`✅ API Server: ${health.services.api}`);
        console.log(`✅ Vector Database: ${health.services.vectorDatabase}`);
        console.log(`✅ Knowledge Graph: ${health.services.knowledgeGraph}`);
        console.log(`✅ Embedding Service: ${health.services.embeddingService}`);
      } else {
        console.log("❌ API Server: Not responding correctly");
      }
    } catch (error) {
      console.log("❌ API Server: Not responding");
      console.log("💡 Make sure the search service is running:");
      console.log("   cd packages/search && docker-compose up -d");
    }
  });

program.parse();

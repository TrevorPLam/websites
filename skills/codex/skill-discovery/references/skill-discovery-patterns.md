---
name: skill-discovery-patterns
description: |
  **REFERENCE GUIDE** - Comprehensive skill discovery patterns and methodologies.
  USE FOR: Understanding discovery techniques, pattern recognition, and capability mapping.
  DO NOT USE FOR: Direct execution - reference material only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "reference"
---

# Skill Discovery Patterns and Methodologies

## Overview
This document outlines comprehensive patterns and methodologies for skill discovery in the marketing websites monorepo.

## Discovery Methodologies

### 1. Pattern-Based Discovery

#### Overview
Pattern-based discovery uses predefined patterns to identify and classify skills based on their structure, content, and metadata.

#### Implementation Pattern
```typescript
interface PatternBasedDiscovery {
  patterns: SkillPattern[];
  confidenceThreshold: number;
  fallbackMethods: FallbackMethod[];
  validationRules: ValidationRule[];
}

interface SkillPattern {
  id: string;
  name: string;
  description: string;
  indicators: PatternIndicator[];
  confidence: number;
  category: SkillCategory;
  metadata: PatternMetadata;
  examples: PatternExample[];
}

interface PatternIndicator {
  type: 'structural' | 'content' | 'metadata' | 'behavioral';
  pattern: string | RegExp;
  weight: number;
  required: boolean;
  evidence: string;
}

class PatternBasedDiscoveryEngine {
  private patterns: Map<string, SkillPattern> = new Map();
  private confidenceThreshold: number = 0.7;
  
  constructor() {
    this.initializePatterns();
  }
  
  async discoverSkills(scanPaths: string[]): Promise<DiscoveredSkills> {
    const discoveredSkills: DiscoveredSkills = {
      skills: [],
      patterns: [],
      confidence: 0,
      metadata: {
        totalFiles: 0,
        scannedPaths: scanPaths,
        discoveryDuration: 0,
        patternsFound: 0
      }
    };
    
    for (const scanPath of scanPaths) {
      const pathSkills = await this.scanDirectory(scanPath);
      discoveredSkills.skills.push(...pathSkills);
    }
    
    // Analyze patterns across all skills
    discoveredSkills.patterns = await this.analyzePatterns(discoveredSkills.skills);
    discoveredSkills.confidence = this.calculateOverallConfidence(discoveredSkills.patterns);
    
    return discoveredSkills;
  }
  
  private async scanDirectory(directory: string): Promise<DiscoveredSkill[]> {
    const skills: DiscoveredSkill[] = [];
    
    const files = await this.getSkillFiles(directory);
    
    for (const file of files) {
      const skill = await this.analyzeSkillFile(file);
      if (skill) {
        skills.push(skill);
      }
    }
    
    return skills;
  }
  
  private async analyzeSkillFile(filePath: string): Promise<DiscoveredSkill | null> {
    try {
      const content = await this.readFile(filePath);
      const metadata = this.extractMetadata(content);
      
      if (!this.isValidSkill(content, metadata)) {
        return null;
      }
      
      return {
        name: this.extractSkillName(filePath),
        filePath,
        content,
        metadata,
        patterns: [],
        confidence: 0,
        discoveredAt: new Date()
      };
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error);
      return null;
    }
  }
  
  private isValidSkill(content: string, metadata: any): boolean {
    // Check for required frontmatter fields
    const requiredFields = ['name', 'description', 'category'];
    
    return requiredFields.every(field => metadata[field]);
  }
  
  private extractMetadata(content: string): any {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      return {};
    }
    
    try {
      return yaml.parse(frontmatter[1]);
    } catch (error) {
      return {};
    }
  }
  
  private extractSkillName(filePath: string): string {
    const fileName = path.basename(filePath, '.md');
    return fileName.replace('.md', '');
  }
  
  private async analyzePatterns(skill: DiscoveredSkill): Promise<SkillPattern[]> {
    const patterns: SkillPattern[] = [];
    let totalConfidence = 0;
    
    for (const [patternId, pattern] of this.patterns) {
      const confidence = this.matchPattern(skill, pattern);
      
      if (confidence >= this.confidenceThreshold) {
        patterns.push({
          ...pattern,
          confidence
        });
        totalConfidence += confidence;
      }
    }
    
    return patterns;
  }
  
  private matchPattern(skill: DiscoveredSkill, pattern: SkillPattern): number {
    let confidence = 0;
    
    // Check structural indicators
    for (const indicator of pattern.indicators) {
      if (this.matchesIndicator(skill, indicator)) {
        confidence += indicator.weight;
      }
    }
    
    // Check content indicators
    for (const indicator of pattern.indicators) {
      if (this.matchesContentIndicator(skill, indicator)) {
        confidence += indicator.weight;
      }
    }
    
    // Check metadata indicators
    for (const indicator of pattern.indicators) {
      if (this.matchesMetadataIndicator(skill, indicator)) {
        confidence += indicator.weight;
      }
    }
    
    return confidence / pattern.indicators.reduce((sum, ind) => sum + ind.weight, 0);
  }
  
  private matchesIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): boolean {
    switch (indicator.type) {
      case 'structural':
        return this.matchesStructuralIndicator(skill, indicator);
      case 'content':
        return this.matchesContentIndicator(skill, indicator);
      case 'metadata':
        return this.matchesMetadataIndicator(skill, indicator);
      case 'behavioral':
        return this.matchesBehavioralIndicator(skill, indicator);
      default:
        return false;
    }
  }
  
  private matchesStructuralIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): boolean {
    if (indicator.pattern instanceof RegExp) {
      return indicator.pattern.test(skill.filePath);
    }
    
    // Check for file structure patterns
    switch (indicator.pattern) {
      case 'workflow-skill':
        return this.hasWorkflowStructure(skill.filePath);
      case 'reference-skill':
        return this.hasReferenceStructure(skill.filePath);
      case 'scripting-skill':
        return this.hasScriptingStructure(skill.filePath);
      default:
        return false;
    }
  }
  
  private hasWorkflowStructure(filePath: string): boolean {
    const workflowSections = [
      'workflow steps',
      'prerequisites',
      'error handling',
      'success criteria'
    ];
    
    const content = this.readFile(filePath);
    return workflowSections.some(section => 
      content.toLowerCase().includes(section)
    );
  }
  
  private hasReferenceStructure(filePath: string): boolean {
    const referenceSections = [
      'overview',
      'usage guidelines',
      'best practices',
      'examples',
      'references'
    ];
    
    const content = this.readFile(filePath);
    return referenceSections.some(section => 
      content.toLowerCase().includes(section)
    );
  }
  
  private hasScriptingStructure(filePath: string): boolean {
    const scriptingSections = [
      'usage',
      'script arguments',
      'implementation',
      'examples',
      'troubleshooting'
    ];
    
    const content = this.readFile(filePath);
    return scriptingSections.some(section => 
      content.toLowerCase().includes(section)
    );
  }
  
  private matchesContentIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): boolean {
    const content = skill.content.toLowerCase();
    const pattern = indicator.pattern instanceof RegExp ? indicator.pattern : indicator.pattern;
    
    return pattern.test(content);
  }
  
  private matchesMetadataIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): boolean {
    const metadata = skill.metadata;
    const pattern = indicator.pattern instanceof RegExp ? indicator.pattern : indicator.pattern;
    
    switch (indicator.pattern) {
      case 'required-fields':
        return this.hasRequiredFields(metadata);
      case 'category-match':
        return this.matchesCategory(metadata, indicator.pattern);
      case 'expertise-level':
        return this.matchesExpertiseLevel(metadata, indicator.pattern);
      default:
        return false;
    }
  }
  
  private hasRequiredFields(metadata: any): boolean {
    const requiredFields = ['name', 'description', 'category'];
    return requiredFields.every(field => metadata[field]);
  }
  
  private matchesCategory(metadata: any, pattern: string): boolean {
    if (typeof pattern === 'string') {
      return metadata.category === pattern;
    }
    
    if (pattern instanceof RegExp) {
      return pattern.test(metadata.category);
    }
    
    return false;
  }
  
  private matchesExpertiseLevel(metadata: any, pattern: string): boolean {
    if (typeof pattern === 'string') {
      return metadata.expertise === pattern;
    }
    
    if (pattern instanceof RegExp) {
      return pattern.test(metadata.expertise || '');
    }
    
    return false;
  }
  
  private matchesBehavioralIndicator(skill: DiscoveredSkill, indicator: PatternIndicator): boolean {
    const content = skill.content.toLowerCase();
    const pattern = indicator.pattern instanceof RegExp ? indicator.pattern : indicator.pattern;
    
    return pattern.test(content);
  }
  
  private readFile(filePath: string): string {
    // Implementation for reading file content
    return '';
  }
  
  private calculateOverallConfidence(patterns: SkillPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const totalConfidence = patterns.reduce((sum, pattern) => sum + pattern.confidence, 0);
    return totalConfidence / patterns.length;
  }
}
```

### 2. Semantic Analysis Discovery

#### Overview
Semantic analysis uses natural language processing and machine learning to understand skill semantics and intent.

#### Implementation Pattern
```typescript
interface SemanticAnalysisConfig {
  nlpModel: string;
  vectorModel: string;
  similarityThreshold: number;
  contextWindow: number;
  categories: string[];
}

interface SemanticVector {
  skill: string;
  vector: number[];
  category: string;
  intent: string;
  expertise: string;
  tools: string[];
  concepts: string[];
}

class SemanticDiscoveryEngine {
  private config: SemanticAnalysisConfig;
  private nlpModel: NLPModel;
  private vectorModel: VectorModel;
  
  constructor(config: SemanticAnalysisConfig) {
    this.config = config;
  }
  
  async discoverSkills(skills: Skill[]): Promise<SemanticAnalysisResult> {
    const vectors = await this.generateSkillVectors(skills);
    const clusters = this.clusterSkills(vectors);
    const analysis = this.analyzeClusters(clusters);
    
    return {
      skills: skills,
      vectors,
      clusters,
      analysis,
      timestamp: new Date()
    };
  }
  
  private async generateSkillVectors(skills: Skill[]): Promise<Map<string, SemanticVector>> {
    const vectors = new Map<string, SemanticVector>();
    
    for (const skill of skills) {
      const vector = await this.generateVector(skill);
      vectors.set(skill.name, vector);
    }
    
    return vectors;
  }
  
  private async generateVector(skill: Skill): Promise<SemanticVector> {
    const text = `${skill.name} ${skill.description} ${skill.content}`;
    
    // Generate text embedding
    const textEmbedding = await this.nlpModel.embed(text);
    
    // Generate category embedding
    const categoryEmbedding = await this.nlpModel.embed(skill.metadata.category);
    
    // Generate expertise embedding
    const expertiseEmbedding = await this.nlpModel.embed(skill.metadata.expertise || 'intermediate');
    
    // Generate intent embedding
    const intentEmbedding = await this.nlpModel.embed(this.extractIntent(skill.content));
    
    // Generate tool embeddings
    const toolEmbeddings = await Promise.all(
      skill.metadata.invokes?.map(tool => 
        this.nlpModel.embed(tool)
      ) || []
    );
    
    // Generate concept embeddings
    const conceptEmbeddings = await this.extractConcepts(skill.content);
    
    return {
      skill: skill.name,
      vector: [
        ...textEmbedding,
        ...categoryEmbedding,
        ...expertiseEmbedding,
        ...intentEmbedding,
        ...toolEmbeddings.flat(),
        ...conceptEmbeddings
      ],
      category: skill.metadata.category,
      intent: this.extractIntent(skill.content),
      expertise: skill.metadata.expertise || 'intermediate',
      tools: skill.metadata.invokes || [],
      concepts: conceptEmbeddings
    };
  }
  
  private clusterSkills(vectors: Map<string, SemanticVector>): Promise<SkillCluster[]> {
    const clusters: SkillCluster[] = [];
    const visited = new Set<string>();
    
    for (const [skillName, vector] of vectors) {
      if (visited.has(skillName)) continue;
      
      visited.add(skillName);
      
      const cluster = this.findOrCreateCluster(skillName, vector, clusters);
      cluster.skills.push(skillName);
    }
    
    return clusters;
  }
  
  private findOrCreateCluster(
    skillName: string, 
    vector: SemanticVector, 
    clusters: SkillCluster[]
  ): SkillCluster {
    // Find existing cluster or create new one
    const existingCluster = clusters.find(c => 
      this.calculateSimilarity(vector, c.centroid) > this.config.similarityThreshold
    );
    
    if (existingCluster) {
      existingCluster.skills.push(skillName);
      return existingCluster;
    }
    
    // Create new cluster
    const newCluster: SkillCluster = {
      id: `cluster-${clusters.length}`,
      centroid: vector,
      skills: [skillName],
      category: this.getCategoryFromVector(vector),
      confidence: 0.8
    };
    
    clusters.push(newCluster);
    return newCluster;
  }
  
  private calculateSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('Vector dimensions must match');
    }
    
    const dotProduct = vector1.reduce((sum, val, idx) => sum + val * vector2[idx], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  private analyzeClusters(clusters: SkillCluster[]): Promise<ClusterAnalysis> {
    const analysis: ClusterAnalysis = {
      totalClusters: clusters.length,
      averageClusterSize: clusters.reduce((sum, c) => sum + c.skills.length, 0) / clusters.length,
      categoryDistribution: this.calculateCategoryDistribution(clusters),
      confidence: clusters.reduce((sum, c) => sum + c.confidence, 0) / clusters.length,
      interClusterSimilarity: this.calculateInterClusterSimilarity(clusters),
      outliers: this.identifyOutliers(clusters)
    };
    
    return analysis;
  }
  
  private calculateCategoryDistribution(clusters: SkillCluster[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const cluster of clusters) {
      const category = this.getCategoryFromVector(cluster.centroid);
      distribution[category] = (distribution[category] || 0) + 1;
    }
    
    return distribution;
  }
  
  private calculateInterClusterSimilarity(clusters: SkillCluster[]): number {
    let totalSimilarity = 0;
    let pairCount = 0;
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = this.calculateSimilarity(
          clusters[i].centroid,
          clusters[j].centroid
        );
        totalSimilarity += similarity;
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalSimilarity / pairCount : 0;
  }
  
  private identifyOutliers(clusters: SkillCluster[]): SkillCluster[] {
    const averageClusterSize = clusters.reduce((sum, c) => sum + c.skills.length, 0) / clusters.length;
    const threshold = averageClusterSize * 0.5;
    
    return clusters.filter(cluster => 
      cluster.skills.length < threshold
    );
  }
  
  private getCategoryFromVector(vector: number[]): string {
    const maxIndex = vector.reduce((maxIdx, val, idx) => 
      val > vector[maxIdx] ? idx : maxIdx, 0
    );
    
    const categories = ['technical', 'business', 'integration', 'security', 'scripting'];
    return categories[maxIndex];
  }
  
  private extractIntent(content: string): string {
    // Extract intent using NLP model
    const intentEmbedding = await this.nlpModel.embed(content);
    return this.extractIntentFromEmbedding(intentEmbedding);
  }
  
  private extractIntentFromEmbedding(embedding: number[]): string {
    // Map embedding back to intent using reverse lookup
    // This would require a trained intent classification model
    return 'general'; // Placeholder
  }
  
  private extractConcepts(content: string): string[] {
    // Extract concepts using NLP model
    const conceptEmbeddings = await this.nlpModel.extractConcepts(content);
    return conceptEmbeddings;
  }
}
```

### 3. Machine Learning Discovery

#### Overview
Machine learning discovery uses trained models to identify and classify skills based on learned patterns.

#### Implementation Pattern
```typescript
interface MLDiscoveryConfig {
  modelPath: string;
  modelType: 'classification' | 'clustering' | 'recommendation';
  confidenceThreshold: number;
  trainingData: TrainingData[];
  features: FeatureExtractor[];
}

interface FeatureExtractor {
  name: string;
  extract: (skill: Skill) => number[];
  type: 'structural' | 'content' | 'metadata' | 'behavioral';
}

class MLDiscoveryEngine {
  private config: MLDiscoveryConfig;
  private model: MLModel;
  private featureExtractors: FeatureExtractor[];
  
  constructor(config: MLDiscoveryConfig) {
    this.config = config;
    this.model = this.loadModel(config.modelPath);
    this.featureExtractors = this.loadFeatureExtractors();
  }
  
  async discoverSkills(skills: Skill[]): Promise<MLDiscoveryResult> {
    const features = this.extractFeatures(skills);
    const predictions = await this.model.predict(features);
    const analysis = this.analyzePredictions(predictions, skills);
    
    return {
      skills,
      predictions,
      features,
      analysis,
      timestamp: new Date()
    };
  }
  
  private extractFeatures(skills: Skill[]): FeatureVector[] {
    return skills.map(skill => ({
      skill: skill.name,
      features: this.featureExtractors.reduce((features, extractor) => {
        const extractedFeatures = extractor.extract(skill);
        return {
          skill: skill.name,
          features: extractedFeatures
        };
      }, []));
  }
  
  private loadModel(modelPath: string): MLModel {
    // Load trained model
    return {} as MLModel;
  }
  
  private loadFeatureExtractors(): FeatureExtractor[] {
    return [
      new StructuralFeatureExtractor(),
      new ContentFeatureExtractor(),
      new MetadataFeatureExtractor(),
      new BehavioralFeatureExtractor()
    ];
  }
  
  private analyzePredictions(predictions: Prediction[], skills: Skill[]): PredictionAnalysis {
    const accuracy = this.calculateAccuracy(predictions, skills);
    const confidence = this.calculateAverageConfidence(predictions);
    
    return {
      accuracy,
      confidence,
      distribution: this.calculatePredictionDistribution(predictions),
      misclassifications: this.identifyMisclassifications(predictions, skills),
      recommendations: this.generateRecommendations(predictions, skills)
    };
  }
  
  private calculateAccuracy(predictions: Prediction[], skills: Skill[]): number {
    const correct = predictions.filter((p, index) => 
      p.predictedCategory === skills[index].metadata.category
    ).length;
    
    return correct / predictions.length;
  }
  
  private calculateAverageConfidence(predictions: Prediction[]): number {
    const totalConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0);
    return totalConfidence / predictions.length;
  }
  
  private calculatePredictionDistribution(predictions: Prediction[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const prediction of predictions) {
      const category = prediction.predictedCategory;
      distribution[category] = (distribution[category] || 0) + 1;
    }
    
    return distribution;
  }
  
  private identifyMisclassifications(predictions: Prediction[], skills: Skill[]): Misclassification[] {
    return predictions.map((prediction, index) => ({
      skill: skills[index].name,
      predicted: prediction.predictedCategory,
      actual: skills[index].metadata.category,
      confidence: prediction.confidence,
      error: prediction.predictedCategory !== skills[index].metadata.category
    }));
  }
  
  private generateRecommendations(
    predictions: Prediction[], 
    skills: Skill[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Identify skills with low confidence
    const lowConfidenceSkills = predictions
      .filter((p, index) => p.confidence < 0.5)
      .map((p, index) => ({
        skill: skills[index].name,
        currentCategory: skills[index].metadata.category,
        suggestedCategory: predictions[index].predictedCategory,
        confidence: predictions[index].confidence,
        reason: 'Low confidence in prediction'
      }));
    
    // Identify skills with potential misclassifications
    const misclassified = this.identifyMisclassifications(predictions, skills);
    
    for (const misclassification of misclassified) {
      recommendations.push({
        skill: misclassification.skill,
        currentCategory: misclassification.actual,
        suggestedCategory: misclassification.predicted,
        confidence: misclassification.confidence,
        reason: 'Potential misclassification detected'
      });
    }
    
    return recommendations;
  }
}
```

## Capability Mapping Patterns

### 1. Direct Mapping Pattern

#### Overview
Direct mapping uses explicit keyword matching and rule-based classification.

#### Implementation Pattern
```typescript
interface DirectMappingConfig {
  mappings: CapabilityMapping[];
  confidenceThreshold: number;
  fallbackEnabled: boolean;
}

interface CapabilityMapping {
  skill: string;
  capabilities: string[];
  confidence: number;
  evidence: string[];
  gaps: string[];
}

class DirectMappingEngine {
  private mappings: Map<string, CapabilityMapping> = new Map();
  private confidenceThreshold: number;
  
  constructor(config: DirectMappingConfig) {
    this.confidenceThreshold = config.confidenceThreshold;
    this.initializeMappings(config.mappings);
  }
  
  async mapCapabilities(skills: Skill[]): Promise<CapabilityMappings> {
    const mappings: CapabilityMappings = {
      skills: [],
      capabilities: [],
      gaps: [],
      overlaps: [],
      coverage: 0,
      recommendations: []
    };
    
    for (const skill of skills) {
      const mapping = await this.mapSkillToCapabilities(skill);
      
      mappings.skills.push({
        skill: skill.name,
        capabilities: mapping.capabilities,
        confidence: mapping.confidence,
        evidence: mapping.evidence,
        gaps: mapping.gaps
      });
      
      mappings.capabilities.push(...mapping.capabilities);
    }
    
    // Remove duplicate capabilities
    const uniqueCapabilities = [...new Set(mappings.capabilities)];
    mappings.capabilities = uniqueCapabilities;
    
    // Calculate coverage
    const totalCapabilities = this.getTotalCapabilities();
    mappings.coverage = uniqueCapabilities.length / totalCapabilities;
    
    // Identify gaps
    const allCapabilities = this.getAllCapabilities();
    const mappedCapabilities = new Set(mappings.capabilities);
    const gaps = allCapabilities.filter(cap => !mappedCapabilities.has(cap));
    mappings.gaps = gaps;
    
    return mappings;
  }
  
  private async mapSkillToCapabilities(skill: Skill): Promise<CapabilityMapping> {
    const capabilities: string[] = [];
    const evidence: string[] = [];
    const gaps: string[] = [];
    let confidence = 0;
    
    // Direct keyword matching
    const keywordMappings = this.getKeywordMappings();
    
    for (const [capability, keywords] of keywordMappings) {
      const skillContent = `${skill.name} ${skill.description} ${skill.content}`.toLowerCase();
      
      const matchCount = keywords.reduce((count, keyword) => 
        count + (skillContent.includes(keyword.toLowerCase()) ? 1 : 0), 0
      );
      
      if (matchCount > 0) {
        capabilities.push(capability);
        evidence.push(`Keyword match: ${keyword}`);
        confidence += 0.8;
      }
    }
    
    // Category-based mapping
    const categoryMappings = this.getCategoryMappings();
    const skillCategory = skill.metadata.category;
    
    if (categoryMappings[skillCategory]) {
      const categoryCapabilities = categoryMappings[skillCategory];
      capabilities.push(...categoryCapabilities);
      
      for (const capability of categoryCapabilities) {
        evidence.push(`Category mapping: ${skillCategory} -> ${capability}`);
        confidence += 0.6;
      }
    }
    
    // Tool-based mapping
    if (skill.metadata.invokes) {
      const toolCapabilities = this.getToolCapabilities(skill.metadata.invokes);
      capabilities.push(...toolCapabilities);
      
      for (const tool of toolCapabilities) {
        evidence.push(`Tool reference: ${tool}`);
        confidence += 0.5;
      }
    }
    
    return {
      skill: skill.name,
      capabilities,
      confidence: confidence / 3, // Average of three methods
      evidence,
      gaps
    };
  }
  
  private getKeywordMappings(): Map<string, string[]> {
    return new Map([
      ['infrastructure', ['terraform', 'azure', 'docker', 'kubernetes', 'terraform']],
      ['development', ['git', 'github', 'vscode', 'eslint', 'testing', 'debugging']],
      ['deployment', ['ci-cd', 'azure-pipelines', 'github-actions', 'docker-hub', 'vercel']],
      ['monitoring', 'prometheus', 'grafana', 'sentry', 'datadog', 'new-relic']],
      ['security', ['oauth-2.1', 'rbac', 'encryption', 'ssl', 'security-auditing']],
      ['database', ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'database-migration']],
      ['api', ['rest', 'graphql', 'webhook', 'api-gateway', 'rate-limiting']],
      ['testing', ['unit', 'integration', 'e2e', 'performance', 'accessibility']],
      ['content', ['cms', 'headless', 'static-site', 'markdown', 'content-management']],
      ['marketing', ['seo', 'analytics', 'email-marketing', 'campaign-management', 'lead-generation']],
      ['integration', ['mcp', 'webhook', 'api-integration', 'data-sync', 'third-party']]
    ]);
  }
  
  private getCategoryMappings(): Map<string, string[]> {
    return new Map([
      ['workflow', ['automation', 'process-automation', 'workflow-orchestration']],
      ['reference', ['documentation', 'guides', 'templates', 'best-practices', 'reference-material']],
      ['scripting', ['automation', 'cli-tools', 'executable-code', 'system-administration']],
      ['technical', ['infrastructure', 'development', 'deployment', 'monitoring', 'testing']],
      ['business', ['marketing', 'sales', 'analytics', 'content', 'communication']],
      ['integration', ['api', 'webhook', 'data-sync', 'third-party', 'mcp-integration']],
      ['security', ['authentication', 'authorization', 'encryption', 'audit', 'compliance']],
      ['performance', ['optimization', 'monitoring', 'caching', 'load-balancing']]
    ]);
  }
  
  private getToolCapabilities(tools: string[]): string[] {
    const toolCapabilities: Map<string, string[]> = new Map([
      ['azure-mcp', ['azure-cli', 'azure-powershell', 'resource-management', 'infrastructure-provisioning']],
      ['github', ['git', 'repository-management', 'issue-tracking', 'pull-requests', 'code-review']],
      ['filesystem', ['file-operations', 'directory-scanning', 'file-analysis']],
      ['observability', ['monitoring', 'logging', 'alerting', 'metrics-collection']],
      ['sequential-thinking', ['reasoning', 'analysis', 'decision-support']],
      ['knowledge-graph', ['memory', 'learning', 'knowledge-management', 'semantic-search']]
    ]);
    
    const capabilities: string[] = [];
    
    for (const tool of tools) {
      const toolCapabilities = toolCapabilities.get(tool) || [];
      capabilities.push(...toolCapabilities);
    }
    
    return capabilities;
  }
  
  private getTotalCapabilities(): string[] {
    return Array.from(new Set(
      Object.values(this.getCategoryMappings()).flat()
    ));
  }
  
  private getAllCapabilities(): string[] {
    return Array.from(new Set(
      Object.values(this.getToolCapabilities()).flat()
    ));
  }
}
```

### 2. Semantic Mapping Pattern

#### Overview
Semantic mapping uses vector similarity and semantic understanding to map skills to capabilities.

#### Implementation Pattern
```typescript
interface SemanticMappingConfig {
  vectorModel: string;
  similarityThreshold: number;
  categoryModel: string;
  expertiseModel: string;
  intentModel: string;
}

interface SemanticMappingResult {
  skill: string;
  capabilities: string[];
  confidence: number;
  evidence: string[];
  gaps: string[];
  recommendations: string[];
}

class SemanticMappingEngine {
  private config: SemanticMappingConfig;
  private vectorModel: VectorModel;
  private categoryModel: CategoryModel;
  private expertiseModel: ExpertiseModel;
  private intentModel: IntentModel;
  
  constructor(config: SemanticMappingConfig) {
    this.config = config;
    this.vectorModel = this.loadModel(config.vectorModel);
    this.categoryModel = this.loadModel(config.categoryModel);
    this.expertiseModel = this.loadModel(config.expertiseModel);
    this.intentModel = this.loadModel(config.intentModel);
  }
  
  async mapCapabilities(skills: Skill[]): Promise<SemanticMappingResult> {
    const vectors = await this.generateSkillVectors(skills);
    const mappings = await this.mapVectorsToCapabilities(vectors, skills);
    
    return {
      skills,
      mappings,
      confidence: this.calculateOverallConfidence(mappings),
      evidence: this.generateEvidence(mappings),
      gaps: this.identifyGaps(mappings),
      recommendations: this.generateRecommendations(mappings)
    };
  }
  
  private async generateSkillVectors(skills: Skill[]): Promise<Map<string, number[]>> {
    const vectors = new Map<string, number[]>();
    
    for (const skill of skills) {
      const vector = await this.generateSkillVector(skill);
      vectors.set(skill.name, vector);
    }
    
    return vectors;
  }
  
  private async generateSkillVector(skill: Skill): Promise<number[]> {
    const text = `${skill.name} ${skill.description} ${skill.content}`;
    
    // Generate text embedding
    const textEmbedding = await this.vectorModel.embed(text);
    
    // Generate category embedding
    const categoryEmbedding = await this.categoryModel.embed(skill.metadata.category);
    
    // Generate expertise embedding
    const expertiseEmbedding = this.expertiseModel.embed(skill.metadata.expertise || 'intermediate');
    
    // Generate intent embedding
    const intentEmbedding = this.intentModel.embed(this.extractIntent(skill.content));
    
    // Generate tool embeddings
    const toolEmbeddings = await Promise.all(
      (skill.metadata.invokes || []).map(tool => 
        this.vectorModel.embed(tool)
      )
    );
    
    // Generate concept embeddings
    const conceptEmbeddings = await this.extractConcepts(skill.content);
    
    // Combine embeddings
    const vector = [
      ...textEmbedding,
      ...categoryEmbedding,
      ...expertiseEmbedding,
      ...intentEmbedding,
      ...toolEmbeddings.flat(),
      ...conceptEmbeddings
    ];
    
    return vector;
  }
  
  private async mapVectorsToCapabilities(
    vectors: Map<string, number[]>,
    skills: Skill[]
  ): Promise<SemanticMappingResult> {
    const mappings: SemanticMappingResult = {
      skills: [],
      capabilities: [],
      confidence: 0,
      evidence: [],
      gaps: [],
      recommendations: []
    };
    
    for (const [skillName, vector] of vectors) {
      const capabilities = await this.mapVectorToCapabilities(vector, skill, skills);
      
      mappings.skills.push({
        skill: skillName,
        capabilities: capabilities.mapped,
        confidence: capabilities.confidence,
        evidence: capabilities.evidence
      });
      
      mappings.capabilities.push(...capabilities.mapped);
    }
    
    // Remove duplicate capabilities
    const uniqueCapabilities = [...new Set(
      mappings.capabilities.flat()
    )];
    mappings.capabilities = uniqueCapabilities;
    
    // Calculate overall confidence
    const totalConfidence = mappings.reduce((sum, mapping) => 
      sum + mapping.confidence, 0
    ) / mappings.skills.length;
    
    mappings.confidence = totalConfidence;
    
    // Identify gaps
    const allCapabilities = this.getAllCapabilities();
    const mappedCapabilities = new Set(mappings.capabilities);
    const gaps = allCapabilities.filter(cap => !mappedCapabilities.has(cap));
    mappings.gaps = gaps;
    
    return mappings;
  }
  
  private async mapVectorToCapabilities(
    vector: number[],
    skill: Skill,
    allSkills: Skill[]
  ): Promise<CapabilityMapping> {
    const capabilities: string[] = [];
    const evidence: string[] = [];
    let confidence = 0;
    
    // Find similar skill vectors
    const similarSkills = allSkills.filter(s => 
      this.calculateSimilarity(vector, s.vector) > 0.8
    );
    
    if (similarSkills.length > 0) {
      // Use capabilities from most similar skill
      const mostSimilar = similarSkills.reduce((most, skill) => 
        this.calculateSimilarity(vector, skill.vector) > 
        this.calculateSimilarity(vector, mostSimilar.vector)
      );
      
      const similarCapabilities = await this.mapVectorToCapabilities(
        mostSimilar.vector,
        mostSimilar
      );
      
      capabilities.push(...similarCapabilities.mapped);
      evidence.push(`Similar to ${mostSimilar.name} (similarity: ${mostSimilar.similarity})`);
      
      confidence += mostSimilar.similarity;
    } else {
      // Use category-based mapping
      const category = this.inferCategoryFromVector(vector);
      const categoryCapabilities = this.getCategoryCapabilities(category);
      
      capabilities.push(...categoryCapabilities);
      evidence.push(`Category-based mapping: ${category}`);
      
      confidence += 0.6;
    }
    
    return {
      capabilities,
      confidence,
      evidence
    };
  }
  
  private calculateSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('Vector dimensions must match');
    }
    
    const dotProduct = vector1.reduce((sum, val, idx) => 
      sum + val * vector2[idx], 0
    );
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0);
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0);
    
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  private inferCategoryFromVector(vector: number[]): string {
    const maxIndex = vector.reduce((maxIdx, val, idx) => 
      val > vector[maxIdx] ? idx : maxIdx, 0
    );
    
    const categories = ['technical', 'business', 'integration', 'security', 'scripting'];
    return categories[maxIndex];
  }
  
  private getCategoryCapabilities(category: string[]): string[] {
    const categoryCapabilityMap = this.getCategoryCapabilityMap();
    return categoryCapabilityMap[category] || [];
  }
  
  private getCategoryCapabilityMap(): Record<string, string[]> {
    return {
      'technical': ['infrastructure', 'development', 'deployment', 'monitoring', 'testing', 'security'],
      'business': ['marketing', 'sales', 'analytics', 'content', 'communication'],
      'integration': ['api', 'webhook', 'data-sync', 'third-party', 'mcp-integration'],
      'security': ['authentication', 'authorization', 'encryption', 'audit', 'compliance'],
      'scripting': ['automation', 'cli-tools', 'executable-code', 'system-admin']
    };
  }
  
  private getAllCapabilities(): string[] {
    return [
      'infrastructure', 'development', 'deployment', 'monitoring', 'testing', 'security',
      'marketing', 'sales', 'analytics', 'content', 'communication',
      'api', 'webhook', 'data-sync', 'third-party', 'mcp-integration'
    ];
  }
  
  private extractConcepts(content: string[]): string[] {
    // Extract concepts using NLP model
    return []; // Placeholder
  }
  
  private generateEvidence(mappings: SemanticMappingResult): string[] {
    return mappings.flatMap(mapping => 
      mapping.evidence
    );
  }
  
  private generateRecommendations(
    mappings: SemanticMappingResult
  ): string[] {
    const recommendations: Recommendation[] = [];
    
    // Gap recommendations
    for (const gap of mappings.gaps) {
      recommendations.push({
        type: 'gap',
        capability: gap.capability,
        description: `Add ${gap.capability} capability to skill set`,
        suggestions: [
          `Create ${gap.capability} skill`,
          `Enhance existing ${gap.capability} capabilities`
        ]
      });
    }
    
    // Overlap recommendations
    const overlaps = this.identifyOverlaps(mappings);
    
    for (const overlap of overlaps) {
      if (overlap.occurrenceCount > 3) {
        recommendations.push({
          type: 'consolidation',
          capability: overlap.capability,
          description: `Consolidate ${overlap.capability} across ${overlap.skills.length} skills`,
          suggestions: [
            `Create shared ${overlap.capability} skill`,
            `Create capability library for ${overlap.capability}`
          ]
        });
      }
    }
    
    // Quality recommendations
    const lowConfidenceSkills = mappings.skills.filter(s => s.confidence < 0.5);
    
    for (const skill of lowConfidenceSkills) {
      recommendations.push({
        type: 'quality-improvement',
        skill: skill.skill,
        currentConfidence: skill.confidence,
        description: `Improve skill description and metadata for better recognition`,
        suggestions: [
          'Add more detailed examples',
          'Enhance metadata completeness',
          'Add structured content'
        ]
      });
    }
    
    return recommendations;
  }
}
```

### 3. Hybrid Mapping Pattern

#### Overview
Hybridg mapping combines multiple approaches for improved accuracy and robustness.

#### Implementation Pattern
```typescript
interface HybridMappingConfig {
  approaches: MappingApproach[];
  weights: Record<string, number>;
  fallbackEnabled: boolean;
  consensusThreshold: number;
}

interface MappingApproachach {
  name: string;
  confidence: number;
  implementation: MappingImplementation;
  useCase: string;
}

interface MappingImplementation {
  type: 'direct' | 'semantic' | 'ml' | 'collaborative';
  confidence: number;
  fallback: MappingImplementation[];
}

class HybridMappingEngine {
  private config: HybridMappingConfig;
  private approaches: Map<string, MappingImplementation> = new Map();
  private weights: Record<string, number>;
  
  constructor(config: HybridMappingConfig) {
    this.config = config;
    this.weights = config.weights;
    this.initializeApproaches(config.approaches);
  }
  
  async mapCapabilities(skills: Skill[]): Promise<HybridMappingResult> {
    const approachResults: ApproachResult[] = [];
    
    for (const approach of this.config.approaches) {
      const result = await this.executeApproach(approach, skills);
      approachResults.push(result);
    }
    
    // Combine results using weighted averaging
    const finalMappings = this.combineApproachResults(approachResults);
    
    return {
      skills,
      mappings: finalMappings.mappings,
      approachResults,
      confidence: this.calculateOverallConfidence(finalMappings),
      evidence: this.generateEvidence(approachResults)
    };
  }
  
  private async executeApproach(
    approach: MappingImplementation, 
    skills: Skill[]
  ): Promise<ApproachResult> {
    const approachResult = await approach.implementation(skills);
    
    return {
      approach: approach.name,
      success: approachResult.success,
      skills: approachResult.skills,
      confidence: approachResult.confidence,
      duration: approachResult.duration,
      evidence: approachResult.evidence
    };
  }
  
  private combineApproachaches(results: ApproachResult[]): HybridMappingResult {
    const weightedScores = results.map(result => 
      result.confidence * this.weights[result.approach] || 0
    );
    
    const totalWeight = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
    
    const finalMappings: CapabilityMapping[] = [];
    
    for (const result of results) {
      if (result.success) {
        const skillMappings = result.skills.map(skill => ({
          skill: skill.skill,
          capabilities: result.skills.find(s => s.skill === skill.skill)?.capabilities || [],
          confidence: result.confidence * this.weights[result.approach] || 0,
          evidence: result.evidence
        }));
        
        finalMappings.push(...skillMappings);
      }
    }
    
    return {
      mappings: finalMappings,
      confidence: totalWeight / totalWeight,
      approachResults
    };
  }
  
  private calculateOverallConfidence(mappings: CapabilityMapping[]): number {
    if (mappings.length === 0) return 0;
    
    const totalConfidence = mappings.reduce((sum, mapping) => 
      sum + mapping.confidence, 0
    ) / mappings.length;
    
    return totalConfidence;
  }
  
  private generateEvidence(approachResults: ApproachResult[]): string[] {
    return approachResults.flatMap(result => 
      result.evidence
    );
  }
}
```

## Optimization Patterns

### 1. Confidence Improvement

#### Overview
Confidence improvement focuses on increasing the accuracy of skill classification and capability mapping.

#### Implementation Pattern
```typescript
interface ConfidenceImprovementConfig {
  feedbackLoop: boolean;
  learningRate: number;
  validationSet: ValidationSet[];
  modelRetraining: boolean;
  thresholdAdjustment: boolean;
}

interface ValidationSet {
  name: string;
  description: string;
  testCases: TestCase[];
  expectedResults: any[];
  actualResults: any[];
}

class ConfidenceImprovementEngine {
  private config: ConfidenceImprovementConfig;
  private validationSets: Map<string, ValidationSet> = new Map();
  
  constructor(config: ConfidenceImprovementConfig) {
    this.config = config;
    this.initializeValidationSets();
  }
  
  async improveConfidence(
    mappings: CapabilityMapping[],
    actualUsage: UsageData
  ): Promise<ImprovedMappings> {
    const improvedMappings = await this.improveConfidenceWithFeedback(
      mappings,
      actualUsage
    );
    
    return improvedMappings;
  }
  
  private async improveConfidenceWithFeedback(
    mappings: CapabilityMapping[],
    actualUsage: UsageData
  ): Promise<CapabilityMapping[]> {
    const improvedMappings: CapabilityMapping[] = [];
    
    for (const mapping of mappings) {
      const improvedMapping = await this.improveMappingWithFeedback(
        mapping,
        actualUsage
      );
      
      improvedMappings.push(improvedMapping);
    }
    
    return improvedMappings;
  }
  
  private async improveMappingWithFeedback(
    mapping: CapabilityMapping,
    actualUsage: UsageData
  ): Promise<CapabilityMapping> {
    // Find similar skills with higher confidence
    const similarSkills = await this.findSimilarSkills(
      mapping.skill,
      actualUsage
    );
    
    if (similarSkills.length === 0) {
      return mapping;
    }
    
    const mostSimilar = similarSkills.reduce((most, skill) => 
      this.calculateSimilarity(mapping.skill, skill) > 
      this.calculateSimilarity(mostSimilar.skill, skill)
    );
    
    const mostSimilarSkill = mostSimilar.skill;
    const improvedMapping = {
      ...mapping,
      capabilities: mostSimilar.capabilities,
      confidence: mapping.confidence + 0.1, // Boost confidence
      evidence: `Improved based on usage patterns for ${mostSimilarSkill.name}`
    };
    
    return improvedMapping;
  }
  
  private async findSimilarSkills(
    targetSkill: string,
    actualUsage: UsageData
  ): Promise<Skill[]> {
    const allSkills = actualUsage.skills;
    
    const similarSkills = allSkills.filter(skill =>
      this.calculateSimilarity(targetSkill, skill) > 0.7
    );
    
    return similarSkills;
  }
  
  private calculateSimilarity(skill1: string, skill2: string): number {
    const text1 = skill1.toLowerCase();
    const text2 = skill2.toLowerCase();
    
    const commonWords = text1.split(/\s+/).filter(word => 
      text2.includes(word)
    ).length;
    
    if (commonWords.length === 0) {
      return 0;
    }
    
    return commonWords.length / Math.max(text1.length, text2.length);
  }
  
  private calculateSimilarity(vector1: number[], vector2: number[]): number {
    // Cosine similarity calculation
    const dotProduct = vector1.reduce((sum, val, idx) => 
      sum + val * vector2[idx], 0
    );
    const magnitude1 = Math.sqrt(
      vector1.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitude2 = Math.sqrt(
      vector2.reduce((sum, val) => sum + val * val, 0)
    );
    
    return dotProduct / (magnitude1 * magnitude2);
  }
}
```

### 2. Gap Analysis Pattern

#### Overview
Gap analysis identifies missing capabilities and provides recommendations for improvement.

#### Implementation Pattern
```typescript
interface GapAnalysisConfig {
  priority: 'critical' | 'high' | 'medium' | 'low';
  threshold: number;
  categories: string[];
  impact: string[];
  recommendations: string[];
}

interface GapAnalysis {
  gaps: CapabilityGap[];
  priority: string;
  impact: string;
  recommendations: GapRecommendation[];
}

class GapAnalysisEngine {
  private config: GapAnalysisConfig;
  private capabilityMatrix: CapabilityMatrix;
  
  constructor(config: GapAnalysisConfig) {
    this.config = config;
    this.capabilityMatrix = this.loadCapabilityMatrix();
  }
  
  async analyzeGaps(
    mappings: CapabilityMappings
  ): Promise<GapAnalysis> {
    const gaps: CapabilityGap[] = [];
    
    // Identify capability gaps
    const allCapabilities = this.getAllCapabilities();
    const mappedCapabilities = new Set(
      mappings.flatMap(m => m.capabilities)
    );
    
    const missingCapabilities = allCapabilities.filter(cap => !mappedCapabilities.has(cap));
    
    for (const capability of missingCapabilities) {
      gaps.push({
        capability,
        priority: this.getPriority(capability),
        impact: this.getImpact(capability),
        recommendations: this.getRecommendations(capability)
      }));
    }
    
    // Sort by priority
    gaps.sort((a, b) => {
      const priorityOrder = {
        'critical': 0,
        'high': 1,
        'medium': 2,
        'low': 3
      };
      
      const priorityLevel = priorityOrder[a.priority] || 3;
      const bPriority = priorityOrder[b.priority] || 3;
      
      return priorityLevel - bPriority;
    });
    
    return {
      gaps,
      priority: 'critical',
      impact: 'Critical capability gaps identified',
      recommendations: gaps.map(gap => gap.recommendations.join('; ')
    };
  }
  
  private getPriority(capability: string): string {
    const priorityMap = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    
    return priorityMap[capability] || 'low';
  }
  
  private getImpact(capability: string): string {
    const impactMap = {
      'critical': 'Blocks core functionality',
      'high': 'Affects user experience',
      'medium': 'Minor performance impact',
      'low': 'Nice to have'
    };
    
    return impactMap[capability] || 'low';
  }
  
  private getRecommendations(capability: string[]): string[] {
    const suggestions = {
      'infrastructure': [
        'Create infrastructure provisioning skill',
        'Add database management skill',
        'Add monitoring capabilities'
      ],
      'development': [
        'Add code review skill',
        'Add testing skill',
        'Add debugging skill'
      ],
      'business': [
        'Add marketing automation skill',
        'Add analytics skill',
        'Add content management skill'
      ],
      'integration': [
        'Add API integration skill',
        'Add webhook management skill',
        'Add data sync skill'
      ],
      'security': [
        'Add security audit skill',
        'add compliance checking skill',
        'add penetration testing skill'
      ]
    };
    
    return suggestions[capability] || ['Create new skill'];
  }
}
```

### 3. Coverage Analysis Pattern

#### Overview
Coverage analysis measures how well the discovered skills cover the required capability space.

#### Implementation Pattern
```typescript
interface CoverageAnalysisConfig {
  capabilityMatrix: CapabilityMatrix;
  coverageThreshold: number;
  categories: string[];
  impactLevels: string[];
  reporting: ReportingConfig;
}

interface CoverageAnalysis {
  overallCoverage: number;
  categoryCoverage: Record<string, number>;
  capabilityCoverage: Record<string, number>;
  gaps: CapabilityGap[];
  overlaps: CapabilityOverlap[];
  recommendations: CoverageRecommendation[];
  metrics: CoverageMetrics;
}

interface CoverageMetrics {
  totalCapabilities: number;
  discoveredCapabilities: number;
  coveragePercentage: number;
  categoryCoverage: Record<string, number>;
  expertiseDistribution: Record<string, number>;
  qualityScore: number;
  performanceMetrics: PerformanceMetrics;
}

interface CoverageRecommendation {
  type: 'addition' | 'consolidation' | 'optimization' | 'restructuring';
  capability: string;
  description: string;
  priority: string;
  effort: string;
  impact: string;
  examples: string[];
}

class CoverageAnalyzer {
  private config: CoverageAnalysisConfig;
  
  async analyzeCoverage(
    mappings: CapabilityMappings
  ): Promise<CoverageAnalysis> {
    const totalCapabilities = this.config.capabilityMatrix.totalCapabilities;
    const discoveredCapabilities = new Set(
      mappings.flatMap(m => m.capabilities)
    );
    
    const coveragePercentage = discoveredCapabilities.length / totalCapabilities;
    
    const categoryCoverage = this.calculateCategoryCoverage(
      discoveredCapabilities,
      this.config.categories
    );
    
    const gaps = this.identifyCapabilityGaps(
      discoveredCapabilities,
      totalCapabilities
    );
    
    const overlaps = this.identifyCapabilityOverlaps(
      discoveredCapabilities
    );
    
    const recommendations = this.generateCoverageRecommendations(
      coveragePercentage,
      gaps,
      overlaps,
      categoryCoverage
    );
    
    return {
      overallCoverage,
      categoryCoverage,
      capabilityCoverage,
      gaps,
      overlaps,
      recommendations,
      metrics: this.calculateMetrics(coveragePercentage)
    };
  }
  
  private calculateCategoryCoverage(
    discoveredCapabilities: Set<string>,
    categories: string[]
  ): Record<string, number> {
    const coverage: Record<string, number> = {};
    
    for (const category of categories) {
      const categoryCapabilities = discoveredCapabilities.filter(cap => 
        categories.includes(category)
      );
      
      coverage[category] = categoryCapabilities.length;
    }
    
    return coverage;
  }
  
  private identifyCapabilityGaps(
    discoveredCapabilities: Set<string>,
    totalCapabilities: number
  ): CapabilityGap[] {
    const allCapabilities = this.config.capabilityMatrix.totalCapabilities;
    const mappedCapabilities = new Set(discoveredCapabilities);
    const missingCapabilities = allCapabilities.filter(cap => !mappedCapabilities.has(cap));
    
    return missingCapabilities.map(cap => ({
      capability,
      priority: this.getPriority(capability),
      impact: this.getImpact(capability),
      recommendations: this.getRecommendations(capability)
    }));
  }
  
  private identifyCapabilityOverlaps(
    discoveredCapabilities: Set<string>
  ): CapabilityOverlap[] {
    const capabilityMap = new Map<string, string[]>();
    
    for (const capability of discoveredCapabilities) {
      const skillsWithCapability = Array.from(discoveredCapabilities).filter(s => 
        s.capabilities.includes(capability)
      );
      
      for (const skill of skillsWithCapability) {
        const existingCapabilities = capabilityMap.get(capability) || [];
        existingCapabilities.push(skill.name);
        capabilityMap.set(capability, existingCapabilities);
      }
    }
    
    const overlaps: CapabilityOverlap[] = [];
    
    for (const [capability, skills] of capabilityMap) {
      if (skillsWithCapability.length > 1) {
        overlaps.push({
          capability,
          skills: skillsWithCapability,
          occurrenceCount: skillsWithCapability.length
        });
      }
    }
    
    return overlaps;
  }
  
  private getPriority(capability: string): string {
    const priorityMap = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    
    return priorityMap[capability] || 'low';
  }
  
  private getImpact(capability: string): string {
    const impactMap = {
      'critical': 'Blocks core functionality',
      'high': 'Affects user experience',
      'medium': 'Minor performance impact',
      'low': 'Nice to have'
    };
    
    return impactMap[capability] || 'low';
  }
  
  private getRecommendations(capability: string[]): string[] {
    const suggestions = {
      'infrastructure': [
        'Create infrastructure provisioning skill',
        'Add database management skill',
        'Add monitoring capabilities'
      ],
      'development': [
        'Add code review skill',
        'Add testing skill',
        'Add debugging skill'
      ],
      'business': [
        'Add marketing automation skill',
        'Add analytics skill',
        'content management skill'
      ],
      'integration': [
        'Add API integration skill',
        'add webhook management skill',
        'data sync skill'
      ],
      'security': [
        'Add security audit skill',
        'Add penetration testing skill'
      ]
    };
    
    return suggestions[capability] || ['Create new skill'];
  }
  
  private calculateMetrics(coveragePercentage: number): CoverageMetrics {
    return {
      totalCapabilities: 0, // Will be calculated
      discoveredCapabilities: 0, // Will be calculated
      coveragePercentage,
      categoryCoverage: {},
      expertiseDistribution: {},
      performanceMetrics: {
        lcp: 0,
        inp: 0,
        cls: 0
      }
    };
  }
}
```

## Discovery Process Templates

### 1. Discovery Process Template

```markdown
# Skill Discovery Process Template

## Phase 1: Preparation
- [ ] Define discovery objectives and scope
- [ ] Configure discovery parameters and thresholds
- [ ] Set up quality gates and validation rules
- [ ] Prepare reporting templates
- [ ] Initialize monitoring and logging

## Phase 2: Scanning
- [ ] Scan specified directories recursively
- [ ] Identify skill files by extension
- [ ] Extract metadata and structure
- [ ] Validate file accessibility
- [ ] Detect duplicates and orphans

## Phase 3: Analysis
- [ ] Execute pattern recognition
- [ ] Perform semantic analysis
- [ ] Map capabilities
- [ ] Validate quality metrics
- [ ] Identify gaps and overlaps

## Phase 4: Validation
- [ ] Validate metadata completeness
- [ ] Check content quality
- [ ] Verify pattern accuracy
- [ ] Test mapping accuracy
- [ ] Review confidence scores

## Phase 5: Reporting
- [ ] Generate comprehensive report
- [ ] Include metrics and analytics
- [ ] Provide recommendations
- [ ] Archive historical data
- [ ] Share findings with team
- [ ] Update skill catalog

## Phase 6: Optimization
- [ ] Implement optimization recommendations
- [ ] Enhance low-confidence skills
- [ ] Consolidate overlapping skills
- [ ] Update discovery parameters
- [ ] Retrain models if needed

## Phase 7: Review
- [ ] Review discovery results
- [ ] Validate recommendations
- [ ] Update processes
- [ ] Archive discovery data
- [ ] Share insights with team
```

### 2. Continuous Discovery Template

```markdown
# Continuous Skill Discovery Template

## Continuous Discovery Process

## Automation Setup
- [ ] Configure scheduled discovery jobs
- [ ] Set up change detection
- [ ] Configure alerting for quality degradation
- [ ] Set up automated reporting

## Monitoring Dashboard
- [ ] Real-time discovery metrics
- [ ] Quality trend analysis
- [ ] Coverage tracking
- [ ] Performance monitoring

## Automation Scripts

### Daily Discovery
```bash
# Daily skill discovery
pnpm run discover:daily --environment=production --report-format=json

# Weekly skill discovery
pnpm run discover:weekly --environment=all --report-format=html

# Monthly skill discovery
pnpm run discover:monthly --environment=all --report-format=html
```

### Quality Monitoring
```bash
# Quality monitoring
pnpm run discover:quality --threshold=0.8 --alert-on-degradation
```

### Alert Configuration
```yaml
alerts:
  quality-degradation:
    enabled: true
    threshold: 0.7
    channels: ['email', 'slack', 'teams']
  new-gaps-detected:
    enabled: true
    threshold: 5
    channels: ['email', 'slack']
```

## Integration Patterns

### CI/CD Integration
```yaml
# .github/workflows/skill-discovery.yml
name: Skill Discovery
on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize]
  schedule:
    - cron: '0 2 * * * *'
    - cron: '0 6 * * *'
jobs:
    - skill-discovery-daily
    - skill-discovery-weekly
    - skill-discovery-monthly
```

### Data Pipeline Integration
```typescript
// skill-discovery-pipeline.ts
interface SkillDiscoveryPipeline {
  stages: DiscoveryStage[];
  automation: boolean;
  qualityGates: QualityGate[];
  reporting: ReportingConfig;
}

class SkillDiscoveryPipeline {
  async execute(
    config: DiscoveryConfig
  ): Promise<PipelineResult> {
    // Execute discovery pipeline
    const result = await this.executePipeline(config);
    
    // Generate report
    await this.generateReport(result);
    
    // Update skill catalog
    await this.updateSkillCatalog(result);
    
    return result;
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

---
name: skill-discovery-agents
description: |
  **AGENT CONFIGURATION** - Codex skill discovery agent configurations and automation patterns.
  USE FOR: Understanding skill discovery behavior, pattern recognition, and capability mapping.
  DO NOT USE FOR: Direct execution - agent configuration reference only.
  INVOKES: none.
meta:
  version: "1.0.0"
  author: "cascade-ai"
  category: "agent-config"
---

# Codex Skill Discovery Agents

## Overview
This document defines specialized Codex agents for skill discovery, capability mapping, and pattern recognition in the marketing websites monorepo.

## Agent Specializations

### 1. Skill Pattern Recognition Agent

```typescript
interface SkillPatternRecognitionAgent {
  name: 'codex-skill-pattern-recognizer';
  expertise: [
    'pattern-matching',
    'skill-taxonomy',
    'capability-extraction',
    'workflow-analysis',
    'intent-classification',
    'context-understanding',
    'semantic-analysis',
    'metadata-parsing'
  ];
  
  recognitionPatterns: {
    workflowSkills: {
      indicators: ['step-by-step processes', 'automation workflows', 'multi-step tasks'];
      patterns: ['sequential execution', 'conditional logic', 'error handling'];
      metadata: ['invokes', 'tools', 'prerequisites', 'success-criteria'];
    };
    referenceSkills: {
      indicators: ['documentation', 'templates', 'checklists', 'best-practices'];
      patterns: ['structured content', 'reference material', 'guidance documents'];
      metadata: ['category', 'scope', 'expertise-level', 'use-cases'];
    };
    scriptingSkills: {
      indicators: ['automation scripts', 'executable code', 'cli commands'];
      patterns: ['parameterized execution', 'error handling', 'logging'];
      metadata: ['runtime', 'dependencies', 'execution-context'];
    };
  };
  
  analysisMethods: {
    semanticAnalysis: {
      nlpProcessing: true;
      keywordExtraction: true;
      entityRecognition: true;
      sentimentAnalysis: false;
      topicModeling: true;
    };
    structuralAnalysis: {
      fileStructureAnalysis: true;
      dependencyMapping: true;
      importAnalysis: true;
      codePatternRecognition: true;
    };
    contextualAnalysis: {
      environmentScanning: true;
      usagePatternDetection: true;
      integrationMapping: true;
      workflowTracing: true;
    };
  };
}
```

### 2. Capability Mapping Agent

```typescript
interface CapabilityMappingAgent {
  name: 'codex-capability-mapper';
  expertise: [
    'capability-inventory',
    'skill-mapping',
    'gap-analysis',
    'coverage-assessment',
    'optimization-recommendations',
    'integration-planning',
    'resource-allocation',
    'performance-optimization'
  ];
  
  mappingStrategies: {
    directMapping: {
      description: 'Direct skill-to-capability mapping';
      approach: 'keyword-based matching';
      confidence: 0.9;
      useCase: 'Well-defined skill descriptions';
    };
    semanticMapping: {
      description: 'Semantic similarity-based mapping';
      approach: 'vector similarity analysis';
      confidence: 0.7;
      useCase: 'Complex or ambiguous descriptions';
    };
    contextualMapping: {
      description: 'Context-aware capability inference';
      approach: 'environment and usage pattern analysis';
      confidence: 0.8;
      useCase: 'Skills with contextual dependencies';
    };
    collaborativeMapping: {
      description: 'Multi-agent collaborative mapping';
      approach: 'cross-agent knowledge sharing';
      confidence: 0.85;
      useCase: 'Complex capability requirements';
    };
  };
  
  capabilityCategories: {
    technical: {
      subcategories: ['infrastructure', 'development', 'deployment', 'monitoring'];
      skills: ['terraform', 'docker', 'kubernetes', 'ci-cd', 'testing'];
    };
    business: {
      subcategories: ['marketing', 'sales', 'analytics', 'content'];
      skills: ['lead-generation', 'campaign-management', 'data-analysis', 'content-creation'];
    };
    integration: {
      subcategories: ['api-integration', 'third-party', 'data-sync', 'workflow'];
      skills: ['rest-apis', 'webhooks', 'etl-processes', 'automation'];
    };
    security: {
      subcategories: ['authentication', 'authorization', 'compliance', 'monitoring'];
      skills: ['oauth-2.1', 'rbac', 'gdpr', 'security-auditing'];
    };
  };
}
```

### 3. Skill Inventory Agent

```typescript
interface SkillInventoryAgent {
  name: 'codex-skill-inventory';
  expertise: [
    'skill-cataloging',
    'metadata-extraction',
    'version-tracking',
    'dependency-analysis',
    'usage-analytics',
    'quality-assessment',
    'duplicate-detection',
    'obsolescence-tracking'
  ];
  
  inventoryMethods: {
    fileSystemScanning: {
      directories: ['skills/', 'skills/codex/', 'skills/claude/'];
      fileTypes: ['.md', '.json', '.yml'];
      depth: 'recursive';
      exclusions: ['node_modules', '.git', 'dist'];
    };
    metadataExtraction: {
      frontmatter: ['yaml', 'json'];
      contentAnalysis: ['keyword-extraction', 'pattern-matching'];
      structureAnalysis: ['heading-hierarchy', 'section-identification'];
    };
    qualityAssessment: {
      completeness: ['required-fields', 'documentation-quality'];
      consistency: ['format-standards', 'naming-conventions'];
      accuracy: ['metadata-validity', 'content-relevance'];
    };
  };
  
  inventoryMetrics: {
    totalSkills: number;
    categorizedSkills: Record<string, number>;
    skillTypes: Record<string, number>;
    qualityScores: Record<string, number>;
    usagePatterns: Record<string, number>;
    dependencies: SkillDependency[];
  };
}
```

### 4. Skill Optimization Agent

```typescript
interface SkillOptimizationAgent {
  name: 'codex-skill-optimizer';
  expertise: [
    'skill-performance-analysis',
    'usage-pattern-optimization',
    'content-improvement',
    'metadata-enhancement',
    'integration-optimization',
    'accessibility-improvement',
    'search-optimization',
    'maintenance-automation'
  ];
  
  optimizationStrategies: {
    contentOptimization: {
      clarityImprovement: ['structure-enhancement', 'readability-improvement'];
      completenessEnhancement: ['missing-sections', 'detail-expansion'];
      accuracyImprovement: ['fact-checking', 'validation-enhancement'];
      relevanceEnhancement: ['context-alignment', 'use-case-optimization'];
    };
    metadataOptimization: {
      schemaCompliance: ['frontmatter-validation', 'field-standardization'];
      searchability: ['keyword-optimization', 'tag-enhancement'];
      categorization: ['taxonomy-alignment', 'classification-improvement'];
      discoverability: ['naming-conventions', 'path-optimization'];
    };
    performanceOptimization: {
      loadingOptimization: ['file-size-reduction', 'parsing-efficiency'];
      cachingOptimization: ['metadata-caching', 'indexing-strategies'];
      accessOptimization: ['path-shortening', 'lookup-optimization'];
      searchOptimization: ['indexing-improvement', 'ranking-enhancement'];
    };
  };
}
```

## Skill Discovery Workflow

### 1. Multi-Agent Discovery Pipeline

```typescript
interface SkillDiscoveryPipeline {
  stages: DiscoveryStage[];
  agents: DiscoveryAgent[];
  coordination: AgentCoordination;
  qualityGates: QualityGate[];
}

interface DiscoveryStage {
  name: string;
  type: 'scanning' | 'analysis' | 'mapping' | 'validation' | 'optimization';
  agents: string[];
  inputs: DiscoveryInput[];
  outputs: DiscoveryOutput[];
  qualityChecks: QualityCheck[];
}

class SkillDiscoveryOrchestrator {
  async executeDiscovery(discoveryConfig: DiscoveryConfig): Promise<DiscoveryResult> {
    console.log('🔍 Starting skill discovery process...');
    
    const discoveryId = this.generateDiscoveryId();
    const discoveryState = new DiscoveryState(discoveryId);
    
    try {
      // Stage 1: Skill Scanning
      const scanResult = await this.executeSkillScanning(discoveryConfig, discoveryState);
      
      // Stage 2: Pattern Recognition
      const patternResult = await this.executePatternRecognition(scanResult, discoveryState);
      
      // Stage 3: Capability Mapping
      const mappingResult = await this.executeCapabilityMapping(patternResult, discoveryState);
      
      // Stage 4: Quality Validation
      const validationResult = await this.executeQualityValidation(mappingResult, discoveryState);
      
      // Stage 5: Optimization Recommendations
      const optimizationResult = await this.executeOptimization(validationResult, discoveryState);
      
      return await this.generateDiscoveryReport(discoveryState);
    } catch (error) {
      console.error('Skill discovery failed:', error);
      throw error;
    }
  }
  
  private async executeSkillScanning(
    config: DiscoveryConfig, 
    state: DiscoveryState
  ): Promise<ScanResult> {
    console.log('📂 Stage 1: Skill Scanning');
    
    const scanAgent = new SkillInventoryAgent();
    const scanResult = await scanAgent.scanSkills(config.scanPaths);
    
    state.completeStage('scanning', scanResult);
    return scanResult;
  }
  
  private async executePatternRecognition(
    scanResult: ScanResult, 
    state: DiscoveryState
  ): Promise<PatternResult> {
    console.log('🧠 Stage 2: Pattern Recognition');
    
    const patternAgent = new SkillPatternRecognitionAgent();
    const patterns = await patternAgent.recognizePatterns(scanResult.skills);
    
    state.completeStage('pattern-recognition', patterns);
    return patterns;
  }
  
  private async executeCapabilityMapping(
    patternResult: PatternResult, 
    state: DiscoveryState
  ): Promise<MappingResult> {
    console.log('🗺️ Stage 3: Capability Mapping');
    
    const mappingAgent = new CapabilityMappingAgent();
    const mappings = await mappingAgent.mapCapabilities(patternResult.skills);
    
    state.completeStage('capability-mapping', mappings);
    return mappings;
  }
  
  private async executeQualityValidation(
    mappingResult: MappingResult, 
    state: DiscoveryState
  ): Promise<ValidationResult> {
    console.log('✅ Stage 4: Quality Validation');
    
    const validationResults = await Promise.all([
      this.validateCompleteness(mappingResult),
      this.validateConsistency(mappingResult),
      this.validateAccuracy(mappingResult),
      this.validateRelevance(mappingResult)
    ]);
    
    const validationResult = {
      completeness: validationResults[0],
      consistency: validationResults[1],
      accuracy: validationResults[2],
      relevance: validationResults[3],
      overall: this.calculateOverallScore(validationResults)
    };
    
    state.completeStage('quality-validation', validationResult);
    return validationResult;
  }
  
  private async executeOptimization(
    validationResult: ValidationResult, 
    state: DiscoveryState
  ): Promise<OptimizationResult> {
    console.log('⚡ Stage 5: Optimization');
    
    const optimizationAgent = new SkillOptimizationAgent();
    const optimizations = await optimizationAgent.generateOptimizations(validationResult);
    
    state.completeStage('optimization', optimizations);
    return optimizations;
  }
  
  private async generateDiscoveryReport(state: DiscoveryState): Promise<DiscoveryResult> {
    const report = {
      discoveryId: state.discoveryId,
      timestamp: new Date(),
      duration: Date.now() - state.startTime,
      stages: state.stages,
      summary: this.generateSummary(state),
      recommendations: this.generateRecommendations(state),
      metrics: this.calculateMetrics(state)
    };
    
    await this.saveReport(report);
    return report;
  }
}
```

### 2. Agent Coordination Patterns

```typescript
interface AgentCoordination {
  communication: AgentCommunication;
  resourceSharing: ResourceSharing;
  conflictResolution: ConflictResolution;
  loadBalancing: LoadBalancing;
  knowledgeSharing: KnowledgeSharing;
}

class SkillDiscoveryCoordinator {
  private agents: Map<string, DiscoveryAgent> = new Map();
  private coordination: AgentCoordination;
  
  async coordinateDiscovery(discoveryConfig: DiscoveryConfig): Promise<DiscoveryResult> {
    // Initialize agents
    await this.initializeAgents();
    
    // Create discovery pipeline
    const pipeline = this.createDiscoveryPipeline(discoveryConfig);
    
    // Execute coordinated discovery
    const result = await this.executePipeline(pipeline);
    
    return result;
  }
  
  private async initializeAgents(): Promise<void> {
    // Initialize specialized agents
    this.agents.set('inventory', new SkillInventoryAgent());
    this.agents.set('pattern', new SkillPatternRecognitionAgent());
    this.agents.set('mapping', new CapabilityMappingAgent());
    this.agents.set('optimization', new SkillOptimizationAgent());
    
    // Establish communication channels
    await this.establishCommunication();
    
    // Set up resource sharing
    await this.setupResourceSharing();
  }
  
  private createDiscoveryPipeline(config: DiscoveryConfig): DiscoveryPipeline {
    return {
      stages: [
        {
          name: 'scanning',
          type: 'scanning',
          agents: ['inventory'],
          inputs: [{ type: 'paths', value: config.scanPaths }],
          outputs: [{ type: 'skills', value: 'discovered-skills' }],
          qualityChecks: [{ type: 'completeness', threshold: 0.8 }]
        },
        {
          name: 'pattern-recognition',
          type: 'analysis',
          agents: ['pattern'],
          inputs: [{ type: 'skills', value: 'discovered-skills' }],
          outputs: [{ type: 'patterns', value: 'recognized-patterns' }],
          qualityChecks: [{ type: 'accuracy', threshold: 0.7 }]
        },
        {
          name: 'capability-mapping',
          type: 'mapping',
          agents: ['mapping'],
          inputs: [{ type: 'skills', value: 'discovered-skills' }],
          outputs: [{ type: 'mappings', value: 'capability-mappings' }],
          qualityChecks: [{ type: 'relevance', threshold: 0.75 }]
        },
        {
          name: 'validation',
          type: 'validation',
          agents: ['inventory', 'pattern', 'mapping'],
          inputs: [{ type: 'mappings', value: 'capability-mappings' }],
          outputs: [{ type: 'validation', value: 'validation-results' }],
          qualityChecks: [{ type: 'completeness', threshold: 0.9 }]
        },
        {
          name: 'optimization',
          type: 'optimization',
          agents: ['optimization'],
          inputs: [{ type: 'validation', value: 'validation-results' }],
          outputs: [{ type: 'optimizations', value: 'optimization-recommendations' }],
          qualityChecks: [{ type: 'feasibility', threshold: 0.8 }]
        }
      ],
      agents: Array.from(this.agents.keys()),
      coordination: this.coordination,
      qualityGates: [
        { name: 'completeness', threshold: 0.8, critical: true },
        { name: 'accuracy', threshold: 0.7, critical: true },
        { name: 'relevance', threshold: 0.75, critical: false },
        { name: 'feasibility', threshold: 0.8, critical: false }
      ]
    };
  }
  
  private async executePipeline(pipeline: DiscoveryPipeline): Promise<DiscoveryResult> {
    const results: StageResult[] = [];
    
    for (const stage of pipeline.stages) {
      const stageResult = await this.executeStage(stage, results);
      results.push(stageResult);
      
      // Check quality gates
      const qualityPassed = await this.checkQualityGates(stage, pipeline.qualityGates);
      
      if (!qualityPassed && stage.qualityChecks.some(check => check.critical)) {
        throw new Error(`Critical quality gate failed in stage: ${stage.name}`);
      }
    }
    
    return this.consolidateResults(results);
  }
}
```

## Skill Analysis Patterns

### 1. Pattern Recognition Algorithms

```typescript
interface PatternRecognitionAlgorithm {
  name: string;
  description: string;
  confidence: number;
  useCase: string;
  implementation: PatternMatcher;
}

class SkillPatternMatcher {
  private patterns: Map<string, SkillPattern> = new Map();
  
  constructor() {
    this.initializePatterns();
  }
  
  async recognizePatterns(skills: Skill[]): Promise<RecognizedPatterns> {
    const recognizedPatterns: RecognizedPatterns = {
      skills: [],
      patterns: [],
      confidence: 0,
      metadata: {}
    };
    
    for (const skill of skills) {
      const skillPatterns = await this.analyzeSkill(skill);
      
      recognizedPatterns.skills.push({
        skill: skill.name,
        patterns: skillPatterns.patterns,
        confidence: skillPatterns.confidence,
        metadata: skillPatterns.metadata
      });
      
      recognizedPatterns.patterns.push(...skillPatterns.patterns);
    }
    
    recognizedPatterns.confidence = this.calculateOverallConfidence(recognizedPatterns);
    
    return recognizedPatterns;
  }
  
  private async analyzeSkill(skill: Skill): Promise<SkillPatterns> {
    const patterns: SkillPattern[] = [];
    let confidence = 0;
    
    // Analyze file structure
    const structurePatterns = this.analyzeFileStructure(skill);
    patterns.push(...structurePatterns.patterns);
    confidence += structurePatterns.confidence;
    
    // Analyze content patterns
    const contentPatterns = this.analyzeContentPatterns(skill);
    patterns.push(...contentPatterns.patterns);
    confidence += contentPatterns.confidence;
    
    // Analyze metadata patterns
    const metadataPatterns = this.analyzeMetadataPatterns(skill);
    patterns.push(...metadataPatterns.patterns);
    confidence += metadataPatterns.confidence;
    
    return {
      patterns,
      confidence: confidence / 3, // Average confidence
      metadata: {
        structure: structurePatterns.metadata,
        content: contentPatterns.metadata,
        metadata: metadataPatterns.metadata
      }
    };
  }
  
  private analyzeFileStructure(skill: Skill): FileStructurePatterns {
    const filePath = skill.filePath;
    const fileName = skill.fileName;
    const directory = skill.directory;
    
    const patterns: SkillPattern[] = [];
    let confidence = 0;
    
    // Check for workflow skill structure
    if (this.hasWorkflowStructure(filePath)) {
      patterns.push({
        type: 'workflow-skill',
        confidence: 0.9,
        evidence: 'workflow-skill.md template structure'
      });
      confidence += 0.9;
    }
    
    // Check for reference skill structure
    if (this.hasReferenceStructure(filePath)) {
      patterns.push({
        type: 'reference-skill',
        confidence: 0.8,
        evidence: 'reference documentation structure'
      });
      confidence += 0.8;
    }
    
    // Check for scripting skill structure
    if (this.hasScriptingStructure(filePath)) {
      patterns.push({
        type: 'scripting-skill',
        confidence: 0.85,
        evidence: 'automation script structure'
      });
      confidence += 0.85;
    }
    
    return {
      patterns,
      confidence,
      metadata: {
        filePath,
        fileName,
        directory,
        structureType: this.inferStructureType(filePath)
      }
    };
  }
  
  private analyzeContentPatterns(skill: Skill): ContentPatterns {
    const content = skill.content;
    const patterns: SkillPattern[] = [];
    let confidence = 0;
    
    // Analyze for workflow indicators
    const workflowIndicators = this.extractWorkflowIndicators(content);
    if (workflowIndicators.length > 0) {
      patterns.push({
        type: 'workflow-indicators',
        confidence: 0.8,
        evidence: workflowIndicators
      });
      confidence += 0.8;
    }
    
    // Analyze for tool references
    const toolReferences = this.extractToolReferences(content);
    if (toolReferences.length > 0) {
      patterns.push({
        type: 'tool-references',
        confidence: 0.7,
        evidence: toolReferences
      });
      confidence += 0.7;
    }
    
    // Analyze for step-by-step instructions
    const stepInstructions = this.extractStepInstructions(content);
    if (stepInstructions.length > 0) {
      patterns.push({
        type: 'step-instructions',
        confidence: 0.9,
        evidence: stepInstructions
      });
      confidence += 0.9;
    }
    
    return {
      patterns,
      confidence,
      metadata: {
        wordCount: content.split(/\s+/).length,
        lineCount: content.split('\n').length,
        sectionCount: this.countSections(content),
        hasCodeBlocks: this.hasCodeBlocks(content),
        hasTables: this.hasTables(content)
      }
    };
  }
  
  private analyzeMetadataPatterns(skill: Skill): MetadataPatterns {
    const metadata = skill.metadata;
    const patterns: SkillPattern[] = [];
    let confidence = 0;
    
    // Analyze frontmatter completeness
    const frontmatterScore = this.analyzeFrontmatterCompleteness(metadata);
    if (frontmatterScore > 0.8) {
      patterns.push({
        type: 'complete-frontmatter',
        confidence: frontmatterScore,
        evidence: 'All required fields present'
      });
      confidence += frontmatterScore;
    }
    
    // Analyze category classification
    const categoryMatch = this.analyzeCategoryClassification(metadata);
    if (categoryMatch.score > 0.7) {
      patterns.push({
        type: 'proper-categorization',
        confidence: categoryMatch.score,
        evidence: categoryMatch.evidence
      });
      confidence += categoryMatch.score;
    }
    
    // Analyze expertise level
    const expertiseMatch = this.analyzeExpertiseLevel(metadata);
    if (expertiseMatch.score > 0.6) {
      patterns.push({
        type: 'expertise-level-defined',
        confidence: expertiseMatch.score,
        evidence: expertiseMatch.evidence
      });
      confidence += expertiseMatch.score;
    }
    
    return {
      patterns,
      confidence,
      metadata: {
        fields: Object.keys(metadata),
        fieldCount: Object.keys(metadata).length,
        hasInvokes: metadata.invokes ? metadata.invokes.length > 0 : false,
        hasMeta: metadata.meta ? Object.keys(metadata.meta).length > 0 : false,
        hasVersion: metadata.version ? true : false
      }
    };
  }
  
  // Helper methods
  private hasWorkflowStructure(filePath: string): boolean {
    return filePath.includes('workflow') || 
           filePath.includes('automation') ||
           this.hasWorkflowSections(filePath);
  }
  
  private hasReferenceStructure(filePath: string): boolean {
    return filePath.includes('reference') || 
           filePath.includes('docs') ||
           this.hasReferenceSections(filePath);
  }
  
  private hasScriptingStructure(filePath: string): boolean {
    return filePath.includes('scripts') || 
           filePath.includes('automation') ||
           this.hasScriptingSections(filePath);
  }
  
  private extractWorkflowIndicators(content: string): string[] {
    const indicators = [
      'workflow steps',
      'execution order',
      'prerequisites',
      'validation',
      'success criteria',
      'error handling'
    ];
    
    return indicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    );
  }
  
  private extractToolReferences(content: string): string[] {
    const toolPattern = /INVOKES:\s*\[([^\]]+)\]/g;
    const matches = content.match(toolPattern);
    
    if (matches) {
      try {
        return JSON.parse(matches[1]);
      } catch (error) {
        return [];
      }
    }
    
    return [];
  }
  
  private extractStepInstructions(content: string): string[] {
    const stepPattern = /###?\s*\d+\.\s*[A-Z]/g;
    const matches = content.match(stepPattern);
    
    return matches || [];
  }
}
```

### 2. Capability Mapping Algorithms

```typescript
interface CapabilityMappingAlgorithm {
  name: string;
  description: string;
  approach: MappingApproach;
  confidence: number;
  implementation: CapabilityMapper;
}

class CapabilityMapper {
  private capabilityMatrix: CapabilityMatrix;
  private skillVectors: Map<string, number[]> = new Map();
  private capabilityVectors: Map<string, number[]> = new Map();
  
  constructor() {
    this.initializeCapabilityMatrix();
    this.initializeVectors();
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
    
    // Generate skill vectors
    this.generateSkillVectors(skills);
    
    // Map skills to capabilities
    for (const skill of skills) {
      const skillVector = this.skillVectors.get(skill.name);
      
      if (skillVector) {
        const capabilities = this.mapSkillToCapabilities(skillVector);
        
        mappings.skills.push({
          skill: skill.name,
          capabilities: capabilities.mapped,
          confidence: capabilities.confidence,
          gaps: capabilities.gaps,
          evidence: capabilities.evidence
        });
        
        mappings.capabilities.push(...capabilities.mapped);
      }
    }
    
    // Analyze gaps and overlaps
    mappings.gaps = this.identifyCapabilityGaps(mappings);
    mappings.overlaps = this.identifyCapabilityOverlaps(mappings);
    
    // Calculate coverage
    mappings.coverage = this.calculateCapabilityCoverage(mappings);
    
    // Generate recommendations
    mappings.recommendations = this.generateRecommendations(mappings);
    
    return mappings;
  }
  
  private generateSkillVectors(skills: Skill[]): void {
    for (const skill of skills) {
      const vector = this.generateSkillVector(skill);
      this.skillVectors.set(skill.name, vector);
    }
  }
  
  private generateSkillVector(skill: Skill): number[] {
    const vector: number[] = [];
    
    // Technical capabilities
    const technicalCapabilities = [
      'infrastructure', 'development', 'deployment', 'monitoring',
      'testing', 'security', 'performance', 'database'
    ];
    
    // Business capabilities
    const businessCapabilities = [
      'marketing', 'sales', 'analytics', 'content', 'communication',
      'collaboration', 'automation', 'integration'
    ];
    
    // Integration capabilities
    const integrationCapabilities = [
      'api-integration', 'webhook-integration', 'data-sync',
      'third-party', 'mcp-integration', 'workflow-integration'
    ];
    
    // All capabilities
    const allCapabilities = [
      ...technicalCapabilities,
      ...businessCapabilities,
      ...integrationCapabilities
    ];
    
    // Generate vector based on skill content and metadata
    for (const capability of allCapabilities) {
      const score = this.calculateCapabilityScore(skill, capability);
      vector.push(score);
    }
    
    return vector;
  }
  
  private calculateCapabilityScore(skill: Skill, capability: string): number {
    let score = 0;
    
    // Check content for capability indicators
    const content = skill.content.toLowerCase();
    const metadata = skill.metadata;
    
    // Direct keyword matching
    if (content.includes(capability.toLowerCase())) {
      score += 0.8;
    }
    
    // Related keyword matching
    const relatedKeywords = this.getRelatedKeywords(capability);
    for (const keyword of relatedKeywords) {
      if (content.includes(keyword.toLowerCase())) {
        score += 0.4;
      }
    }
    
    // Category matching
    if (metadata.category === this.getCapabilityCategory(capability)) {
      score += 0.6;
    }
    
    // Tool references
    if (metadata.invokes) {
      for (const tool of metadata.invokes) {
        if (this.getToolCapabilities(tool).includes(capability)) {
          score += 0.5;
        }
      }
    }
    
    return Math.min(score, 1.0);
  }
  
  private mapSkillToCapabilities(skillVector: number[]): CapabilityMapping {
    const mappings: CapabilityMapping = {
      mapped: [],
      confidence: 0,
      gaps: [],
      evidence: []
    };
    
    const threshold = 0.5; // Minimum confidence threshold
    
    for (let i = 0; i < skillVector.length; i++) {
      const score = skillVector[i];
      
      if (score >= threshold) {
        const capability = this.getCapabilityByIndex(i);
        mappings.mapped.push(capability);
        mappings.evidence.push(`${capability}: ${score.toFixed(2)}`);
      } else {
        const capability = this.getCapabilityByIndex(i);
        mappings.gaps.push(capability);
      }
    }
    
    mappings.confidence = mappings.mapped.length / skillVector.length;
    
    return mappings;
  }
  
  private identifyCapabilityGaps(mappings: CapabilityMappings): CapabilityGap[] {
    const allCapabilities = Array.from(this.capabilityVectors.keys());
    const mappedCapabilities = new Set(mappings.capabilities);
    
    const gaps = allCapabilities.filter(capability => !mappedCapabilities.has(capability));
    
    return gaps.map(capability => ({
      capability,
      priority: this.getCapabilityPriority(capability),
      suggestions: this.getCapabilitySuggestions(capability)
    }));
  }
  
  private identifyCapabilityOverlaps(mappings: CapabilityMappings): CapabilityOverlap[] {
    const capabilityCounts = new Map<string, number>();
    
    // Count capability occurrences
    for (const skill of mappings.skills) {
      for (const capability of skill.capabilities) {
        const count = capabilityCounts.get(capability) || 0;
        capabilityCounts.set(capability, count + 1);
      }
    }
    
    // Find overlaps
    const overlaps: CapabilityOverlap[] = [];
    
    for (const [capability, count] of capabilityCounts) {
      if (count > 1) {
        overlaps.push({
          capability,
          occurrenceCount: count,
          skills: mappings.skills
            .filter(s => s.capabilities.includes(capability))
            .map(s => s.skill)
        });
      }
    }
    
    return overlaps.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }
  
  private calculateCapabilityCoverage(mappings: CapabilityMappings): number {
    const allCapabilities = Array.from(this.capabilityVectors.keys());
    const mappedCapabilities = new Set(mappings.capabilities);
    
    return mappedCapabilities.size / allCapabilities.length;
  }
  
  private generateRecommendations(mappings: CapabilityMappings): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Gap recommendations
    for (const gap of mappings.gaps) {
      recommendations.push({
        type: 'gap',
        priority: gap.priority,
        capability: gap.capability,
        description: `Add ${gap.capability} capability to skill set`,
        suggestions: gap.suggestions
      });
    }
    
    // Overlap recommendations
    for (const overlap of mappings.overlaps) {
      if (overlap.occurrenceCount > 3) {
        recommendations.push({
          type: 'consolidation',
          priority: 'medium',
          capability: overlap.capability,
          description: `Consolidate ${overlap.capability} across ${overlap.skills.length} skills`,
          suggestions: [`Create shared ${overlap.capability} skill`]
        });
      }
    }
    
    return recommendations;
  }
}
```

---

**Last Updated**: 2026-02-26  
**Version**: 1.0.0  
**Author**: cascade-ai

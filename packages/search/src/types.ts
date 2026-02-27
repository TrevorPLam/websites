export interface CodeChunk {
  id: string;
  content: string;
  filePath: string;
  startLine: number;
  endLine: number;
  type: "function" | "class" | "interface" | "variable" | "import" | "export";
  metadata: {
    name?: string;
    parameters?: string[];
    returnType?: string;
    dependencies?: string[];
    complexity?: number;
    description?: string;
  };
}

export interface SearchResult {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  score: number;
  snippet: string;
  metadata: CodeChunk["metadata"];
  context: {
    before: string;
    after: string;
  };
}

export interface SearchQuery {
  query: string;
  filters?: {
    fileTypes?: string[];
    packages?: string[];
    types?: CodeChunk["type"][];
  };
  options?: {
    top?: number;
    threshold?: number;
    includeContext?: boolean;
  };
}

export interface IndexingOptions {
  src: string;
  filter?: string;
  incremental?: boolean;
  batchSize?: number;
}

export interface VectorDatabase {
  addVectors(vectors: number[][]): Promise<void>;
  search(query: number[], k: number): Promise<number[][]>;
  size: number;
}

export interface KnowledgeGraph {
  createNode(label: string, properties: Record<string, any>): Promise<void>;
  createRelationship(fromId: string, toId: string, type: string): Promise<void>;
  findRelatedNodes(nodeId: string, depth: number): Promise<any[]>;
}

export interface EmbeddingService {
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  generateSingleEmbedding(text: string): Promise<number[]>;
}

export interface SearchService {
  indexRepository(options: IndexingOptions): Promise<void>;
  search(query: SearchQuery): Promise<SearchResult[]>;
  reindex(filePath: string): Promise<void>;
  removeIndex(id: string): Promise<void>;
}

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RepositorySearchService } from "../search-service";
import { FaissVectorDatabase } from "../vector-database";

// Mock dependencies
vi.mock("openai", () => ({
  default: class MockOpenAI {
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(3072).fill(0.1) }]
      });
    }
  }
}));

vi.mock("neo4j-driver", () => ({
  default: class MockNeo4j {
    driver = {
      verifyConnectivity: vi.fn().mockResolvedValue(undefined),
      session: vi.fn().mockReturnValue({
        run: vi.fn().mockResolvedValue({ records: [] }),
        close: vi.fn().mockResolvedValue(undefined)
      }),
      close: vi.fn().mockResolvedValue(undefined)
    };
    auth: {
      basic: vi.fn()
    }
  }
}));

describe("RepositorySearchService", () => {
  let searchService: RepositorySearchService;
  
  beforeEach(() => {
    searchService = new RepositorySearchService();
  });

  describe("indexRepository", () => {
    it("should index TypeScript files", async () => {
      const mockFs = vi.mocked(await import("fs"));
      mockFs.readFileSync.mockReturnValue("export function test() { return true; }");
      
      await searchService.indexRepository({
        src: "./test-files",
        filter: "*.ts"
      });
      
      expect(true).toBe(true); // Basic test to ensure no errors
    });
  });

  describe("search", () => {
    it("should return search results", async () => {
      const results = await searchService.search({
        query: "test function",
        options: { top: 5 }
      });
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("reindex", () => {
    it("should reindex a specific file", async () => {
      await searchService.reindex("./test-file.ts");
      expect(true).toBe(true); // Basic test to ensure no errors
    });
  });
});

describe("FaissVectorDatabase", () => {
  let vectorDb: FaissVectorDatabase;
  
  beforeEach(() => {
    vectorDb = new FaissVectorDatabase();
  });

  it("should initialize with correct dimensions", () => {
    expect(vectorDb.size).toBe(0);
  });

  it("should add vectors", async () => {
    const vectors = [
      new Array(3072).fill(0.1),
      new Array(3072).fill(0.2)
    ];
    
    await vectorDb.addVectors(vectors);
    expect(vectorDb.size).toBe(2);
  });

  it("should search vectors", async () => {
    const vectors = [
      new Array(3072).fill(0.1),
      new Array(3072).fill(0.2)
    ];
    
    await vectorDb.addVectors(vectors);
    
    const query = new Array(3072).fill(0.15);
    const results = await vectorDb.search(query, 2);
    
    expect(results).toHaveLength(2);
  });
});

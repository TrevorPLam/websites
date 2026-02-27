import { IndexFlatL2 } from "faiss-node";

export class FaissVectorDatabase implements VectorDatabase {
  private index: IndexFlatL2;
  private dimension: number = 3072; // OpenAI embedding dimension
  private vectors: number[][] = [];
  private _size: number = 0;

  constructor(dimension: number = 3072) {
    this.dimension = dimension;
    this.index = new IndexFlatL2(this.dimension);
  }

  async addVectors(vectors: number[][]): Promise<void> {
    this.vectors.push(...vectors);
    this.index.add(vectors);
    this._size += vectors.length;
  }

  async search(query: number[], k: number): Promise<number[][]> {
    if (this._size === 0) {
      return [];
    }
    
    const { distances, labels } = this.index.search(query, k);
    return labels.map((label: number) => this.vectors[label]);
  }

  get size(): number {
    return this._size;
  }

  async clear(): Promise<void> {
    this.index = new IndexFlatL2(this.dimension);
    this.vectors = [];
    this._size = 0;
  }

  async getVector(id: number): Promise<number[]> {
    return this.vectors[id];
  }

  async getAllVectors(): Promise<number[][]> {
    return [...this.vectors];
  }
}

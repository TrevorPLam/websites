import neo4j from "neo4j-driver";

export class Neo4jKnowledgeGraph implements KnowledgeGraph {
  private driver: neo4j.Driver;
  private isConnected: boolean = false;

  constructor(uri: string, username: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }

  async connect(): Promise<void> {
    try {
      await this.driver.verifyConnectivity();
      this.isConnected = true;
      console.log("Connected to Neo4j database");
    } catch (error) {
      console.error("Failed to connect to Neo4j:", error);
      throw error;
    }
  }

  async createNode(label: string, properties: Record<string, any>): Promise<string> {
    if (!this.isConnected) await this.connect();
    
    const session = this.driver.session();
    try {
      const result = await session.run(
        \`CREATE (n:\${label} \$props) RETURN ID(n) as id\`,
        { props: properties }
      );
      return result.records[0].get("id").toString();
    } finally {
      await session.close();
    }
  }

  async createRelationship(fromId: string, toId: string, type: string): Promise<void> {
    if (!this.isConnected) await this.connect();
    
    const session = this.driver.session();
    try {
      await session.run(
        \`MATCH (a), (b) WHERE ID(a) = \$from AND ID(b) = \$to 
         CREATE (a)-[:\${type}]->(b)\`,
        { from: parseInt(fromId), to: parseInt(toId) }
      );
    } finally {
      await session.close();
    }
  }

  async findRelatedNodes(nodeId: string, depth: number = 1): Promise<any[]> {
    if (!this.isConnected) await this.connect();
    
    const session = this.driver.session();
    try {
      const result = await session.run(
        \`MATCH (start)-[*1..\${depth}]-(related)
         WHERE ID(start) = \$nodeId
         RETURN related, type(r), length(path) as depth\`,
        { nodeId: parseInt(nodeId) }
      );
      
      return result.records.map(record => ({
        node: record.get("related").properties,
        relationshipType: record.get("type(r)"),
        depth: record.get("depth")
      }));
    } finally {
      await session.close();
    }
  }

  async findNodesByLabel(label: string): Promise<any[]> {
    if (!this.isConnected) await this.connect();
    
    const session = this.driver.session();
    try {
      const result = await session.run(
        \`MATCH (n:\${label}) RETURN n\`
      );
      
      return result.records.map(record => record.get("n").properties);
    } finally {
      await session.close();
    }
  }

  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.isConnected = false;
    }
  }
}

import { Document, VectorStoreIndex, serviceContextFromDefaults } from "llamaindex";
import { ChromaVectorStore } from "llamaindex/vector_stores/chroma";

// Initialize Chroma client
let vectorStore: ChromaVectorStore;
let index: VectorStoreIndex;

const CHROMA_CONFIG = {
  dev: {
    host: "localhost",
    port: 8000,
    ssl: false,
  },
  production: {
    host: process.env.CHROMA_HOST || "chroma.your-domain.com",
    port: process.env.CHROMA_PORT ? parseInt(process.env.CHROMA_PORT) : 443,
    ssl: true,
    headers: {
      // Add any authentication headers here
      "X-Api-Key": process.env.CHROMA_API_KEY,
    },
  },
};

export async function initializeVectorStore() {
  if (!vectorStore) {
    const config = process.env.NODE_ENV === "production" 
      ? CHROMA_CONFIG.production 
      : CHROMA_CONFIG.dev;

    // Create vector store
    vectorStore = new ChromaVectorStore({
      ...config,
      collectionName: "lovittsbjj",
    });

    // Create service context
    const serviceContext = serviceContextFromDefaults({});

    try {
      // Create empty index with vector store
      index = await VectorStoreIndex.fromVectorStore(vectorStore, serviceContext);
    } catch (error) {
      console.error("Failed to initialize vector store:", error);
      throw new Error("Vector store initialization failed");
    }
  }
  return { vectorStore, index };
}

export async function addDocumentToIndex(content: string, metadata?: Record<string, any>) {
  try {
    const { vectorStore, index } = await initializeVectorStore();
    
    // Create document
    const document = new Document({ text: content, metadata });
    
    // Insert document into index
    await index.insert(document);
  } catch (error) {
    console.error("Failed to add document to index:", error);
    throw new Error("Document indexing failed");
  }
}

export async function queryIndex(query: string) {
  try {
    const { index } = await initializeVectorStore();
    
    // Create query engine
    const queryEngine = index.asQueryEngine();
    
    // Query the index
    const response = await queryEngine.query(query);
    
    return response;
  } catch (error) {
    console.error("Failed to query index:", error);
    throw new Error("Query failed");
  }
}

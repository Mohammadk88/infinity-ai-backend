// apps/backend/src/modules/memory/adapters/chroma.adapter.ts
import { ChromaClient } from 'chromadb';

export class ChromaAdapter {
  private client: ChromaClient;

  constructor() {
    this.client = new ChromaClient({
      path: process.env.CHROMA_DB_URL ?? 'http://localhost:8000', // أو حسب سيرفرك
    });
  }

  async addMemory(
    collectionName: string,
    id: string,
    embedding: number[],
    metadata: Record<string, any>,
  ) {
    const collection = await this.client.getOrCreateCollection({
      name: collectionName,
    });
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata],
      documents: [metadata.content], // optional لو بدك تخزن النص الأصلي
    });
  }

  async querySimilar(collectionName: string, embedding: number[], topK = 5) {
    const collection = await this.client.getCollection({
      name: collectionName,
    });
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });
    return results;
  }
}

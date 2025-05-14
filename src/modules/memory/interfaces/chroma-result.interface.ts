// apps/backend/src/modules/memory/interfaces/chroma-result.interface.ts
export interface ChromaSearchResult {
  ids: string[];
  distances: number[];
  documents: string[];
  metadatas: any[];
}

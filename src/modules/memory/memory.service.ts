import { Injectable } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { SearchMemoryDto } from './dto/search-memory.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { getEmbedding } from './utils/embedding.utils';
import { ChromaAdapter } from './adapters/chroma.adapter';
import { Memory } from '@prisma/client'; // ناقصة عندك!!
import { RedisService } from '../redis/redis.service'; // أو حسب مسار RedisService عندك

@Injectable()
export class MemoryService {
  private chroma: ChromaAdapter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.chroma = new ChromaAdapter();
  }

  async createMemory(dto: CreateMemoryDto) {
    // No need to check if the model exists, TypeScript will handle it
    const memory: Memory = await this.prisma.memory.create({
      data: {
        userId: dto.userId,
        projectId: dto.projectId,
        moduleId: dto.moduleId,
        tags: dto.tags ?? [],
        content: dto.content,
      },
    });

    const embedding = await getEmbedding(dto.content);
    await this.chroma.addMemory(
      dto.projectId, // collectionName = projectId
      memory.id,
      embedding,
      {
        userId: dto.userId,
        moduleId: dto.moduleId ?? '',
        tags: dto.tags ?? [],
        content: dto.content,
      },
    );

    return memory;
  }

  async searchMemory(dto: SearchMemoryDto): Promise<any> {
    // Replace 'any' with the actual expected type if known
    const cacheKey = `memory_search:${dto.projectId}:${dto.query}`;

    // 1. check cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      return parsed; // Return as the inferred type from JSON.parse
    }

    // 2. query Chroma
    const embedding = await getEmbedding(dto.query);
    const results = await this.chroma.querySimilar(dto.projectId, embedding);

    // 3. save result to cache
    await this.redisService.set(
      cacheKey,
      JSON.stringify(results),
      'EX',
      60 * 5,
    ); // 5 min cache

    return results;
  }
  async getContextForAssistant(
    userId: string,
    projectId: string,
    userMessage: string,
  ) {
    const embedding = await getEmbedding(userMessage);
    const results = await this.chroma.querySimilar(projectId, embedding);

    // Extract documents or metadatas as context
    const context = results?.metadatas
      ?.flat()
      ?.filter(
        (meta): meta is NonNullable<typeof meta> =>
          meta !== null && meta.content !== undefined,
      )
      ?.map((meta) => meta.content)
      ?.join('\n');

    return context ?? '';
  }
  async getMemoriesByProject(projectId: string) {
    return await this.prisma.memory.findMany({
      where: { projectId },
    });
  }

  async getMemoryById(id: string) {
    return await this.prisma.memory.findUnique({
      where: { id },
    });
  }

  async deleteMemory(id: string) {
    await this.prisma.memory.delete({
      where: { id },
    });
    return { message: 'Memory deleted successfully.' };
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { MemoryService } from './memory.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('MemoryService', () => {
  let service: MemoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoryService,
        { provide: PrismaService, useValue: { memory: { create: jest.fn() } } },
        { provide: RedisService, useValue: { get: jest.fn(), set: jest.fn() } },
      ],
    }).compile();

    service = module.get<MemoryService>(MemoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create memory', async () => {
    const dto = {
      userId: 'user-1',
      projectId: 'project-1',
      moduleId: 'gpt-4.1-nano',
      tags: ['test'],
      content: 'This is test content',
    };

    const createSpy = jest.spyOn(prisma.memory, 'create');
    createSpy.mockResolvedValue({
      id: 'test-id',
      userId: dto.userId,
      projectId: dto.projectId,
      moduleId: dto.moduleId,
      tags: dto.tags,
      content: dto.content,
      createdAt: new Date(),
      expiresAt: null,
    });
    const result = await service.createMemory(dto);

    expect(result).toEqual({ id: 'test-id' });
    expect(createSpy).toHaveBeenCalledWith({
      data: dto,
    });
  });
});

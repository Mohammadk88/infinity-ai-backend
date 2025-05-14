// apps/backend/src/modules/memory/memory.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Memory } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { SearchMemoryDto } from './dto/search-memory.dto';
import { ChromaSearchResult } from './interfaces/chroma-result.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Memory')
@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @ApiOperation({ summary: 'Create new memory' })
  @ApiResponse({ status: 201, description: 'Memory created successfully.' })
  @Post()
  async createMemory(@Body() createMemoryDto: CreateMemoryDto) {
    return this.memoryService.createMemory(createMemoryDto);
  }

  @ApiOperation({ summary: 'Search memories by query' })
  @ApiResponse({ status: 200, description: 'List of matched memories.' })
  @Get('search')
  async searchMemory(
    @Query() searchMemoryDto: SearchMemoryDto,
  ): Promise<ChromaSearchResult> {
    return this.memoryService.searchMemory(
      searchMemoryDto,
    ) as Promise<ChromaSearchResult>;
  }

  @ApiOperation({ summary: 'Get all memories by project ID' })
  @ApiResponse({
    status: 200,
    description: 'List of all memories for a project.',
  })
  @Get('project/:projectId')
  async getMemoriesByProject(
    @Param('projectId') projectId: string,
  ): Promise<Memory[]> {
    return this.memoryService.getMemoriesByProject(projectId);
  }

  @ApiOperation({ summary: 'Get single memory by ID' })
  @ApiResponse({ status: 200, description: 'Memory details.' })
  @Get(':id')
  async getMemoryById(@Param('id') id: string): Promise<Memory> {
    const memory = await this.memoryService.getMemoryById(id);
    if (!memory) {
      throw new NotFoundException(`Memory with ID ${id} not found.`);
    }
    return memory;
  }

  @ApiOperation({ summary: 'Delete memory by ID' })
  @ApiResponse({ status: 200, description: 'Memory deleted successfully.' })
  @Delete(':id')
  async deleteMemory(@Param('id') id: string) {
    return this.memoryService.deleteMemory(id);
  }
}

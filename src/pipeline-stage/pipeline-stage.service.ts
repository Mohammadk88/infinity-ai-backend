import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { PipelineStage } from '@prisma/client'; // استيراد النوع من Prisma client

@Injectable()
export class PipelineStageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreatePipelineStageDto,
  ): Promise<PipelineStage> {
    // Ensure the pipeline stage model exists
    if (!this.prisma.pipelineStage) {
      throw new Error('PipelineStage model is not available in Prisma client');
    }

    return await this.prisma.pipelineStage.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findAll(userId: string): Promise<PipelineStage[]> {
    return this.prisma.pipelineStage.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  findOne(id: string): Promise<PipelineStage | null> {
    return this.prisma.pipelineStage.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdatePipelineStageDto): Promise<PipelineStage> {
    return this.prisma.pipelineStage.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string): Promise<PipelineStage> {
    return this.prisma.pipelineStage.delete({
      where: { id },
    });
  }

  async reorderStages(userId: string, stageIds: string[]): Promise<void> {
    const updatePromises = stageIds.map((id, index) =>
      this.prisma.pipelineStage.updateMany({
        where: { id, userId },
        data: { order: index },
      }),
    );
    await Promise.all(updatePromises);
  }
}

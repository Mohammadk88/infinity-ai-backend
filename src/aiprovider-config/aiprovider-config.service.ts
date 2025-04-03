import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAIProviderConfigDto } from './dto/create-ai-provider-config.dto';
import { UpdateAIProviderConfigDto } from './dto/update-ai-provider-config.dto';

@Injectable()
export class AIProviderConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAIProviderConfigDto) {
    return this.prisma.aIProviderConfig.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.aIProviderConfig.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const config = await this.prisma.aIProviderConfig.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!config) {
      throw new NotFoundException('AI Provider Config not found');
    }

    return config;
  }

  async update(id: string, userId: string, dto: UpdateAIProviderConfigDto) {
    await this.findOne(id, userId);

    return this.prisma.aIProviderConfig.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.aIProviderConfig.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }
}

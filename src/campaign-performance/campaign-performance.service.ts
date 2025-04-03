import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignPerformanceDto } from './dto/create-campaign-performance.dto';
import { UpdateCampaignPerformanceDto } from './dto/update-campaign-performance.dto';

@Injectable()
export class CampaignPerformanceService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCampaignPerformanceDto) {
    return this.prisma.campaignPerformance.create({ data: dto });
  }

  findAll(campaignId: string) {
    return this.prisma.campaignPerformance.findMany({
      where: { campaignId },
    });
  }

  async findOne(id: string) {
    const perf = await this.prisma.campaignPerformance.findUnique({
      where: { id },
    });
    if (!perf) throw new NotFoundException('Performance not found');
    return perf;
  }

  update(id: string, dto: UpdateCampaignPerformanceDto) {
    return this.prisma.campaignPerformance.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.campaignPerformance.delete({ where: { id } });
  }
}

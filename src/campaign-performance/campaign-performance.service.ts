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

  findAll() {
    return this.prisma.campaignPerformance.findMany();
  }

  findOne(id: string) {
    return this.prisma.campaignPerformance.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateCampaignPerformanceDto) {
    await this.ensureExists(id);
    return this.prisma.campaignPerformance.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.campaignPerformance.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.campaignPerformance.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Campaign performance not found');
  }
}

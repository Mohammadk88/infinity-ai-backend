import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignPostDto } from './dto/create-campaign-post.dto';
import { UpdateCampaignPostDto } from './dto/update-campaign-post.dto';

@Injectable()
export class CampaignPostService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCampaignPostDto) {
    return this.prisma.campaignPost.create({ data: dto });
  }

  findAll() {
    return this.prisma.campaignPost.findMany();
  }

  findOne(id: string) {
    return this.prisma.campaignPost.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateCampaignPostDto) {
    await this.ensureExists(id);
    return this.prisma.campaignPost.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.campaignPost.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.campaignPost.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Campaign post not found');
  }
}

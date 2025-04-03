import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignPostDto } from './dto/create-campaign-post.dto';
import { UpdateCampaignPostDto } from './dto/update-campaign-post.dto';

@Injectable()
export class CampaignPostService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCampaignPostDto) {
    return this.prisma.campaignPost.create({
      data: {
        ...dto,
      },
    });
  }

  findAll(campaignId: string) {
    return this.prisma.campaignPost.findMany({
      where: { campaignId },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.campaignPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  update(id: string, dto: UpdateCampaignPostDto) {
    return this.prisma.campaignPost.update({
      where: { id },
      data: { ...dto },
    });
  }

  remove(id: string) {
    return this.prisma.campaignPost.delete({ where: { id } });
  }
}

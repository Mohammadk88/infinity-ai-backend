import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';

@Injectable()
export class MarketingCampaignService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMarketingCampaignDto, userId: string, clientId: string) {
    return this.prisma.marketingCampaign.create({
      data: {
        ...data,
        userId,
        clientId,
      },
    });
  }

  findAll(userId: string, clientId: string) {
    return this.prisma.marketingCampaign.findMany({
      where: { userId, clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, userId: string, clientId: string) {
    return this.prisma.marketingCampaign.findFirstOrThrow({
      where: { id, userId, clientId },
    });
  }

  async update(
    id: string,
    data: UpdateMarketingCampaignDto,
    userId: string,
    clientId: string,
  ) {
    const campaign = await this.findOne(id, userId, clientId);
    return this.prisma.marketingCampaign.update({
      where: { id: campaign.id },
      data,
    });
  }

  async remove(id: string, userId: string, clientId: string) {
    const campaign = await this.findOne(id, userId, clientId);
    return this.prisma.marketingCampaign.delete({ where: { id: campaign.id } });
  }
}

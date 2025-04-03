import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';

@Injectable()
export class MarketingCampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDto: CreateMarketingCampaignDto,
    clientId: string,
    userId: string,
  ) {
    // Verify social account belongs to the client
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        id: createDto.socialAccountId,
        clientId,
      },
    });

    if (!socialAccount) {
      throw new NotFoundException('Social account not found for this client');
    }

    return this.prisma.marketingCampaign.create({
      data: {
        ...createDto,
        clientId,
        userId,
        platform: createDto.platform,
      },
    });
  }

  async findAll(clientId: string) {
    return this.prisma.marketingCampaign.findMany({
      where: { clientId },
      include: {
        socialAccount: true,
        posts: true,
        performance: true,
      },
    });
  }

  async findOne(id: string, clientId: string) {
    const campaign = await this.prisma.marketingCampaign.findFirst({
      where: { id, clientId },
      include: {
        socialAccount: true,
        posts: true,
        performance: true,
      },
    });

    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async update(id: string, dto: UpdateMarketingCampaignDto, clientId: string) {
    return this.prisma.marketingCampaign.updateMany({
      where: { id, clientId },
      data: dto,
    });
  }

  async remove(id: string, clientId: string) {
    return this.prisma.marketingCampaign.deleteMany({
      where: { id, clientId },
    });
  }
}

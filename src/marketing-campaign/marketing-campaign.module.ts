import { Module } from '@nestjs/common';
import { MarketingCampaignService } from './marketing-campaign.service';
import { MarketingCampaignController } from './marketing-campaign.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MarketingCampaignService],
  controllers: [MarketingCampaignController],
  exports: [MarketingCampaignService],
})
export class MarketingCampaignModule {}

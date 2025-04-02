import { Module } from '@nestjs/common';
import { MarketingCampaignService } from './marketing-campaign.service';
import { MarketingCampaignController } from './marketing-campaign.controller';

@Module({
  providers: [MarketingCampaignService],
  controllers: [MarketingCampaignController]
})
export class MarketingCampaignModule {}

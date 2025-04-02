import { Module } from '@nestjs/common';
import { CampaignPostController } from './campaign-post.controller';
import { CampaignPostService } from './campaign-post.service';

@Module({
  controllers: [CampaignPostController],
  providers: [CampaignPostService]
})
export class CampaignPostModule {}

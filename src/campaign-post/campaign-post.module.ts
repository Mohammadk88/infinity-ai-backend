import { Module } from '@nestjs/common';
import { CampaignPostController } from './campaign-post.controller';
import { CampaignPostService } from './campaign-post.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CampaignPostController],
  providers: [CampaignPostService],
  exports: [CampaignPostService],
})
export class CampaignPostModule {}

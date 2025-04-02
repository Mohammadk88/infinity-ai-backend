import { Module } from '@nestjs/common';
import { CampaignPerformanceService } from './campaign-performance.service';
import { CampaignPerformanceController } from './campaign-performance.controller';

@Module({
  providers: [CampaignPerformanceService],
  controllers: [CampaignPerformanceController]
})
export class CampaignPerformanceModule {}

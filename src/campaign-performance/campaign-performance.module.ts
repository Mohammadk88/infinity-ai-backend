import { Module } from '@nestjs/common';
import { CampaignPerformanceService } from './campaign-performance.service';
import { CampaignPerformanceController } from './campaign-performance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CampaignPerformanceService],
  controllers: [CampaignPerformanceController],
  exports: [CampaignPerformanceService],
})
export class CampaignPerformanceModule {}

import { PartialType } from '@nestjs/swagger';
import { CreateCampaignPerformanceDto } from './create-campaign-performance.dto';

export class UpdateCampaignPerformanceDto extends PartialType(
  CreateCampaignPerformanceDto,
) {}

import { PartialType } from '@nestjs/swagger';
import { CreateMarketingCampaignDto } from './create-marketing-campaign.dto';

export class UpdateMarketingCampaignDto extends PartialType(
  CreateMarketingCampaignDto,
) {}

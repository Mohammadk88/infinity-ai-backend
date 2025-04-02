import { PartialType } from '@nestjs/swagger';
import { CreateCampaignPostDto } from './create-campaign-post.dto';

export class UpdateCampaignPostDto extends PartialType(CreateCampaignPostDto) {}

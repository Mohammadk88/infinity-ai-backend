import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignPostDto {
  @ApiProperty()
  campaignId!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ required: false })
  mediaUrl?: string;

  @ApiProperty({ required: false })
  scheduledAt?: Date;
}

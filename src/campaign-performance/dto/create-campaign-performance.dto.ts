import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignPerformanceDto {
  @ApiProperty()
  campaignId!: string;

  @ApiProperty()
  impressions!: number;

  @ApiProperty()
  clicks!: number;

  @ApiProperty()
  conversions!: number;

  @ApiProperty()
  cost!: number;

  @ApiProperty()
  metric!: string;

  @ApiProperty()
  value!: number;
}

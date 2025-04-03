import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignPerformanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  campaignId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  metric!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  value!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  impressions!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clicks!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  conversions?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  costPerClick?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  engagementRate?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}

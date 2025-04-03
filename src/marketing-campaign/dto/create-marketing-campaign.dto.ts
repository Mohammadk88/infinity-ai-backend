import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { SocialPlatform } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarketingCampaignDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty()
  @IsDateString()
  endDate!: Date;

  @ApiProperty()
  @IsNumber()
  budget!: number;

  @ApiProperty()
  @IsString()
  objective!: string;

  @ApiProperty()
  @IsString()
  socialAccountId!: string;

  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform!: SocialPlatform;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAIGenerated?: boolean;
}

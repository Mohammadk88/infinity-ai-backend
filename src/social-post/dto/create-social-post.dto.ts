import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { PostStatus } from '@prisma/client'; // Check the path
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSocialPostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  socialAccountId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    required: false,
    type: String,
    example: '2025-04-06T10:00:00Z',
  })
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAIGenerated?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentType?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tone?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  length?: 'short' | 'medium' | 'long';
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promptExtra?: string;
}

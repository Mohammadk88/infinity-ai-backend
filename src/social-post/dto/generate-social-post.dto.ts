import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum PostContentType {
  Promotional = 'promotional',
  Educational = 'educational',
  Entertaining = 'entertaining',
}

export enum PostTone {
  Formal = 'formal',
  Friendly = 'friendly',
  Creative = 'creative',
}

export enum PostLength {
  Short = 'short',
  Medium = 'medium',
  Long = 'long',
}

export class GenerateSocialPostDto {
  @ApiPropertyOptional({ enum: PostContentType })
  @IsOptional()
  @IsEnum(PostContentType)
  contentType?: PostContentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: PostTone })
  @IsOptional()
  @IsEnum(PostTone)
  tone?: PostTone;

  @ApiPropertyOptional({ enum: PostLength })
  @IsOptional()
  @IsEnum(PostLength)
  length?: PostLength;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promptExtra?: string;
}

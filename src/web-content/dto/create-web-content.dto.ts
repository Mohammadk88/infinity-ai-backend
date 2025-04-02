import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { WebContentType, WebStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWebContentDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty()
  @IsString()
  clientId!: string;

  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ enum: WebContentType, default: WebContentType.BLOG })
  @IsOptional()
  @IsEnum(WebContentType)
  type?: WebContentType = WebContentType.BLOG;

  @ApiPropertyOptional({ enum: WebStatus, default: WebStatus.DRAFT })
  @IsOptional()
  @IsEnum(WebStatus)
  status?: WebStatus = WebStatus.DRAFT;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isAIGenerated?: boolean = false;
}

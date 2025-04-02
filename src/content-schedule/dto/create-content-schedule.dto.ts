import {
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentScheduleDto {
  @ApiProperty({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsString()
  @IsNotEmpty()
  contentId!: string;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the social post',
  })
  @ValidateIf((o: CreateContentScheduleDto) => !o.webContentId)
  @IsString()
  @IsNotEmpty()
  socialPostId?: string;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the web content',
  })
  @ValidateIf((o: CreateContentScheduleDto) => !o.socialPostId)
  @IsString()
  @IsNotEmpty()
  webContentId?: string;

  @ApiProperty({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsNotEmpty()
  @IsDateString()
  publishAt!: string;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsOptional()
  @IsBoolean()
  isAIGenerated?: boolean;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsOptional()
  @IsBoolean()
  repeat?: boolean;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({
    example: '6481092126a4134979843111',
    description: 'The id of the content schedule',
  })
  @IsOptional()
  @IsString()
  status?: string;
}

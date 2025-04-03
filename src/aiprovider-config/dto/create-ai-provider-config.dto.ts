import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAIProviderConfigDto {
  @ApiProperty({ example: 'openai' })
  @IsString()
  provider!: string;

  @ApiProperty({ example: 'sk-************' })
  @IsString()
  apiKey!: string;

  @ApiProperty({ example: 'gpt-4' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 'https://api.openai.com/v1' })
  @IsOptional()
  @IsString()
  baseUrl?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

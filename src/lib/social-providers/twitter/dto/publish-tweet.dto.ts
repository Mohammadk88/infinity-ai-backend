import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PublishTweetDto {
  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Client ID of the authenticated user',
    required: false,
  })
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: 'This is my first tweet from Infinity AI System 🎉' })
  @IsNotEmpty()
  @IsString()
  content!: string;
}

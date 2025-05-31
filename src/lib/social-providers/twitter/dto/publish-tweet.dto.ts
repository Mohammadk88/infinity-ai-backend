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

  @ApiProperty({
    name: 'postId',
  })
  @IsString()
  @IsNotEmpty()
  postId!: string;
  @ApiProperty({
    name: 'socialAccountId',
  })
  @ApiProperty({ name: 'twitterAccountId' })
  @IsString()
  @IsNotEmpty()
  twitterAccountId!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Optional media URL to attach to the tweet',
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkedInPublishDto {
  @ApiProperty({
    example: '123',
    description: 'Client ID المرتبط بالحساب',
  })
  @IsNotEmpty()
  @IsString()
  socialAccountId!: string;

  @ApiProperty({ example: '456', description: 'User ID المنشئ للمحتوى' })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({
    example: 'منشور رائع من Infinity AI 💡',
    description: 'المحتوى النصي',
  })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({
    example: 'https://yourapp.com/path/image.jpg',
    description: 'رابط صورة (اختياري)',
    required: false,
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

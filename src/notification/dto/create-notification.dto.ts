import { IsString, IsOptional } from 'class-validator';
import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Notification Title' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Notification Message' })
  @IsString()
  message!: string;

  @IsString()
  @ApiProperty({ enum: [NotificationType], enumName: 'NotificationType' })
  type!: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ example: 'Click here' })
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiProperty({ example: 'social media' })
  @IsOptional()
  @IsString()
  linkType?: string;

  @ApiProperty({ example: 'Post' })
  @IsOptional()
  @IsString()
  moduleType?: string;

  @ApiProperty({ example: 'Module ID' })
  @IsOptional()
  @IsString()
  moduleId?: string;

  @ApiProperty({ example: 'Module Name' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'Client ID' })
  @IsOptional()
  @IsString()
  clientId?: string;
}

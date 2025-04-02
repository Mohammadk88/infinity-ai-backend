import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { SocialPlatform } from '@prisma/client'; // تأكد من المسار حسب مشروعك
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSocialAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SocialPlatform)
  platform!: SocialPlatform;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pageId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsDateString()
  tokenExpiresAt?: string;
}

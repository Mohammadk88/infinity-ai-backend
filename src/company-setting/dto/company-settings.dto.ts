import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: true })
  @IsString()
  email?: string;

  @ApiProperty({ required: true })
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  website?: string;

  @ApiProperty({ required: false })
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  coverImage?: string;

  @ApiProperty({ required: true })
  @IsString()
  countryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsString()
  defaultRoleId?: string;
}

import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanySettingDto {
  @ApiProperty({ example: 'support@infinity.com' })
  @IsString()
  email!: string;

  @ApiProperty({ example: '+905555555555' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Istanbul, Turkey' })
  @IsString()
  address!: string;

  @ApiProperty({ example: 'https://infinity.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'Best AI System', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  defaultRoleId!: string;

  @ApiProperty({ example: 'Europe/Istanbul' })
  @IsString()
  timezone!: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  language!: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  countryId?: string;
}

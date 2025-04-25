import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty()
  @IsString()
  companyName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  country!: string; // countryId

  @ApiProperty({ enum: ['COMPANY', 'AGENCY'] })
  @IsEnum(['COMPANY', 'AGENCY'])
  companyType!: 'COMPANY' | 'AGENCY';

  @ApiProperty()
  @IsString()
  ownerName!: string;

  @ApiProperty()
  @IsEmail()
  ownerEmail!: string;

  @ApiProperty()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @MinLength(8)
  confirmPassword!: string;
}

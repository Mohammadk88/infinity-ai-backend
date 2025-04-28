import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: ['COMPANY', 'AGENCY'] })
  @IsEnum(['COMPANY', 'AGENCY'])
  type!: 'COMPANY' | 'AGENCY';

  @ApiProperty({ example: true })
  @IsBoolean()
  verified!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}

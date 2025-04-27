import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '@prisma/client';

export class UpdateCompanyDto {
  @ApiProperty({ example: 'Infinity AI' })
  @IsString()
  name!: string;

  @ApiProperty({ enum: CompanyType, required: false })
  @IsEnum(CompanyType)
  @IsOptional()
  type?: CompanyType;
}

import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSprintDto {
  @ApiProperty({ description: 'اسم السبرنت' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'هدف السبرنت' })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiProperty({ description: 'معرف المشروع' })
  @IsUUID()
  projectId!: string;

  @ApiProperty({ description: 'تاريخ البداية' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ description: 'تاريخ النهاية' })
  @IsDateString()
  endDate!: string;
}

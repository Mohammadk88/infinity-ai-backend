import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePipelineStageDto {
  @ApiProperty({ description: 'اسم المرحلة' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'لون المرحلة (اختياري)' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'ترتيب المرحلة ضمن المسار' })
  @IsInt()
  order!: number;
}

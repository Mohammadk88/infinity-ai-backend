import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'اسم الفئة', example: 'تعليم' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'وصف الفئة (اختياري)',
    example: 'محتوى تعليمي وتدريبي',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

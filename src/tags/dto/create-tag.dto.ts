import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: 'اسم التاغ', example: 'تقنية' })
  @IsNotEmpty()
  @IsString()
  name!: string;
}

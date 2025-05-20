import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderStagesDto {
  @ApiProperty({
    description: 'قائمة معرفات المراحل بالترتيب الجديد',
    type: [String],
    example: ['stage-id-1', 'stage-id-2', 'stage-id-3'],
  })
  @IsArray()
  @IsString({ each: true })
  stageIds!: string[];
}

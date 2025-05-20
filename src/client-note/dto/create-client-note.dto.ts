import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientNoteDto {
  @ApiProperty({ description: 'محتوى الملاحظة' })
  @IsString()
  content!: string;

  @ApiProperty({ description: 'معرف العميل المرتبط بالملاحظة' })
  @IsString()
  clientId!: string;
}

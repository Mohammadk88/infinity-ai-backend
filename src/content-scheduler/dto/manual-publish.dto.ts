import { ApiProperty } from '@nestjs/swagger';

export class ManualPublishDto {
  @ApiProperty({ description: 'ID تبع المهمة المجدولة للنشر اليدوي' })
  scheduleId!: string;
}

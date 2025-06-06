import { ApiProperty } from '@nestjs/swagger';

export class CheckScheduleDto {
  @ApiProperty({
    description: 'تشغيل يدوي للتنفيذ حتى لو ما حان الوقت',
    default: false,
  })
  forceRun?: boolean = false;
  @ApiProperty({ description: 'معرف المهمة المجدولة', required: true })
  scheduleId!: string;
}

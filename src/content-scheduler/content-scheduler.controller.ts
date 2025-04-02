import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ContentSchedulerService } from './content-scheduler.service';
import { CheckScheduleDto } from './dto/check-schedule.dto';
import { ManualPublishDto } from './dto/manual-publish.dto';

@ApiTags('Content Scheduler')
@Controller('content-scheduler')
export class ContentSchedulerController {
  constructor(private readonly schedulerService: ContentSchedulerService) {}

  @Post('run-now')
  @ApiOperation({ summary: 'تشغيل الجدولة يدويًا (نشر المحتوى المجدول)' })
  runSchedulerManually() {
    return this.schedulerService.checkAndPublishScheduledContent();
  }
  @Post('check')
  @ApiOperation({ summary: 'تفقد المحتوى المجدول وتنفيذه إذا حان وقته' })
  @ApiBody({ type: CheckScheduleDto })
  check() {
    return this.schedulerService.checkAndPublish();
  }

  @Post('manual-publish')
  @ApiOperation({ summary: 'نشر مهمة مجدولة يدويًا' })
  @ApiBody({ type: ManualPublishDto })
  manualPublish(@Body() dto: ManualPublishDto) {
    return this.schedulerService.manualPublish(dto.scheduleId);
  }

  @Get()
  @ApiOperation({ summary: 'عرض كل المهام المجدولة' })
  getAll() {
    return this.schedulerService.getAllSchedules();
  }
}

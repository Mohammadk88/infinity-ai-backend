import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentSchedulerService } from './content-scheduler.service';

@ApiTags('Content Scheduler')
@Controller('content-scheduler')
export class ContentSchedulerController {
  constructor(
    private readonly contentSchedulerService: ContentSchedulerService,
  ) {}

  @Post('run-now')
  @ApiOperation({ summary: 'تشغيل الجدولة يدويًا (نشر المحتوى المجدول)' })
  runSchedulerManually() {
    return this.contentSchedulerService.checkAndPublishScheduledContent();
  }
}

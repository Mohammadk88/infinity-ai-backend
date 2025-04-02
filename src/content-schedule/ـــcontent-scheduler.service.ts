import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ContentSchedulerService {
  private readonly logger = new Logger(ContentSchedulerService.name);

  constructor(private prisma: PrismaService) {}

  // هذا الكرون بيشتغل كل دقيقة
  @Cron('*/1 * * * *')
  async handleScheduledContent() {
    const now = new Date();

    const schedules = await this.prisma.contentSchedule.findMany({
      where: {
        publishAt: {
          lte: now,
        },
        status: 'pending',
      },
      include: {
        socialPost: true,
        webContent: true,
      },
    });

    for (const schedule of schedules) {
      try {
        if (schedule.socialPost) {
          await this.publishSocialPost(schedule.id, schedule.socialPost.id);
        } else if (schedule.webContent) {
          await this.publishWebContent(schedule.id, schedule.webContent.id);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `فشل نشر المحتوى لجدولة ${schedule.id}: ${errorMessage}`,
        );
        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'failed' },
        });
      }
    }
  }

  private async publishSocialPost(scheduleId: string, postId: string) {
    // حالياً نكتفي بتحديث الحالة فقط
    await this.prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    this.logger.log(`تم نشر SocialPost بنجاح: ${postId}`);
  }

  private async publishWebContent(scheduleId: string, webContentId: string) {
    // مستقبلاً: تحديث حالة WebContent إذا بدك
    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    this.logger.log(`تم نشر WebContent بنجاح: ${webContentId}`);
  }
  @Cron('*/1 * * * *') // كل دقيقة
  async checkAndPublishScheduledContent() {
    const now = new Date();

    const schedules = await this.prisma.contentSchedule.findMany({
      where: {
        status: 'pending',
        publishAt: { lte: now },
      },
      include: {
        socialPost: true,
        webContent: true,
      },
    });

    for (const schedule of schedules) {
      try {
        if (schedule.socialPost) {
          await this.publishSocialPost(schedule.id, schedule.socialPost.id); // استخدام id من داخل الـ socialPost object
        } else if (schedule.webContent) {
          await this.publishWebContent(schedule.id, schedule.webContent.id); // استخدام id من داخل الـ webContent object
        }

        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'published' },
        });
      } catch (err) {
        this.logger.error(`فشل النشر: ${schedule.id}`, err);
        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'failed' },
        });
      }
    }
  }
}

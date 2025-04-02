import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContentSchedulerService {
  constructor(private prisma: PrismaService) {}

  @Cron('* * * * *') // كل دقيقة
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
          await this.publishSocialPost(schedule.id, schedule.socialPost.id);
        } else if (schedule.webContent) {
          await this.publishWebContent(schedule.id, schedule.webContent.id);
        }

        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'published' },
        });
      } catch (error) {
        console.error(
          `Failed to publish content for schedule ${schedule.id}:`,
          error,
        );
        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'failed' },
        });
      }
    }
  }

  private async publishSocialPost(scheduleId: string, postId: string) {
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

    console.log(`✅ تم نشر SocialPost بنجاح: ${postId}`);
  }

  private async publishWebContent(scheduleId: string, webContentId: string) {
    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    console.log(`🌐 تم نشر WebContent بنجاح: ${webContentId}`);
  }
}

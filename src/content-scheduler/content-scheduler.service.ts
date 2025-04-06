import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialPostsService } from 'src/social-post/social-post.service';
import { WebContentService } from 'src/web-content/web-content.service';

@Injectable()
export class ContentSchedulerService {
  private readonly logger = new Logger(ContentSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socialPostService: SocialPostsService,
    private readonly webContentService: WebContentService,
  ) {}

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
  async checkAndPublish() {
    const now = new Date();

    const schedules = await this.prisma.contentSchedule.findMany({
      where: {
        status: 'pending',
        OR: [{ publishAt: { lte: now } }, { publishAt: { equals: now } }],
      },
    });

    this.logger.log(`Found \${schedules.length} schedules to process`);

    for (const schedule of schedules) {
      if (schedule.socialPostId) {
        await this.socialPostService.publishSocialPost(
          schedule.id,
          schedule.socialPostId,
        );
      } else if (schedule.webContentId) {
        await this.webContentService.publishWebContent(
          schedule.id,
          schedule.webContentId,
        );
      }

      await this.prisma.contentSchedule.update({
        where: { id: schedule.id },
        data: { status: 'published' },
      });

      this.logger.log(`Published schedule: \${schedule.id}`);
    }

    return { processed: schedules.length };
  }

  async manualPublish(scheduleId: string) {
    const schedule = await this.prisma.contentSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) throw new Error('Schedule not found');

    if (schedule.socialPostId) {
      await this.socialPostService.publishSocialPost(
        schedule.id,
        schedule.socialPostId,
      );
    } else if (schedule.webContentId) {
      await this.webContentService.publishWebContent(
        schedule.id,
        schedule.webContentId,
      );
    }

    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    return { success: true };
  }

  async getAllSchedules() {
    return this.prisma.contentSchedule.findMany({
      orderBy: { publishAt: 'asc' },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPublishing() {
    const now = new Date();

    const schedules = await this.prisma.contentSchedule.findMany({
      where: {
        publishAt: { lte: now },
        status: 'pending',
        socialPost: { isNot: null },
      },
      include: {
        socialPost: {
          include: {
            postTags: true,
            postCategories: true,
          },
        },
      },
    });

    for (const schedule of schedules) {
      const post = schedule.socialPost;
      if (!post?.socialAccountId) continue;

      const socialAccount = await this.prisma.socialAccount.findUnique({
        where: { id: post.socialAccountId },
      });

      if (!socialAccount) continue;

      try {
        switch (socialAccount.platform) {
          case 'TWITTER':
            break;

          // TODO: add Facebook, LinkedIn, etc.

          default:
            throw new Error(`Unsupported platform: ${socialAccount.platform}`);
        }

        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'published' },
        });
      } catch (error) {
        console.error('Failed to publish scheduled post:', error);
        await this.prisma.contentSchedule.update({
          where: { id: schedule.id },
          data: { status: 'failed' },
        });
      }
    }
  }
}

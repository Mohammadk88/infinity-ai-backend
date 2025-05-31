import { LinkedinPublishService } from 'src/lib/social-providers/linkedin/linkedin-publish.service';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentScheduleDto } from './dto/create-content-schedule.dto';
import { UpdateContentScheduleDto } from './dto/update-content-schedule.dto';
import { Cron } from '@nestjs/schedule';
import { TwitterPublisherService } from 'src/lib/social-providers/twitter/twitter-publisher.service';
@Injectable()
export class ContentScheduleService {
  private readonly logger = new Logger(ContentScheduleService.name);

  constructor(
    private prisma: PrismaService,
    private twitterPublisher: TwitterPublisherService,
    private linkedinPublisher: LinkedinPublishService,
  ) {}

  async create(dto: CreateContentScheduleDto) {
    return this.prisma.contentSchedule.create({
      data: {
        ...dto,
        publishAt: new Date(dto.publishAt),
      },
    });
  }

  async findAll() {
    return this.prisma.contentSchedule.findMany({
      orderBy: { publishAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.contentSchedule.findUnique({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(id: string, dto: UpdateContentScheduleDto) {
    return this.prisma.contentSchedule.update({
      where: { id },
      data: {
        ...dto,
        publishAt: dto.publishAt ? new Date(dto.publishAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.contentSchedule.delete({ where: { id } });
  }

  @Cron('*/1 * * * *') // كل دقيقة
  async publishDuePosts() {
    this.logger.log('🔄 Checking for scheduled posts to publish...');

    const posts = await this.prisma.socialPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: new Date() },
      },
    });

    if (!posts.length) return;

    for (const post of posts) {
      const fullPost = await this.prisma.socialPost.findUnique({
        where: { id: post.id },
        include: {
          PostAccount: {
            include: { socialAccount: true },
          },
        },
      });

      if (!fullPost?.PostAccount.length) {
        this.logger.warn(`⚠️ No social accounts linked to post ${post.id}`);
        continue;
      }

      for (const postAccount of fullPost.PostAccount) {
        const account = postAccount.socialAccount;
        const platform = account.platform;

        try {
          switch (platform) {
            case 'TWITTER':
              await this.twitterPublisher.publish(post, account);
              break;
            case 'LINKEDIN':
              if (typeof this.linkedinPublisher.publish === 'function') {
                await this.linkedinPublisher.publish(post, account);
              } else {
                this.logger.warn('LinkedIn publish method is not implemented');
              }
              break;
            default:
              this.logger.warn(`⚠️ Platform ${platform} not yet supported`);
              continue;
          }

          this.logger.log(
            `✅ Published post ${post.id} to account ${account.id}`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          this.logger.error(
            `❌ Failed to publish post ${post.id} to account ${account.id}: ${errorMessage}`,
          );
        }
      }

      await this.prisma.socialPost.update({
        where: { id: post.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });
    }
  }
}

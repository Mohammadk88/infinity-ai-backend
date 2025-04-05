import { Module } from '@nestjs/common';
import { ContentSchedulerService } from './content-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentSchedulerController } from './content-scheduler.controller';
import { SocialPostsModule } from '../social-post/social-post.module';
import { WebContentModule } from '../web-content/web-content.module';
import { TwitterModule } from '../twitter/twitter.module';

@Module({
  imports: [SocialPostsModule, WebContentModule, TwitterModule],
  providers: [ContentSchedulerService, PrismaService],
  controllers: [ContentSchedulerController],
})
export class ContentSchedulerModule {}

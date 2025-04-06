import { Module } from '@nestjs/common';
import { ContentSchedulerService } from './content-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentSchedulerController } from './content-scheduler.controller';
import { SocialPostsModule } from '../social-post/social-post.module';
import { WebContentModule } from '../web-content/web-content.module';

@Module({
  imports: [SocialPostsModule, WebContentModule],
  providers: [ContentSchedulerService, PrismaService],
  controllers: [ContentSchedulerController],
})
export class ContentSchedulerModule {}

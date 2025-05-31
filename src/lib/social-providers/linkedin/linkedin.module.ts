import { Module } from '@nestjs/common';
import { LinkedInController } from './linkedin.controller';
import { LinkedInAuthService } from './linkedin-auth.service';
import { LinkedinPublishService } from './linkedin-publish.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocialSessionStore } from '../redis/social-session.redis';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule],
  controllers: [LinkedInController],
  providers: [LinkedInAuthService, LinkedinPublishService, SocialSessionStore],
  exports: [LinkedInAuthService, LinkedinPublishService, SocialSessionStore],
})
export class LinkedInModule {}

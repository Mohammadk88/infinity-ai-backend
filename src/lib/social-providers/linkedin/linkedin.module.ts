import { Module } from '@nestjs/common';
import { LinkedInController } from './linkedin.controller';
import { LinkedInService } from './linkedin.service';
import { LinkedInPublishService } from './linkedin-publish.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocialSessionStore } from '../redis/social-session.redis';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule],
  controllers: [LinkedInController],
  providers: [LinkedInService, LinkedInPublishService, SocialSessionStore],
})
export class LinkedInModule {}

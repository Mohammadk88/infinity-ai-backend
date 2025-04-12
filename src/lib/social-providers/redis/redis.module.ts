// redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { SocialSessionStore } from './social-session.redis';

@Module({
  providers: [RedisService, SocialSessionStore],
  exports: [SocialSessionStore, RedisService],
})
export class RedisModule {}

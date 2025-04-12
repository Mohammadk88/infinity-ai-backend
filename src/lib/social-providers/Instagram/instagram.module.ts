import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
import { PrismaService } from '../../../prisma//prisma.service';
import { RedisModule } from '../redis/redis.module';
import { SocialSessionStore } from '../redis/social-session.redis';

@Module({
  imports: [
    HttpModule,
    RedisModule, // ✅ ضروري لأن SocialSessionStore بيعتمد على RedisService
  ],
  controllers: [InstagramController],
  providers: [
    InstagramService,
    PrismaService, // ✅ تأكد أنك ضايف PrismaService إذا ما كان ضمن Module
    SocialSessionStore, // ✅ إذا ما كانت ضمن RedisModule exports
  ],
})
export class InstagramModule {}

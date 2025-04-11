import { Module } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { TwitterController } from './twitter.controller';
import { SocialAccountsModule } from '../../../social-accounts/social-accounts.module'; // ✅
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../../prisma/prisma.module'; // حسب مكانه عندك
import { RedisModule } from '../redis/redis.module'; // افترضنا عندك store جاهز

@Module({
  imports: [
    SocialAccountsModule, // ✅ ضروري لاستدعاء SocialAccountsService
    HttpModule,
    ConfigModule,
    PrismaModule,
    RedisModule,
  ],
  providers: [TwitterAuthService],
  controllers: [TwitterController],
})
export class TwitterModule {}

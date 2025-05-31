import { Module, forwardRef } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { TwitterController } from './twitter.controller';
import { SocialAccountsModule } from '../../../social-accounts/social-accounts.module'; // ✅
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../../prisma/prisma.module'; // حسب مكانه عندك
import { RedisModule } from '../redis/redis.module'; // افترضنا عندك store جاهز
import { TwitterPublisherService } from './twitter-publisher.service';

@Module({
  imports: [
    forwardRef(() => SocialAccountsModule), // ✅ ضروري لاستدعاء SocialAccountsService
    HttpModule,
    ConfigModule,
    PrismaModule,
    RedisModule,
  ],
  providers: [TwitterAuthService, TwitterPublisherService],
  controllers: [TwitterController],
  exports: [TwitterAuthService, TwitterPublisherService], // ✅ لتصدير الخدمة لاستخدامها في أماكن أخرى
})
export class TwitterModule {}

import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookController } from './facebook.controller';
import { RedisModule } from '../redis/redis.module';
import { FacebookPublisherService } from './facebook-publish.service';
import { SocialAccountsModule } from '../../../social-accounts/social-accounts.module';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    PrismaModule,
    forwardRef(() => SocialAccountsModule),
  ],
  controllers: [FacebookController],
  providers: [FacebookAuthService, FacebookPublisherService],
  exports: [FacebookAuthService],
})
export class FacebookAuthModule {}

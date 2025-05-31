import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuthService } from './oauth.service';
import { RedisModule } from '../lib/social-providers/redis/redis.module';
import { TwitterModule } from '../lib/social-providers/twitter/twitter.module';
import { FacebookAuthModule } from '../lib/social-providers/facebook/facebook-auth.module';
import { LinkedInModule } from '../lib/social-providers/linkedin/linkedin.module';
import { SocialAccountsModule } from '../social-accounts/social-accounts.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    PrismaModule,
    forwardRef(() => TwitterModule),
    forwardRef(() => FacebookAuthModule),
    forwardRef(() => LinkedInModule),
    forwardRef(() => SocialAccountsModule),
  ],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}

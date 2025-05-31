import { Module, forwardRef } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ حسب مكان مجلد prisma عندك
import { TwitterModule } from '../lib/social-providers/twitter/twitter.module';
import { OAuthModule } from '../oauth/oauth.module';
import { SocialAccountsController } from './social-accounts.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => TwitterModule), OAuthModule],
  providers: [SocialAccountsService],
  controllers: [SocialAccountsController],
  exports: [SocialAccountsService],
})
export class SocialAccountsModule {}

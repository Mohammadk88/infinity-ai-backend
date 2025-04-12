import { LinkedInModule } from './linkedin/linkedin.module';
import { TwitterModule } from './twitter/twitter.module';
import { Module } from '@nestjs/common';
import { FacebookAuthModule } from './facebook/facebook-auth.module';
import { InstagramModule } from './Instagram/instagram.module';

@Module({
  imports: [TwitterModule, FacebookAuthModule, LinkedInModule, InstagramModule], // For use within the module
  exports: [TwitterModule, FacebookAuthModule, LinkedInModule, InstagramModule], // For external use
})
export class SocialProvidersModule {}

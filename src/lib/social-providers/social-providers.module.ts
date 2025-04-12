import { LinkedInModule } from './linkedin/linkedin.module';
import { TwitterModule } from './twitter/twitter.module';
import { Module } from '@nestjs/common';
import { FacebookAuthModule } from './facebook/facebook-auth.module';

@Module({
  imports: [TwitterModule, FacebookAuthModule, LinkedInModule], // For use within the module
  exports: [TwitterModule, FacebookAuthModule, LinkedInModule], // For external use
})
export class SocialProvidersModule {}

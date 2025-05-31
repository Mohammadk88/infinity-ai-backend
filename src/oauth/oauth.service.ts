import { Injectable, NotFoundException } from '@nestjs/common';
import { FacebookAuthService } from '../lib/social-providers/facebook/facebook-auth.service';
import { TwitterAuthService } from '../lib/social-providers/twitter/twitter-auth.service';
import { LinkedInAuthService } from '../lib/social-providers/linkedin/linkedin-auth.service';
// ... أضف باقي الخدمات يلي بتدعم OAuth

@Injectable()
export class OAuthService {
  constructor(
    private readonly facebook: FacebookAuthService,
    private readonly twitter: TwitterAuthService,
    private readonly linkedin: LinkedInAuthService,
    // ... inject الباقي
  ) {}

  getHandler(platform: string) {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return this.facebook;
      case 'twitter':
        return this.twitter;
      case 'linkedin':
        return this.linkedin;
      // ... باقي المنصات
      default:
        throw new NotFoundException(`Platform ${platform} not supported`);
    }
  }
}

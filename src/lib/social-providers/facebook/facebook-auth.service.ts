import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialSessionStore } from '../redis/social-session.redis';
import axios from 'axios';

// facebook-auth.service.ts
@Injectable()
export class FacebookAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionStore: SocialSessionStore,
  ) {}
  async getAuthUrl(userId: string, clientId: string): Promise<string> {
    const appId = this.configService.get('FACEBOOK_APP_ID') as string;
    const redirectUri = this.configService.get(
      'FACEBOOK_CALLBACK_URL',
    ) as string; // لازم تكون نفس الرابط يلي فوق

    const state = `${userId}:${clientId}`;
    const authUrl =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish` +
      `&response_type=code&state=${encodeURIComponent(state)}`;

    await this.sessionStore.delete(`facebook:${state}`);
    await this.sessionStore.set(`facebook:${state}`, { userId, clientId });
    return authUrl;
  }

  async handleCallback(code: string, state: string) {
    const [userId, clientId] = state.split(':');
    const stored = await this.sessionStore.get(`facebook:${state}`);
    if (!stored) throw new UnauthorizedException('Invalid session');

    const appId = this.configService.get<string>('FACEBOOK_APP_ID');
    const appSecret = this.configService.get<string>('FACEBOOK_APP_SECRET');
    const redirectUri = this.configService.get<string>('FACEBOOK_CALLBACK_URL');

    const tokenRes = await axios.get<{ access_token: string }>(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      },
    );

    if (!tokenRes.data || typeof tokenRes.data.access_token !== 'string') {
      throw new UnauthorizedException('Invalid token response from Facebook');
    }
    const accessToken = tokenRes.data.access_token;

    interface FacebookPagesResponse {
      data: {
        access_token: string;
        category: string;
        name: string;
        id: string;
        tasks: string[];
      }[];
    }

    const pagesRes = await axios.get<FacebookPagesResponse>(
      'https://graph.facebook.com/me/accounts',
      {
        params: { access_token: accessToken },
      },
    );

    const pages = pagesRes.data.data;

    return {
      accessToken,
      pages,
      userId,
      clientId,
    };
  }
}

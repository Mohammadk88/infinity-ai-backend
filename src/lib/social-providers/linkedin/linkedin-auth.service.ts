import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { SocialSessionStore } from '../redis/social-session.redis'; // Assuming you have a RedisService that handles the connection
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service'; // Assuming you have a PrismaService for database operations
import { generateCodeVerifier } from 'src/lib/pkce.util';
@Injectable()
export class LinkedInAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private clientScope: string;
  private readonly logger = new Logger(LinkedInAuthService.name);

  constructor(
    private configService: ConfigService,
    private RedisStore: SocialSessionStore,
    private prisma: PrismaService, // Inject PrismaService
  ) {
    this.clientId = this.configService.get('LINKEDIN_CLIENT_ID') as string;
    this.clientSecret = this.configService.get(
      'LINKEDIN_CLIENT_SECRET',
    ) as string;
    this.redirectUri = this.configService.get(
      'LINKEDIN_CALLBACK_URL',
    ) as string;
    this.clientScope = this.configService.get('LINKEDIN_SCOPE') as string;
  }
  getAuthorizationUrl(): string {
    const clientId = this.clientId;
    const redirectUri = encodeURIComponent(this.redirectUri);
    const state = 'secure-random-state'; // لاحقاً يمكن توليده ديناميكياً

    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent(this.clientScope)}`;
  }
  async getAuthUrl(userId: string, clientId: string) {
    // const state = `${userId}:${clientId}`;
    const stateId = uuidv4(); // unique & unguessable
    const state = `${userId}:${clientId}:${stateId}`;

    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    // const codeChallenge = generateCodeChallenge(codeVerifier);
    console.log('getAuthUrl - codeVerifier', codeVerifier);
    console.log('getAuthUrl - userId', userId);
    console.log('getAuthUrl - state', state);
    const dataRedis = {
      codeVerifier,
      clientId,
      userId,
      createdAt: Date.now(),
    };
    await this.RedisStore.delete(`linkedin:auth:${state}`);
    await this.RedisStore.set(`linkedin:auth:${state}`, dataRedis, 300); // TTL 5 دقائق مثلًا
    console.log('linkedin:auth', state);
    const query = qs.stringify({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: this.clientScope,
    });

    return {
      url: `https://www.linkedin.com/oauth/v2/authorization?${query}`,
    };
  }

  async handleCallback(code: string, state: string) {
    // const [userId, clientId, stateId] = state.split(':');

    interface LinkedInTokenResponse {
      access_token: string;
      expires_in: number;
    }

    const tokenResponse = await axios.post<LinkedInTokenResponse>(
      'https://www.linkedin.com/oauth/v2/accessToken',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const accessToken = tokenResponse.data.access_token;

    // console.log('query params:', { state, code });
    // Remove or comment out this line since we don't have the request object
    // console.log('full url:', request.url); // إذا ضفت @Req() request
    if (!state || !code) {
      console.log('🚨 Missing state or code in callback', {
        state,
        code,
      });
      throw new BadRequestException('Missing LinkedIn OAuth state or code');
    }
    console.log('handleCallback: state', state);
    console.log('handleCallback: code', code);
    const session = await this.RedisStore.get<{
      codeVerifier: string;
      clientId: string;
      userId: string;
      createdAt: number;
    }>(`linkedin:auth:${state}`);
    console.log('session', session);
    if (!session) throw new Error('Invalid or expired session');

    const { codeVerifier, clientId, userId } = session;
    console.log({
      code,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    });
    // ⚡️ الخطوة الجديدة: نحفظ بالداتابيز
    await this.prisma.socialAccount.upsert({
      where: {
        // بفرض إنو (userId + platform) هو المفتاح المميز
        userId_platform_pageId: {
          userId,
          platform: 'LINKEDIN',
          pageId: '',
        },
      },
      update: {
        accessToken,
      },
      create: {
        userId,
        clientId,
        platform: 'LINKEDIN',
        accountName: 'LinkedIn Account',
        pageId: '', // LinkedIn ما بتعطي Page ID بهي المرحلة، منتركه فاضي
        externalId: '', // Required field for LinkedIn accounts
        accessToken,
        tokenExpiresAt: new Date(
          Date.now() + tokenResponse.data.expires_in * 1000,
        ), // Set expiration time based on LinkedIn response
      },
    });

    return { success: true, accessToken };
  }

  async postToCompanyPage(
    companyId: string,
    content: string,
    accessToken: string,
  ): Promise<void> {
    const url = 'https://api.linkedin.com/v2/ugcPosts';

    const payload = {
      author: `urn:li:organization:${companyId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
      });
    } catch (unknownError: unknown) {
      let errorMessage = '';
      if (
        unknownError &&
        typeof unknownError === 'object' &&
        'response' in unknownError &&
        unknownError.response &&
        typeof unknownError.response === 'object' &&
        'data' in unknownError.response
      ) {
        errorMessage = `❌ Error posting to company page ${companyId}: ${JSON.stringify((unknownError as { response: { data: unknown } }).response.data)}`;
      } else if (
        unknownError &&
        typeof unknownError === 'object' &&
        'message' in unknownError &&
        typeof (unknownError as { message?: unknown }).message === 'string'
      ) {
        errorMessage = `❌ Error posting to company page ${companyId}: ${(unknownError as { message: string }).message}`;
      } else {
        errorMessage = `❌ Error posting to company page ${companyId}: ${String(unknownError)}`;
      }
      this.logger.error(errorMessage);
      throw unknownError;
    }
  }

  async postToUserProfile(
    profileId: string,
    content: string,
    accessToken: string,
  ): Promise<void> {
    const url = 'https://api.linkedin.com/v2/ugcPosts';

    const payload = {
      author: `urn:li:person:${profileId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`✅ Published post to user profile ${profileId}`);
    } catch (error) {
      let errorMessage = '';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        errorMessage = (error as { response: { data: unknown } }).response
          .data as string;
      } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = String(error);
      }
      this.logger.error(
        `❌ Error posting to user profile ${profileId}`,
        errorMessage,
      );
      throw error;
    }
  }
}

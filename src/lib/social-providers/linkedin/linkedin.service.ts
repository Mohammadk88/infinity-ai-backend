import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { SocialSessionStore } from '../redis/social-session.redis'; // Assuming you have a RedisService that handles the connection
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service'; // Assuming you have a PrismaService for database operations
import { generateCodeVerifier } from 'src/lib/pkce.util';
@Injectable()
export class LinkedInService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private clientScope: string;
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
        userId_platform: {
          userId,
          platform: 'LINKEDIN',
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
        accessToken,
        tokenExpiresAt: new Date(
          Date.now() + tokenResponse.data.expires_in * 1000,
        ), // Set expiration time based on LinkedIn response
      },
    });

    return { success: true, accessToken };
  }
}

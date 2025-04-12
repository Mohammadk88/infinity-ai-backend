import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { SocialSessionStore } from '../redis/social-session.redis';
import { PrismaService } from '../../../prisma/prisma.service'; // Adjust the import path as necessary

@Injectable()
export class InstagramService {
  constructor(
    private prisma: PrismaService,
    private socialSessionRedis: SocialSessionStore,
  ) {}

  /**
   * Get Instagram OAuth authorization URL
   * @param userId The user ID requesting authorization
   * @param clientId The client ID for the Instagram app
   * @returns The OAuth URL to redirect the user to
   */
  async getAuthUrl(userId: string, clientId: string): Promise<string> {
    if (!userId || !clientId) {
      throw new BadRequestException('User ID and client ID are required');
    }

    const state = JSON.stringify({ userId, clientId });
    const stateKey = `instagram_oauth_state_${userId}`;
    await this.socialSessionRedis.set(stateKey, { userId, clientId }, 3600); // Store state for 1 hour

    const instagramClientId = process.env.INSTAGRAM_APP_ID;
    const redirectUri = process.env.INSTAGRAM_CALLBACK_URL;

    if (!instagramClientId || !redirectUri) {
      throw new BadRequestException('Instagram app configuration is missing');
    }

    return `https://api.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media,pages_show_list,instagram_basic,instagram_content_publish&response_type=code&state=${state}`;
  }

  /**
   * Handle Instagram OAuth callback
   * @param code The authorization code returned by Instagram
   * @param state The state parameter returned by Instagram
   * @returns The created social account record
   */
  async handleCallback(code: string, state: string): Promise<any> {
    if (!code || !state) {
      throw new BadRequestException(
        'Authorization code and state are required',
      );
    }

    try {
      interface StateData {
        userId: string;
        clientId: string;
      }

      const parsedState = JSON.parse(state) as StateData;
      const { userId, clientId } = parsedState;
      if (!userId || !clientId) {
        throw new BadRequestException('Invalid state parameter');
      }

      const instagramClientId = process.env.INSTAGRAM_APP_ID;
      const instagramClientSecret = process.env.INSTAGRAM_APP_SECRET;
      const redirectUri = process.env.INSTAGRAM_CALLBACK_URL;

      if (!instagramClientId || !instagramClientSecret || !redirectUri) {
        throw new BadRequestException('Instagram app configuration is missing');
      }

      const url = 'https://api.instagram.com/oauth/access_token';
      const body = new URLSearchParams({
        client_id: instagramClientId,
        client_secret: instagramClientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      });

      interface InstagramTokenResponse {
        access_token: string;
        user_id: string;
      }

      const response = await axios.post(url, body);
      const data = response.data as InstagramTokenResponse;

      if (!data.access_token || !data.user_id) {
        throw new BadRequestException('Invalid response from Instagram');
      }

      // Save the token to database
      const socialAccount = await this.prisma.socialAccount.create({
        data: {
          userId,
          clientId,
          platform: 'INSTAGRAM',
          accountName: data.user_id,
          pageId: data.user_id,
          accessToken: data.access_token,
          tokenExpiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000), // 60 days approx.
        },
      });

      return socialAccount;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Instagram OAuth error:', errorMessage);

      throw new BadRequestException(
        `Instagram authentication failed: ${errorMessage}`,
      );
    }
  }
}

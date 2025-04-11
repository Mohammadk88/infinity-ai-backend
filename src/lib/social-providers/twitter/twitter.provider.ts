import { HttpException, Injectable } from '@nestjs/common';
import { PublishOptions, PublishResult } from '../interfaces/ISocialPublisher';
import { SocialPlatform } from '../enums/social-platform.enum';
import { BaseSocialProvider } from '../base/base-social.provider';
import { TwitterAuthService } from './twitter-auth.service';

// interface TwitterResponse {
//   data: {
//     id: string;
//     text: string;
//   };
// }

@Injectable()
export class TwitterProvider extends BaseSocialProvider {
  authenticate?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly authService: TwitterAuthService) {
    super(SocialPlatform.TWITTER);
  }

  refreshAccessTokenIfNeeded(): Promise<void> {
    return Promise.resolve();
  }

  async publish(options: PublishOptions): Promise<PublishResult> {
    const { content, userId, clientId } = options;
    try {
      const tokenResult = await this.authService.getAccessToken(
        userId,
        clientId,
      );

      if (!tokenResult) {
        throw new HttpException('No linked Twitter account found.', 400);
      }

      // Instead of using the token directly, we'll use the Twitter auth service's
      // publish method which properly handles OAuth 1.0a authentication
      const tweetResult = await this.authService.publish(
        userId,
        clientId || '',
        content,
      );

      // Create a response structure that matches what we expect
      const response = {
        data: {
          data: {
            id: tweetResult.tweetId,
            text: tweetResult.text || content,
          },
        },
      };

      return {
        success: true,
        externalId: response.data.data.id,
        postUrl: `https://twitter.com/user/status/${response.data.data.id}`,
        rawResponse: response.data,
      };
    } catch (err: unknown) {
      const error = err as {
        response?: {
          status?: number;
          data?: {
            error?: string;
          };
        };
        message?: string;
      };

      const status = error?.response?.status ?? 500;
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Twitter publish failed';

      console.error('Twitter publish error:', error?.response?.data || error);

      throw new HttpException(message, status);
    }
  }
}

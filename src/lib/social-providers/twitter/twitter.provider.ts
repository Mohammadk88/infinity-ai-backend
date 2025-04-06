import { HttpException, Injectable } from '@nestjs/common';
import { PublishOptions, PublishResult } from '../interfaces/ISocialPublisher';
import { SocialPlatform } from '../enums/social-platform.enum';
import { BaseSocialProvider } from '../base/base-social.provider';
import axios from 'axios';
import AxiosError from 'axios';
import { TwitterAuthService } from './twitter-auth.service';

interface TwitterResponse {
  data: {
    id: string;
    text: string;
  };
}

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
    const { content } = options;
    const accessToken = this.authService.getAccessToken();

    const url = 'https://api.twitter.com/2/tweets';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post<TwitterResponse>(
        url,
        { text: content },
        { headers },
      );

      return {
        success: true,
        externalId: response.data.data.id,
        postUrl: `https://twitter.com/user/status/${response.data.data.id}`,
        rawResponse: response.data,
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Twitter publish error:', (await err).data);

        throw new HttpException(
          'Failed to publish tweet on Twitter',
          (await err).status ?? 500,
        );
      } else {
        console.error('Unknown error publishing to Twitter:', err);
        throw new HttpException('Failed to publish tweet on Twitter', 500);
      }
    }
  }
}

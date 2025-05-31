import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SocialPost, SocialAccount } from '@prisma/client';

interface TwitterResponse {
  data: {
    id: string;
    text: string;
  };
}

@Injectable()
export class TwitterPublisherService {
  private readonly logger = new Logger(TwitterPublisherService.name);

  async publish(post: SocialPost, account: SocialAccount): Promise<void> {
    const accessToken = account.accessToken;
    // const accessSecret = account.accessSecret as string;
    const content = post.content;

    try {
      const response = await axios.post<TwitterResponse>(
        'https://api.twitter.com/2/tweets',
        { text: content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response?.data || typeof response.data !== 'object') {
        this.logger.error('Tweet response missing ID', response.data);
        throw new Error('Failed to post tweet');
      }

      if (response.status !== 201) {
        this.logger.error('Failed to post tweet', response.data);
        throw new Error('Failed to post tweet');
      }

      this.logger.log(
        `✅ Tweeted post ${post.id} → tweetId: ${response.data.data?.id}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to tweet post ${post.id} for account ${account.id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SocialPost, SocialAccount } from '@prisma/client';
@Injectable()
export class FacebookPublisherService {
  private readonly logger = new Logger(FacebookPublisherService.name);

  async publish(post: SocialPost, account: SocialAccount): Promise<void> {
    const { accessToken, pageId } = account;
    const content = post.content;

    if (!accessToken || !pageId) {
      this.logger.warn(
        `⚠️ Missing Facebook credentials for account ${account.id}`,
      );
      return;
    }

    try {
      let response: any;

      if (post.mediaUrl) {
        // 📹 نشر فيديو
        response = await axios.post(
          `https://graph.facebook.com/v18.0/${pageId}/videos`,
          {
            file_url: post.mediaUrl,
            description: content,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        // 📝 نشر بوست عادي
        response = await axios.post(
          `https://graph.facebook.com/v18.0/${pageId}/feed`,
          {
            message: content,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }

      // Axios automatically throws errors for non-2xx responses
      // If we reach this point, the request was successful
      type FacebookResponse = {
        data?: {
          id?: string;
        };
      };
      const fbPostId =
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        typeof (response as FacebookResponse).data?.id === 'string'
          ? (response as FacebookResponse).data!.id
          : 'unknown';
      this.logger.log(
        `✅ Posted on Facebook: post ${post.id} → account ${account.id}, Facebook post ID: ${fbPostId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Facebook post error for post ${post.id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}

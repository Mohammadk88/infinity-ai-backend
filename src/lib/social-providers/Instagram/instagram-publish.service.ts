import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SocialPost, SocialAccount } from '@prisma/client';

@Injectable()
export class InstagramPublisherService {
  private readonly logger = new Logger(InstagramPublisherService.name);

  async publish(post: SocialPost, account: SocialAccount): Promise<void> {
    const { accessToken, pageId } = account;
    const content = post.content;
    const mediaUrl = post.mediaUrl;

    if (!accessToken || !pageId) {
      this.logger.warn(
        `⚠️ Missing Instagram credentials for account ${account.id}`,
      );
      return;
    }

    if (!mediaUrl) {
      this.logger.warn(
        `⚠️ Instagram post requires mediaUrl for video or image`,
      );
      return;
    }

    try {
      // 1️⃣ إنشاء media container
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/media`,
        {
          caption: content,
          video_url: mediaUrl,
          media_type: 'VIDEO',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const creationId =
        mediaResponse.data &&
        typeof mediaResponse.data === 'object' &&
        mediaResponse.data !== null &&
        'id' in mediaResponse.data &&
        typeof mediaResponse.data.id === 'string'
          ? mediaResponse.data.id
          : null;

      if (!creationId) {
        this.logger.error(`❌ Failed to get Instagram media creation ID`);
        throw new Error('Instagram media creation failed');
      }

      // 2️⃣ نشر الفيديو (Reel)
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/media_publish`,
        {
          creation_id: creationId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const igPostId =
        publishResponse.data &&
        typeof publishResponse.data === 'object' &&
        publishResponse.data !== null &&
        'id' in publishResponse.data &&
        typeof publishResponse.data.id === 'string'
          ? publishResponse.data.id
          : 'unknown';

      this.logger.log(
        `✅ Posted on Instagram: post ${post.id} → account ${account.id}, IG post ID: ${igPostId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Instagram post error for post ${post.id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}

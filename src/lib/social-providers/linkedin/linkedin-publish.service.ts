import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SocialPost, SocialAccount } from '@prisma/client';

interface LinkedInRegisterUploadResponse {
  value: {
    uploadMechanism: {
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
        uploadUrl: string;
      };
    };
    asset: string;
  };
}

@Injectable()
export class LinkedinPublishService {
  private readonly logger = new Logger(LinkedinPublishService.name);

  async publish(post: SocialPost, account: SocialAccount): Promise<void> {
    const { accessToken, accountType, pageId } = account;
    const content = post.content;
    const mediaUrl = post.mediaUrl;

    if (!accessToken || !pageId) {
      this.logger.warn(
        `⚠️ Missing LinkedIn credentials for account ${account.id}`,
      );
      return;
    }

    const authorUrn =
      accountType === 'COMPANY'
        ? `urn:li:organization:${pageId}`
        : `urn:li:person:${pageId}`;

    try {
      let shareMedia: any[] = [];

      if (mediaUrl) {
        // 1. Register upload session
        const registerRes = await axios.post(
          'https://api.linkedin.com/v2/assets?action=registerUpload',
          {
            registerUploadRequest: {
              owner: authorUrn,
              recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
              serviceRelationships: [
                {
                  identifier: 'urn:li:userGeneratedContent',
                  relationshipType: 'OWNER',
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
          },
        );

        const responseData = registerRes.data as LinkedInRegisterUploadResponse;
        const uploadUrl =
          responseData.value.uploadMechanism[
            'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
          ].uploadUrl;
        const asset = responseData.value.asset;

        // 2. Upload video binary
        const videoBinary = await axios.get(mediaUrl, {
          responseType: 'arraybuffer',
        });
        await axios.put(uploadUrl, videoBinary.data, {
          headers: { 'Content-Type': 'application/octet-stream' },
        });

        shareMedia = [
          {
            status: 'READY',
            description: { text: content },
            media: asset,
            title: { text: 'Uploaded video' },
          },
        ];
      }

      // 3. Create UGC Post
      await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: content },
              shareMediaCategory: mediaUrl ? 'VIDEO' : 'NONE',
              media: shareMedia,
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(
        `✅ Posted on LinkedIn: post ${post.id} → account ${account.id}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ LinkedIn post error for post ${post.id}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}

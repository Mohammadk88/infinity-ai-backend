import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

type LinkedInUserInfo = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
};
@Injectable()
export class LinkedInPublishService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly axios = axios;

  async publish(socialAccountId: string, content: string, mediaUrl?: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: socialAccountId },
    });

    if (!account || account.platform !== 'LINKEDIN' || !account.accessToken) {
      throw new Error('LinkedIn account not found or access token missing');
    }

    const accessToken = account.accessToken;

    // ✅ جلب بيانات المستخدم من endpoint الجديد
    const userInfo = await this.axios.get<LinkedInUserInfo>(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!userInfo.data || !userInfo.data.sub) {
      throw new Error('Failed to retrieve user information');
    }
    const author = `urn:li:person:${userInfo.data.sub}`;

    // ✅ إذا في صورة، ارفعها وأخذ URN
    let media: { status: 'READY'; media: string }[] = [];

    if (mediaUrl) {
      const asset = await this.uploadImageAndGetUrn(
        accessToken,
        author,
        mediaUrl,
      );
      media = [
        {
          status: 'READY',
          media: asset,
        },
      ];
    }

    // ✅ إنشاء البوست
    const body = {
      author,
      lifecycleState: 'PUBLISHED',
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: media.length ? 'IMAGE' : 'NONE',
          media,
        },
      },
    };

    const res = await this.axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );

    return {
      success: true,
      postId: res.data,
    };
  }

  async uploadImageAndGetUrn(
    accessToken: string,
    author: string,
    mediaUrl: string,
  ): Promise<string> {
    // STEP 1: Register Upload
    const registerRes = await axios.post<{
      value: {
        uploadMechanism: {
          'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
            uploadUrl: string;
          };
        };
        asset: string;
      };
    }>(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: author,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const uploadUrl =
      registerRes.data.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].uploadUrl;

    const asset = registerRes.data.value.asset;

    // STEP 2: Get Image
    const imageRes = await axios.get<ArrayBuffer>(mediaUrl, {
      responseType: 'arraybuffer',
    });

    // STEP 3: Upload Image
    await axios.put(uploadUrl, imageRes.data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'image/jpeg',
        'Content-Length': imageRes.data.byteLength,
      },
    });

    return asset;
  }
}

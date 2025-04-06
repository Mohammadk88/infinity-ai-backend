import { SocialPlatform } from '../enums/social-platform.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PublishOptionsDto {
  @ApiProperty({ description: 'محتوى المنشور' })
  content!: string;

  @ApiProperty({ description: 'رابط الوسائط (صور، فيديوهات، إلخ)' })
  mediaUrls?: string[];

  @ApiProperty({ description: 'توقيت نشر المنشور' })
  scheduledAt?: Date;

  @ApiProperty({ description: 'رمز الوصول للمنصة' })
  accessToken!: string;

  @ApiProperty({ description: 'رمز التحديث (إذا كان مطلوبًا)' })
  refreshToken?: string;

  @ApiProperty({ description: 'المنصة الاجتماعية' })
  platform!: SocialPlatform;

  @ApiProperty({ description: 'معلومات إضافية' })
  extra?: Record<string, any>; // أي معلومات إضافية خاصة بالمزوّد
}

export interface PublishOptions {
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  accessToken: string;
  refreshToken?: string;
  platform: SocialPlatform;
  pageId?: string; // معرف الصفحة أو الحساب على المنصة
  extra?: Record<string, any>;
  text: string;
}

export interface PublishResult {
  success: boolean;
  postUrl?: string;
  externalId?: string;
  rawResponse?: any;
  error?: string;
  message?: string;
  postId?: string;
}

export interface ISocialPublisher {
  publish(options: PublishOptions): Promise<PublishResult>;
}

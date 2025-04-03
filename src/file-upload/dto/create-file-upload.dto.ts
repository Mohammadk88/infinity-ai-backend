import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileType, SocialPlatform } from '@prisma/client';

export class CreateFileUploadDto {
  @ApiProperty({ description: 'اسم الملف' })
  name!: string;

  @ApiProperty({ description: 'رابط الملف' })
  url!: string;

  @ApiProperty({ enum: [FileType], description: 'نوع الملف' })
  type!: FileType;

  @ApiProperty({ description: 'حجم الملف بالبايت' })
  size!: number;

  @ApiPropertyOptional({ description: 'خصائص إضافية للملف', type: Object })
  properties?: object;

  @ApiPropertyOptional({ description: 'تصنيف الذكاء الاصطناعي' })
  aiCategory?: string;

  @ApiPropertyOptional({ description: 'وصف الذكاء الاصطناعي' })
  aiDescription?: string;

  @ApiPropertyOptional({ description: 'ملخص من الذكاء الاصطناعي' })
  aiSummary?: string;

  @ApiPropertyOptional({
    description: 'كلمات مفتاحية من الذكاء الاصطناعي',
    type: Object,
  })
  aiKeywords?: object;

  @ApiPropertyOptional({
    description: 'تم توليده من الذكاء الاصطناعي؟',
    default: false,
  })
  aiGenerated?: boolean;

  @ApiPropertyOptional({ description: 'معرف المنشور المرتبط' })
  postId?: string;

  @ApiPropertyOptional({ description: 'معرف المحتوى الويب المرتبط' })
  webContentId?: string;

  @ApiPropertyOptional({
    enum: SocialPlatform,
    description: 'المنصة المرتبط بها الملف',
  })
  platform?: SocialPlatform;
}

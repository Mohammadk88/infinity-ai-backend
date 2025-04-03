import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignPostDto {
  @ApiProperty({ description: 'عنوان المنشور' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'محتوى المنشور' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    description: 'رابط أو مسار الوسائط (صورة أو فيديو)',
    required: false,
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiProperty({ description: 'معرّف الحملة التسويقية' })
  @IsUUID()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({ required: false })
  scheduledAt?: Date;
}

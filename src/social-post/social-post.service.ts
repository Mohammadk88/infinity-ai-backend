import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { UpdateSocialPostDto } from './dto/update-social-post.dto';
import { AIGeneratorService } from 'src/ai-generator/ai-generator.service';
import { buildPostPrompt } from 'src/ai-generator/utils/build-post-prompt';
import { GenerateSocialPostDto } from './dto/generate-social-post.dto';

@Injectable()
export class SocialPostsService {
  private readonly logger = new Logger(SocialPostsService.name);
  constructor(
    private prisma: PrismaService,
    private aiGeneratorService: AIGeneratorService,
  ) {}
  private buildPostPrompt(dto: CreateSocialPostDto): string {
    let basePrompt = `اكتب منشورًا مميزًا عن: ${dto.content}`;
    if (dto.mediaUrl) basePrompt += ` - الوسائط: ${dto.mediaUrl}`;
    return basePrompt;
  }
  async create(dto: CreateSocialPostDto, userId: string) {
    if (dto.isAIGenerated) {
      const prompt = buildPostPrompt({
        contentType: dto.contentType,
        language: dto.language,
        tone: dto.tone,
        length: dto.length,
        promptExtra: dto.promptExtra,
      });
      dto.content = await this.aiGeneratorService.generateSocialPostContent(
        prompt,
        userId,
      );
    }
    const { tagIds, categoryIds, ...rest } = dto;

    const post = await this.prisma.socialPost.create({
      data: {
        ...rest,
        postTags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
        postCategories: categoryIds
          ? {
              create: categoryIds.map((catId) => ({
                category: { connect: { id: catId } },
              })),
            }
          : undefined,
      },
    });
    if (dto.scheduledAt) {
      await this.prisma.contentSchedule.create({
        data: {
          socialPostId: post.id,
          publishAt: new Date(dto.scheduledAt),
          isAIGenerated: dto.isAIGenerated ?? false,
          status: 'pending',
        },
      });
    }

    return post;
  }

  async findAll(userId: string) {
    return this.prisma.socialPost.findMany({
      where: { userId },
      include: { postTags: true, postCategories: true },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.socialPost.findUnique({
      where: { id },
      include: { postTags: true, postCategories: true },
    });

    if (!post) throw new NotFoundException('Social post not found');
    return post;
  }

  async update(id: string, dto: UpdateSocialPostDto) {
    const { tagIds, categoryIds, ...rest } = dto;

    // حذف القديم ثم إضافة الجديد (بسيطة حالياً)
    await this.prisma.postTag.deleteMany({ where: { postId: id } });
    await this.prisma.postCategory.deleteMany({ where: { postId: id } });

    return this.prisma.socialPost.update({
      where: { id },
      data: {
        ...rest,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        postTags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
        postCategories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.socialPost.delete({ where: { id } });
  }

  async generateOnly(dto: GenerateSocialPostDto, userId: string) {
    console.log('DTO RECEIVED:', dto);
    const prompt = buildPostPrompt({
      contentType: dto.contentType,
      language: dto.language,
      tone: dto.tone,
      length: dto.length,
      promptExtra: dto.promptExtra,
    });
    console.log('prompt RECEIVED:', prompt);
    const content = await this.aiGeneratorService.generateSocialPostContent(
      prompt,
      userId,
    );

    return {
      prompt,
      content,
    };
  }
  async publishSocialPost(scheduleId: string, postId: string) {
    await this.prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    this.logger.log(`✅ تم نشر SocialPost بنجاح: ${postId}`);
  }
}

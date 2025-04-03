import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWebContentDto } from './dto/create-web-content.dto';
import { UpdateWebContentDto } from './dto/update-web-content.dto';

@Injectable()
export class WebContentService {
  private readonly logger = new Logger(WebContentService.name);
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebContentDto, clientId: string, userId: string) {
    return this.prisma.webContent.create({
      data: {
        ...dto,
        clientId,
        userId,
        files: {
          connect: dto.fileIds?.map((id) => ({ id })) || [],
        },
      },
    });
  }

  async findAll(clientId: string) {
    return this.prisma.webContent.findMany({
      where: {
        clientId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.webContent.findUnique({
      where: { id },
      include: { files: true },
    });
    if (!content) throw new NotFoundException('المحتوى غير موجود');
    return content;
  }

  async update(id: string, dto: UpdateWebContentDto) {
    return this.prisma.webContent.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.webContent.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async publishWebContent(scheduleId: string, webContentId: string) {
    await this.prisma.webContent.update({
      where: { id: webContentId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await this.prisma.contentSchedule.update({
      where: { id: scheduleId },
      data: { status: 'published' },
    });

    this.logger.log(`🌐 تم نشر WebContent بنجاح: ${webContentId}`);
  }
}

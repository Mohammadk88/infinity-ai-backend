import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebContentTagsService {
  constructor(private prisma: PrismaService) {}

  async findTagsByWebContent(webContentId: string) {
    return this.prisma.webContentTag.findMany({
      where: { webContentId },
      include: { tag: true },
    });
  }
}

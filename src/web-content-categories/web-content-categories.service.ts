import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebContentCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findCategoriesByWebContent(webContentId: string) {
    return this.prisma.webContentCategory.findMany({
      where: { webContentId },
      include: { category: true },
    });
  }
}

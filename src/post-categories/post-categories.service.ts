import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findCategoriesByPost(postId: string) {
    return this.prisma.postCategory.findMany({
      where: { postId },
      include: { category: true },
    });
  }
}

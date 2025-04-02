import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostTagsService {
  constructor(private prisma: PrismaService) {}

  async findTagsByPost(postId: string) {
    return this.prisma.postTag.findMany({
      where: { postId },
      include: { tag: true },
    });
  }
}

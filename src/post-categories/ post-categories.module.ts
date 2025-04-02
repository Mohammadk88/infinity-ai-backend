import { Module } from '@nestjs/common';
import { PostCategoriesService } from './post-categories.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PostCategoriesService, PrismaService],
  exports: [PostCategoriesService],
})
export class PostCategoriesModule {}

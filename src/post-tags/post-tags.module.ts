import { Module } from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PostTagsService, PrismaService],
  exports: [PostTagsService],
})
export class PostTagsModule {}

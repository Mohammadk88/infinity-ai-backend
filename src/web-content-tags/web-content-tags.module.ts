import { Module } from '@nestjs/common';
import { WebContentTagsService } from './web-content-tags.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [WebContentTagsService, PrismaService],
  exports: [WebContentTagsService],
})
export class WebContentTagsModule {}

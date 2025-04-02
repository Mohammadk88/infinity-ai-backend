import { Module } from '@nestjs/common';
import { WebContentCategoriesService } from './web-content-categories.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [WebContentCategoriesService, PrismaService],
  exports: [WebContentCategoriesService],
})
export class WebContentCategoriesModule {}

// src/web-content/web-content.module.ts

import { Module } from '@nestjs/common';
import { WebContentService } from './web-content.service';
import { WebContentController } from './web-content.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WebContentController],
  providers: [WebContentService, PrismaService],
})
export class WebContentModule {}

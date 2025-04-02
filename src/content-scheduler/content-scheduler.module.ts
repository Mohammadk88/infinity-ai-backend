import { Module } from '@nestjs/common';
import { ContentSchedulerService } from './content-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ContentSchedulerService, PrismaService],
})
export class ContentSchedulerModule {}

import { Module } from '@nestjs/common';
import { ContentSchedulerService } from './content-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentSchedulerController } from './content-scheduler.controller';

@Module({
  providers: [ContentSchedulerService, PrismaService],
  controllers: [ContentSchedulerController],
})
export class ContentSchedulerModule {}

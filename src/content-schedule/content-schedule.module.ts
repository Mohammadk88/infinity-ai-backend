import { Module } from '@nestjs/common';
import { ContentScheduleService } from './content-schedule.service';
import { ContentScheduleController } from './content-schedule.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ContentScheduleController],
  providers: [ContentScheduleService, PrismaService],
})
export class ContentScheduleModule {}

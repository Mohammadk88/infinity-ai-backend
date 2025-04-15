import { Module } from '@nestjs/common';
import { PointEventService } from './point-event.service';
import { PointEventController } from './point-event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PointEventService],
  controllers: [PointEventController],
})
export class PointEventModule {}

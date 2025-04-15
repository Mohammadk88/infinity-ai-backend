import { Module } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { UserPointController } from './user-point.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserPointService],
  controllers: [UserPointController],
})
export class UserPointModule {}

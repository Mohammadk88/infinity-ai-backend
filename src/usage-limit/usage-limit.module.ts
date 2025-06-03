import { Module } from '@nestjs/common';
import { UsageLimitService } from './usage-limit.service';
import { UsageLimitController } from './usage-limit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsageLimitController],
  providers: [UsageLimitService],
  exports: [UsageLimitService],
})
export class UsageLimitModule {}

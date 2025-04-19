import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { ReferralService } from 'src/referral/referral.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MeController],
  providers: [MeService, PrismaService, ReferralService],
  exports: [MeService],
})
export class MeModule {}

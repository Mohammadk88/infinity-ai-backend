import { Module } from '@nestjs/common';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [PrismaModule, CommissionModule],
  controllers: [ReferralController],
  providers: [ReferralService, PrismaService],
})
export class ReferralModule {}

import { Module } from '@nestjs/common';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommissionModule } from '../commission/commission.module';
import { UserPointModule } from 'src/user-point/user-point.module';
import { UserPointService } from 'src/user-point/user-point.service';
import { CommissionService } from 'src/commission/commission.service';

@Module({
  imports: [PrismaModule, UserPointModule, CommissionModule],
  controllers: [ReferralController],
  providers: [
    ReferralService,
    PrismaService,
    UserPointService,
    CommissionService,
  ],
  exports: [ReferralService],
})
export class ReferralModule {}

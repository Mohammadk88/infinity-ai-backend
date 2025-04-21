import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { ReferralModule } from 'src/referral/referral.module';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [ReferralModule, PrismaModule],
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService],
})
export class MeModule {}

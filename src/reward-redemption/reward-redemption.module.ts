import { Module } from '@nestjs/common';
import { RewardRedemptionService } from './reward-redemption.service';
import { RewardRedemptionController } from './reward-redemption.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RewardRedemptionService],
  controllers: [RewardRedemptionController],
})
export class RewardRedemptionModule {}

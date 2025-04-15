import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RewardRedemptionService } from './reward-redemption.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reward Redemptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardRedemptionController {
  constructor(private readonly rewardService: RewardRedemptionService) {}

  @Post('redeem/:awardId')
  @ApiOperation({ summary: 'Redeem an award using points' })
  redeem(@CurrentUser('id') userId: string, @Param('awardId') awardId: string) {
    return this.rewardService.redeem(userId, awardId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my redemption history' })
  getMyRedemptions(@CurrentUser('id') userId: string) {
    return this.rewardService.findUserRedemptions(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all redemptions (admin)' })
  findAll() {
    return this.rewardService.findAll();
  }
}

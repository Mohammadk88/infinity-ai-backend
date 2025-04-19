import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ReferralService } from './referral.service';
import { ReferralResponseDto } from './dto/referred-user.dto';

// src/modules/referral/referral.controller.ts
@ApiTags('Affiliate')
@ApiBearerAuth()
@Controller('affiliate/referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ type: [ReferralResponseDto] })
  async getMyReferrals(@CurrentUser('id') userId: string) {
    return this.referralService.getReferralsForAffiliate(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('earnings')
  async getEarningsSummary(@CurrentUser('id') userId: string) {
    return this.referralService.getEarningsForAffiliate(userId);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ReferralService } from 'src/referral/referral.service';

@Controller('me')
export class MeController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('affiliates/referrals')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my referrals list' })
  getUserReferrals(@CurrentUser() user: { id: string }) {
    return this.referralService.getMyReferrals(user.id);
  }
}

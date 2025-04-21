import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ReferralService } from 'src/referral/referral.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('me')
export class MeController {
  constructor(
    private readonly referralService: ReferralService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { id: string }) {
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { affiliate: true },
    });
    return {
      ...fullUser,
      referralCode: fullUser?.affiliate?.referralCode || null,
    };
  }
  @Get('affiliates/referrals')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my referrals list' })
  getUserReferrals(@CurrentUser() user: { affiliateId: string }) {
    return this.referralService.getMyReferrals(user.affiliateId);
  }
}

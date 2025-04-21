// referral.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
import { CommissionType } from '../commission/dto/create-commission.dto';
import { UserPointService } from '../user-point/user-point.service';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    private commissionService: CommissionService,
    private userPointService: UserPointService, // Inject UserPointService
  ) {}

  /**
   * Handles referral logic during user registration
   * @param referredUserId string - The new user's ID
   * @param referralCode string - The referral code provided
   * @param options { sourceId?: string, rewardUser?: boolean, campaign?: string }
   */
  async handleReferralOnRegistration(
    referredUserId: string,
    referralCode: string,
    options?: { sourceId?: string; rewardUser?: boolean; campaign?: string },
  ) {
    // 1. Find affiliate by referral code
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { referralCode },
    });
    if (!affiliate) {
      throw new BadRequestException('Invalid referral code');
    }
    // 2. Create Referral record
    const referral = await this.prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId,
        status: 'pending',
        sourceId: options?.sourceId,
        // campaign: options?.campaign, // Uncomment if campaign field exists
      },
    });
    // 3. Create Commission entry for affiliate
    // TODO: Fetch commission amount from config/settings if needed
    await this.commissionService.createCommission(affiliate.userId, {
      type: CommissionType.REFERRAL,
      amount: 10, // Default/fixed value for now
      currency: 'USD',
      source: referral.id,
    });
    // 4. Optionally, create a reward/bonus for the new user
    if (options?.rewardUser) {
      // Example: reward 10 points to the new user
      try {
        await this.userPointService.addPoints(referredUserId, 10);
      } catch {
        // Optionally log or ignore if user point record does not exist
      }
    }
    // 5. Return referral info
    return referral;
  }

  async getReferralsForAffiliate(userId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate account not found');
    }

    return this.prisma.referral.findMany({
      where: { affiliateId: affiliate.id },
      include: {
        referredUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { referredAt: 'desc' },
    });
  }
  async getEarningsForAffiliate(userId: string) {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: {
        userId: userId, // أو ببساطة: userId
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate account not found');
    }
    return {
      totalApprovedEarnings: affiliate.totalApprovedEarnings,
      totalPendingEarnings: affiliate.totalPendingEarnings,
      totalRejectedEarnings: affiliate.totalRejectedEarnings,
      totalConvertedReferrals: affiliate.totalConvertedReferrals,
      totalApprovedReferrals: affiliate.totalApprovedReferrals,
      totalRejectedReferrals: affiliate.totalRejectedReferrals,
    };
  }
  getMyReferrals(userId: string) {
    return this.prisma.referral.findMany({
      where: {
        affiliateId: userId,
      },
      include: {
        referredUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { referredAt: 'desc' },
    });
  }
}

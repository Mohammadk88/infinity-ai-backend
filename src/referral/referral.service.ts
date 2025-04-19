// referral.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

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
      where: { userId },
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
        referredUserId: userId,
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

// src/modules/affiliate/affiliate.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { AffiliateStatsDto } from './dto/affiliate-stats.dto';
import { Affiliate } from '@prisma/client';

@Injectable()
export class AffiliateService {
  constructor(private readonly prisma: PrismaService) {}

  async createAffiliateForUser(userId: string, createdBy: string) {
    const referralCode = this.generateReferralCode();

    return this.prisma.affiliate.create({
      data: {
        userId,
        referralCode,
        createdBy,
      },
    });
  }

  async getAffiliateStats(userId: string): Promise<AffiliateStatsDto> {
    const affiliate = await this.prisma.affiliate.findFirst({
      where: { userId },
    });

    if (!affiliate) throw new NotFoundException('Affiliate not found');

    return {
      referralCode: affiliate.referralCode,
      totalReferrals: affiliate.totalReferrals,
      totalEarnings: affiliate.totalEarnings,
      totalApprovedReferrals: affiliate.totalApprovedReferrals,
      totalPendingReferrals: affiliate.totalPendingReferrals,
      totalRejectedReferrals: affiliate.totalRejectedReferrals,
      totalApprovedEarnings: affiliate.totalApprovedEarnings,
      tier: affiliate.totalReferrals > 50 ? 'Gold' : 'Basic',
    };
  }

  private generateReferralCode(): string {
    return uuidv4().split('-')[0].toUpperCase(); // مثال: 7A9C2F
  }
  async requestAffiliateAccount(userId: string): Promise<Affiliate> {
    const existing = await this.prisma.affiliate.findFirst({
      where: { userId },
    });

    if (existing)
      throw new ConflictException('You already have an affiliate account.');

    const referralCode = this.generateReferralCode();

    const affiliate = await this.prisma.affiliate.create({
      data: {
        userId,
        referralCode,
        createdBy: userId,
      },
    });

    // Optionally: update user.affiliateId
    await this.prisma.user.update({
      where: { id: userId },
      data: { affiliateId: affiliate.id },
    });

    return affiliate;
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RewardRedemptionService {
  constructor(private readonly prisma: PrismaService) {}

  async redeem(userId: string, awardId: string) {
    const award = await this.prisma.award.findUnique({
      where: { id: awardId },
    });
    if (!award || !award.isActive) {
      throw new NotFoundException('Award not found or inactive');
    }

    const userPoint = await this.prisma.userPoint.findUnique({
      where: { userId },
    });
    if (!userPoint || userPoint.points < award.pointsCost) {
      throw new BadRequestException('Insufficient points');
    }

    await this.prisma.userPoint.update({
      where: { userId },
      data: {
        points: { decrement: award.pointsCost },
        redeemedPoints: { increment: award.pointsCost },
      },
    });

    return this.prisma.rewardRedemption.create({
      data: {
        userId,
        awardId,
      },
    });
  }

  async findAll() {
    return this.prisma.rewardRedemption.findMany({
      include: { award: true, user: true },
    });
  }

  async findUserRedemptions(userId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { userId },
      include: { award: true },
    });
  }
}

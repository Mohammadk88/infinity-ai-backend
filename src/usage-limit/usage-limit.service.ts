import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsageType } from '@prisma/client';

@Injectable()
export class UsageLimitService {
  constructor(private prisma: PrismaService) {}

  async getUserLimits(userId: string) {
    return this.prisma.usageLimit.findMany({
      where: { userId },
    });
  }

  async getLimit(userId: string, type: UsageType) {
    return this.prisma.usageLimit.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  }

  async increment(userId: string, type: UsageType, amount = 1) {
    const usage = await this.getLimit(userId, type);
    if (!usage) throw new NotFoundException('Limit not found');

    if (usage.used + amount > usage.limit) {
      throw new ForbiddenException(`Limit exceeded for ${type}`);
    }

    return this.prisma.usageLimit.update({
      where: {
        userId_type: { userId, type },
      },
      data: {
        used: { increment: amount },
      },
    });
  }

  async resetLimitsIfNeeded(userId: string) {
    const now = new Date();
    return this.prisma.usageLimit.updateMany({
      where: {
        userId,
        resetAt: { lte: now },
      },
      data: {
        used: 0,
        resetAt: this.getNextResetDate(),
      },
    });
  }

  getNextResetDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
}

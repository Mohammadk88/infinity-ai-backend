import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Commission } from '@prisma/client';
import { CreateCommissionDto } from './dto/create-commission.dto';

@Injectable()
export class CommissionService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCommissions(userId: string): Promise<Commission[]> {
    return this.prisma.commission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async createCommission(userId: string, dto: CreateCommissionDto) {
    return this.prisma.commission.create({
      data: {
        userId,
        type: dto.type,
        amount: dto.amount,
        currency: dto.currency,
        paymentMethod: dto.paymentMethod,
        source: dto.source,
        status: 'pending',
      },
    });
  }
}

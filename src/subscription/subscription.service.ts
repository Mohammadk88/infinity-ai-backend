// src/modules/subscription/subscription.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        user: { connect: { id: dto.userId } },
        client: { connect: { id: dto.clientId } },
        plan: { connect: { id: dto.planId } },
        startedAt: new Date(dto.startDate),
        expiresAt: new Date(dto.endDate),
        status: dto.status as SubscriptionStatus,
      },
      include: {
        plan: true,
        client: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    return this.prisma.subscription.delete({ where: { id } });
  }
}

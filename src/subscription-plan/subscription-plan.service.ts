import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSubscriptionPlanDto) {
    // Ensure all required fields have values
    const data = {
      ...dto,
      // Set a default value for duration if it's undefined
      duration: dto.duration ?? 0,
    };

    return this.prisma.subscriptionPlan.create({
      data,
    });
  }

  findAll() {
    return this.prisma.subscriptionPlan.findMany();
  }

  async findOne(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async update(id: string, dto: UpdateSubscriptionPlanDto) {
    await this.findOne(id);
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subscriptionPlan.delete({ where: { id } });
  }
}

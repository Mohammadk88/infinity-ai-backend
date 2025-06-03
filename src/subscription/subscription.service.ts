// src/modules/subscription/subscription.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus, UsageType } from '@prisma/client';

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
  async activateSubscription(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.features) {
      throw new BadRequestException(
        'Subscription plan not found or missing features.',
      );
    }

    // أنشئ الاشتراك الجديد
    // You must provide clientId here. You may need to pass it as a parameter to this method.
    await this.prisma.subscription.create({
      data: {
        userId,
        clientId: '', // <-- Set the correct clientId here, e.g. pass as argument
        planId: plan.id,
        status: 'ACTIVE',
        startedAt: new Date(),
        expiresAt: new Date(
          new Date().getTime() + plan.duration * 24 * 60 * 60 * 1000,
        ),
      },
    });

    // فك الـ features من الـ JSON
    const features = plan.features as Record<string, number>;

    for (const [key, limit] of Object.entries(features)) {
      if (!Object.values(UsageType).includes(key as UsageType)) {
        continue; // Skip invalid usage types
      }
      const usageType = key as UsageType;

      await this.prisma.usageLimit.upsert({
        where: {
          userId_type: {
            userId,
            type: usageType,
          },
        },
        update: {
          limit,
          used: 0,
          resetAt: this.getNextResetDate(),
        },
        create: {
          userId,
          type: usageType,
          limit,
          used: 0,
          resetAt: this.getNextResetDate(),
        },
      });
    }

    return { success: true };
  }

  getNextResetDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  async getActiveSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: { gte: new Date() },
      },
      orderBy: { startedAt: 'desc' },
      include: {
        plan: true, // includes SubscriptionPlan details
      },
    });

    if (!subscription) return { status: 'none' };

    return {
      planId: subscription.planId,
      planName: subscription.plan.name,
      startedAt: subscription.startedAt,
      expiresAt: subscription.expiresAt,
      features: subscription.plan.features,
      isTrial: subscription.isTrial,
    };
  }
  async createOrRenewSubscription(
    userId: string,
    planId: string,
    clientId: string,
    payment: {
      amount: number;
      method: string;
      externalId: string;
    },
  ) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new NotFoundException('Plan not found');

    const now = new Date();

    // ✅ 1. تحقق إذا كان مشترك حالياً بنفس الخطة
    const existing = await this.prisma.subscription.findFirst({
      where: {
        userId,
        planId,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      throw new BadRequestException('You are already subscribed to this plan');
    }

    // ⛔ 2. ألغِ كل الاشتراكات السابقة
    await this.prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'EXPIRED', isActive: false, canceledAt: now },
    });

    // 🧾 3. إنشاء سجل الدفع
    const newPayment = await this.prisma.payment.create({
      data: {
        userId,
        planId,
        amount: payment.amount,
        status: 'PAID',
        method: payment.method,
        externalId: payment.externalId,
        paidAt: now,
      },
    });

    // 💳 4. حفظ طريقة الدفع (إذا stripe/card)
    if (payment.method === 'stripe') {
      await this.prisma.paymentMethod.upsert({
        where: { externalId: payment.externalId },
        update: { isDefault: true },
        create: {
          userId,
          externalId: payment.externalId,
          type: 'card',
          brand: 'visa', // أو من Stripe webhook
          last4: '4242',
          expMonth: 12,
          expYear: 2026,
          country: 'US',
          isDefault: true,
        },
      });

      // ❗️اجعل الوسائل القديمة غير افتراضية
      await this.prisma.paymentMethod.updateMany({
        where: {
          userId,
          NOT: { externalId: payment.externalId },
        },
        data: {
          isDefault: false,
        },
      });
    }
    // 📝 5. إنشاء الاشتراك
    const expiresAt = new Date(
      now.getTime() + plan.duration * 24 * 60 * 60 * 1000,
    );
    await this.prisma.subscription.create({
      data: {
        userId,
        clientId,
        planId,
        status: 'ACTIVE',
        isActive: true,
        startedAt: now,
        expiresAt,
      },
    });

    // 📊 6. إعداد حدود الاستخدام UsageLimit
    const features = plan.features as Record<string, number>;
    for (const [key, limit] of Object.entries(features)) {
      if (!Object.values(UsageType).includes(key as UsageType)) {
        continue; // Skip invalid usage types
      }
      const usageType = key as UsageType;

      await this.prisma.usageLimit.upsert({
        where: {
          userId_type: {
            userId,
            type: usageType,
          },
        },
        update: {
          limit,
          used: 0,
          resetAt: this.getNextResetDate(),
        },
        create: {
          userId,
          type: usageType,
          limit,
          used: 0,
          resetAt: this.getNextResetDate(),
        },
      });
    }

    return { success: true, plan: plan.name, expiresAt };
  }

  /* private getNextResetDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } */
}

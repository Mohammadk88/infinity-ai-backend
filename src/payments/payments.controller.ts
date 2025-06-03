import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common//decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

interface PaddleWebhookBody {
  alert_name: string;
  checkout_id: string;
  passthrough?: string;
  amount?: string;
  [key: string]: unknown;
}

interface PassthroughData {
  userId: string;
  planId: string;
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('paddle/create-checkout')
  async createPaddleCheckout(
    @CurrentUser() user: { id: string; email: string },
    @Body('planId') planId: string,
  ) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      select: {
        id: true,
        name: true,
        priceMonthly: true,
        paddleProductId: true,
      },
    });
    if (!plan) throw new Error('Plan not found');
    if (!plan.paddleProductId)
      throw new Error('Plan does not have a Paddle product ID');

    try {
      const checkoutUrl = await this.paymentsService.createPaddleCheckout(
        {
          ...plan,
          paddleProductId: plan.paddleProductId as string,
        },
        {
          id: user.id,
          email: user.email,
        },
      );
      if (typeof checkoutUrl !== 'string') {
        throw new Error('Invalid checkout URL returned');
      }
      return { url: checkoutUrl };
    } catch {
      throw new Error('Failed to create checkout');
    }
  }

  @Post('webhooks/paddle')
  async handlePaddleWebhook(@Body() body: PaddleWebhookBody) {
    try {
      this.logger.log('Received Paddle webhook', {
        alertName: body?.alert_name,
        checkoutId: body?.checkout_id,
      });

      // Verify event type is "payment_succeeded"
      if (body.alert_name !== 'payment_succeeded') {
        this.logger.warn(`Ignoring webhook event: ${body.alert_name}`);
        return { received: true };
      }

      // Parse passthrough to get userId and planId
      const passthrough = JSON.parse(
        body.passthrough || '{}',
      ) as PassthroughData;
      const { userId, planId } = passthrough;

      if (!userId || !planId) {
        this.logger.error('Missing userId or planId in passthrough', {
          passthrough,
        });
        return { received: true };
      }

      // Find user's client (assuming first client for simplicity, or you can add clientId to passthrough)
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { clients: { take: 1 } },
      });

      if (!user || !user.clients.length) {
        this.logger.error('User not found or has no clients', { userId });
        return { received: true };
      }

      const clientId = user.clients[0].id;

      // Call subscription service to activate the plan
      await this.subscriptionService.createOrRenewSubscription(
        userId,
        planId,
        clientId,
        {
          amount: parseFloat(body.amount || '0'),
          method: 'paddle',
          externalId: body.checkout_id,
        },
      );

      this.logger.log('Subscription activated successfully', {
        userId,
        planId,
        checkoutId: body.checkout_id,
        amount: body.amount,
      });

      return { received: true };
    } catch (error) {
      // Log errors silently, don't expose in response
      this.logger.error('Paddle webhook processing failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        body,
      });

      // Return success to prevent Paddle from retrying
      return { received: true };
    }
  }
}

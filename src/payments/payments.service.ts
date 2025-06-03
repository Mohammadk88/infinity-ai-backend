import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface Plan {
  id: string;
  paddleProductId: string;
}

interface User {
  id: string;
  email: string;
}

@Injectable()
export class PaymentsService {
  constructor(private config: ConfigService) {}

  async createPaddleCheckout(plan: Plan, user: User) {
    const vendorId = this.config.get<string>('PADDLE_VENDOR_ID');
    const vendorAuthCode = this.config.get<string>('PADDLE_AUTH_CODE');

    try {
      const response = await axios.post<{
        success: boolean;
        response: {
          url: string;
        };
      }>(
        'https://vendors.paddle.com/api/2.0/product/generate_pay_link',
        new URLSearchParams({
          vendor_id: vendorId || '',
          vendor_auth_code: vendorAuthCode || '',
          product_id: plan.paddleProductId || '', // أو رقم ثابت مؤقت
          customer_email: String(user.email),
          passthrough: JSON.stringify({ userId: user.id, planId: plan.id }),
          return_url: `${this.config.get('FRONTEND_URL')}/dashboard/plans?success=true`,
          cancel_url: `${this.config.get('FRONTEND_URL')}/dashboard/plans?cancel=true`,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      if (!response.data || !response.data.success) {
        throw new Error('Failed to create Paddle checkout link');
      }

      return response.data.response.url;
    } catch {
      throw new Error('Failed to create Paddle checkout link');
    }
  }
}

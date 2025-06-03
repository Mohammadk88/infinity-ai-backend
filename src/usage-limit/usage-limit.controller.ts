import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsageLimitService } from './usage-limit.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsageType } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('usage-limit')
export class UsageLimitController {
  constructor(private readonly usageLimitService: UsageLimitService) {}

  @Get()
  async getLimits(@CurrentUser('id') userId: string) {
    return this.usageLimitService.getUserLimits(userId);
  }

  @Post('increment')
  async incrementUsage(
    @CurrentUser('id') userId: string,
    @Body() body: { type: UsageType; amount?: number },
  ): Promise<{ success: boolean; usage: number }> {
    const result = await this.usageLimitService.increment(
      userId,
      body.type,
      body.amount || 1,
    );
    return { success: true, usage: result.used };
  }
}

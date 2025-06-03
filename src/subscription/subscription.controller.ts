// src/modules/subscription/subscription.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Subscriptions')
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('me')
  async getMySubscription(@CurrentUser('id') userId: string) {
    return await this.subscriptionService.getActiveSubscription(userId);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateSubscriptionDto, @CurrentUser() user: JwtPayload) {
    if (!dto.clientId && (!user || !user.clientId)) {
      throw new Error('ClientId is required');
    }

    return this.subscriptionService.create({
      ...dto,
      clientId: dto.clientId || user.clientId,
    });
  }
  @Post('activate')
  @UseGuards(JwtAuthGuard)
  async activatePlan(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      planId: string;
      amount: number;
      method: string;
      externalId: string;
    },
  ) {
    return this.subscriptionService.createOrRenewSubscription(
      user.id,
      body.planId,
      user.clientId,
      {
        amount: body.amount,
        method: body.method,
        externalId: body.externalId,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one subscription by ID' })
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subscription' })
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subscription' })
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }
}

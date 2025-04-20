import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommissionDto } from './dto/create-commission.dto';

@ApiTags('Affiliate / Commissions')
@Controller('/affiliate/commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  @ApiOperation({ summary: 'Get user commissions' })
  getUserCommissions(@CurrentUser('id') userId: string) {
    return this.commissionService.getUserCommissions(userId);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCommissionDto) {
    return this.commissionService.createCommission(userId, dto);
  }
}

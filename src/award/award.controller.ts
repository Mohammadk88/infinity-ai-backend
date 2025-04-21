import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwardService } from './award.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Awards')
@Controller('awards')
export class AwardController {
  constructor(
    private readonly awardService: AwardService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new award' })
  create(@Body() createDto: CreateAwardDto) {
    return this.awardService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active awards' })
  findAll() {
    return this.awardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an award by ID' })
  findOne(@Param('id') id: string) {
    return this.awardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an award by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAwardDto) {
    return this.awardService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an award by ID' })
  remove(@Param('id') id: string) {
    return this.awardService.remove(id);
  }

  @Get('/points')
  getUserPoints(@CurrentUser('id') userId: string) {
    return this.awardService.getUserPoints(userId);
  }

  @Get('/points/history')
  getUserPointHistory(@CurrentUser('id') user: { id: string }) {
    return this.awardService.getPointHistory(user.id);
  }

  @Post('/rewards/redeem')
  async redeemAward(
    @CurrentUser('id') user: { id: string },
    @Body() dto: { awardId: string },
  ) {
    const award = await this.prisma.award.findUnique({
      where: { id: dto.awardId },
    });
    if (!award || !award.isActive)
      throw new NotFoundException('Award not found');

    const userPoints = await this.prisma.userPoint.findUnique({
      where: { userId: user.id },
    });
    if (!userPoints || userPoints.points < award.pointsCost) {
      throw new BadRequestException('Not enough points');
    }

    // خصم النقاط
    await this.prisma.userPoint.update({
      where: { userId: user.id },
      data: { points: { decrement: award.pointsCost } },
    });

    // تسجيل الاسترداد
    return this.prisma.rewardRedemption.create({
      data: {
        userId: user.id,
        awardId: dto.awardId,
        status: 'pending',
      },
    });
  }
  @Get('/rewards/redemptions')
  getUserRedemptions(@CurrentUser('id') userId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { userId },
      include: { award: true },
      orderBy: { redeemedAt: 'desc' }, // Replace 'redeemedAt' with the actual field name if different in your Prisma schema
    });
  }
}

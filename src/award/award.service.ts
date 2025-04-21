import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';

@Injectable()
export class AwardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAwardDto) {
    const data = {
      ...createDto,
      value: Number(createDto.value),
    };
    return this.prisma.award.create({ data });
  }

  async findAll() {
    return this.prisma.award.findMany({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const award = await this.prisma.award.findUnique({ where: { id } });
    if (!award) throw new NotFoundException('Award not found');
    return award;
  }

  async update(id: string, updateDto: UpdateAwardDto) {
    const data = {
      ...updateDto,
      value:
        updateDto.value !== undefined ? Number(updateDto.value) : undefined,
    };
    return this.prisma.award.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.award.delete({ where: { id } });
  }
  // إجمالي النقاط
  async getUserPoints(userId: string) {
    const pointData = await this.prisma.userPoint.findUnique({
      where: { userId },
    });

    return {
      currentPoints: pointData?.points || 0,
    };
  }

  // سجل الأحداث (تسجيل، إحالة...)
  async getPointHistory(userId: string) {
    return this.prisma.pointEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

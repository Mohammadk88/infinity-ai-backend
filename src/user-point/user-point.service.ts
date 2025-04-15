import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { UpdateUserPointDto } from './dto/update-user-point.dto';
import { UserPoint } from '@prisma/client';

@Injectable()
export class UserPointService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserPoint[]> {
    return await this.prisma.userPoint.findMany({
      include: { user: true },
    });
  }

  async findOneByUserId(userId: string): Promise<UserPoint> {
    const point = await this.prisma.userPoint.findUnique({
      where: { userId },
    });
    if (!point) {
      throw new NotFoundException('User point not found');
    }
    return point;
  }

  async create(createDto: CreateUserPointDto): Promise<UserPoint> {
    return await this.prisma.userPoint.create({
      data: {
        userId: createDto.userId,
        points: createDto.points,
        totalPoints: createDto.totalPoints,
        redeemedPoints: createDto.redeemedPoints,
        pendingPoints: createDto.pendingPoints,
        approvedPoints: createDto.approvedPoints,
        rejectedPoints: createDto.rejectedPoints,
        status: createDto.status || 'active',
        createdBy: createDto.userId, // Adding required createdBy field
      },
    });
  }

  async update(
    userId: string,
    updateDto: UpdateUserPointDto,
  ): Promise<UserPoint> {
    return await this.prisma.userPoint.update({
      where: { userId },
      data: updateDto,
    });
  }

  async addPoints(userId: string, points: number): Promise<UserPoint> {
    return await this.prisma.userPoint.update({
      where: { userId },
      data: {
        points: { increment: points },
        totalPoints: { increment: points },
        pendingPoints: { increment: points },
      },
    });
  }

  async deductPoints(userId: string, points: number): Promise<UserPoint> {
    return await this.prisma.userPoint.update({
      where: { userId },
      data: {
        points: { decrement: points },
      },
    });
  }
}

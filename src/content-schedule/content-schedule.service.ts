import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentScheduleDto } from './dto/create-content-schedule.dto';
import { UpdateContentScheduleDto } from './dto/update-content-schedule.dto';

@Injectable()
export class ContentScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentScheduleDto) {
    return this.prisma.contentSchedule.create({
      data: {
        ...dto,
        publishAt: new Date(dto.publishAt),
      },
    });
  }

  async findAll() {
    return this.prisma.contentSchedule.findMany({
      orderBy: { publishAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.contentSchedule.findUnique({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(id: string, dto: UpdateContentScheduleDto) {
    return this.prisma.contentSchedule.update({
      where: { id },
      data: {
        ...dto,
        publishAt: dto.publishAt ? new Date(dto.publishAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.contentSchedule.delete({ where: { id } });
  }
}

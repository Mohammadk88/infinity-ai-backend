import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePointEventDto } from './dto/create-point-event.dto';
import { UpdatePointEventDto } from './dto/update-point-event.dto';

@Injectable()
export class PointEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePointEventDto) {
    return await this.prisma.pointEvent.create({
      data: {
        ...createDto,
        status: createDto.status || 'pending', // Provide a default value if status is undefined
      },
    });
  }

  async findAll() {
    return await this.prisma.pointEvent.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.pointEvent.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!event) throw new NotFoundException('Point event not found');
    return event;
  }

  async update(id: string, updateDto: UpdatePointEventDto) {
    return await this.prisma.pointEvent.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.pointEvent.delete({
      where: { id },
    });
  }
}

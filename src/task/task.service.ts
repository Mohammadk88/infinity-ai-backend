import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { teamId, assignedTo, ...rest } = createTaskDto;
    return this.prisma.task.create({
      data: {
        ...rest,
        teamId: teamId || null,
        assignedTo: assignedTo || null,
      },
    });
  }

  async findAllByTeam(teamId: string) {
    return this.prisma.task.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, teamId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, teamId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, teamId: string) {
    await this.findOne(id, teamId); // ensure exists
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, teamId: string) {
    await this.findOne(id, teamId); // ensure exists
    return this.prisma.task.delete({
      where: { id },
    });
  }
}

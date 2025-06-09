import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  async create(createSprintDto: CreateSprintDto, userId: string) {
    // Check if user has access to the project
    const project = await this.prisma.project.findUnique({
      where: { id: createSprintDto.projectId },
      include: {
        company: {
          include: {
            members: { where: { userId } },
          },
        },
      },
    });

    if (!project || project.company.members.length === 0) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.prisma.sprint.create({
      data: {
        ...createSprintDto,
        createdBy: userId,
      },
      include: {
        project: true,
        tasks: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async findAll(projectId?: string, userId?: string) {
    const where: any = {};

    if (projectId) {
      // Verify user has access to the project
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          company: {
            include: {
              members: { where: { userId } },
            },
          },
        },
      });

      if (!project || project.company.members.length === 0) {
        throw new ForbiddenException('You do not have access to this project');
      }

      where.projectId = projectId;
    } else if (userId) {
      // Get all sprints from projects user has access to
      where.project = {
        company: {
          members: {
            some: { userId },
          },
        },
      };
    }

    return this.prisma.sprint.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            company: {
              include: {
                members: { where: { userId } },
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    if (sprint.project.company.members.length === 0) {
      throw new ForbiddenException('You do not have access to this sprint');
    }

    return sprint;
  }

  async update(id: string, updateSprintDto: UpdateSprintDto, userId: string) {
    const sprint = await this.findOne(id, userId);

    return this.prisma.sprint.update({
      where: { id },
      data: updateSprintDto,
      include: {
        project: true,
        tasks: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const sprint = await this.findOne(id, userId);

    // Check if sprint has active tasks
    const activeTasks = await this.prisma.task.count({
      where: {
        sprintId: id,
        status: {
          in: ['TODO', 'IN_PROGRESS', 'REVIEW'],
        },
      },
    });

    if (activeTasks > 0) {
      throw new ForbiddenException('Cannot delete sprint with active tasks');
    }

    return this.prisma.sprint.delete({
      where: { id },
    });
  }

  async getSprintStats(id: string, userId: string) {
    const sprint = await this.findOne(id, userId);

    const stats = await this.prisma.task.groupBy({
      by: ['status'],
      where: { sprintId: id },
      _count: {
        status: true,
      },
    });

    const totalTasks = await this.prisma.task.count({
      where: { sprintId: id },
    });

    const completedTasks =
      stats.find((s) => s.status === 'DONE')?._count.status || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      sprint,
      stats,
      totalTasks,
      completedTasks,
      progress: Math.round(progress),
    };
  }
}

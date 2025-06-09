import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    // التحقق من أن المستخدم له صلاحية في الشركة
    const companyMember = await this.prisma.companyMember.findFirst({
      where: {
        userId,
        companyId: createProjectDto.companyId,
        isActive: true,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!companyMember) {
      throw new ForbiddenException('ليس لديك صلاحية في هذه الشركة');
    }

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        startDate: new Date(createProjectDto.startDate),
        endDate: new Date(createProjectDto.endDate),
        createdBy: userId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        createdUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
    });
  }

  async findAll(
    userId: string,
    companyId?: string,
    status?: string,
    type?: string,
  ) {
    // التحقق من الصلاحيات
    const whereCondition: {
      companyId?: string | { in: string[] };
      status?: string;
      type?: string;
    } = {};

    if (companyId) {
      // التحقق من أن المستخدم عضو في الشركة
      const companyMember = await this.prisma.companyMember.findFirst({
        where: {
          userId,
          companyId,
          isActive: true,
        },
      });

      if (!companyMember) {
        throw new ForbiddenException('ليس لديك صلاحية لعرض مشاريع هذه الشركة');
      }

      whereCondition.companyId = companyId;
    } else {
      // إذا لم يتم تحديد شركة، عرض مشاريع الشركات التي المستخدم عضو فيها
      const userCompanies = await this.prisma.companyMember.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          companyId: true,
        },
      });

      whereCondition.companyId = {
        in: userCompanies.map((uc) => uc.companyId),
      };
    }

    if (status) {
      whereCondition.status = status;
    }

    if (type) {
      whereCondition.type = type;
    }

    return this.prisma.project.findMany({
      where: whereCondition,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        createdUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        createdUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sprints: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            sprint: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // أحدث 10 مهام
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('المشروع غير موجود');
    }

    // التحقق من الصلاحية
    const companyMember = await this.prisma.companyMember.findFirst({
      where: {
        userId,
        companyId: project.companyId,
        isActive: true,
      },
    });

    if (!companyMember) {
      throw new ForbiddenException('ليس لديك صلاحية لعرض هذا المشروع');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    await this.findOne(id, userId);

    const updateData: any = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (updateProjectDto.name) updateData.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.description = updateProjectDto.description;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (updateProjectDto.status) updateData.status = updateProjectDto.status;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (updateProjectDto.type) updateData.type = updateProjectDto.type;
    if (updateProjectDto.priority !== undefined) {
      // Map enum to number for database
      const priorityMap = { low: 1, normal: 2, high: 3, urgent: 4 };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.priority = priorityMap[updateProjectDto.priority] || 2;
    }
    if (updateProjectDto.budget !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.budget = updateProjectDto.budget;
    if (updateProjectDto.clientId !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.clientId = updateProjectDto.clientId;

    if (updateProjectDto.startDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.startDate = new Date(updateProjectDto.startDate);
    }
    if (updateProjectDto.endDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.endDate = new Date(updateProjectDto.endDate);
    }

    return this.prisma.project.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        createdUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    // التحقق من وجود مهام أو سبرنتس
    const tasksCount = await this.prisma.task.count({
      where: { projectId: id },
    });

    const sprintsCount = await this.prisma.sprint.count({
      where: { projectId: id },
    });

    if (tasksCount > 0 || sprintsCount > 0) {
      throw new ForbiddenException(
        'لا يمكن حذف المشروع لأنه يحتوي على مهام أو سبرنتس',
      );
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getProjectStats(projectId: string, userId: string) {
    await this.findOne(projectId, userId); // التحقق من الصلاحية

    const totalTasks = await this.prisma.task.count({
      where: { projectId },
    });

    const completedTasks = await this.prisma.task.count({
      where: { projectId, status: 'DONE' },
    });

    const totalSprints = await this.prisma.sprint.count({
      where: { projectId },
    });

    const activeSprints = await this.prisma.sprint.count({
      where: { projectId, status: 'active' },
    });

    const overdueTasks = await this.prisma.task.count({
      where: {
        projectId,
        dueDate: {
          lt: new Date(),
        },
        status: {
          notIn: ['DONE', 'CANCELLED'],
        },
      },
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      totalSprints,
      activeSprints,
      overdueTasks,
      completionPercentage:
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }

  async findUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { createdBy: userId },
          {
            tasks: {
              some: {
                assignedTo: userId,
              },
            },
          },
          {
            company: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      include: {
        company: {
          select: { name: true },
        },
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

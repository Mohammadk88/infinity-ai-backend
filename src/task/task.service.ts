import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    // التحقق من صلاحية الوصول للمشروع
    const project = await this.prisma.project.findFirst({
      where: {
        id: createTaskDto.projectId,
        OR: [
          { createdBy: userId },
          {
            company: {
              members: {
                some: { userId },
              },
            },
          },
        ],
      },
    });

    if (!project) {
      throw new NotFoundException(
        'المشروع غير موجود أو ليس لديك صلاحية للوصول إليه',
      );
    }

    // التحقق من السبرنت إذا تم تحديده
    if (createTaskDto.sprintId) {
      const sprint = await this.prisma.sprint.findFirst({
        where: {
          id: createTaskDto.sprintId,
          projectId: createTaskDto.projectId,
        },
      });

      if (!sprint) {
        throw new NotFoundException('السبرنت غير موجود في هذا المشروع');
      }
    }

    // تحويل Priority إلى رقم
    const priorityMap = {
      LOW: 3,
      MEDIUM: 2,
      HIGH: 1,
      URGENT: 0,
    };

    // إنشاء المهمة
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        projectId: createTaskDto.projectId,
        sprintId: createTaskDto.sprintId,
        assignedTo: createTaskDto.assigneeId,
        status: createTaskDto.status || TaskStatus.TODO,
        priority: createTaskDto.priority
          ? priorityMap[createTaskDto.priority]
          : 2,
        startDate: createTaskDto.startDate
          ? new Date(createTaskDto.startDate)
          : null,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        tags: createTaskDto.tags?.join(','),
        createdBy: userId,
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(userId: string, projectId?: string, status?: TaskStatus) {
    const where: any = {
      OR: [
        { createdBy: userId },
        { assignedTo: userId },
        {
          project: {
            OR: [
              { createdBy: userId },
              {
                company: {
                  members: {
                    some: { userId },
                  },
                },
              },
            ],
          },
        },
      ],
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [
          { createdBy: userId },
          { assignedTo: userId },
          {
            project: {
              OR: [
                { createdBy: userId },
                {
                  company: {
                    members: {
                      some: { userId },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(
        'المهمة غير موجودة أو ليس لديك صلاحية للوصول إليها',
      );
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id, userId);

    // التحقق من الصلاحية للتعديل
    const canEdit = task.createdBy === userId || task.assignedTo === userId;

    if (!canEdit) {
      throw new ForbiddenException('ليس لديك صلاحية لتعديل هذه المهمة');
    }

    // تحويل Priority إلى رقم
    const priorityMap = {
      LOW: 3,
      MEDIUM: 2,
      HIGH: 1,
      URGENT: 0,
    };

    const updateData: any = {
      updatedBy: userId,
    };

    if (updateTaskDto.title) updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      updateData.description = updateTaskDto.description;
    if (updateTaskDto.status) updateData.status = updateTaskDto.status;
    if (updateTaskDto.priority)
      updateData.priority = priorityMap[updateTaskDto.priority];
    if (updateTaskDto.assigneeId !== undefined)
      updateData.assignedTo = updateTaskDto.assigneeId;
    if (updateTaskDto.startDate)
      updateData.startDate = new Date(updateTaskDto.startDate);
    if (updateTaskDto.dueDate)
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    if (updateTaskDto.tags) updateData.tags = updateTaskDto.tags.join(',');

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: true, name: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);

    // فقط منشئ المهمة يمكنه حذفها
    if (task.createdBy !== userId) {
      throw new ForbiddenException('فقط منشئ المهمة يمكنه حذفها');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async getTasksByProject(projectId: string, userId: string) {
    return this.findAll(userId, projectId);
  }

  async getTasksByStatus(status: TaskStatus, userId: string) {
    return this.findAll(userId, undefined, status);
  }

  async assignTask(taskId: string, assigneeId: string, userId: string) {
    const task = await this.findOne(taskId, userId);

    if (task.createdBy !== userId) {
      throw new ForbiddenException('فقط منشئ المهمة يمكنه تكليفها');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignedTo: assigneeId,
        updatedBy: userId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateStatus(taskId: string, status: TaskStatus, userId: string) {
    const task = await this.findOne(taskId, userId);

    const canUpdateStatus =
      task.createdBy === userId || task.assignedTo === userId;

    if (!canUpdateStatus) {
      throw new ForbiddenException('ليس لديك صلاحية لتحديث حالة هذه المهمة');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        updatedBy: userId,
      },
    });
  }
}

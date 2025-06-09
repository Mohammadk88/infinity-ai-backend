import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { userId, clientId, ...notificationData } = createNotificationDto;
    return this.prisma.notification.create({
      data: {
        ...notificationData,
        userId: userId || '',
        clientId: clientId || '',
      },
    });
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      data: notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Additional finder methods for controller compatibility
  async findAllByUser(userId: string, page: number = 1, limit: number = 10) {
    return this.findAll(userId, page, limit);
  }

  async findUnreadByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByClient(
    clientId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { clientId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { clientId },
      }),
    ]);

    return {
      data: notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // Bulk notification methods
  async createBulk(notifications: CreateNotificationDto[]) {
    const formattedNotifications = notifications.map(
      ({ userId, clientId, ...rest }) => ({
        ...rest,
        userId: userId || '',
        clientId: clientId || '',
      }),
    );

    return this.prisma.notification.createMany({
      data: formattedNotifications,
    });
  }

  async createSystemNotification(
    title: string,
    message: string,
    userIds: string[],
    companyId?: string,
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      clientId: companyId || '',
      title,
      message,
      type: 'SYSTEM',
      moduleType: 'SYSTEM',
    }));

    return this.createBulk(notifications);
  }

  // Smart notification methods for different system events

  async notifyPostScheduled(postId: string, userId: string) {
    try {
      const post = await this.prisma.socialPost.findUnique({
        where: { id: postId },
        include: {
          socialAccount: true,
        },
      });

      if (!post) return;

      let message = `Your post has been scheduled`;
      if (post.scheduledAt) {
        message = `Your post has been scheduled for ${post.scheduledAt.toLocaleDateString()}`;
      }

      await this.create({
        userId,
        title: 'Post Scheduled',
        message,
        type: 'SOCIAL_POST',
        moduleType: 'SOCIAL_POST',
        moduleId: postId,
        clientId: '',
      });
    } catch (error) {
      console.error('Error in notifyPostScheduled:', error);
    }
  }

  async notifyPostPublished(postId: string, userId: string) {
    try {
      const post = await this.prisma.socialPost.findUnique({
        where: { id: postId },
        include: {
          socialAccount: true,
        },
      });

      if (!post) return;

      await this.create({
        userId,
        title: 'Post Published',
        message: `Your post has been successfully published on ${
          post.socialAccount?.platform || 'social media'
        }`,
        type: 'SOCIAL_POST',
        moduleType: 'SOCIAL_POST',
        moduleId: postId,
        clientId: '',
      });
    } catch (error) {
      console.error('Error in notifyPostPublished:', error);
    }
  }

  async notifyTaskAssigned(
    taskId: string,
    _assignedToUserId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    _assignedByUserId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    try {
      // Future: Use assignedToUserId and assignedByUserId for additional logic
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: {
            include: {
              company: {
                include: {
                  members: {
                    include: { role: true },
                  },
                },
              },
            },
          },
          assignee: true,
        },
      });

      if (!task) return;

      let recipients: string[] = [];

      if (task.assignedTo) {
        recipients = [task.assignedTo];
      }

      // Also notify project managers
      if (task.project?.company) {
        const managers = await this.prisma.companyMember.findMany({
          where: {
            companyId: task.project.company.id,
            role: {
              name: { in: ['MANAGER', 'ADMIN'] },
            },
          },
          include: { role: true },
        });

        const managerIds = managers.map((m) => m.userId);
        recipients = [...recipients, ...managerIds];
      }

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Task Assigned',
        message: `You have been assigned a new task: ${task.title}`,
        type: 'TASK',
        moduleType: 'TASK' as const,
        moduleId: taskId,
        clientId: task.project?.company?.id || '',
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyTaskAssigned:', error);
    }
  }

  async notifyTaskStatusChanged(
    taskId: string,
    newStatus: TaskStatus,
    _changedByUserId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    try {
      // Future: Use changedByUserId for additional logic
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: {
            include: {
              company: {
                include: {
                  members: {
                    include: { role: true },
                  },
                },
              },
            },
          },
          assignee: true,
        },
      });

      if (!task) return;

      let recipients: string[] = [];

      if (task.assignedTo) {
        recipients = [task.assignedTo];
      }

      // Notify project managers
      if (task.project?.company) {
        const managers = await this.prisma.companyMember.findMany({
          where: {
            companyId: task.project.company.id,
            role: {
              name: { in: ['MANAGER', 'ADMIN'] },
            },
          },
          include: { role: true },
        });

        const managerIds = managers.map((m) => m.userId);
        recipients = [...recipients, ...managerIds];
      }

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed to ${newStatus}`,
        type: 'TASK',
        moduleType: 'TASK' as const,
        moduleId: taskId,
        clientId: task.project?.company?.id || '',
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyTaskStatusChanged:', error);
    }
  }

  async notifyNewLead(leadId: string, companyId?: string) {
    try {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          assignee: true,
        },
      });

      if (!lead) return;

      let recipients: string[] = [];

      // Notify assigned user
      if (lead.assignedTo) {
        recipients = [lead.assignedTo];
      }

      // Notify sales team members if companyId is provided
      if (companyId) {
        const salesTeam = await this.prisma.companyMember.findMany({
          where: {
            companyId,
            role: {
              name: { in: ['MANAGER', 'ADMIN', 'SALES'] },
            },
          },
          include: { role: true },
        });

        const salesTeamIds = salesTeam.map((m) => m.userId);
        recipients = [...recipients, ...salesTeamIds];
      }

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'New Lead',
        message: `New lead received: ${lead.name}`,
        type: 'LEAD',
        moduleType: 'LEAD' as const,
        moduleId: leadId,
        clientId: companyId || '',
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyNewLead:', error);
    }
  }

  async notifyLeadStatusChanged(
    leadId: string,
    newStatus: string,
    changedByUserId: string,
    companyId?: string,
  ) {
    try {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          assignee: true,
        },
      });

      if (!lead) return;

      let recipients: string[] = [];

      if (lead.assignedTo) {
        recipients = [lead.assignedTo];
      }

      // For won/lost leads, notify managers
      if (['Won', 'Lost'].includes(newStatus) && companyId) {
        const salesManagers = await this.prisma.companyMember.findMany({
          where: {
            companyId,
            role: {
              name: { in: ['MANAGER', 'ADMIN'] },
            },
          },
          include: { role: true },
        });

        const managerIds = salesManagers.map((m) => m.userId);
        recipients = [...recipients, ...managerIds];
      }

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Lead Status Updated',
        message: `Lead "${lead.name}" status changed to ${newStatus}`,
        type: 'LEAD',
        moduleType: 'LEAD' as const,
        moduleId: leadId,
        clientId: companyId || '',
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyLeadStatusChanged:', error);
    }
  }

  // Analytics and insights notifications
  async notifyWeeklyTaskSummary(userId: string) {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const completedTasks = await this.prisma.task.count({
        where: {
          assignedTo: userId,
          status: TaskStatus.DONE,
          updatedAt: { gte: startOfWeek },
        },
      });

      const pendingTasks = await this.prisma.task.count({
        where: {
          assignedTo: userId,
          status: { not: TaskStatus.DONE },
        },
      });

      const overdueTasks = await this.prisma.task.count({
        where: {
          assignedTo: userId,
          dueDate: { lt: new Date() },
          status: { not: TaskStatus.DONE },
        },
      });

      await this.create({
        userId,
        title: 'Weekly Task Summary',
        message: `This week: ${completedTasks} completed, ${pendingTasks} pending, ${overdueTasks} overdue`,
        type: 'SYSTEM',
        moduleType: 'SYSTEM',
      });
    } catch (error) {
      console.error('Error in notifyWeeklyTaskSummary:', error);
    }
  }

  async notifyProjectDeadlineApproaching(projectId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          company: {
            include: {
              members: {
                include: { role: true },
              },
            },
          },
          tasks: true,
        },
      });

      if (!project) return;

      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;

      // Notify project managers and team members
      const recipients =
        project.company?.members
          ?.filter(
            (m) => m.role?.name && ['MANAGER', 'ADMIN'].includes(m.role.name),
          )
          ?.map((m) => m.userId) || [];

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Project Deadline Approaching',
        message: `Project "${project.name}" deadline is approaching. Progress: ${completedTasks}/${totalTasks} tasks completed`,
        type: 'PROJECT',
        moduleType: 'PROJECT' as const,
        moduleId: projectId,
        clientId: project.companyId,
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyProjectDeadlineApproaching:', error);
    }
  }

  async notifyTaskDeadlineApproaching(taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: {
            include: {
              company: {
                include: {
                  members: {
                    include: { role: true },
                  },
                },
              },
            },
          },
          assignee: true,
        },
      });

      if (!task) return;

      let recipients: string[] = [];

      if (task.assignedTo) {
        recipients = [task.assignedTo];
      }

      // Also notify managers
      const managers =
        task.project?.company?.members
          ?.filter(
            (m) => m.role?.name && ['MANAGER', 'ADMIN'].includes(m.role.name),
          )
          ?.map((m) => m.userId) || [];

      recipients = [...recipients, ...managers];

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Task Deadline Approaching',
        message: `Task "${task.title}" is due soon`,
        type: 'TASK',
        moduleType: 'TASK' as const,
        moduleId: taskId,
        clientId: task.project?.companyId || '',
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyTaskDeadlineApproaching:', error);
    }
  }

  // Company and team management notifications
  async notifyNewTeamMember(
    companyId: string,
    newMemberUserId: string,
    _invitedByUserId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    try {
      // Future: Use invitedByUserId for additional logic
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: {
          members: {
            include: {
              role: true,
              user: true,
            },
          },
        },
      });

      const newMember = await this.prisma.user.findUnique({
        where: { id: newMemberUserId },
      });

      if (!company || !newMember) return;

      // Notify managers and admins
      const managers = company.members
        .filter(
          (m) => m.role?.name && ['MANAGER', 'ADMIN'].includes(m.role.name),
        )
        .map((m) => m.userId);

      const notifications = managers.map((userId) => ({
        userId,
        title: 'New Team Member',
        message: `${newMember.name} joined the team`,
        type: 'TEAM',
        moduleType: 'COMPANY',
        moduleId: companyId,
        clientId: companyId,
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyNewTeamMember:', error);
    }
  }

  // Subscription and billing notifications
  async notifySubscriptionExpiring(userId: string, daysLeft: number) {
    try {
      await this.create({
        userId,
        title: 'Subscription Expiring',
        message: `Your subscription expires in ${daysLeft} days. Please renew to continue using all features.`,
        type: 'BILLING',
        moduleType: 'SUBSCRIPTION',
      });
    } catch (error) {
      console.error('Error in notifySubscriptionExpiring:', error);
    }
  }

  async notifyPaymentFailed(userId: string, amount: number) {
    try {
      await this.create({
        userId,
        title: 'Payment Failed',
        message: `Payment of $${amount} failed. Please update your payment method.`,
        type: 'BILLING',
        moduleType: 'PAYMENT',
      });
    } catch (error) {
      console.error('Error in notifyPaymentFailed:', error);
    }
  }

  // Campaign and marketing notifications
  async notifyCampaignStarted(campaignId: string, companyId: string) {
    try {
      const campaign = await this.prisma.marketingCampaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) return;

      const companyMembers = await this.prisma.companyMember.findMany({
        where: {
          companyId,
          role: {
            name: { in: ['MANAGER', 'ADMIN', 'MARKETING'] },
          },
        },
        include: { role: true },
      });

      const recipients = companyMembers.map((m) => m.userId);

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Campaign Started',
        message: `Marketing campaign "${campaign.name}" has started`,
        type: 'CAMPAIGN',
        moduleType: 'MARKETING_CAMPAIGN',
        moduleId: campaignId,
        clientId: companyId,
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyCampaignStarted:', error);
    }
  }

  async notifyCampaignCompleted(campaignId: string, companyId: string) {
    try {
      const campaign = await this.prisma.marketingCampaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) return;

      const companyMembers = await this.prisma.companyMember.findMany({
        where: {
          companyId,
          role: {
            name: { in: ['MANAGER', 'ADMIN', 'MARKETING'] },
          },
        },
        include: { role: true },
      });

      const recipients = companyMembers.map((m) => m.userId);

      const notifications = recipients.map((userId) => ({
        userId,
        title: 'Campaign Completed',
        message: `Marketing campaign "${campaign.name}" has completed. View results in analytics.`,
        type: 'CAMPAIGN',
        moduleType: 'MARKETING_CAMPAIGN',
        moduleId: campaignId,
        clientId: companyId,
      }));

      if (notifications.length > 0) {
        await this.createBulk(notifications);
      }
    } catch (error) {
      console.error('Error in notifyCampaignCompleted:', error);
    }
  }
}

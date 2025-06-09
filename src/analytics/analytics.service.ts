import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getCompanyDashboard(companyId: string, userId: string) {
    // Check if user has access to company
    const userAccess = await this.checkCompanyAccess(companyId, userId);
    if (!userAccess) {
      throw new ForbiddenException('No access to this company');
    }

    const [
      totalTasks,
      totalSprints,
      totalClients,
      totalLeads,
      totalCampaigns,
      recentTasks,
      projectProgress,
      teamOverview,
    ] = await Promise.all([
      this.prisma.task.count({
        where: { project: { companyId } },
      }),
      this.prisma.sprint.count({
        where: { project: { companyId } },
      }),
      this.prisma.client.count({ where: { agencyId: companyId } }),
      this.prisma.lead.count(),
      this.prisma.marketingCampaign.count(),
      this.prisma.task.findMany({
        where: { project: { companyId } },
        include: {
          project: { select: { name: true } },
          assignee: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.getProjectProgress(companyId),
      this.getTeamOverview(companyId),
    ]);

    return {
      overview: {
        totalTasks,
        totalSprints,
        totalClients,
        totalLeads,
        totalCampaigns,
      },
      recentTasks,
      projectProgress,
      teamOverview,
    };
  }

  async getProjectAnalytics(projectId: string, userId: string) {
    // Check if user has access to project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { company: { include: { members: true } } },
    });

    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    const hasAccess = project.company.members.some(
      (member) => member.userId === userId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('No access to this project');
    }

    const [
      taskStats,
      sprintStats,
      projectTimeline,
      teamWorkload,
      burndownData,
    ] = await Promise.all([
      this.getTaskStats(projectId),
      this.getSprintStats(projectId),
      this.getProjectTimeline(projectId),
      this.getTeamWorkload(projectId),
      this.getBurndownChart(projectId),
    ]);

    return {
      taskStats,
      sprintStats,
      timeline: projectTimeline,
      teamWorkload,
      burndownChart: burndownData,
    };
  }

  async getMarketingAnalytics(companyId: string, userId: string) {
    // Check if user has access to company
    const userAccess = await this.checkCompanyAccess(companyId, userId);
    if (!userAccess) {
      throw new ForbiddenException('No access to this company');
    }

    const [
      campaignStats,
      socialAccountStats,
      contentStats,
      leadSourceStats,
      clientInsights,
    ] = await Promise.all([
      this.getCampaignStats(companyId),
      this.getSocialAccountStats(companyId),
      this.getContentStats(companyId),
      this.getLeadSourceStats(companyId),
      this.getClientInsights(companyId),
    ]);

    return {
      campaigns: campaignStats,
      socialAccounts: socialAccountStats,
      content: contentStats,
      leadSources: leadSourceStats,
      clients: clientInsights,
    };
  }

  async getUserAnalytics(userId: string) {
    const [userStats, userProjects, userProductivity, userActivity] =
      await Promise.all([
        this.getUserStats(userId),
        this.getUserProjects(userId),
        this.getUserProductivity(userId),
        this.getUserActivity(userId),
      ]);

    return {
      stats: userStats,
      projects: userProjects,
      productivity: userProductivity,
      activity: userActivity,
    };
  }

  // Private helper methods

  private async checkCompanyAccess(
    companyId: string,
    userId: string,
  ): Promise<boolean> {
    const member = await this.prisma.companyMember.findFirst({
      where: { companyId, userId },
    });
    return !!member;
  }

  private async getProjectProgress(companyId: string) {
    const projects = await this.prisma.project.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      totalTasks: project._count.tasks,
      progress: this.calculateProjectProgress(project as any),
    }));
  }

  private calculateProjectProgress(project: any): number {
    // This would need actual task completion data
    // For now, return a placeholder
    return Math.floor(Math.random() * 100);
  }

  private async getTeamOverview(companyId: string) {
    const members = await this.prisma.companyMember.findMany({
      where: { companyId, isActive: true },
      include: {
        role: true,
      },
    });

    const memberStats = await Promise.all(
      members.map(async (member) => {
        const [todoTasks, inProgressTasks, overdueTasks] = await Promise.all([
          this.prisma.task.count({
            where: {
              assignedTo: member.userId,
              project: { companyId },
              status: 'TODO',
            },
          }),
          this.prisma.task.count({
            where: {
              assignedTo: member.userId,
              project: { companyId },
              status: 'IN_PROGRESS',
            },
          }),
          this.prisma.task.count({
            where: {
              assignedTo: member.userId,
              project: { companyId },
              dueDate: { lt: new Date() },
              status: { notIn: ['DONE', 'CANCELLED'] },
            },
          }),
        ]);

        return {
          userId: member.userId,
          role: member.role?.name || 'Member',
          todoTasks,
          inProgressTasks,
          overdueTasks,
        };
      }),
    );

    return memberStats;
  }

  private async getTaskStats(projectId: string) {
    const [totalTasks, todoTasks, inProgressTasks, doneTasks] =
      await Promise.all([
        this.prisma.task.count({
          where: { projectId },
        }),
        this.prisma.task.count({
          where: { projectId, status: 'TODO' },
        }),
        this.prisma.task.count({
          where: { projectId, status: 'IN_PROGRESS' },
        }),
        this.prisma.task.count({
          where: { projectId, status: 'DONE' },
        }),
      ]);

    return {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
      completionRate:
        totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    };
  }

  private async getSprintStats(projectId: string) {
    const sprints = await this.prisma.sprint.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return sprints.map((sprint) => ({
      id: sprint.id,
      name: sprint.name,
      status: sprint.status,
      totalTasks: sprint._count.tasks,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    }));
  }

  private async getProjectTimeline(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        endDate: true,
        assignee: {
          select: { name: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return tasks;
  }

  private async getTeamWorkload(projectId: string) {
    const tasks = await this.prisma.task.groupBy({
      by: ['assignedTo'],
      where: { projectId, assignedTo: { not: null } },
      _count: {
        assignedTo: true,
      },
    });

    const workloadData = await Promise.all(
      tasks.map(async (item) => {
        const user = await this.prisma.user.findUnique({
          where: { id: item.assignedTo! },
          select: {
            name: true,
            email: true,
          },
        });

        return {
          userId: item.assignedTo,
          userName: user?.name || 'Unknown',
          userEmail: user?.email || '',
          taskCount: item._count.assignedTo,
        };
      }),
    );

    return workloadData;
  }

  private async getBurndownChart(projectId: string) {
    // This would typically involve historical data
    // For now, return sample data structure
    return {
      labels: [], // Dates
      idealBurndown: [], // Ideal completion line
      actualBurndown: [], // Actual completion line
    };
  }

  private async getCampaignStats(companyId: string) {
    const campaigns = await this.prisma.marketingCampaign.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      postsCount: campaign._count.posts || 0,
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    }));
  }

  private async getSocialAccountStats(companyId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return accounts.map((account) => ({
      id: account.id,
      platform: account.platform,
      accountName: account.accountName,
      postsCount: account._count.posts || 0,
      status: account.status,
    }));
  }

  private async getContentStats(companyId: string) {
    const [totalPosts, publishedPosts, scheduledPosts] = await Promise.all([
      this.prisma.socialPost.count(),
      this.prisma.socialPost.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.socialPost.count({ where: { status: 'SCHEDULED' } }),
    ]);

    return {
      total: totalPosts,
      published: publishedPosts,
      scheduled: scheduledPosts,
      draft: totalPosts - publishedPosts - scheduledPosts,
    };
  }

  private async getLeadSourceStats(companyId: string) {
    const leadSources = await this.prisma.lead.groupBy({
      by: ['source'],
      _count: {
        source: true,
      },
    });

    return leadSources.map((item) => ({
      source: item.source || 'Unknown',
      count: item._count.source,
    }));
  }

  private async getClientInsights(companyId: string) {
    const [totalClients, activeClients] = await Promise.all([
      this.prisma.client.count({ where: { agencyId: companyId } }),
      this.prisma.client.count({
        where: { agencyId: companyId, isActive: true },
      }),
    ]);

    return {
      total: totalClients,
      active: activeClients,
      inactive: totalClients - activeClients,
    };
  }

  private async getUserStats(userId: string) {
    const [assignedTasks, completedTasks, overdueTasks] = await Promise.all([
      this.prisma.task.count({
        where: { assignedTo: userId },
      }),
      this.prisma.task.count({
        where: { assignedTo: userId, status: 'DONE' },
      }),
      this.prisma.task.count({
        where: {
          assignedTo: userId,
          dueDate: { lt: new Date() },
          status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
        },
      }),
    ]);

    return {
      assignedTasks,
      completedTasks,
      overdueTasks,
      completionRate:
        assignedTasks > 0
          ? Math.round((completedTasks / assignedTasks) * 100)
          : 0,
    };
  }

  private async getUserProjects(userId: string) {
    const projects = await this.prisma.project.findMany({
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
        ],
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      totalTasks: project._count.tasks,
    }));
  }

  private async getUserProductivity(userId: string) {
    // Get tasks completed in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completedTasks = await this.prisma.task.findMany({
      where: {
        assignedTo: userId,
        status: 'DONE',
        updatedAt: { gte: thirtyDaysAgo },
      },
      select: {
        updatedAt: true,
      },
    });

    // Group by date
    const dailyCompletion: { [key: string]: number } = {};
    completedTasks.forEach((task) => {
      const date = task.updatedAt.toISOString().split('T')[0];
      dailyCompletion[date] = (dailyCompletion[date] || 0) + 1;
    });

    return {
      dailyCompletion,
      totalCompleted: completedTasks.length,
      averageDaily:
        Object.values(dailyCompletion).reduce((a, b) => a + b, 0) / 30,
    };
  }

  private async getUserActivity(userId: string) {
    const [recentTasks, recentComments] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          OR: [{ assignedTo: userId }, { createdBy: userId }],
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          projectId: true,
        },
      }),
      this.prisma.taskComment.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          message: true,
          createdAt: true,
          taskId: true,
        },
      }),
    ]);

    return {
      recentTasks,
      recentComments,
    };
  }
}

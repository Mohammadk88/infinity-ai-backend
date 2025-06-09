import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from '../../types/auth.types';

export interface RequiredPermission {
  resource: string;
  action: string;
  companyId?: string;
  projectId?: string;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<RequiredPermission[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    for (const permission of permissions) {
      const hasPermission = await this.checkPermission(
        userId,
        permission,
        request.params as Record<string, string>,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Insufficient permissions for ${permission.action} on ${permission.resource}`,
        );
      }
    }

    return true;
  }

  private async checkPermission(
    userId: string,
    permission: RequiredPermission,
    params: Record<string, string>,
  ): Promise<boolean> {
    const { resource, action } = permission;
    let { companyId, projectId } = permission;

    // Get dynamic IDs from request params if not provided
    companyId = companyId || params.companyId;
    projectId = projectId || params.projectId;

    // Check if user is a member of the company
    if (companyId) {
      const member = await this.prisma.companyMember.findFirst({
        where: {
          userId,
          companyId,
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

      if (!member) {
        return false;
      }

      // Check specific permission
      const hasPermission = member.role.permissions.some((perm) => {
        const [permResource, permAction] = perm.permission.key.split(':');
        return permResource === resource && permAction === action;
      });

      if (!hasPermission) {
        return false;
      }
    }

    // Additional checks for project-level permissions
    if (projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          company: {
            include: {
              members: {
                where: { userId },
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
              },
            },
          },
        },
      });

      if (!project || project.company.members.length === 0) {
        return false;
      }

      const member = project.company.members[0];
      const hasProjectPermission = member.role.permissions.some((perm) => {
        const [permResource, permAction] = perm.permission.key.split(':');
        return (
          (permResource === 'project' || permResource === resource) &&
          (permAction === action || permAction === 'manage')
        );
      });

      return hasProjectPermission;
    }

    return true;
  }
}

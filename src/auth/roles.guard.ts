import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;

    const { user }: { user: { roleId: string } } = context
      .switchToHttp()
      .getRequest();

    const permissions = await this.prisma.permissionOnRole.findMany({
      where: {
        roleId: user.roleId,
        permission: { key: { in: requiredPermissions } },
      },
    });

    if (!permissions.length) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}

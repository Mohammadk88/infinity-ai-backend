import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import { OAuthService } from '../oauth/oauth.service'; // تأكد من المسار

@Injectable()
export class SocialAccountsService {
  constructor(
    private prisma: PrismaService,
    private oauth: OAuthService,
  ) {}

  async create(dto: CreateSocialAccountDto, userId: string) {
    const { tokenExpiresAt, ...rest } = dto;

    return this.prisma.socialAccount.create({
      data: {
        ...rest,
        userId,
        externalId: '', // Provide a default value
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : new Date(), // أو undefined إذا حقل اختياري
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.socialAccount.findMany({
      where: { userId, deletedAt: null },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id },
    });
    if (!account || account.deletedAt)
      throw new NotFoundException('Social account not found');
    return account;
  }
  async findOneByWhere(userId: string, clientId?: string) {
    const account = await this.prisma.socialAccount.findFirst({
      where: {
        userId: userId,
        clientId: clientId,
        platform: 'TWITTER',
        deletedAt: null,
      },
    });
    if (!account) throw new NotFoundException('Social account not found');
    return account;
  }

  async update(id: string, dto: UpdateSocialAccountDto) {
    const { tokenExpiresAt, ...rest } = dto;

    return this.prisma.socialAccount.update({
      where: { id },
      data: {
        ...rest,
        ...(tokenExpiresAt && { tokenExpiresAt: new Date(tokenExpiresAt) }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.socialAccount.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  // service
  async getAccountsForUser(userId: string) {
    return this.prisma.socialAccount.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        platform: true,
        accountName: true,
        pageId: true,
        accessToken: false, // لا ترجع التوكن
        createdAt: true,
      },
    });
  }
  async getStats(userId: string): Promise<any> {
    return this.prisma.socialAccount.groupBy({
      by: ['platform'],
      where: {
        userId,
        deletedAt: null, // مهم جداً حتى ما يحسب الحسابات المحذوفة
      },
      _count: {
        platform: true,
      },
    });
  }

  getOAuthAuthorizationUrl(platform: string, userId: string, clientId: string) {
    return this.oauth.getHandler(platform).getAuthUrl(userId, clientId);
  }

  async handleOAuthCallback(platform: string, code: string, state: string) {
    const handler = this.oauth.getHandler(platform);
    const accounts = await handler.handleCallback(code, state);
    return { accounts };
  }

  async connectAccount(userId: string, data: CreateSocialAccountDto) {
    const { tokenExpiresAt, ...rest } = data;

    const parsedTokenExpiresAt =
      tokenExpiresAt && !isNaN(Date.parse(tokenExpiresAt))
        ? new Date(tokenExpiresAt)
        : new Date(); // Always provide a Date

    const createData: Omit<CreateSocialAccountDto, 'tokenExpiresAt'> & {
      userId: string;
      tokenExpiresAt: Date | string;
    } = {
      ...rest,
      userId,
      tokenExpiresAt: parsedTokenExpiresAt,
    };
    const existing = await this.prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: createData.platform,
      },
    });
    if (existing) {
      return existing; // أو عدله إذا كنت تريد تحديث التوكن مثلاً
    }
    return this.prisma.socialAccount.create({
      data: createData,
    });
  }
}

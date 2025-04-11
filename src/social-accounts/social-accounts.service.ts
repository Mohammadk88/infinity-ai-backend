import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';

@Injectable()
export class SocialAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSocialAccountDto, userId: string) {
    const { tokenExpiresAt, ...rest } = dto;

    return this.prisma.socialAccount.create({
      data: {
        ...rest,
        userId,
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
}

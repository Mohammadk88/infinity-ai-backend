import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    if (!dto.userId || !dto.clientId) {
      throw new BadRequestException('User ID and Client ID are required');
    }
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        clientId: dto.clientId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        link: dto.link,
        linkText: dto.linkText,
        linkType: dto.linkType,
        moduleType: dto.moduleType,
        moduleId: dto.moduleId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByClient(clientId: string) {
    return this.prisma.notification.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.delete({ where: { id } });
  }
  async findUnreadByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async sendToUsers(
    userIds: string[],
    payload: Required<Omit<CreateNotificationDto, 'userId'>>,
  ) {
    if (!userIds || userIds.length === 0) return [];

    const notifications = userIds.map((userId) => ({
      ...payload,
      userId,
    }));

    return this.prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });
  }

  async sendPostInteractionNotification(
    userId: string,
    clientId: string,
    postId: string,
    interactionType: 'like' | 'comment' | 'share',
    platform: string,
    postTitle?: string,
  ) {
    const typeMap = {
      like: 'تم الإعجاب بمنشورك',
      comment: 'تم التعليق على منشورك',
      share: 'تمت مشاركة منشورك',
    };

    const messageMap = {
      like: 'شخص ما أعجب بمنشورك على',
      comment: 'شخص ما علّق على منشورك على',
      share: 'شخص ما شارك منشورك على',
    };

    const title = typeMap[interactionType] ?? 'تفاعل جديد على منشورك';
    const message = `${messageMap[interactionType] ?? 'تفاعل جديد على منشورك على'} ${platform}`;

    return this.prisma.notification.create({
      data: {
        userId,
        clientId,
        title,
        message,
        type: 'INFO',
        moduleType: 'post',
        moduleId: postId,
        link: `/posts/${postId}`,
        linkText: postTitle ?? 'عرض المنشور',
        linkType: 'post',
      },
    });
  }
  async sendPostPublishedNotification(
    userId: string,
    clientId: string,
    postId: string,
    platform: string,
    postTitle?: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        clientId,
        title: 'تم نشر منشورك بنجاح',
        message: `تم نشر منشورك على ${platform} بنجاح.`,
        type: 'SUCCESS',
        moduleType: 'post',
        moduleId: postId,
        link: `/posts/${postId}`,
        linkText: postTitle ?? 'عرض المنشور',
        linkType: 'post',
      },
    });
  }
}

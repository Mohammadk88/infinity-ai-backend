import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  /**
   * إنشاء عميل جديد وربطه بمستخدم محدد
   */
  async create(dto: CreateClientDto, userId: string, agencyId: string) {
    return this.prisma.client.create({
      data: {
        ...dto,
        userId,
        agencyId,
      },
    });
  }

  /**
   * جلب كل العملاء المرتبطين بالمستخدم
   */
  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: { userId },
    });
  }

  /**
   * جلب عميل واحد حسب المعرف
   */
  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  /**
   * تعديل بيانات عميل موجود
   */
  async update(id: string, dto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * حذف عميل حسب المعرف
   */
  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
  /**
   * تعيين اشتراك لعميل
   */
  async assignSubscription(clientId: string, subscriptionId: string) {
    try {
      // Update the client with the new subscription ID
      const updatedClient = await this.prisma.client.update({
        where: { id: clientId },
        data: {
          Subscription: {
            connect: { id: subscriptionId },
          },
        },
      });

      return {
        message: 'Subscription assigned successfully',
        client: updatedClient,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to assign subscription: ${errorMessage}`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService, // ✅ أضفنا mailService
  ) {}

  async create(dto: CreateInvitationDto) {
    const token = uuid();
    let expiresAt: Date;
    try {
      expiresAt = dto.expiresAt
        ? new Date(dto.expiresAt)
        : dayjs().add(3, 'days').toDate();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Invalid date format: ${errorMessage}`);
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        email: dto.email,
        roleId: dto.roleId,
        companyId: dto.companyId,
        invitedBy: dto.invitedBy,
        token,
        expiresAt,
      },
    });

    // ✅ إرسال إيميل الدعوة مباشرة
    await this.mailService.sendInvitationEmail({
      to: dto.email,
      companyName: 'Infinity AI System', // 🔴 ملاحظة: يمكنك جلب اسم الشركة من جدول Company بدل كتابة ثابت
      token,
      language: 'en', // يمكنك تعديلها حسب company.language لاحقًا
    });

    return invitation;
  }

  async findByEmail(email: string) {
    return this.prisma.invitation.findFirst({
      where: {
        email,
        status: 'PENDING',
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.invitation.findUnique({
      where: { token },
      include: {
        company: true, // ✅ يجلب معلومات الشركة
        role: true, // ✅ يجلب معلومات الدور
      },
    });
  }

  async markAsAccepted(token: string) {
    return this.prisma.invitation.updateMany({
      where: { token },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });
  }

  async cancel(token: string) {
    return this.prisma.invitation.updateMany({
      where: { token },
      data: { status: 'CANCELLED' },
    });
  }
  async markAsCancelled(invitationId: string) {
    return this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'CANCELLED' },
    });
  }
}

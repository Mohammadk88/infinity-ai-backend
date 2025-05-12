import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { emailTemplates } from './emailTemplates';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendInvitationEmail({
    to,
    companyName,
    token,
    language = 'en',
  }: {
    to: string;
    companyName: string;
    token: string;
    language?: 'en' | 'fr' | 'ar';
  }) {
    const link = `${process.env.FRONTEND_URL}/invite/${token}`;

    const html = emailTemplates.invitation[language]
      ? emailTemplates.invitation[language]({ companyName, link })
      : emailTemplates.invitation.en({ companyName, link });

    const subject =
      language === 'ar'
        ? `دعوة للانضمام إلى ${companyName}`
        : language === 'fr'
          ? `Invitation à rejoindre ${companyName}`
          : `You are invited to join ${companyName}`;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('MailService error:', err);
      throw new InternalServerErrorException('فشل في إرسال البريد الإلكتروني');
    }
  }
}

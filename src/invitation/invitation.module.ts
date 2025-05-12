// src/invitation/invitation.module.ts
import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ هذا السطر

@Module({
  imports: [PrismaModule, MailModule], // ✅ هنا كمان
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}

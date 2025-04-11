import { Module } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ حسب مكان مجلد prisma عندك

@Module({
  imports: [PrismaModule], // ✅ أضف هذا السطر
  providers: [SocialAccountsService],
  exports: [SocialAccountsService],
})
export class SocialAccountsModule {}

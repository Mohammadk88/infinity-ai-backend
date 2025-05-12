import { Module } from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CompanyMemberController } from './company-member.controller';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ أضف هذا
import { UserModule } from '../users/users.module'; // ✅ لو كنت تستخدم UsersModule

@Module({
  imports: [PrismaModule, UserModule], // ✅ أضف PrismaModule هنا
  controllers: [CompanyMemberController],
  providers: [CompanyMemberService],
  exports: [CompanyMemberService],
})
export class CompanyMemberModule {}

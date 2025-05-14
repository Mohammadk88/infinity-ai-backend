// src/company-members/company-member.module.ts
import { Module } from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CompanyMemberController } from './company-member.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/users.module';
import { InvitationModule } from '../invitation/invitation.module';
import { RolesModule } from '../role/role.module';

@Module({
  imports: [PrismaModule, UserModule, InvitationModule, RolesModule],
  controllers: [CompanyMemberController],
  providers: [CompanyMemberService],
  exports: [CompanyMemberService],
})
export class CompanyMemberModule {}

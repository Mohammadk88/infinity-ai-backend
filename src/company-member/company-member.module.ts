import { Module } from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CompanyMemberController } from './company-member.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CompanyMemberController],
  providers: [CompanyMemberService],
  imports: [PrismaModule],
})
export class CompanyMemberModule {}

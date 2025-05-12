import { RolesService } from 'src/role/role.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { UserPointService } from '../user-point/user-point.service';
import { ReferralService } from '../referral/referral.service';
import { ReferralModule } from 'src/referral/referral.module';
import { UserPointModule } from 'src/user-point/user-point.module';
import { CommissionService } from 'src/commission/commission.service';
import { InvitationModule } from '../invitation/invitation.module';
import { CompanyMemberModule } from 'src/company-member/company-member.module';
import { UserModule } from 'src/users/users.module';
import { CompanyService } from 'src/company/company.service';
import { InvitationService } from 'src/invitation/invitation.service';
import { CompanyMemberService } from 'src/company-member/company-member.service';
import { UserService } from 'src/users/users.service';
import { CompanyModule } from 'src/company/company.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    UserModule,
    ReferralModule,
    UserPointModule,
    CompanyMemberModule,
    CompanyModule, // ✅ الحل السحري هون
    InvitationModule, // ✅ أضف هذا السطر
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserPointService,
    ReferralService,
    CommissionService,
    InvitationService,
    CompanyMemberService,
    UserService,
    MailService,
    RolesService,
    CompanyService, // موجود صح، بس لازم module
  ],
})
export class AuthModule {}

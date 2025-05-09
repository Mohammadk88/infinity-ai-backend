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
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ReferralModule,
    UserPointModule,
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
  ],
})
export class AuthModule {}

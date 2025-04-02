import { Module } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { SocialAccountsController } from './social-accounts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SocialAccountsController],
  providers: [SocialAccountsService, PrismaService],
})
export class SocialAccountsModule {}

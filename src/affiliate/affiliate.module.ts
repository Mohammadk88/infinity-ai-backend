import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { AffiliateController } from './affiliate.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AffiliateController],
  providers: [AffiliateService, PrismaService],
  exports: [AffiliateService],
})
export class AffiliateModule {}

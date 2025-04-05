import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}

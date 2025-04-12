import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookController } from './facebook.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [FacebookController],
  providers: [FacebookAuthService],
})
export class FacebookAuthModule {}

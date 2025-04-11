import { TwitterModule } from './twitter/twitter.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TwitterModule],
  exports: [TwitterModule], // لو بدنا نستخدمه خارجياً
})
export class SocialProvidersModule {}

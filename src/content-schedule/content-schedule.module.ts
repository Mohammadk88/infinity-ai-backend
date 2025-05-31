import { Module } from '@nestjs/common';
import { ContentScheduleService } from './content-schedule.service';
import { ContentScheduleController } from './content-schedule.controller';
import { TwitterModule } from 'src/lib/social-providers/twitter/twitter.module';
import { LinkedInModule } from 'src/lib/social-providers/linkedin/linkedin.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FacebookAuthModule } from 'src/lib/social-providers/facebook/facebook-auth.module';
import { InstagramModule } from 'src/lib/social-providers/Instagram/instagram.module';

@Module({
  imports: [
    FacebookAuthModule,
    TwitterModule,
    LinkedInModule,
    PrismaModule,
    InstagramModule,
  ],
  controllers: [ContentScheduleController],
  providers: [ContentScheduleService],
})
export class ContentScheduleModule {}

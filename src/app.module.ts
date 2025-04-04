import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { SocialPostsModule } from './social-post/social-post.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { ContentScheduleModule } from './content-schedule/content-schedule.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentSchedulerModule } from './content-scheduler/content-scheduler.module';

import { AIGeneratorModule } from './ai-generator/ai-generator.module';
import { WebContentModule } from './web-content/web-content.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MarketingCampaignModule } from './marketing-campaign/marketing-campaign.module';
import { CampaignPostModule } from './campaign-post/campaign-post.module';
import { CampaignPerformanceModule } from './campaign-performance/campaign-performance.module';
import { TeamModule } from './team/team.module';
import { TeamMemberModule } from './team-member/team-member.module';
import { TaskModule } from './task/task.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { NotificationModule } from './notification/notification.module';
import { AiproviderConfigModule } from './aiprovider-config/aiprovider-config.module';
import { TwitterModule } from './twitter/twitter.module';
@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
    ContentSchedulerModule,
    ClientsModule,
    SocialAccountsModule,
    SocialPostsModule,
    CategoriesModule,
    TagsModule,
    ContentScheduleModule,
    AIGeneratorModule,
    WebContentModule,
    SubscriptionPlanModule,
    SubscriptionModule,
    MarketingCampaignModule,
    CampaignPostModule,
    CampaignPerformanceModule,
    TeamModule,
    TeamMemberModule,
    TaskModule,
    FileUploadModule,
    NotificationModule,
    AiproviderConfigModule,
    TwitterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

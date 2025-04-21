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
import { FileUploadModule } from './file-upload/file-upload.module';
import { NotificationModule } from './notification/notification.module';
import { AiproviderConfigModule } from './aiprovider-config/aiprovider-config.module';
import { SocialProvidersModule } from './lib/social-providers/social-providers.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { UserPointModule } from './user-point/user-point.module';
import { PointEventModule } from './point-event/point-event.module';
import { AwardModule } from './award/award.module';
import { RewardRedemptionModule } from './reward-redemption/reward-redemption.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReferralModule } from './referral/referral.module';
import { MeModule } from './me/me.module';
import { CommissionModule } from './commission/commission.module';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
        name: 'short',
      },
    ]),

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
    FileUploadModule,
    NotificationModule,
    AiproviderConfigModule,
    SocialProvidersModule,
    AffiliateModule,
    UserPointModule,
    PointEventModule,
    AwardModule,
    RewardRedemptionModule,
    ReferralModule,
    MeModule,
    CommissionModule,
    InteractionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

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
import { AppConfigModule } from './common/config/app.config.module';

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
import { CompanyModule } from './company/company.module';
import { CompanyMemberModule } from './company-member/company-member.module';
import { CountryModule } from './country/country.module';
import { CompanySettingsModule } from './company-setting/company-setting.module';
import { InvitationModule } from './invitation/invitation.module';
import { MailModule } from './mail/mail.module';
import { RolesModule } from './role/role.module';
import { RedisModule } from './lib/social-providers/redis/redis.module';
import { PipelineStageModule } from './pipeline-stage/pipeline-stage.module';
import { ClientNoteModule } from './client-note/client-note.module';
import { LeadModule } from './lead/lead.module';
import { OAuthModule } from './oauth/oauth.module';
import { UsageLimitModule } from './usage-limit/usage-limit.module';
import { PaymentsModule } from './payments/payments.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    AppConfigModule,
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
    CompanyModule,
    CompanyMemberModule,
    CountryModule,
    CompanySettingsModule,
    InvitationModule,
    MailModule,
    RolesModule,
    RedisModule,
    PipelineStageModule,
    ClientNoteModule,
    LeadModule,
    OAuthModule,
    UsageLimitModule,
    PaymentsModule,
    TaskModule,
    SprintModule,
    AnalyticsModule,
    ProjectModule,
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

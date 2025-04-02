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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

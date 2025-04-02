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

import { AIGeneratorModule } from './ai-generator/ai-generator.module';
@Module({
  imports: [
    AuthModule,
    ClientsModule,
    SocialAccountsModule,
    SocialPostsModule,
    CategoriesModule,
    TagsModule,
    ContentScheduleModule,
    AIGeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

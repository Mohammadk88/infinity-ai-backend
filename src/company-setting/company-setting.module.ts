import { Module } from '@nestjs/common';
import { CompanySettingService } from './company-setting.service';
import { CompanySettingController } from './company-setting.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigModule } from '../common/config/app.config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [CompanySettingController],
  providers: [CompanySettingService, PrismaService],
})
export class CompanySettingsModule {}

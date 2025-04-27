import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { AppConfig } from '../common/config/app.config';

@Injectable()
export class CompanySettingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appConfig: AppConfig,
  ) {}

  async getByCompanyId(companyId: string) {
    const settings = await this.prisma.companySetting.findUnique({
      where: { companyId },
    });

    if (settings) {
      // Add full domain to image paths
      if (settings.logoUrl) {
        settings.logoUrl = this.appConfig.getFullUrl(settings.logoUrl);
      }
      if (settings.coverImage) {
        settings.coverImage = this.appConfig.getFullUrl(settings.coverImage);
      }
    }

    return settings;
  }

  async updateCompanySettings(
    companyId: string,
    dto: UpdateCompanySettingDto,
    logoPath?: string,
    coverPath?: string,
  ) {
    const data = {
      ...dto,
      countryId: dto.countryId as string,
      logoUrl: undefined as string | undefined,
      coverImage: undefined as string | undefined,
    };

    if (logoPath) {
      data.logoUrl = logoPath;
    }
    if (coverPath) {
      data.coverImage = coverPath;
    }

    const result = await this.prisma.companySetting.upsert({
      where: { companyId },
      create: { companyId, ...data },
      update: data,
    });

    // Add full domain to returned image paths
    if (result.logoUrl) {
      result.logoUrl = this.appConfig.getFullUrl(result.logoUrl);
    }
    if (result.coverImage) {
      result.coverImage = this.appConfig.getFullUrl(result.coverImage);
    }

    return result;
  }
}

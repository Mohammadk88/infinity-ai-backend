import { Module } from '@nestjs/common';
import { AIProviderConfigController } from './aiprovider-config.controller';
import { AIProviderConfigService } from './aiprovider-config.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AIProviderConfigController],
  providers: [AIProviderConfigService],
  exports: [AIProviderConfigService],
})
export class AiproviderConfigModule {}

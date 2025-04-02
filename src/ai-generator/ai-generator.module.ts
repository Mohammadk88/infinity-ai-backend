import { Module } from '@nestjs/common';
import { AIGeneratorService } from './ai-generator.service';
import { AIGeneratorController } from './ai-generator.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AIGeneratorService],
  controllers: [AIGeneratorController],
  exports: [AIGeneratorService],
})
export class AIGeneratorModule {}

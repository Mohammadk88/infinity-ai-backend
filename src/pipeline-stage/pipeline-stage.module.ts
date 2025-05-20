import { Module } from '@nestjs/common';
import { PipelineStageService } from './pipeline-stage.service';
import { PipelineStageController } from './pipeline-stage.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PipelineStageController],
  providers: [PipelineStageService],
})
export class PipelineStageModule {}

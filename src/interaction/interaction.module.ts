import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService],
  imports: [PrismaModule],
})
export class InteractionModule {}

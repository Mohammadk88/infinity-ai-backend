import { Module } from '@nestjs/common';
import { SocialPostsService } from './social-post.service';
import { SocialPostsController } from './social-post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AIGeneratorModule } from 'src/ai-generator/ai-generator.module';

@Module({
  imports: [AIGeneratorModule],
  controllers: [SocialPostsController],
  providers: [SocialPostsService, PrismaService],
  exports: [SocialPostsService],
})
export class SocialPostsModule {}

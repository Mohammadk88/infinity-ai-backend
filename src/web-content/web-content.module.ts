import { Module } from '@nestjs/common';
import { WebContentController } from './web-content.controller';
import { WebContentService } from './web-content.service';

@Module({
  controllers: [WebContentController],
  providers: [WebContentService]
})
export class WebContentModule {}

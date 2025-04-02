import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIGeneratorService } from './ai-generator.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('AI Generator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-generator')
export class AIGeneratorController {
  constructor(private readonly service: AIGeneratorService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'توليد محتوى باستخدام مزود ذكاء اصطناعي' })
  @ApiResponse({ status: 201, description: 'تم توليد المحتوى بنجاح' })
  @ApiBearerAuth()
  generateContent(
    @Body() dto: GenerateContentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.generateSocialPostContent(dto.prompt, user.sub);
  }
}

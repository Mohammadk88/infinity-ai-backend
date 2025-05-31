import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AIProviderConfigService } from './aiprovider-config.service';
import { CreateAIProviderConfigDto } from './dto/create-ai-provider-config.dto';
import { UpdateAIProviderConfigDto } from './dto/update-ai-provider-config.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI Provider Config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-provider-config')
export class AIProviderConfigController {
  constructor(private readonly service: AIProviderConfigService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAIProviderConfigDto,
  ) {
    return this.service.create(user.id, dto);
  }
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAllByUser(user.id);
  }

  @Get('active')
  getActiveProvider(@CurrentUser() user: JwtPayload) {
    return this.service.findActiveByUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAIProviderConfigDto,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.remove(id, user.id);
  }
}

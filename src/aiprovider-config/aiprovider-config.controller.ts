import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AIProviderConfigService } from './aiprovider-config.service';
import { CreateAIProviderConfigDto } from './dto/create-ai-provider-config.dto';
import { UpdateAIProviderConfigDto } from './dto/update-ai-provider-config.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('AI Provider Config')
@ApiBearerAuth()
@Controller('ai-provider-config')
export class AIProviderConfigController {
  constructor(private readonly service: AIProviderConfigService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAIProviderConfigDto,
  ) {
    return this.service.create(user.sub, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAllByUser(user.sub);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAIProviderConfigDto,
  ) {
    return this.service.update(id, user.sub, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.remove(id, user.sub);
  }
}

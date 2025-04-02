import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebContentService } from './web-content.service';
import { CreateWebContentDto } from './dto/create-web-content.dto';
import { UpdateWebContentDto } from './dto/update-web-content.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags('Web Content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('web-content')
export class WebContentController {
  constructor(private readonly webContentService: WebContentService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء محتوى ويب جديد' })
  async create(
    @Body() dto: CreateWebContentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.webContentService.create(dto, user.sub, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'جلب كل المحتويات للعميل الحالي' })
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.webContentService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب محتوى معين حسب ID' })
  async findOne(@Param('id') id: string) {
    return this.webContentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث محتوى ويب حسب ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateWebContentDto) {
    return this.webContentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف (Soft Delete) محتوى ويب حسب ID' })
  async remove(@Param('id') id: string) {
    return this.webContentService.softDelete(id);
  }
}

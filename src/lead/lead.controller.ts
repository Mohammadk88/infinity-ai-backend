import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Query } from '@nestjs/common';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadController {
  constructor(private readonly service: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء lead جديد' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateLeadDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب كل leads مع خيارات فلترة' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('stage') stage?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(userId, { status, stage, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'تفاصيل lead معين' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تعديل lead' })
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف lead' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

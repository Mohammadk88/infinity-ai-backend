import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PipelineStageService } from './pipeline-stage.service';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReorderStagesDto } from './dto/reorder-stages.dto';

@ApiTags('Pipeline Stages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pipeline-stages')
export class PipelineStageController {
  constructor(private readonly service: PipelineStageService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء مرحلة جديدة ضمن المسار' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'تم إنشاء المرحلة بنجاح',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات غير صالحة',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePipelineStageDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع المراحل للمستخدم الحالي' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم جلب المراحل بنجاح' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  findAll(@CurrentUser('id') userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب تفاصيل مرحلة معينة' })
  @ApiParam({ name: 'id', description: 'معرف المرحلة', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم جلب المرحلة بنجاح' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'المرحلة غير موجودة',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث بيانات مرحلة معينة' })
  @ApiParam({ name: 'id', description: 'معرف المرحلة', type: 'string' })
  @ApiBody({ type: UpdatePipelineStageDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم تحديث المرحلة بنجاح' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'المرحلة غير موجودة',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات غير صالحة',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  update(@Param('id') id: string, @Body() dto: UpdatePipelineStageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مرحلة من المسار' })
  @ApiParam({ name: 'id', description: 'معرف المرحلة', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم حذف المرحلة بنجاح' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'المرحلة غير موجودة',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'إعادة ترتيب المراحل' })
  @ApiBody({ type: ReorderStagesDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'تم إعادة ترتيب المراحل بنجاح',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'بيانات غير صالحة',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'المراحل غير موجودة',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مصرح' })
  reorderStages(
    @CurrentUser('id') userId: string,
    @Body() dto: ReorderStagesDto,
  ) {
    return this.service.reorderStages(userId, dto.stageIds);
  }
}

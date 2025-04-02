import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
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

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء عميل جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء العميل بنجاح' })
  @ApiResponse({ status: 401, description: 'غير مصرح' })
  create(@Body() dto: CreateClientDto, @CurrentUser() user: JwtPayload) {
    return this.clientsService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع العملاء' })
  @ApiResponse({
    status: 200,
    description: 'قائمة العملاء المرتبطين بالمستخدم',
  })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.clientsService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب عميل واحد حسب المعرف' })
  @ApiResponse({ status: 200, description: 'بيانات العميل' })
  @ApiResponse({ status: 404, description: 'العميل غير موجود' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث بيانات عميل' })
  @ApiResponse({ status: 200, description: 'تم تعديل العميل بنجاح' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف عميل' })
  @ApiResponse({ status: 200, description: 'تم حذف العميل بنجاح' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
  /**
   * [PATCH] /clients/:id/assign-subscription
   * تعيين باقة اشتراك لعميل معيّن
   */
  @Patch(':id/assign-subscription')
  @ApiOperation({ summary: 'تعيين باقة اشتراك لعميل' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AssignSubscriptionDto })
  assignSubscription(
    @Param('id') id: string,
    @Body() dto: AssignSubscriptionDto,
  ) {
    return this.clientsService.assignSubscription(id, dto.subscriptionId);
  }
}

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
import { ClientNoteService } from './client-note.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Client Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('client-notes')
export class ClientNoteController {
  constructor(private readonly service: ClientNoteService) {}

  @Post()
  @ApiOperation({ summary: 'إضافة ملاحظة جديدة لعميل' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateClientNoteDto) {
    return this.service.create(userId, dto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'جلب جميع الملاحظات المرتبطة بعميل معين' })
  findAll(@Param('clientId') clientId: string) {
    return this.service.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب ملاحظة واحدة بالتفصيل' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث ملاحظة' })
  update(@Param('id') id: string, @Body() dto: UpdateClientNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف ملاحظة' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

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
import { ContentScheduleService } from './content-schedule.service';
import { CreateContentScheduleDto } from './dto/create-content-schedule.dto';
import { UpdateContentScheduleDto } from './dto/update-content-schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Content Schedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content-schedule')
export class ContentScheduleController {
  constructor(private readonly service: ContentScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create content schedule' })
  @ApiResponse({
    status: 201,
    description: 'Content schedule created successfully',
  })
  create(@Body() dto: CreateContentScheduleDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scheduled content' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific content schedule' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content schedule' })
  update(@Param('id') id: string, @Body() dto: UpdateContentScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content schedule' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

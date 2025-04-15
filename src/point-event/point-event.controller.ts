import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PointEventService } from './point-event.service';
import { CreatePointEventDto } from './dto/create-point-event.dto';
import { UpdatePointEventDto } from './dto/update-point-event.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Point Events')
@Controller('point-events')
export class PointEventController {
  constructor(private readonly pointEventService: PointEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new point event' })
  create(@Body() createDto: CreatePointEventDto) {
    return this.pointEventService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all point events' })
  findAll() {
    return this.pointEventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific point event by ID' })
  findOne(@Param('id') id: string) {
    return this.pointEventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a point event by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePointEventDto) {
    return this.pointEventService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a point event by ID' })
  remove(@Param('id') id: string) {
    return this.pointEventService.remove(id);
  }
}

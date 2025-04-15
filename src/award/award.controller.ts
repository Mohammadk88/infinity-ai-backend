import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AwardService } from './award.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Awards')
@Controller('awards')
export class AwardController {
  constructor(private readonly awardService: AwardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new award' })
  create(@Body() createDto: CreateAwardDto) {
    return this.awardService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active awards' })
  findAll() {
    return this.awardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an award by ID' })
  findOne(@Param('id') id: string) {
    return this.awardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an award by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAwardDto) {
    return this.awardService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an award by ID' })
  remove(@Param('id') id: string) {
    return this.awardService.remove(id);
  }
}

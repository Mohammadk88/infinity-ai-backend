import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignPerformanceService } from './campaign-performance.service';
import { CreateCampaignPerformanceDto } from './dto/create-campaign-performance.dto';
import { UpdateCampaignPerformanceDto } from './dto/update-campaign-performance.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Campaign Performance')
@Controller('campaign-performance')
export class CampaignPerformanceController {
  constructor(private readonly service: CampaignPerformanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create campaign performance record' })
  create(@Body() dto: CreateCampaignPerformanceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign performance records' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign performance by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign performance' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignPerformanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign performance' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

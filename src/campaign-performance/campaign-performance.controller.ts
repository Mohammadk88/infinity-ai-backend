import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CampaignPerformanceService } from './campaign-performance.service';
import { CreateCampaignPerformanceDto } from './dto/create-campaign-performance.dto';
import { UpdateCampaignPerformanceDto } from './dto/update-campaign-performance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Campaign Performance')
@UseGuards(JwtAuthGuard)
@Controller('campaign-performance')
export class CampaignPerformanceController {
  constructor(private readonly service: CampaignPerformanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create performance metric' })
  create(@Body() dto: CreateCampaignPerformanceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all performance metrics for campaign' })
  findAll(@Query('campaignId') campaignId: string) {
    return this.service.findAll(campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get performance metric by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update performance metric' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignPerformanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete performance metric' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

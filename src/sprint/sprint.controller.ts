import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SprintService } from './sprint.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sprints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sprint' })
  @ApiResponse({ status: 201, description: 'Sprint created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to project' })
  create(@Body() createSprintDto: CreateSprintDto, @Request() req) {
    return this.sprintService.create(createSprintDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sprints' })
  @ApiResponse({ status: 200, description: 'List of sprints' })
  findAll(@Query('projectId') projectId?: string, @Request() req?) {
    return this.sprintService.findAll(projectId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint by ID' })
  @ApiResponse({ status: 200, description: 'Sprint details' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.sprintService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get sprint statistics' })
  @ApiResponse({ status: 200, description: 'Sprint statistics' })
  getStats(@Param('id') id: string, @Request() req) {
    return this.sprintService.getSprintStats(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sprint' })
  @ApiResponse({ status: 200, description: 'Sprint updated successfully' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  update(
    @Param('id') id: string,
    @Body() updateSprintDto: UpdateSprintDto,
    @Request() req,
  ) {
    return this.sprintService.update(id, updateSprintDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sprint' })
  @ApiResponse({ status: 200, description: 'Sprint deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete sprint with active tasks',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.sprintService.remove(id, req.user.id);
  }
}

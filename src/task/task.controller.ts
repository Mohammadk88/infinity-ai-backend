import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one task by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.taskService.findOne(id, user.teamId || '');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by ID' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.taskService.update(id, updateTaskDto, user.teamId || '');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.taskService.remove(id, user.teamId || '');
  }
}

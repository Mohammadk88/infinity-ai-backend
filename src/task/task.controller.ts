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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roleId: string;
  };
}

@ApiTags('المهام')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء مهمة جديدة' })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء المهمة بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'المشروع غير موجود أو ليس لديك صلاحية للوصول إليه',
  })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'الحصول على جميع المهام' })
  @ApiQuery({ name: 'projectId', required: false, description: 'معرف المشروع' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TaskStatus,
    description: 'حالة المهمة',
  })
  @ApiResponse({
    status: 200,
    description: 'تم جلب المهام بنجاح',
  })
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId?: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.taskService.findAll(req.user.userId, projectId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'الحصول على مهمة محددة' })
  @ApiResponse({
    status: 200,
    description: 'تم جلب المهمة بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'المهمة غير موجودة أو ليس لديك صلاحية للوصول إليها',
  })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.taskService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث مهمة' })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث المهمة بنجاح',
  })
  @ApiResponse({
    status: 403,
    description: 'ليس لديك صلاحية لتعديل هذه المهمة',
  })
  @ApiResponse({
    status: 404,
    description: 'المهمة غير موجودة',
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مهمة' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف المهمة بنجاح',
  })
  @ApiResponse({
    status: 403,
    description: 'فقط منشئ المهمة يمكنه حذفها',
  })
  @ApiResponse({
    status: 404,
    description: 'المهمة غير موجودة',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.taskService.remove(id, req.user.userId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'الحصول على مهام مشروع محدد' })
  @ApiResponse({
    status: 200,
    description: 'تم جلب مهام المشروع بنجاح',
  })
  getTasksByProject(
    @Param('projectId') projectId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.getTasksByProject(projectId, req.user.userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'الحصول على المهام حسب الحالة' })
  @ApiResponse({
    status: 200,
    description: 'تم جلب المهام بنجاح',
  })
  getTasksByStatus(
    @Param('status') status: TaskStatus,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.getTasksByStatus(status, req.user.userId);
  }

  @Patch(':id/assign/:assigneeId')
  @ApiOperation({ summary: 'تكليف مهمة لمستخدم' })
  @ApiResponse({
    status: 200,
    description: 'تم تكليف المهمة بنجاح',
  })
  @ApiResponse({
    status: 403,
    description: 'فقط منشئ المهمة يمكنه تكليفها',
  })
  assignTask(
    @Param('id') taskId: string,
    @Param('assigneeId') assigneeId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.assignTask(taskId, assigneeId, req.user.userId);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'تحديث حالة المهمة' })
  @ApiResponse({
    status: 200,
    description: 'تم تحديث حالة المهمة بنجاح',
  })
  @ApiResponse({
    status: 403,
    description: 'ليس لديك صلاحية لتحديث حالة هذه المهمة',
  })
  updateStatus(
    @Param('id') taskId: string,
    @Param('status') status: TaskStatus,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.taskService.updateStatus(taskId, status, req.user.userId);
  }
}

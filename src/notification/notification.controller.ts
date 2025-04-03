import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notifications for a user' })
  findAllByUser(@Param('userId') userId: string) {
    return this.notificationService.findAllByUser(userId);
  }

  @Get('user/:userId/unread')
  @ApiOperation({ summary: 'Get unread notifications for a user' })
  findUnreadByUser(@Param('userId') userId: string) {
    return this.notificationService.findUnreadByUser(userId);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all notifications for a client' })
  findAllByClient(@Param('clientId') clientId: string) {
    return this.notificationService.findAllByClient(clientId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  delete(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}

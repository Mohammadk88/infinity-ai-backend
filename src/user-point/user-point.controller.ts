import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserPointService } from './user-point.service';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { UpdateUserPointDto } from './dto/update-user-point.dto';

@ApiTags('User Points')
@Controller('user-points')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user points' })
  findAll() {
    return this.userPointService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user point info by userId' })
  findOne(@Param('userId') userId: string) {
    return this.userPointService.findOneByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create user point record' })
  create(@Body() createDto: CreateUserPointDto) {
    return this.userPointService.create(createDto);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user point record by userId' })
  update(
    @Param('userId') userId: string,
    @Body() updateDto: UpdateUserPointDto,
  ) {
    return this.userPointService.update(userId, updateDto);
  }

  @Patch(':userId/add')
  @ApiOperation({ summary: 'Add points to a user' })
  addPoints(@Param('userId') userId: string, @Query('points') points: number) {
    return this.userPointService.addPoints(userId, +points);
  }

  @Patch(':userId/deduct')
  @ApiOperation({ summary: 'Deduct points from a user' })
  deductPoints(
    @Param('userId') userId: string,
    @Query('points') points: number,
  ) {
    return this.userPointService.deductPoints(userId, +points);
  }
}

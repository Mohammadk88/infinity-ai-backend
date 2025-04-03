import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Team Members')
@Controller('team-members')
export class TeamMemberController {
  constructor(private readonly service: TeamMemberService) {}

  @Post()
  @ApiOperation({ summary: 'Add member to a team' })
  create(@Body() dto: CreateTeamMemberDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team member by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update team member' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove team member' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

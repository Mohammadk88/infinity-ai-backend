import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CreateCompanyMemberDto } from './dto/create-company-member.dto';
import { UpdateCompanyMemberDto } from './dto/update-company-member.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCompanyMemberRoleDto } from './dto/update-company-member-role.dto';
import { ToggleCompanyMemberStatusDto } from './dto/toggle-company-member-status.dto';

@ApiTags('Company Members')
@Controller('company-members')
export class CompanyMemberController {
  constructor(private readonly service: CompanyMemberService) {}

  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.service.findAllByCompany(companyId);
  }
  @Post('add-member')
  async addMember(@Body() dto: CreateCompanyMemberDto) {
    const invitedBy = ''; // 👈 بعدين من CurrentUser (فيه userId)
    const member = await this.service.addMember(
      {
        companyId: dto.companyId,
        roleId: dto.roleId,
        userId: dto.userId,
        addedBy: invitedBy,
      },
      invitedBy,
    );

    if (member) return { status: 'added', member };
    return { status: 'invite_required', email: dto.userId };
  }
  @Post()
  create(@Body() dto: CreateCompanyMemberDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyMemberDto) {
    return this.service.update(id, dto);
  }

  @Patch(':memberId/role')
  updateRole(
    @Param('memberId') memberId: string,
    @Body() dto: UpdateCompanyMemberRoleDto,
  ) {
    return this.service.updateRole(memberId, dto);
  }

  @Patch(':memberId/toggle-status')
  toggleStatus(
    @Param('memberId') memberId: string,
    @Body() dto: ToggleCompanyMemberStatusDto,
  ) {
    return this.service.toggleStatus(memberId, dto);
  }

  @Delete(':memberId')
  remove(@Param('memberId') memberId: string) {
    return this.service.removeMember(memberId);
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new company invitation' })
  @ApiResponse({ status: 201, description: 'Invitation created' })
  async create(@Body() dto: CreateInvitationDto) {
    // Optional: check if invitation already exists for this email + company
    const existing = await this.invitationService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        'An active invitation already exists for this email',
      );
    }

    return this.invitationService.create(dto);
  }

  @Get(':token')
  @ApiOperation({ summary: 'Get invitation by token' })
  @ApiResponse({ status: 200, description: 'Invitation found' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async getByToken(@Param('token') token: string) {
    const invitation = await this.invitationService.findByToken(token);
    if (!invitation) {
      throw new NotFoundException('Invitation not found or expired');
    }
    const valid =
      invitation.status === 'PENDING' && invitation.expiresAt > new Date();

    return {
      email: invitation.email,
      companyId: invitation.companyId,
      roleId: invitation.roleId,
      companyName: invitation.company?.name || null,
      roleName: invitation.role?.name || null,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
      valid,
    };
  }
  @Post(':token/accept')
  @HttpCode(200)
  @ApiOperation({ summary: 'Accept invitation by token' })
  @ApiResponse({ status: 200, description: 'Invitation accepted' })
  async accept(@Param('token') token: string) {
    await this.invitationService.markAsAccepted(token);
    return { message: 'Invitation accepted' };
  }

  @Post(':token/cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel invitation by token' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled' })
  async cancel(@Param('token') token: string) {
    await this.invitationService.cancel(token);
    return { message: 'Invitation cancelled' };
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UserService } from 'src/users/users.service';
import { CompanyMemberService } from 'src/company-member/company-member.service';
import { RegisterFromInvitationDto } from './dto/register-from-invitation.dto';
import { InvitationService } from 'src/invitation/invitation.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly invitationService: InvitationService,
    private readonly companyMemberService: CompanyMemberService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('register-company')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register a new company with owner' })
  @ApiResponse({
    status: 200,
    description: 'Company and user created successfully',
  })
  registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.authService.registerCompany(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginDto);

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // يوم واحد
    });

    return { message: 'Login successful' };
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { id: string }) {
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { affiliate: true },
    });
    return {
      ...fullUser,
      referralCode: fullUser?.affiliate?.referralCode || null,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }
  @Get('csrf-token')
  getCsrfToken(@Req() req: { csrfToken: () => string }) {
    return { csrfToken: req.csrfToken() };
  }

  @Post('register-from-invitation')
  @ApiOperation({ summary: 'Register user from invitation' })
  async registerFromInvitation(@Body() dto: RegisterFromInvitationDto) {
    const invitation = await this.invitationService.findByToken(dto.token);

    if (!invitation || invitation.status !== 'PENDING') {
      throw new BadRequestException('Invitation is not valid or already used');
    }

    const existingUser = await this.userService.findByEmail(invitation.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // 1. إنشاء المستخدم
    const user = await this.userService.create({
      email: invitation.email,
      name: dto.name,
      password: dto.password,
      emailVerified: true,
    });

    // 2. ربط المستخدم بالشركة كـ member
    await this.companyMemberService.create({
      userId: user.id,
      companyId: invitation.companyId,
      roleId: invitation.roleId,
    });

    // 3. تحديث الدعوة إلى accepted
    await this.invitationService.markAsAccepted(dto.token);

    return { message: 'Account created and invitation accepted' };
  }
}

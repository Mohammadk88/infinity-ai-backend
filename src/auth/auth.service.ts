import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UserPointService } from '../user-point/user-point.service';
import { ReferralService } from 'src/referral/referral.service';
@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private pointsService: UserPointService,
    private referralService: ReferralService, // Inject ReferralService
  ) {}

  /**
   * Generate a unique referral code
   * @returns string
   */
  private async generateUniqueReferralCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;

    let code: string = '';
    let exists = true;

    while (exists) {
      code = Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)],
      ).join('');
      const existing = await this.prisma.affiliate.findUnique({
        where: { referralCode: code },
      });
      exists = !!existing;
    }

    return code;
  }
  /**
   * Register a new user and return token and user object
   * @param dto RegisterDto
   * @returns Promise<{ token: string; user: User }>
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(createUserDto: RegisterDto) {
    const { email, password, name, referralCode } = createUserDto;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // If user wants to be an affiliate, create affiliate record
    if (createUserDto.isAffiliate) {
      const generatedReferralCode = await this.generateUniqueReferralCode();
      const affiliate = await this.prisma.affiliate.create({
        data: {
          userId: user.id,
          referralCode: generatedReferralCode,
          createdBy: user.id,
        },
      });
      await this.prisma.user.update({
        where: { id: user.id },
        data: { affiliateId: affiliate.id },
      });
    }

    // Handle referral code logic using ReferralService
    if (referralCode) {
      try {
        await this.referralService.handleReferralOnRegistration(
          user.id,
          referralCode,
          { rewardUser: true }, // Optionally pass sourceId if available
        );
        // Optionally update referredBy field
        await this.prisma.user.update({
          where: { id: user.id },
          data: { referredBy: referralCode },
        });
      } catch (err) {
        // If referral code is invalid, ignore or throw error as needed
        // throw new BadRequestException('Invalid referral code');
      }
    }

    return { message: 'Registration successful', userId: user.id };
  }

  /**
   * Login an existing user by checking email and password
   * @param dto LoginDto
   * @returns Promise<{ token: string; user: User }>
   */
  async login(dto: LoginDto): Promise<{ token: string; user: User }> {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    return { token, user };
  }

  /**
   * Validate user credentials
   * @param email User email
   * @param password User password
   * @returns Promise<User>
   */
  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}

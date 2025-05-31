import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LinkedinPublishService } from './linkedin-publish.service';
import { LinkedInAuthService } from './linkedin-auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { PublishLinkedinDto } from './dto/publish-linkedin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('LinkedIn')
@Controller('linkedin')
export class LinkedInController {
  constructor(
    private readonly linkedInPublishService: LinkedinPublishService,
    private readonly linkedInService: LinkedInAuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get LinkedIn auth URL' })
  @ApiResponse({ status: 200, description: 'Auth URL returned successfully' })
  getAuthUrl(@CurrentUser() user: JwtPayload) {
    return this.linkedInService.getAuthUrl(user.id, user.clientId);
  }
  @Get('callback')
  @HttpCode(HttpStatus.OK)
  @Get('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle LinkedIn OAuth callback' })
  @ApiResponse({ status: 200, description: 'Authorization successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  handleCallback(@Query() query: { code: string; state: string }) {
    return this.linkedInService.handleCallback(query.code, query.state);
  }
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish a post to LinkedIn' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  @ApiResponse({ status: 404, description: 'Post or social account not found' })
  @Post('publish')
  @UseGuards(JwtAuthGuard)
  async publishToLinkedin(@Body() dto: PublishLinkedinDto) {
    try {
      const post = await this.prisma.socialPost.findUniqueOrThrow({
        where: { id: dto.postId },
      });

      const account = await this.prisma.socialAccount.findUniqueOrThrow({
        where: { id: dto.socialAccountId },
      });

      return this.linkedInPublishService.publish(post, account);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2025'
      ) {
        const prismaError = error as { meta?: { cause?: string } };
        throw new NotFoundException(
          prismaError.meta?.cause || 'Record not found',
        );
      }
      throw error;
    }
  }
}

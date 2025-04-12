import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LinkedInPublishService } from './linkedin-publish.service';
import { LinkedInService } from './linkedin.service';
import { LinkedInPublishDto } from './dto/linkedin.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags('LinkedIn')
@Controller('linkedin')
export class LinkedInController {
  constructor(
    private readonly linkedInPublishService: LinkedInPublishService,
    private readonly linkedInService: LinkedInService,
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
  @ApiOperation({ summary: 'Handle LinkedIn OAuth callback' })
  @ApiResponse({ status: 200, description: 'Authorization successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  handleCallback(@Query() query: { code: string; state: string }) {
    return this.linkedInService.handleCallback(query.code, query.state);
  }

  @Post('publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish post on LinkedIn (text + optional image)' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async publish(@Body() body: LinkedInPublishDto) {
    return this.linkedInPublishService.publish(
      body.socialAccountId,
      body.content,
      body.mediaUrl,
    );
  }
}

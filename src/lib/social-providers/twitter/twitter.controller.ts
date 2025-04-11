import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TwitterAuthService } from './twitter-auth.service';
import { PublishTweetDto } from './dto/publish-tweet.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags('Social Providers – Twitter')
@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterAuthService: TwitterAuthService) {}

  @Get('auth-url')
  @ApiOperation({ summary: 'Get Twitter OAuth URL' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'clientId', required: false })
  async getAuthUrl(
    @Query('userId') userId: string,
    @Query('clientId') clientId?: string,
  ): Promise<object> {
    const url = await this.twitterAuthService.getAuthUrl(
      clientId || '',
      userId,
    );
    return { url };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Twitter OAuth Callback' })
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!code || !state) {
      console.log('❌ Missing state or code in callback', {
        state,
        code,
      });
      throw new BadRequestException('Missing Twitter OAuth state or code');
    }

    try {
      const result = await this.twitterAuthService.handleCallback(code, state);
      return res.send(result); // أو redirect إذا بدك
    } catch (error) {
      console.log('❌ Callback error', error);
      throw new InternalServerErrorException(
        'Failed to handle Twitter callback',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('publish')
  @ApiOperation({ summary: 'Publish a tweet to Twitter' })
  @ApiResponse({ status: 201, description: 'Tweet published successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  publishTweet(@Body() dto: PublishTweetDto, @CurrentUser() user: JwtPayload) {
    return this.twitterAuthService.publish(user.id, dto.clientId, dto.content);
  }
}

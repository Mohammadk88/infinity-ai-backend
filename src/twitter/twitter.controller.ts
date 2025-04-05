import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { Response } from 'express';
import { TwitterCallbackDto } from './dto/twitter-callback.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTwitterPostDto } from './dto/create-twitter-post.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Social Media : Twitter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @ApiOperation({ summary: 'auth url' })
  @Get('auth-url')
  async getAuthUrl(@Res() res: Response) {
    const url = await this.twitterService.getAuthUrl();
    return res.redirect(url);
  }

  @ApiOperation({ summary: 'callback' })
  @Get('callback')
  async handleCallback(
    @Query() query: TwitterCallbackDto,
    @Res() res: Response,
  ) {
    const result = await this.twitterService.handleCallback(
      query.oauth_token,
      query.oauth_verifier,
      query,
    );
    return res.send(result); // أو بتعمله redirect مع save للحساب
  }
  @ApiOperation({ summary: 'publish Twitter' })
  @Post('publish')
  @UseGuards(JwtAuthGuard)
  publishTweet(
    @Body() dto: CreateTwitterPostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.twitterService.publishTweet(dto, user);
  }
}

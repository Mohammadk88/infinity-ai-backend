import { Controller, Get, Query, Res } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { Response } from 'express';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get('auth-url')
  async getAuthUrl(@Res() res: Response) {
    const url = await this.twitterService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async handleCallback(
    @Query('oauth_token') oauthToken: string,
    @Query('oauth_verifier') oauthVerifier: string,
    @Res() res: Response,
  ) {
    const result = await this.twitterService.handleCallback(
      oauthToken,
      oauthVerifier,
    );
    return res.send(result);
  }
}

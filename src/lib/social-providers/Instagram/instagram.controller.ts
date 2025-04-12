import { Controller, Get, Query, Res } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('auth-url')
  @ApiOperation({ summary: 'Generate Instagram OAuth URL' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  @ApiQuery({ name: 'clientId', required: true, description: 'Client ID' })
  async getAuthUrl(
    @Query('userId') userId: string,
    @Query('clientId') clientId: string,
  ): Promise<{ url: string }> {
    const url = await this.instagramService.getAuthUrl(userId, clientId);
    return { url };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Instagram OAuth Callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'OAuth code from Instagram',
  })
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'State with userId and clientId',
  })
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    await this.instagramService.handleCallback(code, state);
    res.redirect(process.env.INSTAGRAM_REDIRECT_URL || 'http://localhost:3000');
  }
}

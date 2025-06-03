import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { OAuthCallbackDto } from './dto/oauth-callback.dto';

@ApiTags('Social Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social-accounts')
export class SocialAccountsController {
  constructor(private readonly service: SocialAccountsService) {}

  @Get('grouped')
  @UseGuards(AuthGuard('jwt'))
  async getGroupedAccounts(@CurrentUser() user: JwtPayload) {
    const accounts = await this.service.findAll(user.sub);

    const grouped = accounts.reduce((acc: Record<string, any[]>, account) => {
      const key = account.platform;
      if (!acc[key]) acc[key] = [];
      acc[key].push(account);
      return acc;
    }, {});

    return grouped;
  }
  @Post()
  @ApiOperation({ summary: 'Link a new social account' })
  create(@Body() dto: CreateSocialAccountDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all linked accounts for the user' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update linked account data' })
  update(@Param('id') id: string, @Body() dto: UpdateSocialAccountDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disable or soft delete the account' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
  @Post('get-account-stats')
  @ApiOperation({ summary: 'Get statistics for Test' })
  getAccountStats(@CurrentUser() user: JwtPayload) {
    console.log('📊 Getting stats for:', user.id);
    return this.service.getStats(user.id);
  }
  @Post('my-social-accounts')
  @ApiOperation({ summary: 'Get statistics for Test' })
  getSocialAccounts(@CurrentUser() user: JwtPayload) {
    console.log('📊 Getting social-accounts for:', user.id);
    return this.service.getAccountsForUser(user.id);
  }

  @Get('oauth/:platform/authorize')
  getOAuthUrl(
    @Param('platform') platform: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.getOAuthAuthorizationUrl(
      platform,
      user.id,
      user.clientId,
    );
  }

  @Post('oauth/:platform/callback')
  handleOAuthCallback(
    @Param('platform') platform: string,
    @Body() body: OAuthCallbackDto,
  ) {
    return this.service.handleOAuthCallback(platform, body.code, body.state);
  }
}

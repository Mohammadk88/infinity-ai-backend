import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { FacebookCallbackDto } from './dto/facebook-auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Facebook Auth')
@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookAuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth-url')
  @ApiOperation({ summary: 'Get Facebook OAuth URL' })
  async getAuthUrl(@CurrentUser() user: JwtPayload) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.facebookService.getAuthUrl(user.id, user.clientId);
  }

  @Get('callback')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'State param with userId:clientId',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Authorization code from Facebook',
  })
  handleCallback(@Query() query: FacebookCallbackDto) {
    return this.facebookService.handleCallback(query.code, query.state);
  }
}

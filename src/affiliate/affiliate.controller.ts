import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AffiliateStatsDto } from './dto/affiliate-stats.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Affiliate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('me')
  @ApiOkResponse({ type: AffiliateStatsDto })
  @ApiOperation({ summary: 'Get my affiliate stats' })
  async getMyAffiliate(@Req() req: { user: JwtPayload }) {
    const userId = req.user.id;

    const affiliate = await this.affiliateService.getAffiliateStats(userId);

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }
  @Post('request')
  @ApiOperation({ summary: 'Request to join the affiliate program' })
  async requestAffiliate(@CurrentUser('id') userId: string) {
    return this.affiliateService.requestAffiliateAccount(userId);
  }
}

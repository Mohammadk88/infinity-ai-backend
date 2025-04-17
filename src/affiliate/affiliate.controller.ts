import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { AffiliateStatsDto } from './dto/affiliate-stats.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags('Affiliate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('me')
  @ApiOkResponse({ type: AffiliateStatsDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user affiliate info' })
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

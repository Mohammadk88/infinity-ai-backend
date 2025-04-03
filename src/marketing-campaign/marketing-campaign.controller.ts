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
import { MarketingCampaignService } from './marketing-campaign.service';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiBearerAuth()
@ApiTags('Marketing Campaigns')
@UseGuards(JwtAuthGuard)
@Controller('marketing-campaigns')
export class MarketingCampaignController {
  constructor(private readonly service: MarketingCampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new marketing campaign' })
  create(
    @Body() dto: CreateMarketingCampaignDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(dto, user.clientId, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for current client' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAll(user.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.service.findOne(id, user.clientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update campaign by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMarketingCampaignDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.update(id, dto, user.clientId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign by ID' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.service.remove(id, user.clientId);
  }
}

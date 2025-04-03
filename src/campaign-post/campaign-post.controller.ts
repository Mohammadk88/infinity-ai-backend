import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CampaignPostService } from './campaign-post.service';
import { CreateCampaignPostDto } from './dto/create-campaign-post.dto';
import { UpdateCampaignPostDto } from './dto/update-campaign-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Campaign Posts')
@UseGuards(JwtAuthGuard)
@Controller('campaign-posts')
export class CampaignPostController {
  constructor(private readonly service: CampaignPostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campaign post' })
  create(@Body() dto: CreateCampaignPostDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts for a campaign' })
  findAll(@Query('campaignId') campaignId: string) {
    return this.service.findAll(campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignPostDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

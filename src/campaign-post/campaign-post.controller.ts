import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignPostService } from './campaign-post.service';
import { CreateCampaignPostDto } from './dto/create-campaign-post.dto';
import { UpdateCampaignPostDto } from './dto/update-campaign-post.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Campaign Posts')
@Controller('campaign-posts')
export class CampaignPostController {
  constructor(private readonly service: CampaignPostService) {}

  @Post()
  @ApiOperation({ summary: 'Create campaign post' })
  create(@Body() dto: CreateCampaignPostDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign posts' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign post by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign post' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignPostDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign post' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

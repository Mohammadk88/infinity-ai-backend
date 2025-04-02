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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateSocialPostDto } from './dto/update-social-post.dto';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { SocialPostsService } from './social-post.service';
import { GenerateSocialPostDto } from './dto/generate-social-post.dto';

@ApiTags('Social Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social-posts')
export class SocialPostsController {
  constructor(private readonly service: SocialPostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(@Body() dto: CreateSocialPostDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user posts' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific post' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  update(@Param('id') id: string, @Body() dto: UpdateSocialPostDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('generate-only')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'توليد منشور ذكي بدون حفظ' })
  @ApiBearerAuth()
  generateOnly(
    @Body() dto: GenerateSocialPostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    console.log('Sending prompt to AI:', dto);
    return this.service.generateOnly(dto, user.sub);
  }
}

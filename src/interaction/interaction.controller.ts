import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InteractionDto } from './dto/interaction.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

@ApiTags('Interactions')
@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @ApiOperation({ summary: 'Create a new interaction' })
  @ApiResponse({ status: 201, type: InteractionDto })
  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('permissions', ['create_interaction'])
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @ApiOperation({ summary: 'Retrieve all interactions' })
  @ApiResponse({ status: 200, type: [InteractionDto] })
  @Get()
  findAll() {
    return this.interactionService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a single interaction by ID' })
  @ApiResponse({ status: 200, type: InteractionDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an interaction by ID' })
  @ApiResponse({ status: 200, type: InteractionDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ) {
    return this.interactionService.update(id, updateInteractionDto);
  }

  @ApiOperation({ summary: 'Delete an interaction by ID' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interactionService.remove(id);
  }
}

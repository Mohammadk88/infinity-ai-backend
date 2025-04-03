import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('FileUpload')
@ApiBearerAuth()
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new file' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createFileUploadDto: CreateFileUploadDto,
  ) {
    return this.fileUploadService.create(user.sub, createFileUploadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files uploaded by the user' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.fileUploadService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single file' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.fileUploadService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update file details' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateFileUploadDto: UpdateFileUploadDto,
  ) {
    return this.fileUploadService.update(id, user.sub, updateFileUploadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file (soft delete)' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.fileUploadService.remove(id, user.sub);
  }
}

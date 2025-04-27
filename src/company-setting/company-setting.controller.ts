import {
  Controller,
  Put,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  Get,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CompanySettingService } from './company-setting.service';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Company Settings')
@Controller('companies/:id/setting')
export class CompanySettingController {
  constructor(private readonly service: CompanySettingService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get company settings by company ID' })
  async getCompanySettings(@Param('id') companyId: string) {
    return this.service.getByCompanyId(companyId);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update company settings including logo and cover' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads',
          filename: (_req, file, cb) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
      },
    ),
  )
  async updateCompanySettings(
    @Param('id') companyId: string,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() dto: UpdateCompanySettingDto,
  ) {
    console.log('Files:', files);
    console.log('DTO:', dto);
    const logoPath = files?.logo?.[0]?.filename
      ? `/public/uploads/${files.logo[0].filename}`
      : undefined;
    const coverPath = files?.cover?.[0]?.filename
      ? `/public/uploads/${files.cover[0].filename}`
      : undefined;

    return this.service.updateCompanySettings(
      companyId,
      dto,
      logoPath,
      coverPath,
    );
  }
}

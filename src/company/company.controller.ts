import { Controller, Get, Put, Param, Body, HttpCode } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID including settings' })
  @ApiResponse({ status: 200, description: 'Company found successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update basic company information' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.service.update(id, dto);
  }
}

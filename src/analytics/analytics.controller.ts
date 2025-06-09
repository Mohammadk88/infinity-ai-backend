import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/auth.types';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/:companyId')
  @ApiOperation({ summary: 'Get company dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Company dashboard data' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to company' })
  getCompanyDashboard(
    @Param('companyId') companyId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.analyticsService.getCompanyDashboard(
      companyId,
      req.user.userId,
    );
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get project analytics' })
  @ApiResponse({ status: 200, description: 'Project analytics data' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to project' })
  getProjectAnalytics(
    @Param('projectId') projectId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.analyticsService.getProjectAnalytics(
      projectId,
      req.user.userId,
    );
  }

  @Get('marketing/:companyId')
  @ApiOperation({ summary: 'Get marketing analytics' })
  @ApiResponse({ status: 200, description: 'Marketing analytics data' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to company' })
  getMarketingAnalytics(
    @Param('companyId') companyId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.analyticsService.getMarketingAnalytics(
      companyId,
      req.user.userId,
    );
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user personal analytics' })
  @ApiResponse({ status: 200, description: 'User analytics data' })
  getUserAnalytics(@Request() req: AuthenticatedRequest) {
    return this.analyticsService.getUserAnalytics(req.user.userId);
  }
}

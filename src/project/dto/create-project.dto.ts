import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

enum ProjectType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  PERSONAL = 'personal',
}

enum ProjectPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'اسم المشروع',
    example: 'حملة التسويق الإلكتروني لمنتج XYZ',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'وصف المشروع',
    example: 'مشروع لإنشاء حملة تسويقية شاملة عبر منصات التواصل الاجتماعي',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'تاريخ بداية المشروع',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'تاريخ انتهاء المشروع',
    example: '2024-03-01T00:00:00.000Z',
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    description: 'حالة المشروع',
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
    default: ProjectStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus = ProjectStatus.ACTIVE;

  @ApiProperty({
    description: 'نوع المشروع',
    enum: ProjectType,
    example: ProjectType.EXTERNAL,
    default: ProjectType.INTERNAL,
  })
  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType = ProjectType.INTERNAL;

  @ApiProperty({
    description: 'أولوية المشروع',
    enum: ProjectPriority,
    example: ProjectPriority.HIGH,
    default: ProjectPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority = ProjectPriority.NORMAL;

  @ApiProperty({
    description: 'ميزانية المشروع',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({
    description: 'عملة الميزانية',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({
    description: 'معرف العميل (اختياري للمشاريع الخارجية)',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({
    description: 'معرف الشركة',
    example: 'company-uuid',
  })
  @IsString()
  companyId!: string;
}

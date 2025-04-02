import { PartialType } from '@nestjs/mapped-types';
import { CreateContentScheduleDto } from './create-content-schedule.dto';

export class UpdateContentScheduleDto extends PartialType(
  CreateContentScheduleDto,
) {}

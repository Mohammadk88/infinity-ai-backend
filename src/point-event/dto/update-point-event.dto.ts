import { PartialType } from '@nestjs/mapped-types';
import { CreatePointEventDto } from './create-point-event.dto';

export class UpdatePointEventDto extends PartialType(CreatePointEventDto) {}

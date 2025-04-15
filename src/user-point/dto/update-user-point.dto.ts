import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPointDto } from './create-user-point.dto';

export class UpdateUserPointDto extends PartialType(CreateUserPointDto) {}

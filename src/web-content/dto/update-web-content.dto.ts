import { PartialType } from '@nestjs/swagger';
import { CreateWebContentDto } from './create-web-content.dto';

export class UpdateWebContentDto extends PartialType(CreateWebContentDto) {}

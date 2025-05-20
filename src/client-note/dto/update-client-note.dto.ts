import { PartialType } from '@nestjs/swagger';
import { CreateClientNoteDto } from './create-client-note.dto';

export class UpdateClientNoteDto extends PartialType(CreateClientNoteDto) {}

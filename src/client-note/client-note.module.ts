import { Module } from '@nestjs/common';
import { ClientNoteService } from './client-note.service';
import { ClientNoteController } from './client-note.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientNoteController],
  providers: [ClientNoteService],
})
export class ClientNoteModule {}

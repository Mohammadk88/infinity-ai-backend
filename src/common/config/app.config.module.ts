import { Module, Global } from '@nestjs/common';
import { AppConfig } from './app.config';

@Global() // Make this module available everywhere without importing
@Module({
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}

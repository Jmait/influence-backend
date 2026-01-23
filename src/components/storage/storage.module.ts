import { Global, Logger, Module } from '@nestjs/common';

import { LOGGER_SERVICE, StorageService } from './storage.service';

@Global()
@Module({
  providers: [
    StorageService,
    {
      provide: LOGGER_SERVICE,
      useClass: Logger,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}

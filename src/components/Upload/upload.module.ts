import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFiles } from './entities/files.entity';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UploadedFiles])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

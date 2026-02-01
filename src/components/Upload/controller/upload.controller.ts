import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadService } from '../service/upload.service';
import { UploadDto } from '../dto/upload.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';

@ApiTags('Upload Management')
@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiBearerAuth('Bearer')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadDto,
  ) {
    const uploadedFiles = await this.uploadService.uploadImages(files, body);

    return { message: 'files successfully uploaded', uploadedFiles };
  }
}

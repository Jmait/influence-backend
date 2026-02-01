import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from 'src/components/storage/storage.service';
import { UploadDto, UploadedFilesInterface } from '../dto/upload.dto';
import { FileStatus, UploadedFiles } from '../entities/files.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UploadService {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(UploadedFiles)
    private readonly fileRepo: Repository<UploadedFiles>,
  ) {}

  async uploadImages(files: Express.Multer.File[], dto: UploadDto) {
    if (!files) {
      throw new BadRequestException('Please upload valid files');
    }

    console.log(files);

    if (files.length == 0) {
      throw new BadRequestException('You must upload at least a file');
    }
    const uploadedImagesId: UploadedFilesInterface[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = this.storageService.getFileByField(`file_${i}`, files);
      if (file) {
        const fileUrl = (
          await this.storageService.uploadPublicFiles(file.buffer, {
            userId: dto.userId,
            service: 'upload-service',
            folder: dto.folder,
            file_name: `${file.originalname}`,
            content_type: file.mimetype,
          })
        ).file_url;
        const fileEntity = this.fileRepo.create({
          url: fileUrl,
          size: file.size,
          type: file.mimetype,
          name: file.originalname,
          thumbnail: fileUrl,
        });
        const newFile = await this.fileRepo.save(fileEntity);
        uploadedImagesId.push({
          ...newFile,
        });
      }
    }

    return uploadedImagesId;
  }

  async updateClaimedFilesAndGet(
    fileId: string,
  ): Promise<UploadedFiles | null> {
    await this.fileRepo.update(fileId, { status: FileStatus.ATTACHED });

    return await this.fileRepo.findOne({ where: { fileId } });
  }
}

import { IsString, IsUUID } from 'class-validator';

export class UploadDto {
  @IsUUID()
  userId: string;

  @IsString()
  folder: string;
}

export interface UploadedFilesInterface {
  url?: string;
  fileId: string;
  type?: string;
  size?: number;
  name?: string;
  thumbnail?: string;
}

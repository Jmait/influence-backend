import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FileStatus {
  TEMP = 'TEMP',
  ATTACHED = 'ATTACHED',
}

@Entity('uploaded_files')
export class UploadedFiles {
  @PrimaryGeneratedColumn('uuid')
  fileId: string;

  @Column({ type: 'text', nullable: true })
  url?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @Column({ type: 'int', nullable: true })
  size?: number;

  @Column({ enum: FileStatus, default: FileStatus.TEMP })
  status?: string;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail?: string;
}

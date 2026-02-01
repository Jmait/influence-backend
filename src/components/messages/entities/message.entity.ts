import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  SYSTEM = 'system',
}

@Entity('messages')
@Index(['senderId', 'createdAt'])
@Index(['receiverId', 'createdAt'])
@Index(['status'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  conversationId: string;

  @Column({ type: 'varchar', length: 255 })
  senderId: string;

  @Column({ type: 'varchar', length: 255 })
  receiverId: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    url?: string;
    type?: string;
    size?: number;
    name?: string;
    thumbnail?: string;
  }[];

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  replyToMessageId: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;
}

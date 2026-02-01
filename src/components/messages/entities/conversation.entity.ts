import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/components/user/entities/user.entity';

export enum ConversationType {
  PRIVATE = 'private',
  GROUP = 'group',
}

@Entity('conversations')
@Index(['participant1Id', 'participant2Id'], { unique: true })
@Index(['conversationHash'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // For private conversations: smaller user ID goes first for consistency
  @Column({ type: 'uuid' })
  @Index()
  participant1Id: string;

  @Column({ type: 'uuid' })
  @Index()
  participant2Id: string;

  // Hash of sorted participant IDs for quick lookup
  @Column({ type: 'varchar', length: 512 })
  conversationHash: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.PRIVATE,
  })
  type: ConversationType;

  // Last message preview
  @Column({ type: 'text', nullable: true })
  lastMessageContent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastMessageSenderId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  // Unread counts per participant
  @Column({ type: 'jsonb', default: {} })
  unreadCounts: Record<string, number>;

  // Participant metadata (mute, block, archive status)
  @Column({ type: 'jsonb', default: {} })
  participantSettings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participant1Id' })
  participant1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participant2Id' })
  participant2: User;

  // Soft delete
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}

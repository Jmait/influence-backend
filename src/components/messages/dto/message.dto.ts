import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { MessageStatus, MessageType } from '../entities/message.entity';

import { Transform } from 'class-transformer';

export class UploadedFilesDto {
  @IsString()
  url?: string;

  @IsString()
  fileId: string;

  @IsString()
  type?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  size?: number;

  @IsString()
  name?: string;
  @IsString()
  thumbnail?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsOptional()
  attachments: UploadedFilesDto[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class MessageResponseDto {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  status: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export class UpdateMessageStatusDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsEnum(MessageStatus)
  status: MessageStatus;
}

export class GetMessagesDto {
  @IsString()
  @IsOptional()
  conversationId?: string;

  @IsString()
  @IsOptional()
  beforeMessageId?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

export enum MessagesAndConversationEvents {
  NEW_MESSAGE = 'new-message',
  MESSAGE_STATUS_UPDATE = 'message-status-update',
  SEND_MESSAGE = 'send-message',
  MESSAGE_ERROR = 'message-error',
  MESSAGE_SENT = 'message-sent',
  ISTYPING = 'typing',
  USER_TYPING = 'user-typing',
  GET_MESSAGES = 'get-messages',
}

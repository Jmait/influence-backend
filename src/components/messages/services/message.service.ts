import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import {
  Message,
  MessageStatus,
  MessageType,
} from '../entities/message.entity';
import {
  SendMessageDto,
  GetMessagesDto,
  UpdateMessageStatusDto,
} from '../dto/message.dto';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly messageRepository: MessageRepository,
    @InjectQueue('messages') private readonly messageQueue: Queue,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
    try {
      // Create message with PENDING status
      const message = await this.messageRepository.createMessage({
        senderId: sendMessageDto.senderId,
        receiverId: sendMessageDto.receiverId,
        content: sendMessageDto.content,
        type: sendMessageDto.type || MessageType.TEXT,
        status: MessageStatus.PENDING,
        metadata: sendMessageDto.metadata,
      });

      // Add to queue for async processing
      await this.messageQueue.add(
        'send-message',
        { messageId: message.id },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      this.logger.log(`Message ${message.id} queued for sending`);
      return message;
    } catch (error) {
      this.logger.error(
        `Failed to send message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateMessageStatus(body: UpdateMessageStatusDto): Promise<Message> {
    try {
      const { messageId, status } = body;
      const message = await this.messageRepository.updateStatus(
        messageId,
        status,
      );

      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }

      this.logger.log(`Message ${messageId} status updated to ${status}`);
      return message;
    } catch (error) {
      this.logger.error(
        `Failed to update message status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async markMessagesAsDelivered(messageIds: string[]): Promise<void> {
    try {
      await this.messageRepository.bulkUpdateStatus(
        messageIds,
        MessageStatus.DELIVERED,
      );
      this.logger.log(`${messageIds.length} messages marked as delivered`);
    } catch (error) {
      this.logger.error(
        `Failed to mark messages as delivered: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      await this.messageRepository.bulkUpdateStatus(
        messageIds,
        MessageStatus.READ,
      );
      this.logger.log(`${messageIds.length} messages marked as read`);
    } catch (error) {
      this.logger.error(
        `Failed to mark messages as read: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getMessages(query: GetMessagesDto): Promise<Message[]> {
    try {
      const message =
        await this.messageRepository.getConversationMessages(query);

      return message ?? [];
    } catch (error) {
      this.logger.error(
        `Failed to get messages: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getMessageById(messageId: string): Promise<Message> {
    try {
      const message = await this.messageRepository.findById(messageId);

      if (!message) {
        throw new NotFoundException(`Message with ID ${messageId} not found`);
      }

      return message;
    } catch (error) {
      this.logger.error(
        `Failed to get message by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async processPendingMessages(): Promise<void> {
    try {
      const pendingMessages =
        await this.messageRepository.findPendingMessages(100);

      for (const message of pendingMessages) {
        await this.messageQueue.add(
          'send-message',
          { messageId: message.id },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
          },
        );
      }

      this.logger.log(
        `${pendingMessages.length} pending messages added to queue`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process pending messages: ${error.message}`,
        error.stack,
      );
    }
  }
}

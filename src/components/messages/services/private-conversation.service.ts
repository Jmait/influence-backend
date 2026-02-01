import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationRepository } from '../repositories/conversation.repository';
import {
  Message,
  MessageStatus,
  MessageType,
} from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { GetMessagesDto } from '../dto/message.dto';
import { UploadService } from 'src/components/Upload/service/upload.service';
import { UploadedFilesInterface } from 'src/components/Upload/dto/upload.dto';

export interface SendPrivateMessageDto {
  senderId: string;
  receiverId: string;
  content: string;
  type?: MessageType;
  replyToMessageId?: string;
  attachments?: UploadedFilesInterface[];
  metadata?: Record<string, any>;
}

@Injectable()
export class PrivateConversationService {
  private readonly logger = new Logger(PrivateConversationService.name);

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly uploadService: UploadService,
    private readonly conversationRepository: ConversationRepository,
    @InjectQueue('messages') private readonly messageQueue: Queue,
  ) {
    console.log(messageQueue.client.options, 'bull');
  }

  /**
   * Send a message in a private conversation
   * Automatically creates conversation if it doesn't exist
   */
  async sendMessage(dto: SendPrivateMessageDto): Promise<Message> {
    try {
      // Get or create conversation
      const conversation =
        await this.conversationRepository.getOrCreatePrivateConversation(
          dto.senderId,
          dto.receiverId,
        );
      const attachments: UploadedFilesInterface[] = [];

      if (dto.attachments && dto.attachments?.length > 0) {
        for (const attachment of dto.attachments) {
          const fileAttached =
            await this.uploadService.updateClaimedFilesAndGet(
              attachment.fileId,
            );
          if (fileAttached) {
            attachments.push(fileAttached);
          }
        }
      }
      // Create message
      const message = await this.messageRepository.createMessage({
        conversationId: conversation.id,
        senderId: dto.senderId,
        receiverId: dto.receiverId,
        content: dto.content,
        type: dto.type || MessageType.TEXT,
        status: MessageStatus.PENDING,
        replyToMessageId: dto.replyToMessageId,
        attachments,
        metadata: dto.metadata,
      });

      // Update conversation last message
      await this.conversationRepository.updateLastMessage(
        conversation.id,
        dto.senderId,
        dto.content,
        message.createdAt,
      );

      // Increment unread count for receiver
      await this.conversationRepository.incrementUnreadCount(
        conversation.id,
        dto.receiverId,
      );

      //reset sender read count to 0 and mark all messages previous recieved as read
      await this.markConversationAsRead(conversation.id, dto.senderId);

      // Queue message for async processing
      await this.messageQueue.add(
        'send-message',
        { messageId: message.id },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
        },
      );

      this.logger.log(
        `Message ${message.id} queued in conversation ${conversation.id}`,
      );

      return message;
    } catch (error) {
      this.logger.error(
        `Failed to send message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get conversation between two users
   */
  async getConversation(
    userId1: string,
    userId2: string,
  ): Promise<Conversation> {
    return await this.conversationRepository.getOrCreatePrivateConversation(
      userId1,
      userId2,
    );
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Conversation[]> {
    return await this.conversationRepository.getUserConversations(
      userId,
      limit,
      offset,
    );
  }

  /**
   * Get messages in a conversation with pagination
   * Uses cursor-based pagination for better performance
   */
  async getConversationMessages(query: GetMessagesDto): Promise<Message[]> {
    // Verify user is part of conversation
    const { conversationId } = query;
    const conversation = await this.conversationRepository.findById(
      conversationId ?? '',
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return await this.messageRepository.getConversationMessages(query);
  }

  /**
   * Mark all messages in a conversation as read
   */
  async markConversationAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    // Mark messages as read
    await this.messageRepository.markConversationAsRead(conversationId, userId);

    // Reset unread count
    await this.conversationRepository.resetUnreadCount(conversationId, userId);

    this.logger.log(
      `Conversation ${conversationId} marked as read by ${userId}`,
    );
  }

  /**
   * Mark specific messages as read
   */
  async markMessagesAsRead(
    messageIds: string[],
    userId: string,
  ): Promise<void> {
    if (messageIds.length === 0) return;

    // Update message status
    await this.messageRepository.bulkUpdateStatus(
      messageIds,
      MessageStatus.READ,
    );

    // Get conversation ID from first message
    const firstMessage = await this.messageRepository.findById(messageIds[0]);
    if (firstMessage) {
      // Decrement unread count
      const unreadCount = await this.messageRepository.countUnreadMessages(
        firstMessage.conversationId,
        userId,
      );

      // If no more unread messages, reset count
      if (unreadCount === 0) {
        await this.conversationRepository.resetUnreadCount(
          firstMessage.conversationId,
          userId,
        );
      }
    }
  }

  /**
   * Get total unread count across all conversations
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    return await this.conversationRepository.getTotalUnreadCount(userId);
  }

  /**
   * Get unread conversations
   */
  async getUnreadConversations(userId: string): Promise<Conversation[]> {
    return await this.conversationRepository.getUnreadConversations(userId);
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('You can only delete your own messages');
    }

    await this.messageRepository.deleteMessage(messageId);

    this.logger.log(`Message ${messageId} deleted by ${userId}`);
  }

  /**
   * Search messages in a conversation
   */
  async searchConversationMessages(
    conversationId: string,
    query: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messageRepository.searchMessages(
      conversationId,
      query,
      limit,
    );
  }

  /**
   * Get media messages in a conversation
   */
  async getConversationMedia(
    conversationId: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messageRepository.getMediaMessages(conversationId, limit);
  }

  /**
   * Mute/unmute a conversation
   */
  async muteConversation(
    conversationId: string,
    userId: string,
    muted: boolean,
  ): Promise<void> {
    await this.conversationRepository.updateParticipantSettings(
      conversationId,
      userId,
      { muted },
    );

    this.logger.log(
      `Conversation ${conversationId} ${muted ? 'muted' : 'unmuted'} by ${userId}`,
    );
  }

  /**
   * Archive/unarchive a conversation
   */
  async archiveConversation(
    conversationId: string,
    userId: string,
    archived: boolean,
  ): Promise<void> {
    await this.conversationRepository.updateParticipantSettings(
      conversationId,
      userId,
      { archived },
    );

    this.logger.log(
      `Conversation ${conversationId} ${archived ? 'archived' : 'unarchived'} by ${userId}`,
    );
  }

  /**
   * Delete a conversation (soft delete)
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.conversationRepository.deleteConversation(conversationId);
    this.logger.log(`Conversation ${conversationId} deleted`);
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(conversationId: string): Promise<any> {
    return await this.messageRepository.getConversationStats(conversationId);
  }

  /**
   * Search conversations
   */
  async searchConversations(
    userId: string,
    query: string,
    limit: number = 20,
  ): Promise<Conversation[]> {
    return await this.conversationRepository.searchConversations(
      userId,
      query,
      limit,
    );
  }
}

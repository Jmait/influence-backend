import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Message, MessageStatus } from '../entities/message.entity';
import { GetMessagesDto } from '../dto/message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {}

  /**
   * Create a new message
   */
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message = this.repository.create(messageData);
    return await this.repository.save(message);
  }

  /**
   * Bulk create messages
   */
  async bulkCreateMessages(
    messagesData: Partial<Message>[],
  ): Promise<Message[]> {
    const messages = this.repository.create(messagesData);
    return await this.repository.save(messages);
  }

  /**
   * Find message by ID (excluding soft-deleted)
   */
  async findById(id: string): Promise<Message | null> {
    return await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  /**
   * Get messages in a conversation with pagination
   * Optimized query using conversation ID index
   */
  async getConversationMessages(query: GetMessagesDto): Promise<Message[]> {
    const { conversationId, limit, beforeMessageId } = query;
    const message = this.repository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .limit(limit);

    // Cursor-based pagination for better performance
    if (beforeMessageId) {
      const beforeMessage = await this.findById(beforeMessageId);
      if (beforeMessage) {
        message.andWhere('message.createdAt < :beforeDate', {
          beforeDate: beforeMessage.createdAt,
        });
      }
    }

    return await message.getMany();
  }

  /**
   * Get unread messages in a conversation for a specific user
   */
  async getUnreadMessages(
    conversationId: string,
    userId: string,
  ): Promise<Message[]> {
    return await this.repository.find({
      where: {
        conversationId,
        receiverId: userId,
        status: MessageStatus.DELIVERED,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  /**
   * Update message status
   */
  async updateStatus(
    messageId: string,
    status: MessageStatus,
  ): Promise<Message | null> {
    const updateData: any = { status };

    if (status === MessageStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === MessageStatus.READ) {
      updateData.readAt = new Date();
      // Also set deliveredAt if not already set
      const message = await this.findById(messageId);
      if (message && !message.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }

    await this.repository.update({ id: messageId }, updateData);
    return await this.findById(messageId);
  }

  /**
   * Bulk update message status (optimized for marking multiple messages as read)
   */
  async bulkUpdateStatus(
    messageIds: string[],
    status: MessageStatus,
  ): Promise<void> {
    if (messageIds.length === 0) return;

    const updateData: any = { status };

    if (status === MessageStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === MessageStatus.READ) {
      updateData.readAt = new Date();
    }

    await this.repository
      .createQueryBuilder()
      .update(Message)
      .set(updateData)
      .where('id IN (:...messageIds)', { messageIds })
      .execute();
  }

  /**
   * Mark all messages in conversation as read for a user
   */
  async markConversationAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Message)
      .set({
        status: MessageStatus.READ,
        readAt: new Date(),
      })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('receiverId = :userId', { userId })
      .andWhere('status != :readStatus', { readStatus: MessageStatus.READ })
      .andWhere('deletedAt IS NULL')
      .execute();
  }

  /**
   * Soft delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    await this.repository.update(messageId, {
      deletedAt: new Date(),
      content: 'This message was deleted',
    });
  }

  /**
   * Get pending messages for delivery
   */
  async findPendingMessages(limit: number = 100): Promise<Message[]> {
    return await this.repository.find({
      where: {
        status: MessageStatus.PENDING,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'ASC',
      },
      take: limit,
    });
  }

  /**
   * Search messages in a conversation
   */
  async searchMessages(
    conversationId: string,
    query: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.repository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.content ILIKE :query', { query: `%${query}%` })
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Get messages with attachments in a conversation
   */
  async getMediaMessages(
    conversationId: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.repository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.attachments IS NOT NULL')
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Count unread messages in a conversation
   */
  async countUnreadMessages(
    conversationId: string,
    userId: string,
  ): Promise<number> {
    return await this.repository.count({
      where: {
        conversationId,
        receiverId: userId,
        status: MessageStatus.DELIVERED,
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Get message statistics for a conversation
   */
  async getConversationStats(conversationId: string): Promise<{
    totalMessages: number;
    lastMessageAt: Date | null;
    messagesByType: Record<string, number>;
  }> {
    const messages = await this.repository.find({
      where: { conversationId, deletedAt: IsNull() },
      select: ['type', 'createdAt'],
    });

    const messagesByType: Record<string, number> = {};
    let lastMessageAt: Date | null = null;

    messages.forEach((msg) => {
      messagesByType[msg.type] = (messagesByType[msg.type] || 0) + 1;
      if (!lastMessageAt || msg.createdAt > lastMessageAt) {
        lastMessageAt = msg.createdAt;
      }
    });

    return {
      totalMessages: messages.length,
      lastMessageAt,
      messagesByType,
    };
  }

  /**
   * Clean up old deleted messages (for maintenance)
   */
  async cleanupOldDeletedMessages(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where('deletedAt IS NOT NULL')
      .andWhere('deletedAt < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}

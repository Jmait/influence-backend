import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  Conversation,
  ConversationType,
} from '../entities/conversation.entity';
import * as crypto from 'node:crypto';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly repository: Repository<Conversation>,
  ) {}

  /**
   * Create a conversation hash from two user IDs
   * Always sorts IDs to ensure consistency
   */
  private createConversationHash(userId1: string, userId2: string): string {
    const sorted = [userId1, userId2].sort((a, b) => a.localeCompare(b));

    return crypto
      .createHash('sha256')
      .update(`${sorted[0]}:${sorted[1]}`)
      .digest('hex');
  }

  /**
   * Get or create a private conversation between two users
   * This is optimized to avoid duplicate conversations
   */
  async getOrCreatePrivateConversation(
    userId1: string,
    userId2: string,
  ): Promise<Conversation> {
    const hash = this.createConversationHash(userId1, userId2);

    // Try to find existing conversation
    let conversation = await this.repository.findOne({
      where: { conversationHash: hash },
    });

    if (!conversation) {
      // Create new conversation with sorted participant IDs
      const [participant1Id, participant2Id] = [userId1, userId2].sort((a, b) =>
        a.localeCompare(b),
      );

      conversation = this.repository.create({
        participant1Id,
        participant2Id,
        conversationHash: hash,
        type: ConversationType.PRIVATE,
        unreadCounts: {
          [userId1]: 0,
          [userId2]: 0,
        },
        participantSettings: {
          [userId1]: { muted: false, archived: false },
          [userId2]: { muted: false, archived: false },
        },
      });

      conversation = await this.repository.save(conversation);
    }

    return conversation;
  }

  /**
   * Find conversation by ID
   */
  async findById(conversationId: string): Promise<Conversation | null> {
    return await this.repository.findOne({
      where: { id: conversationId, deletedAt: IsNull() },
    });
  }

  /**
   * Get all conversations for a user
   * Optimized with pagination and sorting by last message
   */
  async getUserConversations(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Conversation[]> {
    return await this.repository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.participant1', 'participant1')
      .leftJoin('conversation.participant2', 'participant2')
      .addSelect([
        'participant1.userId',
        'participant1.firstName',
        'participant1.lastName',
        'participant1.profileImage',
        'participant1.type',
        'participant2.userId',
        'participant2.firstName',
        'participant2.lastName',
        'participant2.profileImage',
        'participant2.type',
      ])
      .where(
        '(conversation.participant1Id = :userId OR conversation.participant2Id = :userId)',
        { userId },
      )
      .andWhere('conversation.deletedAt IS NULL')
      .orderBy('conversation.lastMessageAt', 'DESC', 'NULLS LAST')
      .limit(limit)
      .offset(offset)

      .getMany();
  }

  /**
   * Update conversation with last message info
   */
  async updateLastMessage(
    conversationId: string,
    senderId: string,
    content: string,
    timestamp: Date,
  ): Promise<void> {
    await this.repository.update(conversationId, {
      lastMessageContent: content.substring(0, 100), // Store first 100 chars
      lastMessageSenderId: senderId,
      lastMessageAt: timestamp,
    });
  }

  /**
   * Increment unread count for a user in a conversation
   */
  async incrementUnreadCount(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const conversation = await this.findById(conversationId);
    if (!conversation) return;

    const unreadCounts = conversation.unreadCounts || {};
    unreadCounts[userId] = (unreadCounts[userId] || 0) + 1;

    await this.repository.update(conversationId, {
      unreadCounts,
    });
  }

  /**
   * Reset unread count for a user in a conversation
   */
  async resetUnreadCount(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const conversation = await this.findById(conversationId);
    if (!conversation) return;

    const unreadCounts = conversation.unreadCounts || {};
    unreadCounts[userId] = 0;

    await this.repository.update(conversationId, {
      unreadCounts,
    });
  }

  /**
   * Get total unread count across all conversations for a user
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    const conversations = await this.repository
      .createQueryBuilder('conversation')
      .where(
        '(conversation.participant1Id = :userId OR conversation.participant2Id = :userId)',
        { userId },
      )
      .andWhere('conversation.deletedAt IS NULL')
      .getMany();

    return conversations.reduce((total, conv) => {
      return total + (conv.unreadCounts?.[userId] || 0);
    }, 0);
  }

  /**
   * Update participant settings (mute, archive, etc.)
   */
  async updateParticipantSettings(
    conversationId: string,
    userId: string,
    settings: Partial<{ muted: boolean; archived: boolean; blocked: boolean }>,
  ): Promise<void> {
    const conversation = await this.findById(conversationId);
    if (!conversation) return;

    const participantSettings = conversation.participantSettings || {};
    participantSettings[userId] = {
      ...participantSettings[userId],
      ...settings,
    };

    await this.repository.update(conversationId, {
      participantSettings,
    });
  }

  /**
   * Soft delete conversation for a user
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.repository.update(conversationId, {
      deletedAt: new Date(),
    });
  }

  /**
   * Search conversations by participant name or last message
   */
  async searchConversations(
    userId: string,
    query: string,
    limit: number = 20,
  ): Promise<Conversation[]> {
    return await this.repository
      .createQueryBuilder('conversation')
      .where(
        '(conversation.participant1Id = :userId OR conversation.participant2Id = :userId)',
        { userId },
      )
      .andWhere('conversation.deletedAt IS NULL')
      .andWhere('conversation.lastMessageContent ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('conversation.lastMessageAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Get conversations with unread messages
   */
  async getUnreadConversations(userId: string): Promise<Conversation[]> {
    const conversations = await this.repository
      .createQueryBuilder('conversation')
      .where(
        '(conversation.participant1Id = :userId OR conversation.participant2Id = :userId)',
        { userId },
      )
      .andWhere('conversation.deletedAt IS NULL')
      .orderBy('conversation.lastMessageAt', 'DESC')
      .getMany();

    return conversations.filter(
      (conv) => (conv.unreadCounts?.[userId] || 0) > 0,
    );
  }
}

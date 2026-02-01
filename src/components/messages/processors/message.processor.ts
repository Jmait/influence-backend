import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { MessageGateway } from '../gateway/message.gateway';
import { MessageStatus } from '../entities/message.entity';
import { MessagesAndConversationEvents } from '../dto/message.dto';

@Processor('messages')
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Process('send-message')
  async handleSendMessage(job: Job<{ messageId: string }>) {
    const { messageId } = job.data;

    try {
      this.logger.log(`Processing message ${messageId}`);

      // Get message from database
      const message = await this.messageRepository.findById(messageId);

      if (!message) {
        throw new Error(`Message ${messageId} not found`);
      }

      // For now, we'll just mark it as sent
      await this.messageRepository.updateStatus(messageId, MessageStatus.SENT);

      // Check if receiver is online
      const isReceiverOnline = this.messageGateway.isUserOnline(
        message.receiverId,
      );

      if (isReceiverOnline) {
        // Emit to receiver via WebSocket
        await this.messageGateway.emitMessageToUser(
          message.receiverId,
          MessagesAndConversationEvents.NEW_MESSAGE,
          message,
        );

        this.logger.log(`Message ${messageId} delivered to online user`);
      } else {
        this.logger.log(
          `Message ${messageId} sent but user is offline, will be delivered on connect`,
        );
      }

      // Notify sender about sent status
      await this.messageGateway.emitMessageToUser(
        message.senderId,
        MessagesAndConversationEvents.MESSAGE_STATUS_UPDATE,
        {
          messageId: message.id,
          status: MessageStatus.SENT,
        },
      );

      this.logger.log(`Message ${messageId} processed successfully`);
      return { success: true, messageId };
    } catch (error) {
      this.logger.error(
        `Failed to process message ${messageId}: ${error.message}`,
        error.stack,
      );

      // Mark message as failed
      await this.messageRepository.updateStatus(
        messageId,
        MessageStatus.FAILED,
      );

      throw error;
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);

    // Implement retry logic or dead letter queue here if needed
    if (job.attemptsMade >= job.opts.attempts!) {
      this.logger.error(
        `Job ${job.id} failed after ${job.attemptsMade} attempts, moving to DLQ`,
      );
      // Move to dead letter queue or send alert
    }
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Message } from './entities/message.entity';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { MessageGateway } from './gateway/message.gateway';
import { MessageController } from './controllers/message.controller';
import { MessageProcessor } from './processors/message.processor';
import { Conversation } from './entities/conversation.entity';
import { PrivateConversationService } from './services/private-conversation.service';
import { ConversationRepository } from './repositories/conversation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    BullModule.registerQueue({
      name: 'messages',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [MessageController],
  providers: [
    MessageRepository,
    ConversationRepository,
    MessageService,
    PrivateConversationService,
    MessageGateway,
    MessageProcessor,
  ],
  exports: [
    MessageService,
    MessageGateway,
    MessageRepository,
    ConversationRepository,
  ],
})
export class MessagesModule {}

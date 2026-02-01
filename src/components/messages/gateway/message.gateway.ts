import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import {
  MessagesAndConversationEvents,
  SendMessageDto,
} from '../dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/messages',
  transports: ['websocket', 'polling'],
})
@UsePipes(new ValidationPipe({ transform: true }))
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessageGateway.name);
  private readonly userSockets: Map<string, Set<string>> = new Map();

  constructor(private readonly messageService: MessageService) {}

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;

      if (!userId) {
        this.logger.warn(`Client ${client.id} connected without userId`);
        client.disconnect();
        return;
      }

      // Store user socket mapping
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user to their personal room
      await client.join(`user:${userId}`);

      this.logger.log(`Client ${client.id} connected for user ${userId}`);

      // Send undelivered messages
      // const undeliveredMessages =
      //   await this.messageService.getUndeliveredMessages(userId);

      // Send unread count
      // const unreadCount = await this.messageService.getUnreadCount(userId);
      // client.emit('unread-count', { count: unreadCount });
    } catch (error) {
      this.logger.error(
        `Error handling connection: ${error.message}`,
        error.stack,
      );
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;

      if (userId && this.userSockets.has(userId)) {
        const sockets = this.userSockets.get(userId)!;
        sockets.delete(client.id);

        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }

      this.logger.log(`Client ${client.id} disconnected`);
    } catch (error) {
      this.logger.error(
        `Error handling disconnect: ${error.message}`,
        error.stack,
      );
    }
  }

  @SubscribeMessage(MessagesAndConversationEvents.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save message to database
      const message = await this.messageService.sendMessage(sendMessageDto);

      // Emit to sender (confirmation)
      client.emit(MessagesAndConversationEvents.MESSAGE_SENT, {
        tempId: sendMessageDto.metadata?.tempId,
        message,
      });

      // Emit to receiver if online
      this.emitToUser(
        sendMessageDto.receiverId,
        MessagesAndConversationEvents.NEW_MESSAGE,
        message,
      );

      this.logger.log(
        `Message ${message.id} sent from ${sendMessageDto.senderId} to ${sendMessageDto.receiverId}`,
      );

      return { success: true, messageId: message.id };
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, error.stack);
      client.emit(MessagesAndConversationEvents.MESSAGE_ERROR, {
        error: error.message,
        tempId: sendMessageDto.metadata?.tempId,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark-delivered')
  async handleMarkDelivered(
    @MessageBody() data: { messageIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.messageService.markMessagesAsDelivered(data.messageIds);

      // Notify senders
      const messages = await Promise.all(
        data.messageIds.map((id) => this.messageService.getMessageById(id)),
      );

      messages.forEach((msg) => {
        this.emitToUser(msg.senderId, 'message-delivered', {
          messageId: msg.id,
          deliveredAt: msg.deliveredAt,
        });
      });

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error marking messages as delivered: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @MessageBody() data: { messageIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.messageService.markMessagesAsRead(data.messageIds);

      // Notify senders
      const messages = await Promise.all(
        data.messageIds.map((id) => this.messageService.getMessageById(id)),
      );

      messages.forEach((msg) => {
        this.emitToUser(msg.senderId, 'message-read', {
          messageId: msg.id,
          readAt: msg.readAt,
        });
      });

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Error marking messages as read: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage(MessagesAndConversationEvents.ISTYPING)
  async handleTyping(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.query.userId as string;

    this.emitToUser(
      data.receiverId,
      MessagesAndConversationEvents.USER_TYPING,
      {
        userId,
        isTyping: data.isTyping,
      },
    );

    return { success: true };
  }

  @SubscribeMessage(MessagesAndConversationEvents.GET_MESSAGES)
  async handleGetMessages(
    @MessageBody()
    data: {
      conversationId: string;
      otherUserId: string;
      limit?: number;
      offset?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messages = await this.messageService.getMessages({
        conversationId: data.conversationId,

        limit: data.limit,
        offset: data.offset,
      });

      return { success: true, messages };
    } catch (error) {
      this.logger.error(
        `Error getting messages: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  // Helper method to emit to specific user
  private emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Public method to emit from external services
  async emitMessageToUser(userId: string, event: string, data: any) {
    this.emitToUser(userId, event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return (
      this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0
    );
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.userSockets.size;
  }
}

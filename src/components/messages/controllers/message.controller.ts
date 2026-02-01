import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { SendMessageDto, GetMessagesDto } from '../dto/message.dto';
import { PrivateConversationService } from '../services/private-conversation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { ProfileRequestOptions } from 'src/shared/interface/shared.interface';
import { JwtGuard } from 'src/components/auth/guards/jwt.guard';

@ApiTags('Conversation Management')
@ApiBearerAuth('Bearer')
@UseGuards(JwtGuard)
@Controller('messages')
@UsePipes(new ValidationPipe({ transform: true }))
export class MessageController {
  constructor(
    private readonly privateConversationService: PrivateConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const message =
      await this.privateConversationService.sendMessage(sendMessageDto);
    return {
      success: true,
      data: message,
      message: 'Message sent successfully',
    };
  }

  @Get()
  async getMessages(@Query() query: GetMessagesDto) {
    const messages = await this.messageService.getMessages(query);
    return {
      success: true,
      data: messages,
      count: messages.length,
    };
  }

  @Get('conversation/:userId')
  async getUserConversations(
    @Param('userId') id: string,
    @Req() req: ProfileRequestOptions,
  ) {
    const { pagination } = req;
    const { limit, offset } = pagination;
    const message = await this.privateConversationService.getUserConversations(
      id,
      limit,
      offset,
    );
    return {
      success: true,
      data: message,
    };
  }
}

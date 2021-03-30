import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomProudcerService } from '../producers/chatroom.producer';
import { ChatEventConsumerService } from './chat.consumer';
import { ChatEventHandler } from './chat-event.handler';
import { ChatRepository } from '../chats/chat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository])],
  providers: [ChatRoomProudcerService, ChatEventConsumerService, ChatEventHandler, ChatRepository],
})
export class ChatEventConsumerModule {}

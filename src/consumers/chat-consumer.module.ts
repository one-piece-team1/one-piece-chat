import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from '../chats/chat.service';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { ChatRepository } from '../chats/chat.repository';
import { ChatRoomProudcerService } from '../producers/chatroom.producer';
import { ChatEventConsumerService } from './chat.consumer';
import { ChatEventHandler } from './chat-event.handler';
import { ChatMessageAggregate } from '../chats/aggregates/chat-message.aggregate';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository, ChatParticipateRepository])],
  providers: [ChatRoomProudcerService, ChatEventConsumerService, ChatEventHandler, ChatService, ChatMessageAggregate],
})
export class ChatEventConsumerModule {}

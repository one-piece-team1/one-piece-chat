import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { ChatRepository } from '../chats/chat.repository';
import { UserRepository } from '../users/user.repository';
import { ChatRoomProudcerService } from '../producers/chatroom.producer';
import { ChatRoomAggregate } from './aggregates/chat-room.aggregate';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomRepository, ChatParticipateRepository, ChatRepository, UserRepository])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomProudcerService, ChatRoomAggregate],
})
export class ChatRoomModule {}

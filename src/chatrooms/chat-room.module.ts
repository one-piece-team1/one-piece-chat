import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { UserRepository } from '../users/user.repository';
import { ChatRoomProudcerService } from '../producers/chatroom.producer';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomRepository, ChatParticipateRepository, UserRepository])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomProudcerService],
})
export class ChatRoomModule {}

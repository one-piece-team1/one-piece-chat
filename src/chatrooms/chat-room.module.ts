import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomRepository, ChatParticipateRepository])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatRoomModule {}

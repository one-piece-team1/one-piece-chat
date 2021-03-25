import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { ChatModule } from './chats/chat.module';
import { ChatRoomModule } from './chatrooms/chat-room.module';
import { ChatEventConsumerService } from './consumers/chat.consumer';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ChatModule, ChatRoomModule],
  providers: [ChatEventConsumerService],
})
export class AppModule {}

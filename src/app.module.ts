import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { ChatModule } from './chats/chat.module';
import { ChatRoomModule } from './chatrooms/chat-room.module';
import { ChatEventConsumerModule } from './consumers/chat-consumer.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ChatModule, ChatRoomModule, ChatEventConsumerModule],
})
export class AppModule {}

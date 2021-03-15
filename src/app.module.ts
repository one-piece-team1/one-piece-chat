import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { ChatModule } from './chats/chat.module';
import { ChatRoomModule } from './chatrooms/chat-room.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ChatModule, ChatRoomModule],
})
export class AppModule {}

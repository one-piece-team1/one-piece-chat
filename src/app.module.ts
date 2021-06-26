import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';
import { ChatModule } from './chats/chat.module';
import { ChatRoomModule } from './chatrooms/chat-room.module';
import { ChatEventConsumerModule } from './consumers/chat-consumer.module';
import { EventStoreDBProvider } from './domains/databases/event-store-db.provider';
import { UserRepository } from './users/user.repository';
import { UserEventStoreRepository } from './domains/stores/user-event.store';
import { UserEventStoreProvider } from './domains/providers/user-event.provider';
import { ChatKakfaConsumerService } from './domains/kafka-consumers/chat.consumer';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ChatModule, ChatRoomModule, ChatEventConsumerModule],
  providers: [...EventStoreDBProvider, UserRepository, UserEventStoreRepository, ...UserEventStoreProvider, ChatKakfaConsumerService],
  exports: [...EventStoreDBProvider],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserRepository } from '../users/user.repository';
import { ChatEventSubscribers } from '../subscribers';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatEventSubscribers],
})
export class ChatModule {}

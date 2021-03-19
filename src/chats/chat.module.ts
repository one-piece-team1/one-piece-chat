import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../strategy';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserRepository } from '../users/user.repository';
import { ChatRepository } from './chat.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { ChatEventSubscribers } from '../subscribers';
import { config } from '../../config';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true,
    }),
    JwtModule.register({
      secret: config.JWT.SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '7d',
        issuer: 'one-piece',
      },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    }),
    TypeOrmModule.forFeature([UserRepository, ChatRepository, ChatParticipateRepository]),
  ],
  controllers: [ChatController],
  providers: [JwtStrategy, ChatService, ChatEventSubscribers],
})
export class ChatModule {}

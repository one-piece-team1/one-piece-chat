import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ChatParticipate } from 'chatparticipates/chat-participant.entity';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Chat } from './chat.entity';
import * as EChat from './enums';

@EntityRepository(Chat)
export class ChatRepository extends BaseRepository<Chat> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatRepository');

  public async createChatMessage(message: string);
  public async createChatMessage(message: string, chatParitcipate: ChatParticipate);
  public async createChatMessage(message: string, chatParitcipate?: ChatParticipate) {
    const chat = new Chat();
    chat.sendStatus = EChat.EChatSendStatus.SENDING;
    chat.readStatus = EChat.EChatStatus.UNREAD;
    chat.message = message;
    if (chatParitcipate) chat.chatParticipate = chatParitcipate;
    try {
      await chat.save();
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatMessageError');
      throw new InternalServerErrorException(error.message);
    }
    return chat;
  }
}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger('ChatService');

  constructor(private readonly chatRepository: ChatRepository) {}

  public async getRequest(): Promise<string> {
    return 'Hello World!';
  }

  @Transactional()
  public async createChatMessage(message: string, chatParitcipate: ChatParticipate) {
    try {
      return await this.chatRepository.createChatMessage(message, chatParitcipate);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

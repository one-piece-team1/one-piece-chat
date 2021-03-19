import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Chat } from './chat.entity';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import { ChatRepository } from './chat.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { CreateChatDto } from './dtos';
import * as IShare from '../interfaces';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger('ChatService');

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: ChatRepository,
    @InjectRepository(ChatParticipate)
    private readonly chatParticipateRepository: ChatParticipateRepository,
  ) {}

  public async getRequest(): Promise<string> {
    return 'Hello World!';
  }

  @Transactional()
  public async createChatMessage(user: IShare.UserInfo | IShare.JwtPayload, createChatDto: CreateChatDto) {
    if (user.id !== createChatDto.requestUserId) {
      this.logger.error('Invalid credential', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid credential',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (createChatDto.requestUserId === createChatDto.responseUserId) {
      this.logger.error('Self assignment', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Self assignment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const participate = await this.chatParticipateRepository.getChatParticipateById(createChatDto.chatParitcipateId);
    if (!participate) {
      this.logger.error(`Cannot find participate for ${createChatDto.chatParitcipateId}`, '', 'CreateChatMessageError');
      return new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Cannot find participate for ${createChatDto.chatParitcipateId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      const chat = await this.chatRepository.createChatMessage(createChatDto.message, participate);
      const updateChatResult = await this.chatParticipateRepository.insertChatRelations(user, participate.id, chat);
      if (!updateChatResult) {
        this.logger.error('Update chat conflict', '', 'CreateChatMessageError');
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Update chat conflict',
          },
          HttpStatus.CONFLICT,
        );
      }
      return chat;
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatMessageError');
      return new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Create chat failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

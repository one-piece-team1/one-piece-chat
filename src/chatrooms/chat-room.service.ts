import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ChatRoom } from './chat-room.entity';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatParticipateRepository } from '../chatparticipates/chat-paritcipant.repository';
import { UserRepository } from 'users/user.repository';
import { ChatRoomProudcerService } from '../producers/chatroom.producer';
import { CreateChatRoomDto } from './dtos';
import { CreateChatParticiPantDto } from '../chatparticipates/dtos';
import HTTPResponse from '../libs/response';
import * as IShare from '../interfaces';
import { config } from '../../config';

@Injectable()
export class ChatRoomService {
  private readonly logger: Logger = new Logger('ChatRoomService');
  private readonly httpResponse = new HTTPResponse();
  private readonly chatKafkaTopic = config.EVENT_STORE_SETTINGS.topics.chatTopic;

  constructor(private readonly chatRoomRepository: ChatRoomRepository, private readonly chatParticipateRepository: ChatParticipateRepository, private readonly userRepositoy: UserRepository, private readonly chatRoomProudcerService: ChatRoomProudcerService) {}

  /**
   * @description Create chat rooom services layer
   * @public
   * @param {IShare.UserInfo | IShare.JwtPayload} user
   * @param {CreateChatRoomDto} createChatRoomDto
   * @returns {Promise<IShare.IResponseBase<ChatRoom> | HttpException>}
   */
  public async createChatRoom(user: IShare.UserInfo | IShare.JwtPayload, createChatRoomDto: CreateChatRoomDto): Promise<IShare.IResponseBase<ChatRoom> | HttpException> {
    if (user.id !== createChatRoomDto.requestUserId) {
      this.logger.error('Invalid credential', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid credential',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (createChatRoomDto.requestUserId === createChatRoomDto.responseUserId) {
      this.logger.error('Self assignment', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Self assignment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const chatRoom = await this.chatRoomRepository.createChatRoom(createChatRoomDto);
    if (!chatRoom) {
      this.logger.error('Create chat room failed', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Create chat room failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const particpateUsers = await this.userRepositoy.getParticipates([createChatRoomDto.requestUserId, createChatRoomDto.responseUserId]);
    const createChatParticipateDto: CreateChatParticiPantDto = { chatRoomId: chatRoom, userIds: particpateUsers };
    const chatParticipate = await this.chatParticipateRepository.createChatParticipate(createChatParticipateDto);

    if (!chatParticipate) {
      this.logger.error('Create participate faile', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Create participate failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedChatRoom = await this.chatRoomRepository.updateChatRoomParticipateRelations(chatRoom.id, chatParticipate);

    if (!updatedChatRoom) {
      this.logger.error('Connect participate realtions failed', '', 'CreateChatRoomError');
      return new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Connect participate realtions failed',
        },
        HttpStatus.CONFLICT,
      );
    }

    this.chatRoomProudcerService.produce<ChatRoom>(this.chatKafkaTopic, updatedChatRoom, updatedChatRoom.id);

    return this.httpResponse.StatusCreated(updatedChatRoom);
  }
}

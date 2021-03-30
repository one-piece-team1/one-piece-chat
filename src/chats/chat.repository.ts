import { InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ChatParticipate } from 'chatparticipates/chat-participant.entity';
import { chain } from 'lodash';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from 'users/user.entity';
import { Chat } from './chat.entity';
import { ChatIdDto, UpdateChatReadStatusDto, UpdateChatSendStatusDto } from './dtos';
import * as EChat from './enums';

@EntityRepository(Chat)
export class ChatRepository extends BaseRepository<Chat> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatRepository');

  /**
   * @description Creat new chat message
   * @public
   * @param {string} message
   * @param {ChatParticipate | undefined} chatParitcipate
   * @returns {Promise<Chat>}
   */
  public async createChatMessage(message: string): Promise<Chat>;
  public async createChatMessage(message: string, chatParitcipate: ChatParticipate): Promise<Chat>;
  public async createChatMessage(message: string, chatParitcipate?: ChatParticipate): Promise<Chat> {
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

  /**
   * @description Validate if user can update or not
   * @private
   * @param {User[]} users
   * @param {UpdateChatReadStatusDto} updateChatReadStatusDto
   * @returns {boolean}
   */
  private validateRequestUser(users: User[], requestUserId: string): boolean {
    let isValidated = false;
    users.forEach((user) => {
      if (user.id === requestUserId) {
        isValidated = true;
      }
    });
    return isValidated;
  }

  /**
   * @description Update chat message read status
   * @public
   * @param chatIdDto
   * @param updateChatReadStatusDto
   * @returns {Promise<Chat>}
   */
  public async updateChatReadStatus(chatIdDto: ChatIdDto, updateChatReadStatusDto: UpdateChatReadStatusDto): Promise<Chat> {
    const chat = await this.repoManager.getRepository(Chat).findOne({
      where: { id: chatIdDto.id },
      relations: ['chatParticipate'],
    });
    if (!chat) {
      this.logger.error(`Chat ${chatIdDto.id} not found`, '', 'UpdateChatReadStatusError');
      throw new NotFoundException(`Chat ${chatIdDto.id} not found`);
    }
    if (chat.readStatus === 'read') return chat;
    const isValidated = this.validateRequestUser(chat.chatParticipate.users, updateChatReadStatusDto.requestUserId);
    if (!isValidated) {
      this.logger.error(`Invalid Request`, '', 'UpdateChatReadStatusError');
      throw new UnauthorizedException('Invalid Request');
    }
    try {
      chat.readStatus = updateChatReadStatusDto.readStatus;
      await chat.save();
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateChatReadStatusError');
      throw new InternalServerErrorException(error.message);
    }
    return chat;
  }

  /**
   * @description Update chat message send status
   * @public
   * @param {ChatIdDto} chatIdDto
   * @param {UpdateChatSendStatusDto} updateChatSendStatusDto
   * @returns
   */
  public async updateChatSendStatus(chatIdDto: ChatIdDto, updateChatSendStatusDto: UpdateChatSendStatusDto): Promise<Chat> {
    const chat = await this.repoManager.getRepository(Chat).findOne({
      where: { id: chatIdDto.id },
      relations: ['chatParticipate'],
    });
    if (!chat) {
      this.logger.error(`Chat ${chatIdDto.id} not found`, '', 'UpdateChatSendStatusError');
      throw new NotFoundException(`Chat ${chatIdDto.id} not found`);
    }
    if (chat.sendStatus === 'finish') return chat;
    const isValidated = this.validateRequestUser(chat.chatParticipate.users, updateChatSendStatusDto.requestUserId);
    if (!isValidated) {
      this.logger.error(`Invalid Request`, '', 'UpdateChatSendStatusError');
      throw new UnauthorizedException('Invalid Request');
    }
    try {
      chat.sendStatus = updateChatSendStatusDto.sendStatus;
      await chat.save();
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateChatSendStatusError');
      throw new InternalServerErrorException(error.message);
    }
    return chat;
  }
}

import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from '../users/user.entity';
import { ChatParticipate } from './chat-participant.entity';
import { Chat } from '../chats/chat.entity';
import { CreateChatParticiPantDto } from './dtos';
import * as IShare from '../interfaces';

@EntityRepository(ChatParticipate)
export class ChatParticipateRepository extends BaseRepository<ChatParticipate> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatParticipateRepository');

  /**
   * @description Create Chat Participate
   * @public
   * @param {CreateChatParticiPantDto} createChatParticiPantDto
   * @returns {Promise<ChatParticipate>}
   */
  public async createChatParticipate(createChatParticiPantDto: CreateChatParticiPantDto): Promise<ChatParticipate> {
    const { users } = createChatParticiPantDto;
    const chatParticipate = new ChatParticipate();
    chatParticipate.users = users;
    chatParticipate.chats = [createChatParticiPantDto.chat];
    try {
      await chatParticipate.save();
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatParticipateErorr');
      throw new InternalServerErrorException(error.message);
    }
    return chatParticipate;
  }

  /**
   * @description Get list user ids by participate relations
   * @public
   * @lock
   * @param {User} user
   * @returns {Promise<string[]>}
   */
  public async getChatParticipateIdsByUser(user: User): Promise<string[]> {
    try {
      const participates: ChatParticipate[] = await this.createQueryBuilder('chatparticipate')
        .leftJoinAndSelect('chatparticipate.users', 'users')
        .andWhere('users.id = :id', { id: user.id })
        .select('chatparticipate.id')
        .getMany();
      if (participates.length === 0) return null;
      return participates.map((participate) => participate.id);
    } catch (error) {
      this.logger.error(error.message, '', 'GetChatParticipateIdsByUserError');
      throw new InternalServerErrorException(error.message);
    }
  }

  private checkUserRight(particiapate: ChatParticipate, requestUser: IShare.UserInfo | IShare.JwtPayload) {
    let auth = false;
    particiapate.users.forEach((user) => {
      if (user.id === requestUser.id) auth = true;
    });
    return auth;
  }

  public async insertChatRelations(user: IShare.UserInfo | IShare.JwtPayload, particiapteId: string, chat: Chat): Promise<ChatParticipate> {
    const participate = await this.getChatParticipateById(particiapteId);
    if (!participate) return null;
    if (!this.checkUserRight(participate, user)) return null;
    participate.chats.push(chat);
    try {
      await participate.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return participate;
  }

  public async getChatParticipateById(id: string): Promise<ChatParticipate> {
    try {
      const particiapte: ChatParticipate = await this.createQueryBuilder('chatparticipate')
        .useTransaction(true)
        .setLock('pessimistic_read')
        .andWhere('chatparticipate.id = :id', { id })
        .innerJoinAndSelect('chatparticipate.users', 'users')
        .innerJoinAndSelect('chatparticipate.chats', 'chats')
        .getOne();
      if (!particiapte) return null;
      return particiapte;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

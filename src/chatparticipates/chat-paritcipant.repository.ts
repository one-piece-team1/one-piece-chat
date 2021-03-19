import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { User } from '../users/user.entity';
import { ChatParticipate } from './chat-participant.entity';
import { CreateChatParticiPantDto } from './dtos';

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
}

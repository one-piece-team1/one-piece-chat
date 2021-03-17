import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatParticipate } from './chat-participant.entity';
import { CreateChatParticiPantDto } from './dtos';

@EntityRepository(ChatParticipate)
export class ChatParticipateRepository extends Repository<ChatParticipate> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatParticipateRepository');

  /**
   * @description Create Chat Participate
   * @public
   * @param {CreateChatParticiPantDto} createChatParticiPantDto
   * @returns {Promise<ChatParticipate>}
   */
  public async createChatParticipate(createChatParticiPantDto: CreateChatParticiPantDto): Promise<ChatParticipate> {
    const { chatRoomId, userIds } = createChatParticiPantDto;
    const chatParticipate = new ChatParticipate();
    chatParticipate.chatRoomId = chatRoomId;
    chatParticipate.userIds = userIds;
    try {
      await chatParticipate.save();
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatParticipateErorr');
      throw new InternalServerErrorException(error.message);
    }
    return chatParticipate;
  }

  public async getChatParticipateIdsByUser(user: User): Promise<string[]> {
    try {
      const participates: ChatParticipate[] = await this.createQueryBuilder('chatparticipate')
        .leftJoinAndSelect('chatparticipate.userIds', 'users')
        .andWhere('users.id = :id', { id: user.id })
        .select('chatparticipate.id')
        .getMany();
      if (participates.length === 0) return null;
      return participates.map((participate) => participate.id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}

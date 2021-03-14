import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
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
}

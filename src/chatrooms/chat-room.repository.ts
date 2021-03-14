import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import { CreateChatRoomDto } from './dtos';

@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {
  private readonly repoManager: EntityManager = getManager();
  private readonly logger: Logger = new Logger('ChatRoomRepository');

  /**
   * @description Create chat room
   * @public
   * @param {CreateChatRoomDto} createChatRoomDto
   * @returns {Promise<ChatRoom>}
   */
  public async createChatRoom(createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    const { name, type } = createChatRoomDto;
    const chatRoom = new ChatRoom();
    chatRoom.name = name;
    chatRoom.type = type;

    try {
      await chatRoom.save();
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatRoom');
      throw new InternalServerErrorException(error.message);
    }
    return chatRoom;
  }

  /**
   * @description Update chatroom participate
   * @public
   * @param {string} id
   * @param {ChatParticipate} chatParticipate
   * @returns {Promise<ChatRoom>}
   */
  public async updateChatRoomParticipateRelations(id: string, chatParticipate: ChatParticipate): Promise<ChatRoom> {
    const chatRoom = await this.repoManager.findOne(ChatRoom, {
      where: {
        id,
      },
    });
    if (!chatRoom) throw new NotFoundException('Cannot find Chatroom');
    chatRoom.participateId = chatParticipate;
    try {
      await chatRoom.save();
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateChatRoomParticipateRelations');
      throw new InternalServerErrorException(error.message);
    }
    return chatRoom;
  }
}

import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Connection, EntityRepository, getConnection, In } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ChatRoom } from './chat-room.entity';
import { User } from '../users/user.entity';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import { ChatSearchDto, CreateChatRoomDto, GetChatRoomByIdDto } from './dtos';

@EntityRepository(ChatRoom)
export class ChatRoomRepository extends BaseRepository<ChatRoom> {
  private readonly connection: Connection = getConnection('default');
  private readonly logger: Logger = new Logger('ChatRoomRepository');

  /**
   * @description Create chat room
   * @public
   * @param {CreateChatRoomDto} createChatRoomDto
   * @returns {Promise<ChatRoom>}
   */
  public async createChatRoom(createChatRoomDto: CreateChatRoomDto, chatParticipate: ChatParticipate): Promise<ChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.name = createChatRoomDto.name;
    chatRoom.type = createChatRoomDto.type;
    chatRoom.chatParticipate = chatParticipate;
    try {
      await chatRoom.save({ transaction: true });
    } catch (error) {
      this.logger.error(error.message, '', 'CreateChatRoom');
      throw new InternalServerErrorException(error.message);
    }
    return chatRoom;
  }

  /**
   * @description check user rule
   * @protected
   * @param {string} userId
   * @param {ChatRoom} chatRoom
   * @returns {boolean}
   */
  protected checkUserRule(userId: string, chatRoom: ChatRoom): boolean {
    let isvalidated = false;
    chatRoom.chatParticipate.users.forEach((user) => {
      if (user.id === userId) {
        isvalidated = true;
      }
    });
    return isvalidated;
  }

  /**
   * @description Get chatroom by id
   * @public
   * @param {User} user
   * @param {GetChatRoomByIdDto} getChatRoomByIdDto
   * @returns {Promise<ChatRoom>}
   */
  public async getChatRoomById(user: User, getChatRoomByIdDto: GetChatRoomByIdDto): Promise<ChatRoom> {
    try {
      const chatRoom = await this.createQueryBuilder('chatroom')
        .useTransaction(true)
        .setLock('pessimistic_read')
        .andWhere('chatroom.id = :id', { id: getChatRoomByIdDto.id })
        .innerJoinAndSelect('chatroom.chatParticipate', 'participate', 'chatroom.chatParticipateId = participate.id')
        .innerJoinAndSelect('participate.users', 'users')
        .innerJoinAndMapMany('participate.chats', 'chat', 'participate.id = chat.chatParticipateId')
        .getOne();
      if (!chatRoom) return null;
      if (!this.checkUserRule(user.id, chatRoom)) return null;
      return chatRoom;
    } catch (error) {
      this.logger.error(error.message, '', 'GetChatRoomByIdError');
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Get user chatrooms by paging
   * @public
   * @param {string[]} participateIds
   * @param {ChatSearchDto} chatSearchDto
   * @returns {Promise<{ chatrooms: ChatRoom[], take: number; skip: number; count: number; }>}
   */
  public async getUserChatRooms(participateIds: string[], chatSearchDto: ChatSearchDto): Promise<{ chatrooms: ChatRoom[]; take: number; skip: number; count: number }> {
    const take = chatSearchDto.take ? Number(chatSearchDto.take) : 10;
    const skip = chatSearchDto.skip ? Number(chatSearchDto.skip) : 0;
    try {
      const [chatrooms, count] = await this.findAndCount({
        join: { alias: 'chatroom', innerJoin: { chatParticipate: 'chatroom.chatParticipate' } },
        where: {
          chatParticipate: In(participateIds),
        },
        relations: ['chatParticipate'],
        order: {
          updatedAt: chatSearchDto.sort,
        },
        take,
        skip,
      });
      if (!chatrooms) return null;
      return {
        chatrooms,
        take,
        skip,
        count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

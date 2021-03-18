import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository, getManager, Repository } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../users/user.entity';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import { ChatSearchDto, CreateChatRoomDto, GetChatRoomByIdDto } from './dtos';

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
   * @lock
   * @param {string} id
   * @param {ChatParticipate} chatParticipate
   * @returns {Promise<ChatRoom>}
   */
  public async updateChatRoomParticipateRelations(id: string, chatParticipate: ChatParticipate): Promise<ChatRoom> {
    const chatRoom = await this.findOne({
      where: {
        id,
      },
      lock: {
        mode: 'pessimistic_write'
      },
    });
    if (!chatRoom) throw new NotFoundException('Cannot find Chatroom');
    chatRoom.chatParticipate = chatParticipate;
    try {
      await chatRoom.save();
    } catch (error) {
      this.logger.error(error.message, '', 'UpdateChatRoomParticipateRelations');
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
      const chatRoom = await this.findOne({
        where: { id: getChatRoomByIdDto.id },
        relations: ['chatParticipate'],
      });
      if (!chatRoom) return null;
      if (!this.checkUserRule(user.id, chatRoom)) return null;
      return chatRoom;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Get user chatrooms by paging
   * @public
   * @lock
   * @param {string[]} participateIds
   * @param {ChatSearchDto} chatSearchDto
   * @returns {Promise<{ chatrooms: ChatRoom[], take: number; skip: number; count: number; }>}
   */
  public async getUserChatRooms(participateIds: string[], chatSearchDto: ChatSearchDto): Promise<{ chatrooms: ChatRoom[]; take: number; skip: number; count: number }> {
    const take = chatSearchDto.take ? Number(chatSearchDto.take) : 10;
    const skip = chatSearchDto.skip ? Number(chatSearchDto.skip) : 0;
    try {
      const [chatrooms, count] = await this.findAndCount({
        join: { alias: 'chatroom', leftJoin: { chatParticipate: 'chatroom.chatParticipate' } },
        where: (db) => {
          db.andWhere('chatParticipate.id IN (:...id)', { id: participateIds });
        },
        order: {
          updatedAt: chatSearchDto.sort,
        },
        lock: {
          mode: 'pessimistic_write'
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

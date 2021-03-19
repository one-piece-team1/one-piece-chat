import { Injectable } from '@nestjs/common';
import { ChatRoom } from 'chatrooms/chat-room.entity';
import * as EChatRoom from '../enums';
import * as IChatRoom from '../interfaces';

@Injectable()
export class ChatRoomAggregate {
  /**
   * @description Create chat room event
   * @public
   * @param {ChatRoom} chatRoom
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom>}
   */
  public createChatRoom(chatRoom: ChatRoom): IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom> {
    return Object.freeze<IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom>>({
      type: EChatRoom.EChatRoomSocketEvent.CREATECHATROOM,
      data: chatRoom,
    });
  }

  /**
   * @description Update chat room event
   * @public
   * @param {ChatRoom} chatRoom
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom>}
   */
  public updateChatRoom(chatRoom: ChatRoom): IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom> {
    return Object.freeze<IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, ChatRoom>>({
      type: EChatRoom.EChatRoomSocketEvent.UPDATECHATROOM,
      data: chatRoom,
    });
  }

  /**
   * @description Delete chat room event
   * @public
   * @param {string} chatRoomId
   * @returns {IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IResponseWithPk>}
   */
  public deleteChatRoom(chatRoomId: string): IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IResponseWithPk> {
    return Object.freeze<IChatRoom.IAggregateResponse<EChatRoom.EChatRoomSocketEvent, IChatRoom.IResponseWithPk>>({
      type: EChatRoom.EChatRoomSocketEvent.DELETECHATROOM,
      data: {
        id: chatRoomId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Chat } from '../chat.entity';
import * as EChat from '../enums';
import * as IChat from '../interfaces';

@Injectable()
export class ChatMessageAggregate {
  /**
   * @description New chat message event
   * @public
   * @param {Chat} chat
   * @returns {IChat.IAggregateResponse<EChat.EChatRoomSocketEvent, Chat>}
   */
  public newChatMessage(chat: Chat): IChat.IAggregateResponse<EChat.EChatRoomSocketEvent, Chat> {
    return Object.freeze<IChat.IAggregateResponse<EChat.EChatRoomSocketEvent, Chat>>({
      type: EChat.EChatRoomSocketEvent.NEWCHATMESSAGE,
      data: chat,
    });
  }
}

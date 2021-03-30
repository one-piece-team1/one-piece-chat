import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { Chat } from '../chats/chat.entity';
import { ChatService } from '../chats/chat.service';
import * as EChat from './enums';
import * as IChat from './interfaces';
import * as IShare from '../interfaces';

@Injectable()
export class ChatEventHandler {
  constructor(private readonly chatService: ChatService) {}

  /**
   * @description register kafka message
   * @public
   * @param {Kafka.Message} kafkaMessage
   * @returns {Promise<IShare.IResponseBase<Chat> | HttpException>}
   */
  public register(kafkaMessage: Kafka.Message): Promise<IShare.IResponseBase<Chat> | HttpException> {
    if (!kafkaMessage) throw new InternalServerErrorException('Non message is being proecssed');
    const evt: IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt> = JSON.parse(kafkaMessage.value.toString());
    return this.assign(evt);
  }

  /**
   * @description assign kafka message event
   * @public
   * @param {IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt>} evt
   * @returns {Promise<IShare.IResponseBase<Chat> | HttpException>}
   */
  private assign(evt: IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt>): Promise<IShare.IResponseBase<Chat> | HttpException> {
    switch (evt.type) {
      case EChat.EChatEeventFromSocket.UPDATEREADSTATUS:
        return this.chatService.updateChatReadStatus(evt.data.user, { id: evt.data.chatId }, { requestUserId: evt.data.requestUserId, readStatus: evt.data.readStatus });
      case EChat.EChatEeventFromSocket.UPDATESENDSTATUS:
        return this.chatService.updateChatSendStatus(evt.data.user, { id: evt.data.chatId }, { requestUserId: evt.data.requestUserId, sendStatus: evt.data.sendStatus });
    }
  }
}

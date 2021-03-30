import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import Kafka from 'node-rdkafka';
import { Chat } from '../chats/chat.entity';
import { ChatRepository } from '../chats/chat.repository';
import * as EChat from './enums';
import * as IChat from './interfaces';

@Injectable()
export class ChatEventHandler {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * @description register kafka message
   * @public
   * @param {Kafka.Message} kafkaMessage
   * @returns {Promise<Chat>}
   */
  public register(kafkaMessage: Kafka.Message): Promise<Chat> {
    if (!kafkaMessage) throw new InternalServerErrorException('Non message is being proecssed');
    const evt: IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt> = JSON.parse(kafkaMessage.value.toString());
    return this.assign(evt);
  }

  /**
   * @description assign kafka message event
   * @public
   * @param {IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt>} evt
   * @returns {Promise<Chat>}
   */
  private assign(evt: IChat.IEventAggregateResponse<EChat.EChatEeventFromSocket, IChat.IUpdateChatStatusEvt>): Promise<Chat> {
    if (evt.data.user.id !== evt.data.requestUserId) throw new UnauthorizedException();

    switch (evt.type) {
      case EChat.EChatEeventFromSocket.UPDATEREADSTATUS:
        return this.chatRepository.updateChatReadStatus({ id: evt.data.chatId }, { requestUserId: evt.data.requestUserId, readStatus: evt.data.readStatus });
      case EChat.EChatEeventFromSocket.UPDATEREADSTATUS:
        return this.chatRepository.updateChatSendStatus({ id: evt.data.chatId }, { requestUserId: evt.data.requestUserId, sendStatus: evt.data.sendStatus });
    }
  }
}

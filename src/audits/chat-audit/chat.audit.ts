import { InternalServerErrorException } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Chat } from '../../chats/chat.entity';
import { ChatAuditLog } from './chat-audit.entity';
import * as EAudit from '../enums';

@EventSubscriber()
export class ChatAuditSubscriber implements EntitySubscriberInterface<Chat> {
  /**
   * @description Listen to chat entity changing
   * @public
   * @returns {Chat}
   */
  public listenTo() {
    return Chat;
  }

  /**
   * @description Called after entity insertion
   * @event
   * @create
   * @public
   * @param {InsertEvent<Chat>} event
   */
  afterInsert(event: InsertEvent<Chat>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {UpdateEvent<Chat>} event
   */
  afterUpdate(event: UpdateEvent<Chat>) {
    this.insertUpdateEvent(event.entity);
  }

  /**
   * @description Called after entity delete
   * @event
   * @remove
   * @public
   * @param {RemoveEvent<Chat>} event
   */
  afterRemove(event: RemoveEvent<Chat>) {
    this.insertDeleteEvent(event.entity);
  }

  /**
   * @description Insert create chat log
   * @public
   * @param {Chat} event
   */
  async insertCreateEvent(event: Chat) {
    const chatAuditLog = new ChatAuditLog();
    chatAuditLog.version = event.version;
    chatAuditLog.chatId = event.id;
    chatAuditLog.type = EAudit.EAduitType.CREATE;
    try {
      await chatAuditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert update chat log
   * @public
   * @param {Chat} event
   */
  async insertUpdateEvent(event: Chat) {
    const chatAuditLog = new ChatAuditLog();
    chatAuditLog.version = event.version;
    chatAuditLog.chatId = event.id;
    chatAuditLog.type = EAudit.EAduitType.UPDATE;
    try {
      await chatAuditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert delete chat log
   * @public
   * @param {Chat} event
   */
  async insertDeleteEvent(event: Chat) {
    const chatAuditLog = new ChatAuditLog();
    chatAuditLog.version = event.version;
    chatAuditLog.chatId = event.id;
    chatAuditLog.type = EAudit.EAduitType.DELETE;
    try {
      await chatAuditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

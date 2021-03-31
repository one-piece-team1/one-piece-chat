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
  public afterInsert(event: InsertEvent<Chat>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {UpdateEvent<Chat>} event
   */
  public afterUpdate(event: UpdateEvent<Chat>) {
    this.insertUpdateEvent(event);
  }

  /**
   * @description Called after entity delete
   * @event
   * @remove
   * @public
   * @param {RemoveEvent<Chat>} event
   */
  public afterRemove(event: RemoveEvent<Chat>) {
    this.insertDeleteEvent(event.entity);
  }

  /**
   * @description Insert create chat log
   * @private
   * @param {Chat} event
   */
  private async insertCreateEvent(event: Chat) {
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
   * @private
   * @param {UpdateEvent<Chat>} event
   */
  private async insertUpdateEvent(event: UpdateEvent<Chat>) {
    const chatAuditLog = new ChatAuditLog();
    chatAuditLog.version = event.entity.version;
    chatAuditLog.chatId = event.entity.id;
    chatAuditLog.type = EAudit.EAduitType.UPDATE;
    chatAuditLog.updateAlias = event.updatedColumns.map((col) => col.databaseName).join(',');
    try {
      await chatAuditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert delete chat log
   * @private
   * @param {Chat} event
   */
  private async insertDeleteEvent(event: Chat) {
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

import { InternalServerErrorException } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { ChatRoom } from '../../chatrooms/chat-room.entity';
import { RoomAuditLog } from './room-audit.entity';
import * as EAudit from '../enums';

@EventSubscriber()
export class RoomAuditSubscriber implements EntitySubscriberInterface<ChatRoom> {
  /**
   * @description Listen to chat room entity changing
   * @public
   * @returns {Chat}
   */
  public listenTo() {
    return ChatRoom;
  }

  /**
   * @description Called after entity insertion
   * @event
   * @create
   * @public
   * @param {InsertEvent<ChatRoom>} event
   */
  public afterInsert(event: InsertEvent<ChatRoom>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {UpdateEvent<ChatRoom>} event
   */
  public afterUpdate(event: UpdateEvent<ChatRoom>) {
    this.insertUpdateEvent(event);
  }

  /**
   * @description Called after entity delete
   * @event
   * @remove
   * @public
   * @param {RemoveEvent<ChatRoom>} event
   */
  public afterRemove(event: RemoveEvent<ChatRoom>) {
    this.insertDeleteEvent(event.entity);
  }

  /**
   * @description Insert create ChatRoom log
   * @private
   * @param {ChatRoom} event
   */
  private async insertCreateEvent(event: ChatRoom) {
    const auditLog = new RoomAuditLog();
    auditLog.version = event.version;
    auditLog.roomId = event.id;
    auditLog.type = EAudit.EAduitType.CREATE;
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert update ChatRoom log
   * @private
   * @param {UpdateEvent<ChatRoom>} event
   */
  private async insertUpdateEvent(event: UpdateEvent<ChatRoom>) {
    const auditLog = new RoomAuditLog();
    auditLog.version = event.entity.version;
    auditLog.roomId = event.entity.id;
    auditLog.type = EAudit.EAduitType.UPDATE;
    auditLog.updateAlias = event.updatedColumns.map((col) => col.databaseName).join(',');
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert delete ChatRoom log
   * @public
   * @param {Chat} event
   */
  private async insertDeleteEvent(event: ChatRoom) {
    const auditLog = new RoomAuditLog();
    auditLog.version = event.version;
    auditLog.roomId = event.id;
    auditLog.type = EAudit.EAduitType.DELETE;
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

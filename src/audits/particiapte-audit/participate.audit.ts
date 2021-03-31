import { InternalServerErrorException } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { ChatParticipate } from '../../chatparticipates/chat-participant.entity';
import { ParticipateAuditLog } from './participate.entity';
import * as EAudit from '../enums';

@EventSubscriber()
export class ParticipateAuditSubscriber implements EntitySubscriberInterface<ChatParticipate> {
  /**
   * @description Listen to ChatParticipate entity changing
   * @public
   * @returns {Chat}
   */
  public listenTo() {
    return ChatParticipate;
  }

  /**
   * @description Called after entity insertion
   * @event
   * @create
   * @public
   * @param {InsertEvent<ChatParticipate>} event
   */
  public afterInsert(event: InsertEvent<ChatParticipate>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {UpdateEvent<ChatParticipate>} event
   */
  public afterUpdate(event: UpdateEvent<ChatParticipate>) {
    this.insertUpdateEvent(event);
  }

  /**
   * @description Called after entity delete
   * @event
   * @remove
   * @public
   * @param {RemoveEvent<ChatParticipate>} event
   */
  public afterRemove(event: RemoveEvent<ChatParticipate>) {
    this.insertDeleteEvent(event.entity);
  }

  /**
   * @description Insert create ChatParticipate log
   * @private
   * @param {ChatParticipate} event
   */
  private async insertCreateEvent(event: ChatParticipate) {
    const auditLog = new ParticipateAuditLog();
    auditLog.version = event.version;
    auditLog.participateId = event.id;
    auditLog.type = EAudit.EAduitType.CREATE;
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert update ChatParticipate log
   * @private
   * @param {UpdateEvent<ChatParticipate>} event
   */
  private async insertUpdateEvent(event: UpdateEvent<ChatParticipate>) {
    const auditLog = new ParticipateAuditLog();
    auditLog.version = event.entity.version;
    auditLog.participateId = event.entity.id;
    auditLog.type = EAudit.EAduitType.UPDATE;
    auditLog.updateAlias = event.updatedColumns.map((col) => col.databaseName).join(',');
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert delete ChatParticipate log
   * @private
   * @param {ChatParticipate} event
   */
  private async insertDeleteEvent(event: ChatParticipate) {
    const auditLog = new ParticipateAuditLog();
    auditLog.version = event.version;
    auditLog.participateId = event.id;
    auditLog.type = EAudit.EAduitType.DELETE;
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

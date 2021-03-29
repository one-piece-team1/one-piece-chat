import { InternalServerErrorException } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { ChatParticipate } from '../..//chatparticipates/chat-participant.entity';
import { ParticipateAuditLog } from './participate.entity';
import * as EAudit from '../enums';

@EventSubscriber()
export class ParticipateAuditSubscriber implements EntitySubscriberInterface<ChatParticipate> {
  /**
   * @description Listen to chat entity changing
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
  afterInsert(event: InsertEvent<ChatParticipate>) {
    this.insertCreateEvent(event.entity);
  }

  /**
   * @description Called after entity update
   * @event
   * @update
   * @public
   * @param {UpdateEvent<ChatParticipate>} event
   */
  afterUpdate(event: UpdateEvent<ChatParticipate>) {
    this.insertUpdateEvent(event.entity);
  }

  /**
   * @description Called after entity delete
   * @event
   * @remove
   * @public
   * @param {RemoveEvent<ChatParticipate>} event
   */
  afterRemove(event: RemoveEvent<ChatParticipate>) {
    this.insertDeleteEvent(event.entity);
  }

  /**
   * @description Insert create ChatParticipate log
   * @public
   * @param {ChatParticipate} event
   */
  async insertCreateEvent(event: ChatParticipate) {
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
   * @description Insert update chat log
   * @public
   * @param {Chat} event
   */
  async insertUpdateEvent(event: ChatParticipate) {
    const auditLog = new ParticipateAuditLog();
    auditLog.version = event.version;
    auditLog.participateId = event.id;
    auditLog.type = EAudit.EAduitType.UPDATE;
    try {
      await auditLog.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description Insert delete chat log
   * @public
   * @param {Chat} event
   */
  async insertDeleteEvent(event: ChatParticipate) {
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

import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import * as EChat from './enums';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  message: string;

  @Column({
    type: 'enum',
    enum: EChat.EChatSendStatus,
    default: EChat.EChatSendStatus.SENDING,
    nullable: false,
  })
  sendStatus: EChat.EChatSendStatus;

  @Column({
    type: 'enum',
    enum: EChat.EChatStatus,
    default: EChat.EChatStatus.UNREAD,
    nullable: false,
  })
  readStatus: EChat.EChatStatus;

  @ManyToOne(
    () => ChatParticipate,
    (chatParticipate) => chatParticipate.chats,
  )
  chatParticipate: ChatParticipate;

  /**
   * @description Version control
   */
  @VersionColumn({ nullable: true })
  version: number;

  /**
   * @description Time area
   */
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @BeforeInsert()
  updateWhenInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDateWhenUpdate() {
    this.updatedAt = new Date();
  }
}

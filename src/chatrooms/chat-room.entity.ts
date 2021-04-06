import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, VersionColumn } from 'typeorm';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';
import * as EChatRoom from './enums';

@Entity()
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, default: 'room' })
  name: string;

  @Column({
    type: 'enum',
    enum: EChatRoom.EChatRoomType,
    default: EChatRoom.EChatRoomType.PRIVATE,
    nullable: false,
    insert: false,
  })
  type: EChatRoom.EChatRoomType;

  /**
   * @description relation with ChatParticipate
   */
  @OneToOne(
    () => ChatParticipate,
    (chatParticipate) => chatParticipate.chatRoom,
    { cascade: true },
  )
  @JoinColumn()
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

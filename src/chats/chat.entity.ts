import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChatParticipate } from '../chatparticipates/chat-participant.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  message: string;

  @ManyToOne(
    () => ChatParticipate,
    (chatParticipate) => chatParticipate.messageIds,
  )
  @JoinColumn()
  chatParticipateId: ChatParticipate;

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
